// 抓取外部数据源：atlas.letz.ai（504 条特效）+ motion-prompt（240 条动效）
// 通道：Node 直连 DNS 失败，本机 HTTP_PROXY=127.0.0.1:7897，故用 curl.exe 取数
// 产出：
//   04_工具\_抓取缓存\atlas-effects.json      504 条完整特效数据
//   04_工具\_抓取缓存\motion-catalog.json     240 条动效元数据
//   04_工具\_抓取缓存\motion-prompts\*.txt    可复制提示词
//   04_工具\_抓取缓存\motion-code\*.txt       元素代码（保留 MIT 首行）
//   04_工具\_抓取缓存\motion-kit\*.js         分包常量
//   02_素材\图片库\风格参考图\*.webp           504 张风格参考图
// 可重复运行：已存在的文件会跳过。

import { spawn } from 'node:child_process';
import P, { IMG_STYLE } from './paths.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 注意：new URL(import.meta.url).pathname 会把中文路径转成百分号编码，
// 导致目录名变成 %E5%88%9B... 这种字面量。必须用 fileURLToPath。
const LIB = P.root;
const CACHE = P.cache;
const IMG_DIR = path.join(P.assets, IMG_STYLE);
const ATLAS = 'https://atlas.letz.ai/api/public/atlas';
const MP = 'https://raw.githubusercontent.com/showheyohtaki/motion-prompt/main/api/v1';

for (const d of [CACHE, path.join(CACHE, 'motion-prompts'), path.join(CACHE, 'motion-code'), path.join(CACHE, 'motion-kit'), IMG_DIR]) {
  fs.mkdirSync(d, { recursive: true });
}

const CONCURRENCY = 8;
const RETRIES = 3;

function curlBuf(url, tries = RETRIES) {
  return new Promise((resolve, reject) => {
    const run = (n) => {
      const p = spawn('curl.exe', ['-s', '--compressed', '--max-time', '60', '-H', 'Accept: application/json', url], { windowsHide: true });
      const chunks = [];
      let err = '';
      p.stdout.on('data', (d) => chunks.push(d));
      p.stderr.on('data', (d) => (err += d.toString()));
      p.on('error', () => (n > 1 ? setTimeout(() => run(n - 1), 700) : reject(new Error(`spawn ${url}`))));
      p.on('close', (code) => {
        if (code === 0) return resolve(Buffer.concat(chunks));
        if (n > 1) return setTimeout(() => run(n - 1), 700);
        reject(new Error(`curl ${code} ${url} ${err.slice(0, 160)}`));
      });
    };
    run(tries);
  });
}

async function curlText(url) {
  return (await curlBuf(url)).toString('utf8');
}

async function pool(items, worker) {
  let idx = 0;
  let done = 0;
  const workers = Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (idx < items.length) {
      const i = idx++;
      try {
        await worker(items[i], i);
      } catch (e) {
        console.error(`  ✗ ${items[i]?.slug || items[i]?.id || items[i]}: ${e.message}`);
      }
      done++;
      if (done % 25 === 0 || done === items.length) console.log(`  … ${done}/${items.length}`);
    }
  });
  await Promise.all(workers);
}

// ---------- 1. atlas 目录 ----------
console.log('[1/6] atlas 目录');
let catalog = [];
for (let off = 0; ; off += 100) {
  const c = JSON.parse(await curlText(`${ATLAS}/catalog?offset=${off}&limit=100`));
  catalog = catalog.concat(c.effects);
  if (!c.next) break;
}
console.log(`  目录 ${catalog.length} 条`);

// ---------- 2. atlas 全量详情 ----------
console.log('[2/6] atlas 全量详情（每条含 LetzAI 提示词）');
const effFile = path.join(CACHE, 'atlas-effects.json');
let effects = [];
if (fs.existsSync(effFile)) {
  try { effects = JSON.parse(fs.readFileSync(effFile, 'utf8')); } catch {}
}
const doneSlugs = new Set(effects.map((e) => e.slug));
const todo = catalog.filter((c) => !doneSlugs.has(c.slug));
console.log(`  已有 ${doneSlugs.size}，待抓 ${todo.length}`);
const fresh = [];
await pool(todo, async (c) => {
  const d = JSON.parse(await curlText(`${ATLAS}/effects/${c.slug}`));
  fresh.push({ slug: c.slug, kind: c.kind, decade: c.decade, chapter: c.chapter, era: c.era, detail: d });
});
effects = effects.concat(fresh);
const bySlug = new Map();
for (const e of effects) bySlug.set(e.slug, e);
effects = catalog.map((c) => bySlug.get(c.slug)).filter(Boolean);
fs.writeFileSync(effFile, JSON.stringify(effects), 'utf8');
console.log(`  已写入 ${effects.length} 条 → ${effFile}`);

