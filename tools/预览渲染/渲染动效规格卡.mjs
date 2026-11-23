// 本地工程动效/组件的「规格卡」渲染器
//
// 这 108 条是工程内已实现的代码引用条目（没有独立预览渲染，metadata.preview 为 null）。
// 直接给它们编造画面是误导，所以产出的是规格卡：写清源码位置、参数、依赖与状态，
// 让「找不到效果」变成「知道去哪找、怎么调」。
//
// 输出：02_素材\图片库\动效参考图\动效规格卡_<id>_<name>.png
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import P, { IMG_MOTION_CARD } from '../paths.mjs';
import { sanitizePath } from '../脱敏.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LIB = P.root;
const IDX = P.data;
const OUT_DIR = path.join(P.assets, IMG_MOTION_CARD);
const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const comp = JSON.parse(fs.readFileSync(path.join(IDX, 'components.json'), 'utf8'));
const items = comp.items || comp;
const local = items.filter((x) => x.type === '动效' || x.type === '组件源码');

function readMeta(dir) {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, 'metadata.json'), 'utf8').replace(/^\uFEFF/, ''));
  } catch {
    return null;
  }
}

const specs = local.map((x) => {
  const meta = readMeta(x.dir);
  return {
    id: x.id,
    name: x.name || x.id,
    type: x.type,
    status: x.status || meta?.status || '未标注',
    src: sanitizePath(x.src || meta?.source || ''),
    episode: meta?.source_episode || '',
    params: meta?.parameters && typeof meta.parameters === 'object' ? Object.entries(meta.parameters) : [],
    deps: meta?.dependencies || [],
    limits: meta?.limitations || '',
    assets: meta?.assets || [],
    file: `动效规格卡_${x.id}_${String(x.name || x.id).replace(/[\\/:*?"<>|]/g, '')}.png`,
  };
});

console.log(`规格卡 ${specs.length} 张`);
fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.setContent('<!doctype html><meta charset="utf-8"><body></body>');

