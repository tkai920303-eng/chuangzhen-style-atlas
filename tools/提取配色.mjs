// 用 ffmpeg 解码图片并提取主色板（零第三方依赖，ffmpeg 已在本机）
// 产出：04_工具\_抓取缓存\配色板.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import P from './paths.mjs';

const IMG_ROOT = P.assets;
// 本地写入采集缓存；发布包写入 data/（随包分发，CI 无 ffmpeg 无法重算）
const OUT = P.palette;

const W = 64, H = 36;
const CONCURRENCY = 8;

// ffmpeg -i X -vf scale=64:36 -f rawvideo -pix_fmt rgb24 -
function decode(file) {
  return new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', ['-v', 'error', '-i', file, '-vf', `scale=${W}:${H}`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], {
      windowsHide: true,
    });
    const chunks = [];
    let err = '';
    p.stdout.on('data', (d) => chunks.push(d));
    p.stderr.on('data', (d) => (err += d.toString()));
    p.on('close', (code) => {
      if (code !== 0) return reject(new Error(`ffmpeg ${code}: ${err.slice(0, 200)}`));
      resolve(Buffer.concat(chunks));
    });
    p.on('error', (e) => reject(new Error(`spawn ffmpeg: ${e.message}`)));
  });
}

function quantize(buf, k = 6) {
  const px = buf.length / 3;
  if (px < 10) return [];
  // 先按 4bit 量化做直方图，取出现最多的若干桶，再做一次均值归并
  const buckets = new Map();
  for (let i = 0; i < buf.length; i += 3) {
    const r = buf[i], g = buf[i + 1], b = buf[i + 2];
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    let e = buckets.get(key);
    if (!e) { e = { n: 0, r: 0, g: 0, b: 0 }; buckets.set(key, e); }
    e.n++; e.r += r; e.g += g; e.b += b;
  }
  const top = [...buckets.values()].sort((a, b) => b.n - a.n).slice(0, k * 4);
  // 合并过近的颜色（欧氏距离 < 60）
  const groups = [];
  for (const e of top) {
    const r = e.r / e.n, g = e.g / e.n, b = e.b / e.n;
    let hit = null;
    for (const gp of groups) {
      const d = Math.hypot(gp.r - r, gp.g - g, gp.b - b);
      if (d < 60) { hit = gp; break; }
    }
    if (hit) {
      const n = hit.n + e.n;
      hit.r = (hit.r * hit.n + r * e.n) / n;
      hit.g = (hit.g * hit.n + g * e.n) / n;
      hit.b = (hit.b * hit.n + b * e.n) / n;
      hit.n = n;
    } else {
      groups.push({ r, g, b, n: e.n });
    }
  }
  groups.sort((a, b) => b.n - a.n);
  const total = groups.reduce((s, g) => s + g.n, 0) || 1;
  return groups.slice(0, k).map((g) => {
    const hex = '#' + [g.r, g.g, g.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
    return { hex, ratio: Math.round((g.n / total) * 1000) / 1000 };
  });
}

// 递归扫描图片库下的所有图片；配色板以「文件名」为键（各目录前缀不重名）
function listImages(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) listImages(p, out);
    else if (/\.(webp|png|jpe?g|gif)$/i.test(e.name)) out.push(p);
  }
  return out;
}

// 动图（animated webp）无法用本机 ffmpeg 解码，其配色由同名 PNG 海报帧提供
function isAnimated(file) {
  try {
    const fd = fs.openSync(file, 'r');
    const buf = Buffer.alloc(64);
    fs.readSync(fd, buf, 0, 64, 0);
    fs.closeSync(fd);
    if (buf.slice(0, 4).toString('ascii') !== 'RIFF') return false;
    return buf.slice(12, 64).includes('ANIM');
  } catch {
    return false;
  }
}

const allFiles = listImages(IMG_ROOT).filter((p) => !isAnimated(p));
const pathOf = new Map(allFiles.map((p) => [path.basename(p), p]));
const files = [...pathOf.keys()];
console.log(`待提取 ${files.length} 张`);

const result = {};
if (fs.existsSync(OUT)) {
  try { Object.assign(result, JSON.parse(fs.readFileSync(OUT, 'utf8'))); } catch {}
}
let done = 0, fail = 0;
const pending = files.filter((f) => !result[f]);
console.log(`已有 ${files.length - pending.length}，待处理 ${pending.length}`);

let idx = 0;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (idx < pending.length) {
      const f = pending[idx++];
      try {
        const buf = await decode(pathOf.get(f));
        const pal = quantize(buf);
        if (pal.length) result[f] = pal;
        else fail++;
      } catch (e) {
        fail++;
        if (fail < 6) console.log(`  ✗ ${f}: ${e.message}`);
      }
      done++;
      if (done % 50 === 0) {
        console.log(`  … ${done}/${pending.length}`);
        fs.writeFileSync(OUT, JSON.stringify(result), 'utf8');
      }
    }
  })
);
fs.writeFileSync(OUT, JSON.stringify(result), 'utf8');
console.log(`完成：成功 ${Object.keys(result).length}，失败 ${fail}`);