// ---------- 3. atlas 参考图 ----------
console.log('[3/6] atlas 参考图');
const imgTodo = effects.filter((e) => {
  const rel = e.detail?.effect?.image || '';
  const name = path.basename(rel);
  if (!name) return false;
  const dest = path.join(IMG_DIR, `风格图鉴_${e.slug}.webp`);
  return !fs.existsSync(dest);
});
console.log(`  待下载 ${imgTodo.length} 张`);
await pool(imgTodo, async (e) => {
  const rel = e.detail.effect.image;
  const buf = await curlBuf(`https://atlas.letz.ai${rel}`);
  if (buf.length < 1000) throw new Error(`图片过小 ${buf.length}B`);
  const dest = path.join(IMG_DIR, `风格图鉴_${e.slug}.webp`);
  fs.writeFileSync(dest, buf);
});

// ---------- 4. motion-prompt 元数据 + 提示词 + 代码 ----------
console.log('[4/6] motion-prompt 元数据 / 提示词 / 代码');
const mpCatalog = JSON.parse(await curlText(`${MP}/catalog.json`));
fs.writeFileSync(path.join(CACHE, 'motion-catalog.json'), JSON.stringify(mpCatalog), 'utf8');
console.log(`  元数据 ${mpCatalog.elements.length} 条，pack ${mpCatalog.packs.length} 个`);

const mpFiles = [];
for (const el of mpCatalog.elements) {
  mpFiles.push({ url: `${MP}/en/p/${el.id}.txt`, dest: path.join(CACHE, 'motion-prompts', `${el.id}.txt`) });
  mpFiles.push({ url: `${MP}/en/e/${el.id}.txt`, dest: path.join(CACHE, 'motion-code', `${el.id}.txt`) });
}
for (const pk of mpCatalog.packs) {
  mpFiles.push({ url: `${MP}/kit/${pk.pack}.js`, dest: path.join(CACHE, 'motion-kit', `${pk.pack}.js`) });
}
console.log(`  待下载 ${mpFiles.length} 个文件`);
await pool(mpFiles, async (f) => {
  if (fs.existsSync(f.dest) && fs.statSync(f.dest).size > 200) return;
  const buf = await curlBuf(f.url);
  if (buf.length < 100) throw new Error(`过短 ${buf.length}B`);
  fs.writeFileSync(f.dest, buf);
});

// ---------- 5. motion-prompt 渲染包（pack.js + 运行时）----------
// 预览图渲染器直接执行这些 Canvas 绘制函数，必须与库源同版本。
console.log('[5/6] motion-prompt 渲染包');
const PACK_BASE = 'https://raw.githubusercontent.com/showheyohtaki/motion-prompt/main';
const PACK_DIR = path.join(CACHE, 'motion-pack');
fs.mkdirSync(PACK_DIR, { recursive: true });
const packFiles = [
  { url: `${PACK_BASE}/assets/runtime.js`, dest: path.join(CACHE, 'mp_assets_runtime.js') },
  ...mpCatalog.packs.map((pk) => ({ url: `${PACK_BASE}/packs/${pk.pack}/pack.js`, dest: path.join(PACK_DIR, `${pk.pack}.js`) })),
];
await pool(packFiles, async (f) => {
  if (fs.existsSync(f.dest) && fs.statSync(f.dest).size > 200) return;
  const buf = await curlBuf(f.url);
  if (buf.length < 100) throw new Error(`过短 ${buf.length}B`);
  fs.writeFileSync(f.dest, buf);
});
console.log(`  渲染包 ${packFiles.length} 个（含 ${mpCatalog.packs.length} 个 pack）`);

// ---------- 6. 统计 ----------
console.log('[6/6] 统计');
const imgFiles = fs.readdirSync(IMG_DIR).filter((f) => f.endsWith('.webp'));
let imgBytes = 0;
for (const f of imgFiles) imgBytes += fs.statSync(path.join(IMG_DIR, f)).size;
console.log(`  参考图 ${imgFiles.length} 张 / ${(imgBytes / 1048576).toFixed(2)} MB`);
console.log(`  提示词 ${fs.readdirSync(path.join(CACHE, 'motion-prompts')).length} 份`);
console.log(`  元素代码 ${fs.readdirSync(path.join(CACHE, 'motion-code')).length} 份`);
console.log(`  kit ${fs.readdirSync(path.join(CACHE, 'motion-kit')).length} 份`);
console.log('完成。');
