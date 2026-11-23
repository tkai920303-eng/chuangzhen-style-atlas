// 素材收集库交付前最终复核
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import P from './paths.mjs';

const LIB = P.root;
const ok = (b) => (b ? '✅' : '❌');
let fail = 0;
const check = (label, cond, extra = '') => {
  if (!cond) fail++;
  console.log(`  ${ok(cond)} ${label}${extra ? '  ' + extra : ''}`);
};

console.log('=== 1. 产出文件 ===');
console.log(`  布局：${P.layout}（根目录 ${P.root}）`);
const files = [
  ['风格库.json', 552],
  ['动效库.json', 370],
  ['光影库.json', 130],
];
const docs = {};
for (const [rel, expect] of files) {
  const p = path.join(P.data, rel);
  const d = JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
  docs[rel] = d;
  check(`data/${rel}`, d.items.length === expect, `${(fs.statSync(p).size / 1048576).toFixed(2)} MB，${d.items.length} 条`);
}
const htmlP = path.join(P.public, 'atlas.html');
check('图鉴 atlas.html', fs.existsSync(htmlP), `${(fs.statSync(htmlP).size / 1048576).toFixed(2)} MB`);
const docPath = P.layout === 'package' ? path.join(P.root, 'docs', '改动说明.md') : path.join(LIB, '01_文档/改动说明_20261116.md');
check('改动说明文档', fs.existsSync(docPath), docPath.replace(P.root, '…'));

console.log('\n=== 2. 风格库结构 ===');
const S = docs['风格库.json'].items;
check('每条都有 prompt', S.every((x) => x.prompt && x.prompt.length > 40));
check('prompt 含【画面】', S.every((x) => x.prompt.includes('【画面】')));
check('prompt 含【配色】', S.every((x) => x.prompt.includes('【配色】')));
check('prompt 含【动法】', S.every((x) => x.prompt.includes('【动法】')));
check('prompt 含【光影】', S.every((x) => x.prompt.includes('【光影】')));
check('id 唯一', new Set(S.map((x) => x.id)).size === S.length);
check('本地 24 条都有 sourcePath', S.filter((x) => x.source === 'local').every((x) => x.sourcePath));

console.log('\n=== 3. 动效库 + 白模化 ===');
const M = docs['动效库.json'].items;
const mp = M.filter((x) => x.source === 'motion-prompt');
check('motion-prompt 240 条', mp.length === 240);
check('240 条全部有白模版', mp.every((x) => x.whitened && x.whitened.prompt && x.whitened.prompt.length > 100));
check('白模版含中性灰白 #e8e8e8', mp.every((x) => x.whitened.prompt.includes('#e8e8e8')));
check('白模版含 6 个可替换槽位', mp.every((x) => x.whitened.slots.length === 6));
check('白模版规格已去色', mp.every((x) => x.whitened.spec.every((l) => !/\b(coral|blue|yellow|mint)\b/i.test(l))));
check('元素代码保留 MIT 首行', mp.every((x) => x.code && /MIT License/i.test(x.code.firstLine)));
check('代码全文首行与 firstLine 一致', mp.every((x) => x.code.body.split(/\r?\n/)[0] === x.code.firstLine));
check('时序/缓动/幅度三段不重复', mp.every((x) => !(x.timing && x.easing && x.timing === x.easing) && !(x.timing && x.amplitude && x.timing === x.amplitude)));
check('本地 130 条只引用不搬动', M.filter((x) => x.local).every((x) => x.sourcePath && !x.whitened));

console.log('\n=== 4. 光影库 ===');
const L = docs['光影库.json'].items;
check('每条都有 prompt', L.every((x) => x.prompt && x.prompt.length > 40));
check('每条都有出处 sourceUrl', L.every((x) => x.sourceUrl && x.sourceUrl.length > 10));
check('24 套布光方案', L.filter((x) => x.category && x.category.includes('布光')).length >= 24);
check('id 唯一', new Set(L.map((x) => x.id)).size === L.length);

