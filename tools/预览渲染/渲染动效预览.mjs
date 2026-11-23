// 动效预览图渲染器
//
// 输入：04_工具\_抓取缓存\motion-pack\<pack>.js（motion-prompt 的 Canvas 元素代码，MIT）
//       04_工具\_抓取缓存\motion-catalog.json（240 条元素元数据）
// 输出：02_素材\图片库\动效预览图\动效预览_<pack>_<slug>.png   静态海报帧
//       02_素材\图片库\动效预览图\动效预览_<pack>_<slug>.webp  循环动图（libwebp_anim）
//
// 用法：
//   node 渲染动效预览.mjs                     渲染全部 216 条（跳过 artstyle，画风另有图）
//   node 渲染动效预览.mjs --pack motion        只渲染某个包
//   node 渲染动效预览.mjs --only 3 --fps 12    只渲染某包第 3 条
//   node 渲染动效预览.mjs --bench              基准测试，不写文件
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import P, { IMG_MOTION } from '../paths.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LIB = P.root;
const CACHE = P.cache;
const PACK_DIR = path.join(CACHE, 'motion-pack');
const OUT_DIR = path.join(P.assets, IMG_MOTION);
const RUNTIME = path.join(CACHE, 'mp_assets_runtime.js');
const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const argv = process.argv.slice(2);
const arg = (k, d = null) => {
  const i = argv.indexOf('--' + k);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};
const BENCH = argv.includes('--bench');
const FPS = Number(arg('fps', '12'));
const ONLY = arg('only') ? Number(arg('only')) : 0;
const PACK_FILTER = arg('pack');
const FORCE = argv.includes('--force');

// artstyle 包的元素是作者提供的画风卡（MIT 公开 webp），不重渲染
const SKIP_PACKS = new Set(['artstyle']);

const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';