const results = await page.evaluate((specs) => {
  const W = 760, H = 420;
  function wrap(k, text, maxW, maxLines) {
    const lines = [];
    let cur = '';
    for (const ch of String(text || '')) {
      if (ch === '\n') { lines.push(cur); cur = ''; continue; }
      const t = cur + ch;
      if (k.measureText(t).width > maxW && cur) { lines.push(cur); cur = ch; if (lines.length >= maxLines) break; }
      else cur = t;
    }
    if (lines.length < maxLines && cur) lines.push(cur);
    return lines;
  }
  const STATUS_COLOR = (s) => {
    if (/已渲染|已执行|可复用|已实现/.test(s)) return ['#e2f5e6', '#2f7d43'];
    if (/尚未|未标注|待/.test(s)) return ['#fdf0e0', '#9a6a1f'];
    return ['#ececec', '#666'];
  };
  // 状态缩略词（徽章在 291px 缩略图里只有 ~120px 宽）
  const STATUS_SHORT = (s) => {
    if (/已渲染/.test(s)) return '已渲染';
    if (/已执行/.test(s)) return '已执行';
    if (/可复用/.test(s)) return '可复用';
    if (/已实现|工程内/.test(s)) return '工程内';
    if (/已识别源码/.test(s)) return '待抽取';
    if (/已识别/.test(s)) return '待抽取';
    return '待验收';
  };
  // 标题按可用宽度截断加省略号
  const ellipsis = (k, text, maxW) => {
    if (k.measureText(text).width <= maxW) return text;
    let t = text;
    while (t.length > 1 && k.measureText(t + '…').width > maxW) t = t.slice(0, -1);
    return t + '…';
  };

  const out = [];
  for (const sp of specs) {
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const k = c.getContext('2d');
    k.fillStyle = '#f4f3f0'; k.fillRect(0, 0, W, H);
    k.fillStyle = '#ffffff'; k.fillRect(0, 0, W, 108);
    k.strokeStyle = '#e0dfdb'; k.lineWidth = 2;
    k.beginPath(); k.moveTo(0, 108.5); k.lineTo(W, 108.5); k.stroke();

    // 标题（大字：图鉴缩略图只有 291px 宽，字号要按缩放比放大）
    const short = STATUS_SHORT(sp.status);
    k.font = '700 46px "Microsoft YaHei", system-ui, sans-serif';
    k.font = '22px "Microsoft YaHei", system-ui, sans-serif';
    const sw = k.measureText(short).width + 34;
    const titleMax = W - 30 - sw - 28 - 20;
    k.fillStyle = '#16181d';
    k.font = '700 46px "Microsoft YaHei", system-ui, sans-serif';
    k.fillText(ellipsis(k, sp.name, titleMax), 30, 66);
    k.fillStyle = '#9a9a94';
    k.font = '22px ui-monospace, Consolas, monospace';
    k.fillText(sp.id, 30, 94);

    // 状态 badge
    const [bg, fg] = STATUS_COLOR(sp.status);
    k.font = '22px "Microsoft YaHei", system-ui, sans-serif';
    k.fillStyle = bg;
    k.beginPath(); k.roundRect(W - sw - 28, 34, sw, 38, 19); k.fill();
    k.fillStyle = fg;
    k.fillText(short, W - sw - 11, 60);

    let y = 148;
    k.fillStyle = '#16181d';
    k.font = '700 25px "Microsoft YaHei", system-ui, sans-serif';
    k.fillText('源码位置', 30, y);
    y += 38;
    k.font = '25px ui-monospace, Consolas, monospace';
    k.fillStyle = '#3d3d39';
    const srcLines = wrap(k, sp.src, W - 60, 2);
    for (const l of srcLines) { k.fillText(l, 30, y); y += 34; }
    if (sp.episode) {
      k.fillStyle = '#8b8b86';
      k.font = '23px "Microsoft YaHei", system-ui, sans-serif';
      k.fillText(`${sp.episode} · ${sp.type}`, 30, y);
      y += 40;
    }

    // 参数（chips）
    if (sp.params.length) {
      k.fillStyle = '#16181d';
      k.font = '700 25px "Microsoft YaHei", system-ui, sans-serif';
      k.fillText('可调参数', 30, y);
      y += 40;
      k.font = '24px "Microsoft YaHei", system-ui, sans-serif';
      let px = 30;
      for (const [key] of sp.params.slice(0, 6)) {
        const w = k.measureText(key).width + 26;
        if (px + w > W - 30) { px = 30; y += 44; }
        k.fillStyle = '#dfe9f7';
        k.beginPath(); k.roundRect(px, y - 28, w, 34, 7); k.fill();
        k.fillStyle = '#31547a';
        k.fillText(key, px + 13, y);
        px += w + 12;
      }
      y += 40;
    }

    // 依赖（单行）
    if (sp.deps.length) {
      k.fillStyle = '#6f6f6a';
      k.font = '22px "Microsoft YaHei", system-ui, sans-serif';
      const dl = wrap(k, '依赖：' + sp.deps.join(' · '), W - 60, 1);
      for (const l of dl) { if (y > H - 50) break; k.fillText(l, 30, y); y += 32; }
    }

    // 底部说明
    k.fillStyle = '#a5a5a0';
    k.font = '20px "Microsoft YaHei", system-ui, sans-serif';
    k.fillText('规格卡自产 · 引用工程内已实现代码，未做独立渲染预览', 30, H - 24);

    out.push({ id: sp.id, file: sp.file, png: c.toDataURL('image/png').slice('data:image/png;base64,'.length) });
  }
  return out;
}, specs);

let bytes = 0;
for (const r of results) {
  const buf = Buffer.from(r.png, 'base64');
  fs.writeFileSync(path.join(OUT_DIR, r.file), buf);
  bytes += buf.length;
}
await browser.close();
console.log(`生成 ${results.length} 张规格卡，合计 ${(bytes / 1024).toFixed(0)} KB → ${OUT_DIR}`);
