// 剔除「版权保留」主图（可选开关）
//
// 发布前如果不想在仓库里保留明确标注版权保留的 atlas 主图，执行：
//   npm run strip:restricted
//
// 做什么：
//   1. 读 data/atlas-image-credits.json，挑出 redistributable === false 的条目
//   2. 删掉 assets/风格参考图/ 下对应的主图文件
//   3. 把这些条目在 风格库.json / 光影库.json 里的 refs 置空（条目文本、提示词、来源链接都保留）
//   4. 重新生成单文件图鉴
//
// 幂等：重复执行不会报错。只想先看清单不改动文件，加 --dry-run。
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import P from './paths.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = P.root;
const DRY = process.argv.includes('--dry-run');
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
const writeJson = (p, o) => fs.writeFileSync(p, JSON.stringify(o), 'utf8');

const creditsFile = path.join(P.data, 'atlas-image-credits.json');
if (!fs.existsSync(creditsFile)) {
  console.error('✗ 找不到 data/atlas-image-credits.json，无法判断哪些图受限');
  process.exit(1);
}
const credits = readJson(creditsFile);
const restricted = credits.images.filter((c) => c.redistributable === false);
if (!restricted.length) {
  console.log('✅ 没有需要剔除的「版权保留」主图');
  process.exit(0);
}

console.log(`待剔除 ${restricted.length} 张「版权保留」主图${DRY ? '（--dry-run，不改文件）' : ''}：\n`);
for (const c of restricted) console.log(`  ${c.file || '(无文件)'}  ← ${c.credit}`);

if (DRY) {
  console.log('\n--dry-run 结束，未改动任何文件。');
  process.exit(0);
}

// ---- 1. 删文件 ----
let removed = 0;
for (const c of restricted) {
  if (!c.file) continue;
  const f = path.join(P.assets, ...c.file.split('/'));
  if (fs.existsSync(f)) {
    fs.rmSync(f);
    removed++;
  }
}
console.log(`\n已删除 ${removed} 个主图文件`);

// ---- 2. 清 refs ----
const slugs = new Set(restricted.map((c) => c.slug));
let cleared = 0;
for (const name of ['风格库.json', '动效库.json', '光影库.json']) {
  const p = path.join(P.data, name);
  if (!fs.existsSync(p)) continue;
  const doc = readJson(p);
  for (const it of doc.items || []) {
    const slug = String(it.id || '').replace(/^atlas-(light-)?/, '');
    if (!slugs.has(slug)) continue;
    if (it.refs && it.refs.length) {
      it.refs = [];
      it.refsStripped = true;
      cleared++;
    }
  }
  writeJson(p, doc);
}
console.log(`已清空 ${cleared} 个条目的参考图引用（条目文本与提示词保留）`);

// ---- 3. 重新生成图鉴 ----
const gen = spawnSync(process.execPath, [path.join(HERE, '生成图鉴HTML.mjs')], {
  cwd: ROOT,
  stdio: 'inherit',
});
if (gen.status !== 0) {
  console.error('✗ 图鉴重新生成失败');
  process.exit(1);
}
console.log('\n✅ 完成。署名表 docs/图源署名.md 仍保留完整清单，便于回溯。');