function ffEncode(frames, outFile, fps) {
  return new Promise((resolve, reject) => {
    const args = [
      '-y', '-v', 'error',
      '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', 'pipe:0',
      '-c:v', 'libwebp_anim', '-loop', '0', '-lossless', '0', '-quality', '72', '-preset', 'picture',
      '-f', 'webp', outFile,
    ];
    const p = spawn(FFMPEG, args, { windowsHide: true, stdio: ['pipe', 'ignore', 'pipe'] });
    let err = '';
    p.stderr.on('data', (d) => (err += d.toString()));
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg ${code}: ${err.slice(0, 300)}`))));
    p.on('error', (e) => reject(new Error(`spawn ffmpeg: ${e.message}`)));
    p.stdin.on('error', () => {});
    (async () => {
      for (const b of frames) {
        if (!p.stdin.write(b)) await new Promise((r) => p.stdin.once('drain', r));
      }
      p.stdin.end();
    })().catch(reject);
  });
}

const catalog = JSON.parse(fs.readFileSync(path.join(CACHE, 'motion-catalog.json'), 'utf8'));
const all = (catalog.elements || catalog).filter((e) => !SKIP_PACKS.has(e.pack));
const packs = [...new Set(all.map((e) => e.pack))].filter((p) => !PACK_FILTER || p === PACK_FILTER);
console.log(`待渲染：${all.length} 条 / ${packs.length} 个包 / fps=${FPS}${BENCH ? '（基准模式，不写文件）' : ''}`);

fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('  [pageerror]', e.message.slice(0, 200)));
await page.setContent('<!doctype html><meta charset="utf-8"><body></body>');
await page.addScriptTag({ path: RUNTIME });

const report = { ok: 0, skip: 0, fail: 0, bytesPng: 0, bytesWebp: 0, frames: 0 };
const t0 = Date.now();

for (const packId of packs) {
  await page.addScriptTag({ path: path.join(PACK_DIR, packId + '.js') });
  const packInfo = await page.evaluate((id) => {
    const p = window.MotionPrompt.packs[id];
    return { w: p.width, h: p.height, cycle: p.cycle, cells: p.cells.length };
  }, packId);

  const els = all.filter((e) => e.pack === packId).sort((a, b) => Number(a.no) - Number(b.no));
  console.log(`\n[${packId}] ${packInfo.w}x${packInfo.h} cycle=${packInfo.cycle}s cells=${packInfo.cells}`);

  for (const el of els) {
    const idx = Number(el.no) - 1;
    if (ONLY && idx + 1 !== ONLY) continue;

    const base = `动效预览_${packId}_${el.slug}`;
    const pngFile = path.join(OUT_DIR, base + '.png');
    const webpFile = path.join(OUT_DIR, base + '.webp');
    if (!FORCE && fs.existsSync(pngFile) && fs.existsSync(webpFile)) {
      report.skip++;
      continue;
    }

    const n = Math.max(6, Math.round(packInfo.cycle * FPS));
    // 在浏览器里批量渲染这一条的 n 帧
    const frames = await page.evaluate(
      ({ id, i, n, cycle }) => {
        const p = window.MotionPrompt.packs[id];
        const c = document.createElement('canvas');
        c.width = p.width;
        c.height = p.height;
        const k = c.getContext('2d');
        const out = [];
        let best = { ink: -1, idx: 0 };
        for (let f = 0; f < n; f++) {
          const u = (f / n) * cycle;
          k.setTransform(1, 0, 0, 1, 0, 0);
          k.globalAlpha = 1;
          k.filter = 'none';
          k.globalCompositeOperation = 'source-over';
          k.clearRect(0, 0, p.width, p.height);
          k.save();
          p.cells[i](k, p.width, p.height, u);
          k.restore();
          const url = c.toDataURL('image/png');
          // 用不透明像素数量挑一张信息量最大的帧做海报
          const d = k.getImageData(0, 0, p.width, p.height).data;
          let ink = 0;
          for (let q = 3; q < d.length; q += 4) if (d[q] > 8) ink++;
          const mid = f > n * 0.15 && f < n * 0.9;
          if (mid && ink > best.ink) best = { ink, idx: f };
          out.push(url.slice('data:image/png;base64,'.length));
        }
        return { frames: out, posterIdx: best.idx };
      },
      { id: packId, i: idx, n, cycle: packInfo.cycle }
    );

    const bufs = frames.frames.map((b) => Buffer.from(b, 'base64'));
    if (BENCH) {
      console.log(`  ${base}: ${bufs.length} 帧，海报帧 #${frames.posterIdx}，单帧 ${Math.round(bufs.reduce((a, b) => a + b.length, 0) / bufs.length)} B`);
      report.ok++;
      report.frames += bufs.length;
      if (!ONLY) break; // 基准模式每个包只跑一条
      continue;
    }

    fs.writeFileSync(pngFile, bufs[frames.posterIdx]);
    await ffEncode(bufs, webpFile, FPS);

    const szP = fs.statSync(pngFile).size;
    const szW = fs.statSync(webpFile).size;
    report.ok++;
    report.frames += bufs.length;
    report.bytesPng += szP;
    report.bytesWebp += szW;
    console.log(`  ✓ ${base}  ${bufs.length}帧  png ${(szP / 1024).toFixed(0)}KB  webp ${(szW / 1024).toFixed(0)}KB  海报帧#${frames.posterIdx}`);
  }
}

await browser.close();
const dt = ((Date.now() - t0) / 1000).toFixed(1);
console.log(`\n=== 完成 ===`);
console.log(`成功 ${report.ok} / 跳过 ${report.skip} / 失败 ${report.fail} / 共 ${report.frames} 帧 / 用时 ${dt}s`);
if (!BENCH) {
  console.log(`PNG 合计 ${(report.bytesPng / 1024 / 1024).toFixed(2)} MB`);
  console.log(`WebP 合计 ${(report.bytesWebp / 1024 / 1024).toFixed(2)} MB`);
}
