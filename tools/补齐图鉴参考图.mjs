// 补齐风格库缺图：
//   1. atlas 条目 —— 用该条 gallery[0]（Atlas 自家生成的历史例图，license 见条目 gallery[].license）
//   2. motion-prompt 画风条目 —— 用作者公开的 packs/artstyle/img/style-NN.webp（MIT）
// 输出图片：02_素材\图片库\风格参考图\
// 输出映射：04_工具\_抓取缓存\画风图映射.json（画风）、风格库补图映射.json（全量）
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import P, { IMG_STYLE } from './paths.mjs';

const LIB = P.root;
const CACHE = P.cache;
const IMG_DIR = path.join(P.assets, IMG_STYLE);
const ATLAS_ORIGIN = 'https://atlas.letz.ai';

function curlBuf(url, tries = 3) {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      const p = spawn('curl.exe', ['-s', '--compressed', '--max-time', '60', '-L', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0', '-o', '-', url], {
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      const c = [];
      let err = '';
      p.stdout.on('data', (d) => c.push(d));
      p.stderr.on('data', (d) => (err += d.toString()));
      p.on('close', (code) => {
        if (code === 0 && c.length) return resolve(Buffer.concat(c));
        if (n < tries) return setTimeout(() => attempt(n + 1), 800 * n);
        reject(new Error(`curl ${code} ${url} ${err.slice(0, 140)}`));
      });
      p.on('error', (e) => (n < tries ? setTimeout(() => attempt(n + 1), 800 * n) : reject(e)));
    };
    attempt(1);
  });
}

function extOf(buf, url) {
  const head = buf.slice(0, 12);
  if (head.slice(0, 4).toString('ascii') === 'RIFF' && head.slice(8, 12).toString('ascii') === 'WEBP') return 'webp';
  if (head[0] === 0x89 && head.slice(1, 4).toString('ascii') === 'PNG') return 'png';
  if (head[0] === 0xff && head[1] === 0xd8) return 'jpg';
  if (head.slice(0, 3).toString('ascii') === 'GIF') return 'gif';
  const m = /\.(webp|png|jpe?g|gif)(?:$|[?#])/i.exec(url);
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'webp';
}

fs.mkdirSync(IMG_DIR, { recursive: true });
const styles = JSON.parse(fs.readFileSync(path.join(LIB, '03_索引', '风格库.json'), 'utf8'));
const artMap = JSON.parse(fs.readFileSync(path.join(CACHE, '画风图映射.json'), 'utf8'));
const artById = new Map(artMap.map((m) => [m.id, m]));
// 风格库条目 id 形如 mp-art-193，画风映射表用 motion-prompt 原始 id（193）作键
const artLookup = (libId) => artById.get(libId) || artById.get(String(libId).replace(/^mp-art-/, ''));

const mapping = {};
let fixed = 0;
const failed = [];

for (const it of styles.items) {
  if (it.refs && it.refs.length) {
    mapping[it.id] = it.refs[0];
    continue;
  }
  let url = null;
  let want = null;
  if (it.source === 'motion-prompt') {
    const m = artLookup(it.id);
    if (m) {
      want = m.file;
      const dest = path.join(IMG_DIR, want);
      if (!fs.existsSync(dest)) {
        console.log(`  ! 画风图缺失，跳过 ${it.id} ${want}`);
        failed.push(it.id);
        continue;
      }
      mapping[it.id] = want;
      fixed++;
      continue;
    }
  } else if (it.source === 'atlas') {
    const g = (it.gallery || []).find((x) => x.src);
    if (g) {
      url = g.src.startsWith('http') ? g.src : ATLAS_ORIGIN + g.src;
      want = `风格图鉴_${it.id.replace(/^atlas-/, '')}.webp`;
    }
  }
  if (!url || !want) {
    failed.push(it.id);
    continue;
  }
  const dest = path.join(IMG_DIR, want);
  try {
    const buf = await curlBuf(url);
    if (buf.length < 2000) throw new Error(`内容过小 ${buf.length}`);
    const realExt = extOf(buf, url);
    const finalName = realExt === 'webp' ? want : want.replace(/\.webp$/, '.' + realExt);
    fs.writeFileSync(path.join(IMG_DIR, finalName), buf);
    mapping[it.id] = finalName;
    fixed++;
    console.log(`  ✓ ${it.id} ← ${url}  ${(buf.length / 1024).toFixed(0)}KB`);
  } catch (e) {
    console.log(`  ✗ ${it.id} ${e.message}`);
    failed.push(it.id);
  }
}

fs.writeFileSync(path.join(CACHE, '风格库补图映射.json'), JSON.stringify(mapping, null, 2), 'utf8');
console.log(`\n补齐 ${fixed} 条，仍缺 ${failed.length} 条`);
if (failed.length) console.log('  仍缺:', failed.join(', '));
const files = fs.readdirSync(IMG_DIR);
console.log(`风格参考图目录现有 ${files.length} 个文件`);
