// 生成抽样拼版，用于肉眼复核动效预览画面
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import P, { IMG_MOTION } from './paths.mjs';

const LIB = P.root;
const DIR = path.join(P.assets, IMG_MOTION);
const CACHE = P.cache;
const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';

const perPack = Number(process.argv[2] || 3);
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.png'));
const byPack = {};
for (const f of files) {
  const p = f.replace(/^动效预览_/, '').split('_')[0];
  (byPack[p] = byPack[p] || []).push(f);
}
const list = [];
for (const p of Object.keys(byPack).sort()) list.push(...byPack[p].slice(0, perPack));

const tmp = path.join(CACHE, '_拼版源');
fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(tmp, { recursive: true });
list.forEach((f, i) => fs.copyFileSync(path.join(DIR, f), path.join(tmp, String(i + 1).padStart(3, '0') + '.png')));

const cols = Number(process.argv[3] || 6);
const rows = Math.ceil(list.length / cols);
const out = path.join(CACHE, '_动效拼版.png');
const args = ['-v', 'error', '-y', '-framerate', '1', '-i', path.join(tmp, '%03d.png'), '-vf', `scale=380:147:force_original_aspect_ratio=decrease,pad=380:147:(ow-iw)/2:(oh-ih)/2:color=0xf2f2f2,tile=${cols}x${rows}:padding=6:margin=6:color=0x222222`, '-frames:v', '1', out];
const p = spawn(FFMPEG, args, { windowsHide: true });
let err = '';
p.stderr.on('data', (d) => (err += d.toString()));
p.on('close', (code) => {
  console.log(code === 0 ? `拼版 ${list.length} 张 → ${out} (${(fs.statSync(out).size / 1024).toFixed(0)} KB)` : `失败 ${code}: ${err.slice(0, 300)}`);
});