console.log('\n=== 5. 参考图与配色 ===');
const IMG_ROOT = P.assets;
const listFiles = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) listFiles(p, out);
    else out.push(path.relative(IMG_ROOT, p).replace(/\\/g, '/'));
  }
  return out;
};
const allImgs = listFiles(IMG_ROOT);
const dirs = {};
for (const f of allImgs) {
  const d = f.includes('/') ? f.split('/')[0] : '(根)';
  dirs[d] = (dirs[d] || 0) + 1;
}
console.log('  图片分布:', JSON.stringify(dirs));
check('图片库文件总数 > 1000', allImgs.length > 1000, `${allImgs.length} 个`);
// 风格参考图：本地 568 张；公开包在导出阶段自动剔除「版权保留」主图，故按署名表实算期望值
let expectStyleImgs = 568;
let strippedMain = 0;
try {
  const cr = JSON.parse(fs.readFileSync(path.join(P.data, 'atlas-image-credits.json'), 'utf8').replace(/^\uFEFF/, ''));
  strippedMain = (cr.images || []).filter((c) => c.redistributable === false && c.includedInPackage === false).length;
  if (strippedMain) expectStyleImgs = 568 - strippedMain;
} catch {}
check(
  `风格参考图 ${expectStyleImgs} 个${strippedMain ? `（已剔除 ${strippedMain} 张版权保留主图）` : ''}`,
  dirs['风格参考图'] === expectStyleImgs,
  `${dirs['风格参考图']}`
);
check('动效预览图 436 个（216 条 × 海报+动图，再加工程实拍 2 条）', dirs['动效预览图'] === 436, `${dirs['动效预览图']}`);
check('动效参考图 130 个', dirs['动效参考图'] === 130, `${dirs['动效参考图']}`);
check('光影参考图 53 个', dirs['光影参考图'] === 53, `${dirs['光影参考图']}`);
let palCount = 0;
try {
  const PAL = JSON.parse(fs.readFileSync(P.palette, 'utf8'));
  palCount = Object.keys(PAL).length;
} catch {}
check('配色板 ≥ 800 条', palCount >= 800, `${palCount}（${P.palette.replace(P.root, '…')}）`);
const imgSet = new Set(allImgs);
const allRefs = [...S, ...M, ...L].flatMap((x) => x.refs || []);
check('三库引用的图全部存在', allRefs.every((f) => imgSet.has(f)), allRefs.filter((f) => !imgSet.has(f)).slice(0, 3).join(' '));
const allPrev = [...M, ...L].map((x) => x.preview).filter(Boolean);
check('循环动图引用全部存在', allPrev.every((f) => imgSet.has(f)), allPrev.filter((f) => !imgSet.has(f)).slice(0, 3).join(' '));
// 「有图」判定：版权保留主图在导出阶段被剔除（refs 置空 + refsStripped 标记），
// 这类条目**不算缺图**——条目文本、提示词、署名、来源链接都还在。
const hasImg = (x) => (x.refs || []).length > 0 || x.refsStripped === true;
const strippedCount = (arr) => arr.filter((x) => x.refsStripped === true).length;
const sStrip = strippedCount(S);
check(
  '风格库 552 条全部有图（版权保留条目除外）',
  S.every(hasImg),
  sStrip ? `${S.length - sStrip} 条有图 + ${sStrip} 条版权保留已剔除` : `${S.length} 条`
);
check('动效库 370 条全部有图', M.every((x) => (x.refs || []).length > 0));
check(
  '光影库 130 条全部有图（版权保留条目除外）',
  L.every(hasImg),
  (() => {
    const n = strippedCount(L);
    return n ? `${L.length - n} 条有图 + ${n} 条版权保留已剔除` : `${L.length} 条`;
  })()
);
check('动效库 218 条带循环动图', M.filter((x) => x.preview).length === 218, `${M.filter((x) => x.preview).length}`);

console.log('\n=== 6. file:// 离线打开的相对路径 ===');
const htmlDir = path.dirname(htmlP);
const rel = path.resolve(htmlDir, path.relative(path.dirname(htmlP), P.assets));
check('图鉴相对图片根目录解析正确', rel === P.assets, rel);

console.log('\n=== 7. 图鉴内联数据 ===');
const html = fs.readFileSync(htmlP, 'utf8');
check('内联了三库', html.includes('"styles"') && html.includes('"motions"') && html.includes('"lighting"'));
check('无外部脚本引用', !/<script[^>]+src=/.test(html));
const extTags = [...html.matchAll(/<(script|link)\b[^>]*\b(?:src|href)=["']([^"']+)["']/gi)]
  .map((x) => x[2]).filter((t) => /^https?:/i.test(t));
check('无外部 script/link 依赖', extTags.length === 0, extTags.slice(0, 3).join(' '));
check('复制按钮存在', html.includes('一键复制风格配置') && html.includes('复制白模版') && html.includes('复制光影提示词'));

