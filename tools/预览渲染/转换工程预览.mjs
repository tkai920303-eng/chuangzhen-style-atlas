// 把工程动效库里已渲染的 mp4 预览转成图鉴用的循环动图 + 海报帧
// 输入：命令行给的 previews 目录（node 转换工程预览.mjs <previews 目录>）
// 输出：02_素材\图片库\动效预览图\动效预览_<id>.webp / .png
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import P, { IMG_MOTION } from '../paths.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LIB = P.root;
const OUT_DIR = path.join(P.assets, IMG_MOTION);
const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';
const SRC_DIR = process.argv[2];

if (!SRC_DIR || !fs.existsSync(SRC_DIR)) {
  console.error('用法：node 转换工程预览.mjs <previews 目录>');
  process.exit(1);
}

function run(args, label) {
  return new Promise((res, rej) => {
    const p = spawn(FFMPEG, args, { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    p.stderr.on('data', (d) => (err += d.toString()));
    p.on('close', (code) => (code === 0 ? res() : rej(new Error(`${label} ffmpeg ${code}: ${err.slice(-400)}`))));
    p.on('error', (e) => rej(e));
  });
}

// 探测时长（用于挑一张内容最饱满的海报帧）
function probeDuration(file) {
  return new Promise((res) => {
    const p = spawn(FFMPEG, ['-i', file], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    p.stderr.on('data', (d) => (err += d.toString()));
    p.on('close', () => {
      const m = /Duration:\s*(\d+):(\d+):([\d.]+)/.exec(err);
      res(m ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) : null);
    });
    p.on('error', () => res(null));
  });
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const mp4s = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.mp4'));
console.log(`待转换 ${mp4s.length} 个 mp4`);

for (const f of mp4s) {
  const id = f.replace(/\.mp4$/i, '');
  const src = path.join(SRC_DIR, f);
  const webp = path.join(OUT_DIR, `动效预览_${id}.webp`);
  const png = path.join(OUT_DIR, `动效预览_${id}.png`);
  try {
    await run(['-y', '-v', 'error', '-i', src, '-vf', 'fps=12,scale=540:-1:flags=lanczos', '-c:v', 'libwebp_anim', '-loop', '0', '-lossless', '0', '-quality', '78', '-preset', 'picture', '-f', 'webp', webp], id);
    // 海报帧取视频 70% 处（首帧常常是空画面）
    const dur = await probeDuration(src);
    const at = dur ? Math.max(0, dur * 0.7) : 0;
    await run(['-y', '-v', 'error', '-ss', at.toFixed(2), '-i', src, '-frames:v', '1', png], id);
    console.log(`  ✓ ${id}  时长 ${dur ? dur.toFixed(1) + 's' : '未知'}  webp ${(fs.statSync(webp).size / 1024).toFixed(0)}KB  png ${(fs.statSync(png).size / 1024).toFixed(0)}KB`);
  } catch (e) {
    console.log(`  ✗ ${id} ${e.message}`);
  }
}
