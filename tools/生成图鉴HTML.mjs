// 生成单文件自包含的 HTML 视觉参考图鉴
// 输出：05_工作台\public\atlas.html（内联三库 JSON + 复制逻辑 + 图片路由自适应）
// 图片来源：02_素材\图片库\风格参考图\
//   HTTP 访问 → /atlas-img/<文件名>
//   file:// 双击打开 → ../../02_素材/图片库/风格参考图/<文件名>

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import P from './paths.mjs';

const LIB = P.root;
const IDX = P.data;
const OUT = path.join(P.public, 'atlas.html');
const CACHE_DIR = P.cache;
// file:// 直接打开时的图片相对路径：按实际目录关系算，发布包与本地布局自动适配
const FILE_IMG_BASE = path.relative(path.dirname(OUT), P.assets).replace(/\\/g, '/') + '/';

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
const styles = readJson(path.join(IDX, '风格库.json'));
const motions = readJson(path.join(IDX, '动效库.json'));
const lighting = readJson(path.join(IDX, '光影库.json'));
// Vibe 画法库：知识短片的方法论库（MIT 上游 + 本项目蒸馏），可缺省（旧布局不生成该页签）
let vibe = null;
try {
  vibe = readJson(path.join(IDX, 'Vibe画法库.json'));
} catch {
  console.warn('  ! 未找到 Vibe画法库.json，图鉴将不生成「Vibe 画法库」页签');
}

const DATA = {
  generatedAt: styles.generatedAt,
  styles: { name: styles.name, counts: styles.counts, categories: styles.categories, items: styles.items },
  motions: { name: motions.name, counts: motions.counts, packs: motions.packs, items: motions.items },
  lighting: { name: lighting.name, counts: lighting.counts, categories: lighting.categories, items: lighting.items },
};
if (vibe) {
  DATA.vibe = { name: vibe.name, counts: vibe.counts, items: vibe.items };
}

