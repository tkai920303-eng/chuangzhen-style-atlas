// 探测：playwright-core 能否驱动本机 Chrome，以及各 pack 的字体/尺寸依赖
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LIB = path.resolve(HERE, '..', '..');
const PACK_DIR = path.join(LIB, '04_工具', '_抓取缓存', 'motion-pack');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function curl(url) {
  return new Promise((resolve, reject) => {
    const p = spawn('curl.exe', ['-s', '--compressed', '--max-time', '45', '-L', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0', url], { windowsHide: true });
    const c = [];
    p.stdout.on('data', (d) => c.push(d));
    p.stderr.on('data', (d) => process.stderr.write(d));
    p.on('close', (code) => (code !== 0 ? reject(new Error('curl ' + code)) : resolve(Buffer.concat(c).toString('utf8'))));
    p.on('error', reject);
  });
}

const PACKS = ['motion', 'motion2', 'camera', 'camera2', 'ui', 'lp', 'lp2', 'photo', 'diagram', 'artstyle'];

fs.mkdirSync(PACK_DIR, { recursive: true });
for (const id of PACKS) {
  const f = path.join(PACK_DIR, id + '.js');
  if (!fs.existsSync(f) || fs.statSync(f).size < 100) {
    const t = await curl(`https://raw.githubusercontent.com/showheyohtaki/motion-prompt/main/packs/${id}/pack.js`);
    fs.writeFileSync(f, t, 'utf8');
    console.log('下载', id, t.length);
  }
}

console.log('\n=== 启动 Chrome ===');
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
console.log('已启动:', browser.version());

const page = await browser.newPage();
page.on('console', (m) => console.log('  [console]', m.text().slice(0, 160)));
page.on('pageerror', (e) => console.log('  [pageerror]', e.message.slice(0, 200)));

await page.setContent('<!doctype html><meta charset="utf-8"><body></body>');
await page.addScriptTag({ path: path.join(LIB, '04_工具', '_抓取缓存', 'mp_assets_runtime.js') });
for (const id of PACKS) {
  await page.addScriptTag({ path: path.join(PACK_DIR, id + '.js') });
}

const info = await page.evaluate(() => {
  const out = {};
  for (const [id, p] of Object.entries(window.MotionPrompt.packs)) {
    out[id] = {
      w: p.width, h: p.height, cycle: p.cycle, cells: p.cells.length,
      fonts: (p.fonts || []).map((f) => f.family + ' :: ' + f.url),
      images: (p.images || []).length,
    };
  }
  return out;
});
console.log('\n=== 各 pack 信息 ===');
for (const [id, v] of Object.entries(info)) {
  console.log(`${id.padEnd(10)} ${v.w}x${v.h} cycle=${v.cycle}s cells=${v.cells} imgs=${v.images} fonts=${JSON.stringify(v.fonts)}`);
}

// 试渲染一个 cell，检查画布是否有内容
const probe = await page.evaluate(() => {
  const p = window.MotionPrompt.packs.motion;
  const c = document.createElement('canvas');
  c.width = p.width; c.height = p.height;
  const k = c.getContext('2d');
  const t0 = performance.now();
  try { p.cells[0](k, p.width, p.height, 0.8); } catch (e) { return { err: e.message }; }
  const dt = performance.now() - t0;
  const d = k.getImageData(0, 0, p.width, p.height).data;
  let nonEmpty = 0;
  for (let i = 3; i < d.length; i += 4) if (d[i] > 0) nonEmpty++;
  return { ms: Math.round(dt), nonEmptyPx: nonEmpty, total: p.width * p.height, dataUrlLen: c.toDataURL('image/png').length };
});
console.log('\n=== 渲染探测 motion cell 0 ===');
console.log(JSON.stringify(probe));

await browser.close();
console.log('\n完成');