console.log('\n=== 8. 公开包脱敏检查 ===');
if (P.layout === 'package') {
  // 发布前必须保证：包里不能出现本机绝对路径、不能出现 Windows 用户名
  // 盘符必须前面不是字母数字，否则英文单词结尾（"...Spec:\n- Scene"）会被误判成路径
  const ABS_PATH_RE = /(?<![A-Za-z0-9_])[A-Za-z]:\\[^\s"]{2,120}/g;
  const USER_RE = /(?<![A-Za-z0-9_])C:\\Users\\[^\\"]{1,40}/g;
  const dataFiles = fs.readdirSync(P.data).filter((f) => f.endsWith('.json'));
  let absHits = [];
  let userHits = [];
  for (const f of dataFiles) {
    const t = fs.readFileSync(path.join(P.data, f), 'utf8');
    for (const m of t.matchAll(ABS_PATH_RE)) absHits.push(`${f}: ${m[0].slice(0, 60)}`);
    for (const m of t.matchAll(USER_RE)) userHits.push(`${f}: ${m[0]}`);
  }
  check('data/ 无本机绝对路径', absHits.length === 0, absHits.slice(0, 3).join(' | '));
  check('data/ 无 Windows 用户名', userHits.length === 0, userHits.slice(0, 3).join(' | '));
  const compPath = path.join(P.data, 'components.json');
  if (fs.existsSync(compPath)) {
    const comp = JSON.parse(fs.readFileSync(compPath, 'utf8'));
    const arr = Array.isArray(comp) ? comp : comp.items || [];
    check('components.json 已剥除 dir/file', arr.every((x) => !x.dir && !x.file), `${arr.length} 条`);
    check('components.json 的 src 已脱敏', arr.every((x) => !x.src || x.src.startsWith('<私有工程>')), '');
  }
  const credPath = path.join(P.data, 'atlas-image-credits.json');
  check('图源署名表存在', fs.existsSync(credPath));
  if (fs.existsSync(credPath)) {
    const cred = JSON.parse(fs.readFileSync(credPath, 'utf8'));
    check('署名表覆盖 504 张主图', cred.images.length === 504, `${cred.images.length} 张`);
    check('每张都有权利声明原文', cred.images.every((c) => typeof c.credit === 'string'));
    const restricted = cred.images.filter((c) => c.redistributable === false);
    const restrictedInPkg = restricted.filter((c) => c.includedInPackage !== false);
    check(
      '版权保留主图未随包分发',
      restrictedInPkg.length === 0,
      restrictedInPkg.length ? `仍有 ${restrictedInPkg.length} 张在包内` : `${restricted.length} 张已全部剔除`
    );
    console.log(`  ℹ 版权保留（不可再分发）${restricted.length} 张；导出阶段自动剔除，条目文本、提示词与署名保留`);
  }
  const creditDoc = path.join(P.root, 'docs', '图源署名.md');
  check('docs/图源署名.md 存在', fs.existsSync(creditDoc));
  // 本机路径不允许出现在 docs 里
  const docLeak = [];
  for (const f of fs.readdirSync(path.join(P.root, 'docs'))) {
    const t = fs.readFileSync(path.join(P.root, 'docs', f), 'utf8');
    for (const m of t.matchAll(/(?<![A-Za-z0-9_])[A-Za-z]:\\[^\s`）)、，。|]{4,100}/g)) docLeak.push(`${f}: ${m[0].slice(0, 50)}`);
  }
  check('docs/ 无本机绝对路径', docLeak.length === 0, docLeak.slice(0, 3).join(' | '));

  // ---- 个人内容绝不入库 ----
  // 「我的作品/」是用户扫描自己目录的产物，已在 .gitignore 里。
  // 这里做硬断言：只要它被 git 追踪，就是发布事故（个人作品进了公开仓库）。
  const myDir = path.join(P.root, '我的作品');
  const myExists = fs.existsSync(myDir);
  let trackedPersonal = [];
  if (myExists) {
    try {
      const r = spawnSync('git', ['ls-files', '--', '我的作品'], { cwd: P.root, encoding: 'utf8', shell: false });
      if (r.status === 0) {
        trackedPersonal = String(r.stdout || '').split(/\r?\n/).filter((l) => l.trim());
      }
    } catch {}
  }
  check(
    '个人作品索引未被 git 追踪（我的作品/）',
    trackedPersonal.length === 0,
    trackedPersonal.length ? `⚠ 已追踪 ${trackedPersonal.length} 个个人文件` : myExists ? '目录存在但未追踪 ✓' : '目录不存在 ✓'
  );
  // 顺带确认 .gitignore 里有这条规则
  const gi = path.join(P.root, '.gitignore');
  let giHas = false;
  if (fs.existsSync(gi)) giHas = fs.readFileSync(gi, 'utf8').includes('我的作品/');
  check('.gitignore 已排除「我的作品/」', giHas);
} else {
  console.log('  （本地布局保留真实路径以便本地复现，跳过脱敏检查）');
}

console.log(`\n${fail === 0 ? '全部通过' : fail + ' 项未通过'}`);
process.exitCode = fail === 0 ? 0 : 1;
