// 验证动效预览图：用 Chrome 的 ImageDecoder 读帧数与动画标记（ffmpeg 本机无 libwebp 解码器）
// 用法：node 验证动图.mjs [文件...]   不带参数则校验 动效预览图 目录下全部 .webp
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import P, { IMG_MOTION } from '../paths.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LIB = P.root;
const OUT_DIR = path.join(P.assets, IMG_MOTION);
const TMP = path.join(P.cache, '_格式测试');
const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const targets = args.length ? args.map((a) => path.resolve(a)) : fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.webp')).map((f) => path.join(OUT_DIR, f));
if (!targets.length) {
  console.log('没有待验证的动图');
  process.exit(0);
}

fs.mkdirSync(TMP, { recursive: true });
const probe = path.join(TMP, 'probe-decode.html');
fs.writeFileSync(
  probe,
  `<!doctype html><meta charset="utf-8"><body><script>
window.check = async (url) => {
  const buf = await (await fetch(url)).arrayBuffer();
  const type = url.endsWith('.gif') ? 'image/gif' : url.endsWith('.png') ? 'image/png' : 'image/webp';
  const dec = new ImageDecoder({ data: buf, type });
  await dec.tracks.ready;
  const tr = dec.tracks.selectedTrack;
  const r = { frames: tr.frameCount, animated: tr.animated, repeat: tr.repetitionCount };
  const f = await dec.decode({ frameIndex: 0 });
  r.w = f.image.displayWidth; r.h = f.image.displayHeight;
  return r;
};
</script>`,
  'utf8'
);

const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.goto(pathToFileURL(probe).href);

let ok = 0;
let bad = 0;
const sizes = [];
for (const f of targets) {
  const size = fs.statSync(f).size;
  sizes.push(size);
  let r;
  try {
    r = await page.evaluate((u) => window.check(u), pathToFileURL(f).href);
  } catch (e) {
    console.log(`${path.basename(f).padEnd(46)} ${(size / 1024).toFixed(0).padStart(5)} KB  ✗ ${e.message.slice(0, 80)}`);
    bad++;
    continue;
  }
  const good = r.animated && r.frames > 1;
  if (good) ok++;
  else bad++;
  console.log(
    `${path.basename(f).padEnd(46)} ${(size / 1024).toFixed(0).padStart(5)} KB  ${r.w}x${r.h}  ${r.frames} 帧  animated=${r.animated}  ${good ? '✓' : '✗'}`
  );
}
await browser.close();
console.log(`\n动图 ${ok} 个通过，${bad} 个异常；合计 ${(sizes.reduce((a, b) => a + b, 0) / 1024 / 1024).toFixed(2)} MB`);
process.exit(bad ? 1 : 0);
