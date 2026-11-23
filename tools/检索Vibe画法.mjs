// Vibe 画法库 · 离线检索
//
// 用法：
//   node 04_工具/检索Vibe画法.mjs <关键词>          # 全文检索（名称/主题/标签/正文细节/配色）
//   node 04_工具/检索Vibe画法.mjs --list             # 列出全部条目
//   node 04_工具/检索Vibe画法.mjs --id=vibe-world-c  # 按 id 取单条
//   node 04_工具/检索Vibe画法.mjs --id=vibe-world-c --full   # 完整输出（含配色与全部细节）
//   node 04_工具/检索Vibe画法.mjs --kind=画法        # 按类别过滤
//   node 04_工具/检索Vibe画法.mjs 字幕 --json        # 输出 JSON（给脚本用）
//   node 04_工具/检索Vibe画法.mjs --kit              # 只出引擎件清单
//
// 输出一律带授权标记：本库方法论与引擎代码为 MIT，可自由引用与再分发；
// 库内「版权受限_仅本地对照」目录的内容属他人短片，不得再分发。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import P from './paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LIB = path.resolve(__dirname, '..');
// 索引位置随布局走：本地是 03_索引\，发布包是 data\
const IDX = path.join(P.data, 'Vibe画法库.json');
// 件清单位置：发布包在 data\ 下；本地库在 02_素材\特效组件库\<引擎目录>\件清单.json。
// 引擎目录名**不写死**——本脚本会随包分发，写死的本地目录名会被作品名审计当场抓出来。
function findKit() {
  if (P.layout === 'package') return path.join(P.data, 'vibe件清单.json');
  const comp = path.join(LIB, '02_素材', '特效组件库');
  if (!fs.existsSync(comp)) return null;
  for (const e of fs.readdirSync(comp, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const p = path.join(comp, e.name, '件清单.json');
    if (fs.existsSync(p)) return p;
  }
  return null;
}
const KIT = findKit();

if (!fs.existsSync(IDX)) {
  console.error(
    `未找到索引：${IDX}\n` +
      (P.layout === 'package'
        ? '发布包内应有 data/Vibe画法库.json——请检查这个包是否完整。'
        : '先运行：node 04_工具/入库Vibe画法.mjs')
  );
  process.exit(1);
}
const db = JSON.parse(fs.readFileSync(IDX, 'utf8').replace(/^\uFEFF/, ''));

const argv = process.argv.slice(2);
const flags = Object.fromEntries(
  argv.filter((a) => a.startsWith('--')).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v === undefined ? true : v];
  })
);
const words = argv.filter((a) => !a.startsWith('--'));

const hit = (hay, needle) => String(hay ?? '').toLowerCase().includes(needle.toLowerCase());

// 条目级命中面：只放「整条都相关」的粗粒度字段。
// 细节（detail）与配色是细粒度的，单独匹配，避免命中一个子项却把整条全打出来。
const matchItem = (it, q) => {
  if (!q) return true;
  const bag = [it.id, it.name, it.theme, it.category, it.kind, ...(it.tags || [])].join(' ');
  return hit(bag, q);
};
// 细节命中面：只命中某个子项时，只出该子项
const matchDetail = (d, q) => {
  if (!d || typeof d !== 'object') return false;
  return Object.entries(d).some(([k, v]) => hit(k, q) || hit(v, q));
};
const matchPalette = (p, q) => hit(p.role, q) || hit(p.hex, q) || hit(p.note, q);

let items = db.items;
if (flags.id) items = items.filter((i) => i.id === flags.id);
if (flags.kind) items = items.filter((i) => i.kind === flags.kind);
if (flags.cat) items = items.filter((i) => i.category === flags.cat);

if (flags.kit) {
  if (!KIT || !fs.existsSync(KIT)) {
    console.error(`未找到件清单：${KIT || '(未找到引擎目录)'}`);
    process.exit(1);
  }
  const kit = JSON.parse(fs.readFileSync(KIT, 'utf8').replace(/^\uFEFF/, ''));
  console.log(`VKit 件库（window.VKit.*）  ${kit.件数} 项   来源 ${kit.来源.repo}@${kit.来源.commit.slice(0, 7)}`);
  console.log('─'.repeat(78));
  console.log('  ' + kit.件.join('  '));
  console.log(`\nVK 核心 API（window.VK.*）  ${kit.核心API项数} 项`);
  console.log('  ' + kit.核心API.join('  '));
  console.log('\n※ 件库是「货架」：每条片都会出现的件在这里；每章的道具（陶瓮、针、信封……）在自己 film.js 里现画。');
  process.exit(0);
}