// 内联 JSON 的安全转义：避免 </script> 与 HTML 注释序列
const BS = String.fromCharCode(92); // 反斜杠，避免源码里出现字面量转义
const inline = JSON.stringify(DATA)
  .split('<').join(BS + 'u003c')
  .split(String.fromCharCode(0x2028)).join(BS + 'u2028')
  .split(String.fromCharCode(0x2029)).join(BS + 'u2029');

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>素材收集库 · 视觉参考图鉴</title>
<style>
:root{
  --bg:#0e1113; --panel:#151a1d; --panel2:#1b2126; --line:#28313a; --line2:#39454f;
  --fg:#e8edf1; --fg2:#9fb0bd; --fg3:#6b7d8b;
  --accent:#5cbcc2; --accent2:#ef795a; --gold:#ffcc53; --ok:#6f9f34;
  --r:10px; --mono:"SF Mono",Consolas,"Cascadia Mono",Menlo,monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{background:var(--bg);color:var(--fg);font:14px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei","PingFang SC",sans-serif;-webkit-font-smoothing:antialiased}
a{color:var(--accent);text-decoration:none}
button{font:inherit;color:inherit;background:none;border:none;cursor:pointer}

/* ---------- 顶栏 ---------- */
header{position:sticky;top:0;z-index:40;background:rgba(14,17,19,.92);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.bar{display:flex;align-items:center;gap:18px;padding:12px 22px;max-width:1680px;margin:0 auto;flex-wrap:wrap}
.brand{display:flex;align-items:baseline;gap:10px;white-space:nowrap}
.brand h1{font-size:16px;font-weight:700;letter-spacing:.02em}
.brand .sub{font-size:11.5px;color:var(--fg3);font-family:var(--mono)}
.tabs{display:flex;gap:2px;background:var(--panel);border:1px solid var(--line);border-radius:var(--r);padding:3px}
.tabs button{padding:6px 15px;border-radius:7px;font-size:13px;color:var(--fg2);transition:.14s;white-space:nowrap}
.tabs button:hover{color:var(--fg)}
.tabs button.on{background:var(--accent);color:#0c1416;font-weight:600}
.tabs .n{font-family:var(--mono);font-size:11px;opacity:.7;margin-left:5px}
.search{flex:1;min-width:200px;display:flex;align-items:center;gap:8px;background:var(--panel);border:1px solid var(--line);border-radius:var(--r);padding:0 12px;height:36px}
.search input{flex:1;background:none;border:none;outline:none;color:var(--fg);font-size:13px}
.search input::placeholder{color:var(--fg3)}
.search .icon{color:var(--fg3);font-size:13px}
.tools{display:flex;gap:8px;align-items:center}
.btn{padding:6px 13px;border:1px solid var(--line2);border-radius:8px;font-size:12.5px;color:var(--fg2);transition:.14s;white-space:nowrap}
.btn:hover{border-color:var(--accent);color:var(--fg)}
.btn.pri{background:var(--accent);border-color:var(--accent);color:#0c1416;font-weight:600}
.btn.pri:hover{filter:brightness(1.1)}

/* ---------- 筛选条 ---------- */
.filters{display:flex;gap:7px;padding:9px 22px 12px;max-width:1680px;margin:0 auto;overflow-x:auto;scrollbar-width:thin;align-items:center}
.filters::-webkit-scrollbar{height:5px}
.filters::-webkit-scrollbar-thumb{background:var(--line2);border-radius:3px}
.chip{padding:4px 12px;border:1px solid var(--line);border-radius:20px;font-size:12px;color:var(--fg2);white-space:nowrap;transition:.14s;background:var(--panel)}
.chip:hover{border-color:var(--line2);color:var(--fg)}
.chip.on{background:var(--accent);border-color:var(--accent);color:#0c1416;font-weight:600}
.chip .n{font-family:var(--mono);font-size:10.5px;opacity:.65;margin-left:4px}
.fsep{width:1px;height:18px;background:var(--line);margin:0 3px;flex:none}

/* ---------- 网格 ---------- */
main{max-width:1680px;margin:0 auto;padding:0 22px 60px}
.bar-info{display:flex;align-items:center;gap:14px;padding:4px 0 14px;color:var(--fg3);font-size:12px}
.bar-info b{color:var(--fg2);font-weight:600}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(232px,1fr));gap:16px}
.card{background:var(--panel);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;cursor:pointer;transition:.16s;display:flex;flex-direction:column}
.card:hover{border-color:var(--accent);transform:translateY(-2px);box-shadow:0 8px 26px rgba(0,0,0,.45)}
.thumb{aspect-ratio:16/10;background:linear-gradient(135deg,#1b2126,#151a1d);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;border-bottom:1px solid var(--line)}
.thumb img{width:100%;height:100%;object-fit:cover;display:block}
.thumb .ph{color:var(--fg3);font-size:11px;font-family:var(--mono);text-align:center;padding:10px}
.thumb .tag{position:absolute;top:8px;left:8px;background:rgba(14,17,19,.86);border:1px solid var(--line2);border-radius:5px;padding:2px 7px;font-size:10.5px;color:var(--fg2);backdrop-filter:blur(4px)}
.thumb .src{position:absolute;bottom:8px;right:8px;background:rgba(14,17,19,.86);border:1px solid var(--line2);border-radius:5px;padding:2px 7px;font-size:10px;color:var(--fg3);font-family:var(--mono)}
.card .body{padding:11px 13px 13px;flex:1;display:flex;flex-direction:column;gap:6px}
.card .nm{font-size:14px;font-weight:600;line-height:1.35}
.card .en{font-size:11px;color:var(--fg3);font-family:var(--mono);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.card .ds{font-size:12px;color:var(--fg2);line-height:1.55;display:-webkit-box;-webkit-line-clamp:3;line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.swatches{display:flex;gap:3px;margin-top:auto;padding-top:7px}
.sw{width:13px;height:13px;border-radius:3px;border:1px solid rgba(255,255,255,.14)}
.more{display:block;text-align:center;padding:14px;color:var(--fg3);font-size:13px;cursor:pointer;border:1px dashed var(--line);border-radius:var(--r);margin-top:16px}
.more:hover{color:var(--accent);border-color:var(--accent)}
.empty{text-align:center;padding:70px 20px;color:var(--fg3)}
.empty b{display:block;color:var(--fg2);font-size:15px;margin-bottom:7px}

/* ---------- 详情抽屉 ---------- */
.mask{position:fixed;inset:0;background:rgba(6,8,10,.72);z-index:35;opacity:0;pointer-events:none;transition:.2s;backdrop-filter:blur(2px)}
.mask.on{opacity:1;pointer-events:auto}
.drawer{position:fixed;top:0;right:0;bottom:0;width:min(560px,94vw);background:var(--panel);border-left:1px solid var(--line);z-index:41;transform:translateX(100%);transition:transform .24s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column}
.drawer.on{transform:none}
.dh{padding:16px 20px;border-bottom:1px solid var(--line);display:flex;gap:12px;align-items:flex-start;flex:none}
.dh h2{font-size:18px;font-weight:700;line-height:1.3}
.dh .en{font-size:11.5px;color:var(--fg3);font-family:var(--mono);margin-top:3px}
.dh .close{margin-left:auto;font-size:22px;color:var(--fg3);line-height:1;padding:2px 8px;border-radius:6px}
.dh .close:hover{color:var(--accent);background:var(--panel2)}
.db{flex:1;overflow-y:auto;padding:16px 20px 30px}
.db img.full{width:100%;border-radius:8px;border:1px solid var(--line);margin-bottom:14px;display:block}
.mov-preview{margin:0 0 16px;border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--panel2)}
.mv-t{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--fg3);padding:7px 10px;font-weight:700;border-bottom:1px solid var(--line)}
.mov-preview img{width:100%;display:block}
.sec{margin-bottom:18px}
.sec h3{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg3);margin-bottom:7px;font-weight:700}
.sec p{font-size:13px;color:var(--fg2);line-height:1.7;white-space:pre-wrap;word-break:break-word}
.kv{display:grid;grid-template-columns:78px 1fr;gap:5px 10px;font-size:12.5px}
.kv dt{color:var(--fg3)}
.kv dd{color:var(--fg2);word-break:break-word}
.pal{display:flex;flex-wrap:wrap;gap:6px}
.pal .p{display:flex;align-items:center;gap:6px;background:var(--panel2);border:1px solid var(--line);border-radius:6px;padding:3px 8px;font-size:11px;font-family:var(--mono);color:var(--fg2)}
.pal .p i{width:12px;height:12px;border-radius:3px;border:1px solid rgba(255,255,255,.16);display:block}
.pre{background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:11px 13px;font-family:var(--mono);font-size:11.5px;line-height:1.72;color:var(--fg2);white-space:pre-wrap;word-break:break-word;max-height:340px;overflow:auto}
.pre .lb{color:var(--accent)}
.dacts{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;position:sticky;bottom:-30px;background:linear-gradient(transparent,var(--panel) 22%);padding:18px 0 8px}
.dacts .btn{padding:8px 15px;font-size:13px}
.tags{display:flex;flex-wrap:wrap;gap:5px}
.tags span{font-size:11px;background:var(--panel2);border:1px solid var(--line);border-radius:5px;padding:2px 8px;color:var(--fg3);font-family:var(--mono)}
.links{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.links a{font-size:12px;border:1px solid var(--line2);border-radius:6px;padding:4px 10px;color:var(--fg2)}
.links a:hover{border-color:var(--accent);color:var(--accent)}
.gal{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px}
.gal figure{margin:0}
.gal img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:5px;border:1px solid var(--line);cursor:zoom-in;display:block}
.gal figcaption{font-size:10.5px;line-height:1.45;color:var(--fg3);margin-top:4px;word-break:break-word}
.credit{font-size:11.5px;line-height:1.6;color:var(--fg3);margin:-8px 0 14px;padding:8px 10px;background:var(--panel2);border:1px solid var(--line);border-radius:7px}
.credit b{color:var(--fg2)}
.credit .warn{color:var(--accent2)}

/* ---------- toast ---------- */
.toast{position:fixed;bottom:26px;left:50%;transform:translate(-50%,20px);background:var(--accent);color:#0c1416;font-weight:600;font-size:13px;padding:10px 22px;border-radius:24px;opacity:0;pointer-events:none;transition:.22s;z-index:60;box-shadow:0 8px 26px rgba(0,0,0,.5)}
.toast.on{opacity:1;transform:translate(-50%,0)}
.toast.err{background:var(--accent2);color:#fff}
@media(max-width:760px){
  .grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:11px}
  .card .ds{display:none}
  .bar{padding:10px 14px;gap:10px}
  main{padding:0 14px 50px}
  .filters{padding:8px 14px 10px}
}
</style>
</head>
<body>
<header>
  <div class="bar">
    <div class="brand">
      <h1>素材收集库 · 视觉参考图鉴</h1>
      <span class="sub" id="stamp"></span>
    </div>
    <div class="tabs" id="tabs">
      <button data-tab="styles" class="on">风格库<span class="n" id="n-styles"></span></button>
      <button data-tab="motions">动效库<span class="n" id="n-motions"></span></button>
      <button data-tab="lighting">光影库<span class="n" id="n-lighting"></span></button>
      ${vibe ? '<button data-tab="vibe">Vibe 画法库<span class="n" id="n-vibe"></span></button>' : ''}
    </div>
    <div class="search">
      <span class="icon">⌕</span>
      <input id="q" type="search" placeholder="搜索名称、标签、提示词内容…" autocomplete="off">
    </div>
    <div class="tools">
      <button class="btn" id="copyList">复制筛选清单</button>
      <button class="btn pri" id="copyAll">复制全部提示词</button>
    </div>
  </div>
  <div class="filters" id="filters"></div>
</header>

<main>
  <div class="bar-info">
    <span>共 <b id="cnt">0</b> 条</span>
    <span id="cntInfo"></span>
    <span style="flex:1"></span>
    <span id="srcInfo"></span>
  </div>
  <div class="grid" id="grid"></div>
  <div class="more" id="more" style="display:none">加载更多</div>
</main>

<div class="mask" id="mask"></div>
<aside class="drawer" id="drawer">
  <div class="dh">
    <div style="min-width:0">
      <h2 id="dTitle"></h2>
      <div class="en" id="dEn"></div>
    </div>
    <button class="close" id="dClose">×</button>
  </div>
  <div class="db" id="dBody"></div>
</aside>
<div class="toast" id="toast"></div>

<script>
const DATA = ${inline};
const IMG_BASE = location.protocol === 'file:' ? '${FILE_IMG_BASE}' : '/atlas-img/';
// refs 是「相对图片库根目录」的路径，含子目录；逐段编码，保留分隔符
function imgUrl(r){
  if(!r) return '';
  if(/^https?:/.test(r)) return r;
  return IMG_BASE + r.split('/').map(encodeURIComponent).join('/');
}
const PAGE = 60;
let tab = 'styles';
let cat = '';
let q = '';
let shown = PAGE;
const SRC_ZH = { local:'本地', atlas:'atlas', 'motion-prompt':'motion-prompt', web:'网络' };
const CAT_KEY = { styles:'category', motions:'packName', lighting:'category', vibe:'category' };

document.getElementById('stamp').textContent = '生成于 ' + new Date(DATA.generatedAt).toLocaleString('zh-CN', { hour12:false });
document.getElementById('n-styles').textContent = DATA.styles.items.length;
document.getElementById('n-motions').textContent = DATA.motions.items.length;
document.getElementById('n-lighting').textContent = DATA.lighting.items.length;
if (DATA.vibe) document.getElementById('n-vibe').textContent = DATA.vibe.items.length;

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list = () => DATA[tab].items;

function cats(){
  const key = CAT_KEY[tab];
  const m = new Map();
  for(const it of list()){ const c = it[key] || '未分类'; m.set(c,(m.get(c)||0)+1); }
  return [...m.entries()].sort((a,b)=>b[1]-a[1]);
}
function match(it){
  if(cat){
    const key = CAT_KEY[tab];
    const c = it[key] || '未分类';
    if(c !== cat) return false;
  }
  if(!q) return true;
  const s = (it.name+' '+(it.nameEn||'')+' '+(it.tags||[]).join(' ')+' '+(it.category||'')+' '+(it.packName||'')+' '+(it.prompt||'')
    +' '+(it.theme||'')+' '+(it.kind||'')+' '+(it.detail?JSON.stringify(it.detail):'')).toLowerCase();
  return s.includes(q);
}
function swatches(it){
  const p = it.palette || [];
  if(!p.length) return '';
  return '<div class="swatches">' + p.slice(0,8).map(c=>'<span class="sw" style="background:'+esc(c.hex)+'" title="'+esc(c.hex)+'"></span>').join('') + '</div>';
}
function srcLabel(it){
  const s = it.source;
  if(!s) return '';
  if(typeof s === 'object') return s.project || '';
  return SRC_ZH[s] || s;
}
function onImgErr(el){ el.parentNode.innerHTML = '<div class="ph">图片不可用</div>'; }
function thumb(it){
  const r = (it.refs||[])[0];
  const tag = srcLabel(it);
  if(!r) {
    if (tab === 'vibe') {
      return '<div class="thumb"><div class="ph"><b style="font-size:13px;color:var(--fg2)">'+esc(it.category||'')+'</b><br>'+esc(it.kind||'')+'</div>'
        + (tag?'<span class="tag">'+esc(tag)+'</span>':'') + '</div>';
    }
    const why = it.refsStripped ? '主图版权保留<br>未随包分发' : '无参考图';
    return '<div class="thumb"><div class="ph">' + why + '</div>' + (tag?'<span class="tag">'+esc(tag)+'</span>':'') + '</div>';
  }
  const isRemote = /^https?:/.test(r);
  const src = isRemote ? r : imgUrl(r);
  return '<div class="thumb"><img loading="lazy" src="'+esc(src)+'" alt="'+esc(it.name)+'" onerror="onImgErr(this)"><span class="tag">'+esc(tag)+'</span><span class="src">'+esc(it.category||it.packName||'')+'</span></div>';
}

function render(){
  const items = list().filter(match);
  document.getElementById('cnt').textContent = items.length;
  const srcs = {};
  for(const it of list()){ const k = srcLabel(it) || '未标注'; srcs[k] = (srcs[k]||0)+1; }
  document.getElementById('srcInfo').textContent = '来源：' + Object.entries(srcs).map(([k,v])=>k+' '+v).join(' · ');
  document.getElementById('cntInfo').textContent = tab==='motions' ? '（含白模版条目 '+list().filter(x=>x.whitened).length+' 条）' : '';

  const slice = items.slice(0, shown);
  document.getElementById('grid').innerHTML = slice.map((it,i)=>
    '<article class="card" data-i="'+i+'">'+thumb(it)+
    '<div class="body"><div class="nm">'+esc(it.name)+'</div>'+
    (it.nameEn?'<div class="en">'+esc(it.nameEn)+'</div>':'')+
    '<div class="ds">'+esc(it.summary||it.meaning||it.effect||it.description||it.visual||it.use||it.theme||'')+'</div>'+
    swatches(it)+'</div></article>'
  ).join('') || '<div class="empty"><b>没有匹配的条目</b>换个关键词，或清空分类筛选</div>';

  document.getElementById('more').style.display = items.length > shown ? 'block' : 'none';
  document.getElementById('more').textContent = '加载更多（还有 ' + Math.max(0, items.length - shown) + ' 条）';

  document.querySelectorAll('.card').forEach(c=>c.addEventListener('click',()=>openDrawer(slice[+c.dataset.i])));
}

function renderFilters(){
  const cs = cats();
  const box = document.getElementById('filters');
  box.innerHTML = '<button class="chip'+(cat===''?' on':'')+'" data-c="">全部<span class="n">'+list().length+'</span></button>' +
    '<div class="fsep"></div>' +
    cs.map(([c,n])=>'<button class="chip'+(cat===c?' on':'')+'" data-c="'+esc(c)+'">'+esc(c)+'<span class="n">'+n+'</span></button>').join('');
  box.querySelectorAll('.chip').forEach(b=>b.addEventListener('click',()=>{ cat=b.dataset.c; shown=PAGE; render(); renderFilters(); }));
}

// ---------- 抽屉 ----------
function pre(label, text){
  if(!text) return '';
  return '<div class="sec"><h3>'+esc(label)+'</h3><div class="pre">'+esc(text)+'</div></div>';
}
function kv(rows){
  const r = rows.filter(x=>x[1]);
  if(!r.length) return '';
  return '<div class="sec"><h3>基本信息</h3><dl class="kv">' + r.map(x=>'<dt>'+esc(x[0])+'</dt><dd>'+esc(x[1])+'</dd>').join('') + '</dl></div>';
}
function openDrawer(it){
  if(!it) return;
  const db = document.getElementById('dBody');
  let html = '';

  const r0 = (it.refs||[])[0];
  if(r0 && !/^https?:/.test(r0)) html += '<img class="full" src="'+esc(imgUrl(r0))+'" alt="'+esc(it.name)+'" loading="lazy">';
  if(it.refsStripped) html += '<div class="credit"><b>主图未随包分发</b>：主参考图为「' + esc(it.imageLicense || '版权保留') + '」，不随本仓库再分发；条目文本、提示词与署名信息完整保留。</div>';
  // 主参考图的出处与授权（atlas 条目的 credit 是唯一的权利声明来源）
  if(it.credit){
    // 有图（或图被剔掉）时才叫「主图出处」，并附再分发提示；
    // 没有图的条目（如 Vibe 方法条目）只标「出处」——那是**方法论**的出处，
    // 别让它看起来像在提示某张图的授权风险。
    const hasImg = !!(it.refs && it.refs.length) || !!it.preview || !!it.refsStripped;
    const cls = it.imageLicense || '';
    const red = it.imageRedistributable;
    const warn = (hasImg && (red === false || red === '需授权' || red === '需人工判读'))
      ? ' <span class="warn">· 再分发受限，商用前请逐条核对</span>' : '';
    html += '<div class="credit"><b>' + (hasImg ? '主图出处' : '出处') + '</b>：'+esc(it.credit)
      + (cls ? '（'+esc(cls)+'）' : '') + warn + '</div>';
  }
  // 动效条目：附循环动图，点开抽屉即可看真实运动
  if(it.preview) html += '<div class="mov-preview"><div class="mv-t">循环动效预览</div><img src="'+esc(imgUrl(it.preview))+'" alt="'+esc(it.name)+' 动效"></div>';

  html += kv([
    ['分类', it.category || it.packName],
    ['英文名', it.nameEn],
    ['来源', srcLabel(it)],
    ['授权', it.license],
    ['状态', it.status],
    ['出处', it.sourcePath || it.sourceUrl],
  ]);

  if(it.palette && it.palette.length){
    html += '<div class="sec"><h3>配色</h3><div class="pal">' + it.palette.map(c=>
      '<span class="p"><i style="background:'+esc(c.hex)+'"></i>'+esc(c.hex)+(c.ratio?' '+(c.ratio*100).toFixed(0)+'%':'')+'</span>').join('') + '</div>' +
      (it.paletteDesc?'<p style="margin-top:8px">'+esc(it.paletteDesc)+'</p>':'') + '</div>';
  }

  const PROMPT_HEAD = {
    styles: '风格配置提示词 · 画面 / 配色 / 动法 / 光影',
    motions: '动效提示词 · 时序 / 缓动 / 幅度',
    lighting: '光影提示词 · 光位 / 光质 / 光比 / 色温',
  };
  html += pre(PROMPT_HEAD[tab] || '提示词', it.prompt);

  if(tab==='styles'){
    html += pre('实际画面观察', it.visual);
    html += pre('动法', it.motion);
    html += pre('光影', it.lighting);
    html += pre('质感', it.texture);
    html += pre('适用契机', it.use);
    html += pre('迁移方案', it.migration);
    html += pre('限制', it.limitations);
    html += pre('混搭边界', it.mix);
  }
  if(tab==='motions'){
    html += kv([['动效含义', it.meaning],['画布', it.canvas?(it.canvas.width+'×'+it.canvas.height+'，循环 '+it.canvas.cycle+'s'):null],['时序', it.timing],['缓动', it.easing],['幅度', it.amplitude]]);
    if(it.spec && it.spec.length) html += pre('运动规格（原文）', it.spec.join('\\n'));
    if(it.ask) html += pre('原始问法', it.ask);
  }
  if(tab==='lighting'){
    html += kv([['光位', it.direction],['光质', it.hardness],['光比', it.ratio],['色温', it.colorTemp],['来源', it.sourceName]]);
    html += pre('效果说明', it.effect);
    if(it.useCases && it.useCases.length) html += pre('适用场景', it.useCases.join('\\n'));
  }
  if(tab==='vibe'){
    html += pre('这条解决什么', it.theme);
    const d = it.detail || {};
    for(const [k,v] of Object.entries(d)){
      if(Array.isArray(v)) html += pre(k, v.join('\\n'));
      else html += pre(k, v);
    }
    if(it.refs && it.refs.length){
      html += '<div class="sec"><h3>参考图</h3><div class="gal">' + it.refs.map(r=>{
        const cr = '上游自有题目的样片拼图 · HeyChengC / vibe-knowledge-film';
        return '<figure><img loading="lazy" src="'+esc(imgUrl(r))+'" alt="'+esc(it.name)+' 参考图" title="'+esc(cr)+'">'
          + '<figcaption>'+esc(cr)+'</figcaption></figure>';
      }).join('') + '</div></div>';
    }
    if(it.source && it.source.repo){
      html += '<div class="sec"><h3>上游出处</h3><div class="links"><a href="'+esc(it.source.repo)+'" target="_blank" rel="noopener">'+esc(it.source.repo)+'</a>'
        + '<span class="tag" style="margin-left:8px">commit '+esc(String(it.source.commit||'').slice(0,7))+'</span></div>'
        + '<p style="margin-top:8px;color:var(--fg3);font-size:12px">上游文件：<code>'+esc(it.source.path||'')+'</code>｜'
        + esc(it.credit||'')+'｜方法论与代码按 ' + esc(it.license||'') + ' 分发。</p></div>';
    }
  }

  if(it.whitened){
    html += '<div class="sec"><h3>白模版 · 去风格化</h3><div class="pre"><span class="lb">'+
      esc(it.whitened.rules)+'</span>\\n\\n'+esc(it.whitened.prompt)+'</div></div>';
    html += '<div class="sec"><h3>可替换槽位</h3><div class="tags">'+it.whitened.slots.map(s=>'<span>{'+esc(s)+'}</span>').join('')+'</div></div>';
  }
  if(it.tags && it.tags.length) html += '<div class="sec"><h3>标签</h3><div class="tags">'+it.tags.map(t=>'<span>'+esc(t)+'</span>').join('')+'</div></div>';
  if(it.gallery && it.gallery.length){
    html += '<div class="sec"><h3>历史例图</h3><div class="gal">' + it.gallery.map(g=>{
      // 优先用拼好站点域名的 url；根相对路径直接用会 404
      const u = g.url || g.src;
      const cr = [g.artist, g.license].filter(Boolean).join(' · ');
      return '<figure><img loading="lazy" src="'+esc(u)+'" alt="'+esc(g.title||'')+'" title="'+esc(cr)+'">'
        + (cr ? '<figcaption>'+esc(cr)+'</figcaption>' : '') + '</figure>';
    }).join('') + '</div>'
    + '<div class="credit">历史例图由 <b>atlas.letz.ai</b> 远程提供，未随本仓库分发；每张的作者与授权如上标注（CC BY-SA 需署名，CC BY-SA 衍生作品需同授权）。</div></div>';
  }
  if(it.sourceUrl) html += '<div class="sec"><h3>原始出处</h3><div class="links"><a href="'+esc(it.sourceUrl)+'" target="_blank" rel="noopener">'+esc(it.sourceUrl)+'</a></div></div>';

  // 复制按钮
  const acts = [];
  if(tab==='styles'){
    acts.push(['copy','一键复制风格配置', it.prompt]);
    if(it.letzaiPrompt) acts.push(['copy','复制效果指令', it.letzaiPrompt]);
  }
  if(tab==='motions'){
    acts.push(['copy','复制动效提示词', it.prompt]);
    if(it.whitened) acts.push(['copy','复制白模版', it.whitened.prompt]);
    if(it.code) acts.push(['copy','复制元素代码', it.code.body]);
  }
  if(tab==='lighting') acts.push(['copy','复制光影提示词', it.prompt]);
  if(tab==='vibe'){
    // 注意：本文件整体是模板字符串，换行必须写成 \\n，否则生成出来的 JS 会是语法错误
    const md = '## ' + (it.name||'') + '\\n\\n' + (it.theme||'') + '\\n\\n'
      + Object.entries(it.detail||{}).map(([k,v])=>'### '+k+'\\n'+(Array.isArray(v)?v.map(x=>'- '+x).join('\\n'):v)).join('\\n\\n')
      + '\\n\\n---\\n出处：' + ((it.source&&it.source.repo)||'') + '（' + (it.license||'') + '）';
    acts.push(['copy','复制这条方法', md]);
  }
  html += '<div class="dacts">' + acts.map((a,i)=>'<button class="btn '+(i===0?'pri':'')+'" data-act="'+i+'">'+esc(a[1])+'</button>').join('') + '</div>';

  db.innerHTML = html;
  db.querySelectorAll('.dacts .btn').forEach(b=>b.addEventListener('click',()=>{
    const a = acts[+b.dataset.act];
    copy(a[2], a[1]+' 已复制');
  }));

  document.getElementById('dTitle').textContent = it.name;
  document.getElementById('dEn').textContent = it.nameEn || '';
  document.getElementById('drawer').classList.add('on');
  document.getElementById('mask').classList.add('on');
  db.scrollTop = 0;
}
function closeDrawer(){
  document.getElementById('drawer').classList.remove('on');
  document.getElementById('mask').classList.remove('on');
}

// ---------- 复制 ----------
function toast(msg, err){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast on' + (err?' err':'');
  clearTimeout(t._h);
  t._h = setTimeout(()=>{ t.className='toast'; }, 1900);
}
function copy(text, okMsg){
  if(!text){ toast('没有可复制的内容', true); return; }
  const done = ()=>toast(okMsg||'已复制');
  if(navigator.clipboard && window.isSecureContext){
    navigator.clipboard.writeText(text).then(done, ()=>fallback(text, done));
  } else fallback(text, done);
}
function fallback(text, done){
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch(e){}
  document.body.removeChild(ta);
  ok ? done() : toast('复制失败，请手动选中文本', true);
}

// ---------- 事件 ----------
document.getElementById('tabs').addEventListener('click', e=>{
  const b = e.target.closest('button[data-tab]');
  if(!b) return;
  document.querySelectorAll('#tabs button').forEach(x=>x.classList.toggle('on', x===b));
  tab = b.dataset.tab; cat = ''; shown = PAGE;
  document.getElementById('q').value = ''; q = '';
  renderFilters(); render();
});
let tq;
document.getElementById('q').addEventListener('input', e=>{
  clearTimeout(tq);
  tq = setTimeout(()=>{ q = e.target.value.trim().toLowerCase(); shown = PAGE; render(); }, 160);
});
document.getElementById('more').addEventListener('click', ()=>{ shown += PAGE; render(); });
document.getElementById('dClose').addEventListener('click', closeDrawer);
document.getElementById('mask').addEventListener('click', closeDrawer);
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeDrawer(); });

document.getElementById('copyList').addEventListener('click', ()=>{
  const items = list().filter(match);
  const text = items.map(it => '## ' + it.name + (it.nameEn?'（'+it.nameEn+'）':'') + '\\n' + (it.prompt||'')).join('\\n\\n---\\n\\n');
  copy(text, '已复制 '+items.length+' 条筛选清单');
});
document.getElementById('copyAll').addEventListener('click', ()=>{
  const items = list().filter(match);
  const text = items.map(it => '## ' + it.name + '\\n' + (it.prompt||'')).join('\\n\\n---\\n\\n');
  copy(text, '已复制 '+items.length+' 条提示词');
});

renderFilters();
render();
</script>
</body>
</html>
`;

fs.writeFileSync(OUT, html, 'utf8');
const size = (Buffer.byteLength(html) / 1048576).toFixed(2);
console.log(`已生成 ${OUT}`);
console.log(`体积 ${size} MB；风格 ${DATA.styles.items.length} / 动效 ${DATA.motions.items.length} / 光影 ${DATA.lighting.items.length}`
  + (DATA.vibe ? ` / Vibe 画法 ${DATA.vibe.items.length}` : ''));

// 自检：抽出内联 <script> 做语法检查，防止模板字符串吃掉转义导致运行时报错
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (m) {
  const tmp = path.join(CACHE_DIR, '_图鉴内联脚本检查.js');
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(tmp, m[1], 'utf8');
  const { spawnSync } = await import('node:child_process');
  const r = spawnSync(process.execPath, ['--check', tmp], { encoding: 'utf8' });
  if (r.status === 0) {
    console.log('内联脚本语法检查：OK');
    fs.unlinkSync(tmp);
  } else {
    console.error('内联脚本语法检查失败：\n' + (r.stderr || ''));
    process.exitCode = 1;
  }
}
