// 下载 motion-prompt artstyle 包的 24 张画风参考图（作者提供，MIT 授权）
// 输出：02_素材\图片库\风格参考图\风格图鉴_画风_<slug>.webp
// 同时把 catalog 中 artstyle 24 条的 id/no/slug 映射写进缓存，供构建三库使用。
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import P, { IMG_STYLE } from './paths.mjs';

const LIB = P.root;
const CACHE = P.cache;
const IMG_DIR = path.join(P.assets, IMG_STYLE);
const BASE = 'https://raw.githubusercontent.com/showheyohtaki/motion-prompt/main/packs/artstyle/img';

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
        reject(new Error(`curl ${code} ${url} ${err.slice(0, 160)}`));
      });
      p.on('error', (e) => (n < tries ? setTimeout(() => attempt(n + 1), 800 * n) : reject(e)));
    };
    attempt(1);
  });
}

const catalog = JSON.parse(fs.readFileSync(path.join(CACHE, 'motion-catalog.json'), 'utf8'));
const arts = (catalog.elements || catalog).filter((e) => e.pack === 'artstyle').sort((a, b) => Number(a.no) - Number(b.no));
console.log('artstyle 条目', arts.length);

fs.mkdirSync(IMG_DIR, { recursive: true });
const map = [];
let ok = 0;
let skip = 0;
for (const el of arts) {
  const file = `风格图鉴_画风_${el.slug}.webp`;
  const dest = path.join(IMG_DIR, file);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 2000) {
    skip++;
  } else {
    const buf = await curlBuf(`${BASE}/style-${el.no}.webp`);
    if (buf.length < 2000) throw new Error(`下载内容过小 ${el.no} ${buf.length}`);
    // RIFF/WEBP 魔数校验
    if (buf.slice(0, 4).toString('ascii') !== 'RIFF' || buf.slice(8, 12).toString('ascii') !== 'WEBP') {
      throw new Error(`不是 webp ${el.no}`);
    }
    fs.writeFileSync(dest, buf);
    ok++;
  }
  map.push({ id: el.id, no: el.no, slug: el.slug, file, name: el.name?.['zh-Hans'] || el.name?.en, category: el.category });
}

fs.writeFileSync(path.join(CACHE, '画风图映射.json'), JSON.stringify(map, null, 2), 'utf8');
console.log(`画风参考图：新增 ${ok}，已存在 ${skip}，共 ${arts.length}`);
const sizes = map.map((m) => fs.statSync(path.join(IMG_DIR, m.file)).size);
console.log('总字节', sizes.reduce((a, b) => a + b, 0), '平均', Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length));