if (flags.list || (!words.length && !flags.id && !flags.kind && !flags.cat)) {
  console.log(`${db.name}  ${db.counts.items} 条 / ${db.counts.画法} 画法 / ${db.counts.规格} 外观规格 / ${db.counts.配色token} 配色 token`);
  console.log(`生成于 ${db.generatedAt}`);
  console.log(`来源 ${db.源.repo}@${db.源.commit.slice(0, 7)}（${db.源.upstreamLicense}）`);
  console.log('='.repeat(78));
  for (const it of items) {
    console.log(`  ${it.id}`);
    console.log(`    ${it.name}（${it.category} / ${it.kind}）`);
    console.log(`    ${it.theme}`);
    console.log(`    标签：${(it.tags || []).join(' / ')}`);
    console.log(`    授权：${it.license}｜${it.credit}`);
    console.log('');
  }
  console.log('※ 本库方法论与引擎代码为 MIT，可自由引用与再分发（请保留出处 HeyChengC/vibe-knowledge-film）。');
  console.log('  「版权受限_仅本地对照」目录（仅本地库有）属他人短片，不得再分发，也不在开源包内。');
  process.exit(0);
}

const q = words[0];
const out = items
  .map((it) => {
    const itemHit = matchItem(it, q);
    const detailHit = itemHit ? it.detail : Object.fromEntries(
      Object.entries(it.detail || {}).filter(([k, v]) => matchDetail({ [k]: v }, q))
    );
    const palHit = itemHit ? it.palette : (it.palette || []).filter((p) => matchPalette(p, q));
    return {
      item: it, itemHit, detailHit, palette: palHit,
      detailHitCount: Object.keys(detailHit || {}).length,
      palHitCount: palHit.length,
    };
  })
  .filter((r) => r.itemHit || r.detailHitCount || r.palHitCount);

if (flags.json) {
  console.log(JSON.stringify({
    name: db.name,
    query: q || null,
    source: db.源,
    hits: out.map((r) => ({
      id: r.item.id, name: r.item.name, kind: r.item.kind, category: r.item.category,
      license: r.item.license, credit: r.item.credit,
      theme: r.item.theme, tags: r.item.tags,
      detail: r.detailHit, palette: r.palette,
      paths: r.item.paths, files: r.item.files,
      source: r.item.source,
    })),
  }, null, 2));
  process.exit(0);
}

if (!out.length) {
  console.log('无命中。试试：--list 查看全部条目，或换一个关键词（如「画法」「字幕」「转场」「夜曲」「仪表」「分镜表」）。');
  process.exit(0);
}

for (const r of out) {
  const it = r.item;
  console.log('='.repeat(78));
  console.log(`${it.name}  [${it.id}]`);
  console.log(`  分类 ${it.category}｜${it.kind}`);
  console.log(`  ${it.theme}`);
  console.log(`  授权 ${it.license}｜${it.credit}`);
  console.log(`  标签 ${(it.tags || []).join(' / ')}`);
  console.log(`  出处 ${it.source.repo}@${it.source.commit.slice(0, 7)} · ${it.source.path}`);

  if (r.itemHit && q && !r.detailHitCount && !r.palHitCount) {
    console.log('\n  （条目级命中：以下为该条全文）');
  }

  console.log('\n  ── 要点 ──');
  const shown = flags.full ? it.detail : r.detailHit;
  for (const [k, v] of Object.entries(shown || {})) {
    if (Array.isArray(v)) {
      console.log(`  ${k}：`);
      for (const x of v) console.log(`     · ${x}`);
    } else {
      console.log(`  ${k}：${v}`);
    }
  }

  if (r.palette.length) {
    console.log('\n  ── 配色 token ──');
    for (const p of r.palette) console.log(`  ${p.role.padEnd(14)} ${p.hex}  ${p.note}`);
  }

  if (flags.full) {
    if (P.layout === 'package') {
      console.log('\n  ── 库内路径 ──');
      console.log('    （发布包内不含本机路径；方法正文与配色 token 即为全部可用内容）');
    } else {
      console.log('\n  ── 库内路径（相对 02_素材）──');
      for (const [k, v] of Object.entries(it.paths || {})) console.log(`    ${k.padEnd(6)} ${v}`);
    }
    console.log('  ── 取用文件 ──');
    for (const f of it.files || []) console.log(`    ${f}`);
    if (it.源文件校验) {
      console.log(`  ── 源文件校验 ──`);
      console.log(`    字节 ${it.源文件校验.字节}  sha256(前16) ${it.源文件校验.sha256}`);
    }
  }
  console.log('');
}
console.log('※ 本库方法论与引擎代码为 MIT，可自由引用与再分发（请保留出处 HeyChengC/vibe-knowledge-film）。');
console.log('  「版权受限_仅本地对照」目录（仅本地库有）属他人短片，不得再分发，也不在开源包内。');
