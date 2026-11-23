// 动图格式浏览器兼容性对照（页面本身跑在 file:// 上，避免 about:blank 源禁载 file:// 子资源）
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LIB = path.resolve(HERE, '..', '..');
const CACHE = path.join(LIB, '04_工具', '_抓取缓存');
const PACK_DIR = path.join(CACHE, 'motion-pack');
const TMP = path.join(CACHE, '_格式测试');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';

fs.mkdirSync(TMP, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.setContent('<!doctype html><meta charset="utf-8"><body></body>');
await page.addScriptTag({ path: path.join(CACHE, 'mp_assets_runtime.js') });
await page.addScriptTag({ path: path.join(PACK_DIR, 'motion.js') });

const r = await page.evaluate(() => {
  const p = window.MotionPrompt.packs.motion;
  const c = document.createElement('canvas');
  c.width = p.width; c.height = p.height;
  const k = c.getContext('2d');
  const out = [];
  for (let f = 0; f < 56; f++) {
    k.setTransform(1, 0, 0, 1, 0, 0); k.globalAlpha = 1; k.filter = 'none';
    k.globalCompositeOperation = 'source-over';
    k.clearRect(0, 0, p.width, p.height);
    k.save(); p.cells[0](k, p.width, p.height, (f / 56) * p.cycle); k.restore();
    out.push(c.toDataURL('image/png').slice('data:image/png;base64,'.length));
  }
  return out;
});
const bufs = r.map((b) => Buffer.from(b, 'base64'));
console.log('帧数', bufs.length);

function run(args) {
  return new Promise((res, rej) => {
    const p = spawn(FFMPEG, args, { windowsHide: true, stdio: ['pipe', 'ignore', 'pipe'] });
    let err = '';
    p.stderr.on('data', (d) => (err += d.toString()));
    p.on('close', (code) => (code === 0 ? res() : rej(new Error(`ffmpeg ${code}: ${err.slice(0, 300)}`))));
    p.stdin.on('error', () => {});
    (async () => { for (const b of bufs) { if (!p.stdin.write(b)) await new Promise((x) => p.stdin.once('drain', x)); } p.stdin.end(); })().catch(rej);
  });
}

const cases = [
  ['still-webp', '.webp', ['-y','-v','error','-f','image2pipe','-framerate','12','-c:v','png','-i','pipe:0','-frames:v','1','-c:v','libwebp','-quality','80','-f','webp']],
  ['anim-webp-default', '.webp', ['-y','-v','error','-f','image2pipe','-framerate','12','-c:v','png','-i','pipe:0','-c:v','libwebp_anim','-loop','0','-lossless','0','-quality','72','-preset','picture','-f','webp']],
  ['anim-webp-bgra', '.webp', ['-y','-v','error','-f','image2pipe','-framerate','12','-c:v','png','-i','pipe:0','-c:v','libwebp_anim','-loop','0','-quality','72','-pix_fmt','bgra','-f','webp']],
  ['apng', '.png', ['-y','-v','error','-f','image2pipe','-framerate','12','-c:v','png','-i','pipe:0','-plays','0','-f','apng']],
  ['gif', '.gif', ['-y','-v','error','-f','image2pipe','-framerate','12','-c:v','png','-i','pipe:0','-lavfi','split[a][b];[a]palettegen[p];[b][p]paletteuse','-loop','0','-f','gif']],
];

const results = [];
for (const [name, ext, args] of cases) {
  const out = path.join(TMP, name + ext);
  try {
    await run([...args, out]);
    results.push([name, out]);
  } catch (e) {
    console.log(`${name.padEnd(20)} 编码失败: ${e.message}`);
    results.push([name, null]);
  }
}

// 写一个跑在 file:// 上的探针页
const probe = path.join(TMP, 'probe.html');
fs.writeFileSync(
  probe,
  `<!doctype html><meta charset="utf-8"><body><script>
// 用 WebCodecs 的 ImageDecoder 直接读帧数与时长，比像素采样可靠
window.check = async (url) => {
  const buf = await (await fetch(url)).arrayBuffer();
  const type = url.endsWith('.gif') ? 'image/gif' : url.endsWith('.png') ? 'image/png' : 'image/webp';
  if (!('ImageDecoder' in window)) return { err: '无 ImageDecoder' };
  const dec = new ImageDecoder({ data: buf, type });
  await dec.tracks.ready;
  const tr = dec.tracks.selectedTrack;
  const out = { frames: tr.frameCount, animated: tr.animated, dur: tr.duration };
  if (tr.frameCount > 1) {
    const f = await dec.decode({ frameIndex: 0 });
    const f2 = await dec.decode({ frameIndex: Math.floor(tr.frameCount / 2) });
    out.differs = f.image.byteLength !== f2.image.byteLength || true;
    const d1 = new Uint8Array(f.image.allocationSize ? await f.image.copyTo(new Uint8Array(f.image.allocationSize())).then(() => f.image) : new Uint8Array(0));
    out.ok = true;
  }
  return out;
};
</script>`,
  'utf8'
);
await page.goto(pathToFileURL(probe).href);

// 对照组：已知能用的 PNG 海报
const ctrl = path.join(LIB, '02_素材', '图片库', '动效预览图', '动效预览_motion_pop-in.png');
const all = [['对照-PNG海报', ctrl], ...results];
for (const [name, file] of all) {
  if (!file || !fs.existsSync(file)) { console.log(`${name.padEnd(20)} 无文件`); continue; }
  const size = fs.statSync(file).size;
  if (size === 0) { console.log(`${name.padEnd(20)} ${String(size).padStart(5)} B  ✗ 空文件`); continue; }
  const r2 = await page.evaluate((u) => window.check(u), pathToFileURL(file).href);
  console.log(
    `${name.padEnd(20)} ${(size / 1024).toFixed(0).padStart(5)} KB  ${r2.err ? '✗ ' + r2.err : `${r2.frames} 帧  animated=${r2.animated}  时长 ${Math.round(r2.dur / 1000)}ms  ${r2.frames > 1 ? '✓ 动图' : '· 静态'}`}`
  );
}

await browser.close();
