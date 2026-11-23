// 素材库离线检索：不开服务也能查三库
//
// 用法：
//   node tools/检索.mjs <库> [关键词] [选项]
//
//   库：styles（风格库） | motions（动效库） | lighting（光影库） | all（全部三库）
//   关键词：匹配名称 / 英文名 / 分类 / 标签 / 提示词正文（不区分大小写）
//
//   选项：
//     --cat=分类名     按分类精确过滤（分类名从 --list-cats 拿）
//     --source=来源    按来源过滤：local / atlas / motion-prompt / web
//     --limit=N        最多输出 N 条（默认 20）
//     --json           输出 JSON（便于脚本消费）
//     --full           输出完整 prompt（默认只截断到 160 字）
//     --list-cats      列出该库的所有分类与条数，然后退出
//     --ids            只输出 id，便于批量取图
import fs from 'node:fs';
import path from 'node:path';
import P from './paths.mjs';

const argv = process.argv.slice(2);
const flag = (name) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
};
const has = (name) => argv.includes(`--${name}`);

const LIB_NAME = { styles: '风格库.json', motions: '动效库.json', lighting: '光影库.json' };
const LIB_LABEL = { styles: '风格库', motions: '动效库', lighting: '光影库' };

const libArg = (argv.find((a) => !a.startsWith('--')) || 'all').toLowerCase();
if (!['styles', 'motions', 'lighting', 'all'].includes(libArg)) {
  console.error(`未知库名：${libArg}（可用：styles / motions / lighting / all）`);
  process.exit(1);
}
const libs = libArg === 'all' ? Object.keys(LIB_NAME) : [libArg];
const keyword = (argv.filter((a) => !a.startsWith('--'))[1] || '').trim();
const cat = flag('cat');
const source = flag('source');
const limit = Number(flag('limit') || 20);
const asJson = has('json');
const full = has('full');
const idsOnly = has('ids');
const listCats = has('list-cats');

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));

for (const lib of libs) {
  const file = path.join(P.data, LIB_NAME[lib]);
  if (!fs.existsSync(file)) {
    console.error(`✗ 找不到 ${file}`);
    process.exit(1);
  }
  const doc = readJson(file);
  let items = doc.items || [];

  if (listCats) {
    const m = new Map();
    for (const it of items) {
      const c = it.category || it.packName || it.pack || '未分类';
      m.set(c, (m.get(c) || 0) + 1);
    }
    console.log(`\n【${LIB_LABEL[lib]}】共 ${items.length} 条，分类 ${m.size} 个：\n`);
    for (const [c, n] of [...m.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${String(n).padStart(4)}  ${c}`);
    }
    console.log('');
    continue;
  }

  if (cat) items = items.filter((x) => (x.category || x.packName || x.pack) === cat);
  if (source) items = items.filter((x) => x.source === source);
  if (keyword) {
    const q = keyword.toLowerCase();
    items = items.filter((x) =>
      [x.name, x.nameEn, x.id, x.category, x.packName, x.meaning, x.description, x.effect,
        x.prompt, (x.tags || []).join(' ')]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }

  const shown = items.slice(0, limit);

  if (asJson) {
    console.log(JSON.stringify({ lib, total: items.length, items: shown }, null, 2));
    continue;
  }
  if (idsOnly) {
    for (const it of shown) console.log(it.id);
    continue;
  }

  const title = `${LIB_LABEL[lib]}  命中 ${items.length} 条${items.length > shown.length ? `（显示前 ${shown.length}）` : ''}`;
  console.log(`\n=== ${title} ===\n`);
  for (const it of shown) {
    console.log(`  ${it.name}${it.nameEn ? `（${it.nameEn}）` : ''}  [${it.id}]`);
    console.log(`    分类 ${it.category || it.packName || '-'}   来源 ${it.source || '-'}${it.license ? `   授权 ${it.license}` : ''}`);
    if (it.imageLicense) console.log(`    主图授权 ${it.imageLicense}${it.imageRedistributable === false ? '（不可再分发）' : ''}`);
    if (it.refs?.length) console.log(`    参考图 ${it.refs.join(', ')}`);
    if (it.preview) console.log(`    循环动图 ${it.preview}`);
    if (it.sourceUrl) console.log(`    出处 ${it.sourceUrl}`);
    const p = full ? it.prompt : String(it.prompt || '').slice(0, 160).replace(/\n/g, ' ⏎ ');
    if (p) console.log(`    ${p}${full ? '' : (String(it.prompt || '').length > 160 ? ' …' : '')}`);
    console.log('');
  }
}
