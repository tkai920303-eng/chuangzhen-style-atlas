// 光影示意图渲染：把规格画成 PNG（自产素材，版权自有）
// 输出：02_素材\图片库\光影参考图\<规格.file>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import P, { IMG_LIGHT } from '../paths.mjs';
import { buildLightingSchematics } from '../库源/光影示意图.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LIB = P.root;
const CACHE = P.cache;
const OUT_DIR = path.join(P.assets, IMG_LIGHT);
const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const raw = JSON.parse(fs.readFileSync(path.join(CACHE, '光影库原始数据.json'), 'utf8'));
const specs = buildLightingSchematics(raw);
fs.writeFileSync(path.join(CACHE, '光影示意图规格.json'), JSON.stringify(specs, null, 2), 'utf8');
console.log(`示意图规格 ${specs.length} 条`);

fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.setContent('<!doctype html><meta charset="utf-8"><body></body>');

const results = await page.evaluate((specs) => {
  const W = 760, H = 420;

  // 色温 → RGB（Tanner Helland 近似）
  function kelvinRGB(k) {
    const t = Math.max(1000, Math.min(12000, k)) / 100;
    let r, g, b;
    if (t <= 66) { r = 255; } else { r = 329.7 * Math.pow(t - 60, -0.1332); }
    if (t <= 66) { g = 99.47 * Math.log(t) - 161.12; } else { g = 288.12 * Math.pow(t - 60, -0.0755); }
    if (t >= 66) { b = 255; } else if (t <= 19) { b = 0; } else { b = 138.52 * Math.log(t - 10) - 305.04; }
    const cl = (v) => Math.max(0, Math.min(255, Math.round(v)));
    return `rgb(${cl(r)},${cl(g)},${cl(b)})`;
  }
  function nmRGB(nm) {
    let r = 0, g = 0, b = 0;
    if (nm >= 380 && nm < 440) { r = -(nm - 440) / 60; b = 1; }
    else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
    else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
    else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
    else if (nm <= 780) { r = 1; }
    let f = 1;
    if (nm > 700) f = 0.3 + 0.7 * (780 - nm) / 80;
    else if (nm < 420) f = 0.3 + 0.7 * (nm - 380) / 40;
    const cl = (v) => Math.max(0, Math.min(255, Math.round(v * 255 * f)));
    return `rgb(${cl(r)},${cl(g)},${cl(b)})`;
  }

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

  const out = [];
  for (const sp of specs) {
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const k = c.getContext('2d');

    // 背景
    k.fillStyle = '#f4f3f0';
    k.fillRect(0, 0, W, H);
    k.fillStyle = '#ffffff';
    k.fillRect(0, 0, W, 66);
    k.strokeStyle = '#e0dfdb'; k.lineWidth = 1;
    k.beginPath(); k.moveTo(0, 66.5); k.lineTo(W, 66.5); k.stroke();

    // 标题
    k.fillStyle = '#16181d';
    k.font = '600 25px "Microsoft YaHei", system-ui, sans-serif';
    k.textBaseline = 'alphabetic';
    k.fillText(sp.title, 26, 42);
    const tw = k.measureText(sp.title).width;
    if (sp.subtitle) {
      k.fillStyle = '#8b8b86';
      k.font = '13px "Microsoft YaHei", system-ui, sans-serif';
      k.fillText(sp.subtitle, 26 + tw + 12, 41);
    }
    // 分类 chip
    k.font = '12px "Microsoft YaHei", system-ui, sans-serif';
    const cw = k.measureText(sp.chip).width + 20;
    k.fillStyle = '#eceae5';
    k.beginPath(); k.roundRect(W - cw - 24, 22, cw, 24, 12); k.fill();
    k.fillStyle = '#6b6b66';
    k.fillText(sp.chip, W - cw - 14, 38);

    // ---------- 左侧：俯视图盘 ----------
    const cx = 188, cy = 248, R = 116;
    // 刻度圈
    k.strokeStyle = '#dcdbd6'; k.lineWidth = 1; k.setLineDash([4, 5]);
    k.beginPath(); k.arc(cx, cy, R, 0, Math.PI * 2); k.stroke();
    k.setLineDash([]);
    k.beginPath(); k.arc(cx, cy, R * 0.62, 0, Math.PI * 2); k.stroke();
    // 角度刻度
    k.font = '10px system-ui, sans-serif'; k.fillStyle = '#a8a8a2'; k.textAlign = 'center';
    for (let a = 0; a <= 180; a += 30) {
      const rad = (a * Math.PI) / 180;
      const x = cx + Math.sin(rad) * (R + 12), y = cy + Math.cos(rad) * (R + 12);
      k.fillText(String(a), x, y + 3);
      k.strokeStyle = '#d5d4cf';
      k.beginPath();
      k.moveTo(cx + Math.sin(rad) * (R - 5), cy + Math.cos(rad) * (R - 5));
      k.lineTo(cx + Math.sin(rad) * (R + 3), cy + Math.cos(rad) * (R + 3));
      k.stroke();
    }
    k.textAlign = 'left';

    // 镜头
    k.fillStyle = '#8a8a85';
    k.font = '11px "Microsoft YaHei", system-ui, sans-serif';
    k.textAlign = 'center';
    k.fillText('镜头轴 0°', cx, cy + R + 40);
    k.beginPath();
    k.moveTo(cx - 13, cy + R + 14); k.lineTo(cx + 13, cy + R + 14);
    k.lineTo(cx + 9, cy + R + 30); k.lineTo(cx - 9, cy + R + 30);
    k.closePath(); k.fill();
    k.textAlign = 'left';

    // 主体
    k.fillStyle = '#dedcd6';
    k.beginPath(); k.arc(cx, cy, 24, 0, Math.PI * 2); k.fill();
    k.strokeStyle = '#9c9c96'; k.lineWidth = 1.5;
    k.beginPath(); k.arc(cx, cy, 24, 0, Math.PI * 2); k.stroke();
    k.fillStyle = '#7d7d78';
    k.font = '11px "Microsoft YaHei", system-ui, sans-serif';
    k.textAlign = 'center';
    k.fillText('主体', cx, cy + 4);
    k.textAlign = 'left';

    // 灯位
    for (const L of sp.lights || []) {
      if (L.angle == null) continue;
      const rad = (L.angle * Math.PI) / 180;
      const elev = L.elev == null ? 0 : L.elev;
      const rr = R * (0.38 + 0.62 * (1 - Math.min(90, Math.max(-30, elev)) / 90));
      const lx = cx + Math.sin(rad) * rr, ly = cy + Math.cos(rad) * rr;
      // 连线
      k.strokeStyle = L.color; k.globalAlpha = 0.55; k.lineWidth = 1.5; k.setLineDash([5, 4]);
      k.beginPath(); k.moveTo(lx, ly); k.lineTo(cx, cy); k.stroke();
      k.setLineDash([]); k.globalAlpha = 1;
      // 灯
      const grd = k.createRadialGradient(lx, ly, 1, lx, ly, L.size * 2.1);
      grd.addColorStop(0, L.color); grd.addColorStop(1, L.color.replace('rgb', 'rgba').replace(')', ',0)'));
      k.fillStyle = grd;
      k.beginPath(); k.arc(lx, ly, L.size * 2.1, 0, Math.PI * 2); k.fill();
      k.fillStyle = L.color;
      k.beginPath(); k.arc(lx, ly, L.size * 0.72, 0, Math.PI * 2); k.fill();
      // 标注（加白底衬托，避免与刻度文字重叠）
      k.font = '600 11px "Microsoft YaHei", system-ui, sans-serif';
      k.fillStyle = '#3a3a36';
      const tag = `${L.role} ${L.angle}°${L.elev != null ? ` / ${L.elev}°` : ''}`;
      const side = lx >= cx ? 1 : -1;
      k.textAlign = side > 0 ? 'left' : 'right';
      const tagX = lx + side * (L.size * 2.1 + 5);
      const tw2 = k.measureText(tag).width;
      k.fillStyle = 'rgba(255,255,255,0.9)';
      k.beginPath();
      k.roundRect(side > 0 ? tagX - 3 : tagX - tw2 - 3, ly - 11, tw2 + 6, 16, 3);
      k.fill();
      k.fillStyle = '#3a3a36';
      k.fillText(tag, tagX, ly + 1);
      if (L.note) {
        k.font = '10px "Microsoft YaHei", system-ui, sans-serif';
        const nw = k.measureText(L.note).width;
        k.fillStyle = 'rgba(255,255,255,0.9)';
        k.beginPath();
        k.roundRect(side > 0 ? tagX - 3 : tagX - nw - 3, ly + 4, nw + 6, 15, 3);
        k.fill();
        k.fillStyle = '#9a9a94';
        k.fillText(L.note, tagX, ly + 15);
      }
      k.textAlign = 'left';
    }
    if (!sp.lights || !sp.lights.length) {
      k.fillStyle = '#b0b0aa';
      k.font = '12px "Microsoft YaHei", system-ui, sans-serif';
      k.textAlign = 'center';
      k.fillText('（该条目无离散灯位，按参数描述使用）', cx, cy + 46);
      k.textAlign = 'left';
    }

    // ---------- 右侧：参数区 ----------
    const RX = 372, RW = W - RX - 42;
    let y = 92;
    k.fillStyle = '#16181d';
    k.font = '600 14px "Microsoft YaHei", system-ui, sans-serif';
    k.fillText('关键参数', RX, y);
    y += 10;

    // 色温
    if (sp.kelvin) {
      y += 18;
      k.fillStyle = '#8b8b86';
      k.font = '12px "Microsoft YaHei", system-ui, sans-serif';
      k.fillText('色温', RX, y);
      const chipX = RX + 40, chipW = 108;
      if (sp.kelvin.nm) {
        const g2 = k.createLinearGradient(chipX, 0, chipX + chipW, 0);
        sp.kelvin.nm.forEach((nm, i) => g2.addColorStop(i / Math.max(1, sp.kelvin.nm.length - 1), nmRGB(nm)));
        k.fillStyle = g2;
      } else {
        k.fillStyle = kelvinRGB(sp.kelvin.main);
      }
      k.beginPath(); k.roundRect(chipX, y - 13, chipW, 18, 4); k.fill();
      k.strokeStyle = '#d8d7d2'; k.lineWidth = 1; k.stroke();
      k.fillStyle = '#4a4a46';
      k.font = '12px "Microsoft YaHei", system-ui, sans-serif';
      const ktxt = sp.kelvin.nm ? sp.kelvin.nm.join('nm / ') + 'nm' : `${sp.kelvin.main}K${sp.kelvin.second ? ` / ${sp.kelvin.second}K` : ''}`;
      k.fillText(ktxt, chipX + chipW + 10, y);
      y += 24;
    }

    // 光比
    if (sp.ratio) {
      y += 10;
      k.fillStyle = '#8b8b86';
      k.font = '12px "Microsoft YaHei", system-ui, sans-serif';
      k.fillText('光比', RX, y);
      const total = sp.ratio.key + sp.ratio.fill;
      const bw = RW - 108;
      const kw = Math.max(6, (sp.ratio.key / total) * bw);
      const fw = Math.max(3, (sp.ratio.fill / total) * bw);
      k.fillStyle = '#ffb347';
      k.fillRect(RX + 40, y - 11, kw, 9);
      k.fillStyle = '#7fb6ff';
      k.fillRect(RX + 40, y + 1, fw, 9);
      k.fillStyle = '#4a4a46';
      k.fillText(`${sp.ratio.key} : ${sp.ratio.fill}`, RX + 48 + bw, y);
      y += 28;
    }

    // 光质
    if (sp.hardness) {
      y += 6;
      k.fillStyle = '#8b8b86';
      k.font = '12px "Microsoft YaHei", system-ui, sans-serif';
      k.fillText('光质', RX, y);
      k.fillStyle = sp.hardness === '硬光' ? '#ffd9d0' : sp.hardness === '柔光' ? '#e2ecff' : '#f0e6ff';
      k.beginPath(); k.roundRect(RX + 40, y - 13, 62, 18, 4); k.fill();
      k.fillStyle = '#4a4a46';
      k.fillText(sp.hardness, RX + 50, y);
      y += 26;
    }

    // 事实列表
    if (sp.facts && sp.facts.length) {
      k.fillStyle = '#6f6f6a';
      k.font = '12px "Microsoft YaHei", system-ui, sans-serif';
      for (const f of sp.facts) {
        const ls = wrap(k, f, RW, 2);
        for (const l of ls) { k.fillText(l, RX, y); y += 17; }
      }
      y += 4;
    }

    // 描述
    k.fillStyle = '#3d3d39';
    k.font = '12.5px "Microsoft YaHei", system-ui, sans-serif';
    const dl = wrap(k, sp.desc, RW, 5);
    for (const l of dl) { if (y > H - 34) break; k.fillText(l, RX, y); y += 19; }

    // 出处
    k.fillStyle = '#a5a5a0';
    k.font = '10.5px "Microsoft YaHei", system-ui, sans-serif';
    k.fillText('示意图自产 · 参数来源：' + (sp.source || ''), RX, H - 16);

    out.push({ id: sp.id, file: sp.file, png: c.toDataURL('image/png').slice('data:image/png;base64,'.length) });
  }
  return out;
}, specs);

let ok = 0;
let bytes = 0;
for (const r of results) {
  const buf = Buffer.from(r.png, 'base64');
  fs.writeFileSync(path.join(OUT_DIR, r.file), buf);
  bytes += buf.length;
  ok++;
}
await browser.close();
console.log(`生成 ${ok} 张示意图，合计 ${(bytes / 1024).toFixed(0)} KB → ${OUT_DIR}`);
