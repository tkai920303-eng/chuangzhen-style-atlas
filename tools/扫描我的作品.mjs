// 扫描我的作品：把**你自己**的目录索引成一份可检索的作品索引
//
// 用法：
//   node tools/扫描我的作品.mjs <目录>
//   node tools/扫描我的作品.mjs <目录> --out 我的作品
//   node tools/扫描我的作品.mjs <目录> --dry        只统计，不落盘
//
// 产物（默认写到「当前工作目录」下的 我的作品/）：
//   index.json     每个文件一条记录（含绝对路径，用于本机预览）
//   works.json     作品清单（按扫描根下的一级子目录划分）
//   summary.json   统计汇总
//
// 设计约束（重要）：
//   1. **零第三方依赖**，Node ≥ 18 即可运行。
//   2. 产物目录默认在**仓库的 .gitignore 里**——你的作品是你自己的，
//      绝不能被提交进公开仓库。
//   3. 不移动、不删除、不修改被扫描目录里的任何文件（只读）。
//   4. ffprobe 可选：有就探测时长/分辨率，没有就只记文件元数据。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const argv = process.argv.slice(2);
const DRY = argv.includes('--dry');
const outArg = (() => {
  const i = argv.indexOf('--out');
  return i >= 0 ? argv[i + 1] : null;
})();
// 位置参数：跳过 --out 的取值与其余开关
const positional = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--out') { i++; continue; }
  if (argv[i].startsWith('--')) continue;
  positional.push(argv[i]);
}
const rootArg = positional[0];

if (!rootArg) {
  console.error('用法：node tools/扫描我的作品.mjs <目录> [--out 输出目录] [--dry]');
  process.exit(1);
}

const ROOT = path.resolve(rootArg);
const OUT_DIR = path.resolve(outArg || path.join(process.cwd(), '我的作品'));

if (!fs.existsSync(ROOT) || !fs.statSync(ROOT).isDirectory()) {
  console.error(`✗ 目录不存在：${ROOT}`);
  process.exit(1);
}

// ---------- 跳过清单：依赖目录与运行时目录 ----------
const SKIP_DIRS = new Set([
  'node_modules', '.git', '.cache', '.svn', '.hg', '.vscode', '.idea',
  '.venv', 'venv', '__pycache__', '.pytest_cache', '.mypy_cache',
  'dist', 'build', '.next', '.nuxt', '.output', '.turbo', '.parcel-cache',
  'coverage', '.nyc_output', '.astro', '.docusaurus',
  'tmp', 'temp', '.tmp', 'out', '.DS_Store', '__MACOSX',
  '.mh', // MotionHarness 运行时目录：会话状态会随 daemon 重启消失
]);
const MAX_DEPTH = 24;

// ---------- 分类 ----------
const CAT_OF = new Map();
for (const e of ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff', 'tif', 'svg', 'avif', 'ico', 'heic'])
  CAT_OF.set(e, 'image');
for (const e of ['mp4', 'mov', 'mkv', 'avi', 'webm', 'flv', 'wmv', 'm4v', 'mpg', 'mpeg', 'prores'])
  CAT_OF.set(e, 'video');
for (const e of ['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg', 'opus', 'wma', 'aiff'])
  CAT_OF.set(e, 'audio');
for (const e of ['md', 'txt', 'doc', 'docx', 'pdf', 'rtf', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'json', 'yaml', 'yml', 'xml', 'html', 'htm'])
  CAT_OF.set(e, 'doc');
for (const e of ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs', 'py', 'rb', 'go', 'rs', 'java', 'c', 'h', 'cpp', 'hpp', 'cs', 'php', 'swift', 'kt', 'sh', 'ps1', 'bat', 'lua', 'vue', 'svelte'])
  CAT_OF.set(e, 'code');
for (const e of ['zip', '7z', 'rar', 'tar', 'gz', 'bz2', 'xz', 'tgz'])
  CAT_OF.set(e, 'archive');
for (const e of ['glb', 'gltf', 'fbx', 'obj', 'blend', 'stl', 'usd', 'usda', 'abc', 'ply'])
  CAT_OF.set(e, 'model3d');
for (const e of ['ttf', 'otf', 'woff', 'woff2', 'eot'])
  CAT_OF.set(e, 'font');

// ---------- ffprobe（可选） ----------
function findFfprobe() {
  if (process.env.FFPROBE_PATH && fs.existsSync(process.env.FFPROBE_PATH)) return process.env.FFPROBE_PATH;
  for (const c of ['ffprobe', 'ffprobe.exe']) {
    const r = spawnSync(process.platform === 'win32' ? 'where' : 'which', [c], { encoding: 'utf8', shell: process.platform === 'win32' });
    if (r.status === 0) {
      const first = String(r.stdout || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean)[0];
      if (first && fs.existsSync(first)) return first;
    }
  }
  return null;
}
const FFPROBE = findFfprobe();
const PROBE_EXT = new Set(['mp4', 'mov', 'mkv', 'avi', 'webm', 'mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg']);
const probeCache = new Map();
function probeMedia(file) {
  if (!FFPROBE || !PROBE_EXT.has(path.extname(file).slice(1).toLowerCase())) return null;
  if (probeCache.has(file)) return probeCache.get(file);
  let out = null;
  try {
    const r = spawnSync(FFPROBE, [
      '-v', 'quiet', '-print_format', 'json',
      '-show_format', '-show_streams', file,
    ], { encoding: 'utf8', windowsHide: true, timeout: 15000 });
    if (r.status === 0) {
      const j = JSON.parse(r.stdout || '{}');
      const v = (j.streams || []).find((s) => s.codec_type === 'video');
      const a = (j.streams || []).find((s) => s.codec_type === 'audio');
      out = {
        duration: j.format?.duration ? Math.round(Number(j.format.duration) * 10) / 10 : null,
        width: v?.width || null,
        height: v?.height || null,
        fps: v?.avg_frame_rate && v.avg_frame_rate !== '0/0'
          ? (() => { const [a1, b1] = String(v.avg_frame_rate).split('/').map(Number); return b1 ? Math.round((a1 / b1) * 100) / 100 : null; })()
          : null,
        codec: v?.codec_name || a?.codec_name || null,
        audio: !!a,
      };
    }
  } catch {}
  probeCache.set(file, out);
  return out;
}

// ---------- 作品划分：扫描根下的一级子目录 ----------
function listWorks(root) {
  const out = [];
  let entries = [];
  try { entries = fs.readdirSync(root, { withFileTypes: true }); } catch {}
  const dirs = entries.filter((e) => e.isDirectory() && !SKIP_DIRS.has(e.name));
  if (dirs.length) {
    for (const d of dirs) out.push({ id: d.name, name: d.name, path: path.join(root, d.name) });
  } else {
    out.push({ id: path.basename(root), name: path.basename(root), path: root });
  }
  return out;
}

// ---------- 主扫描 ----------
console.log('════ 扫描我的作品 ════');
console.log(`  扫描根：${ROOT}`);
console.log(`  输出到：${OUT_DIR}${DRY ? '（--dry，不落盘）' : ''}`);
console.log(`  ffprobe：${FFPROBE || '未找到（只记文件元数据，不探测时长/分辨率）'}`);

const works = listWorks(ROOT);
const workByPath = new Map();
for (const w of works) workByPath.set(path.resolve(w.path).toLowerCase(), w);

const assets = [];
const workStat = new Map(works.map((w) => [w.id, { id: w.id, name: w.name, path: w.path, files: 0, bytes: 0, byCat: {} }]));
let skippedDirs = 0;
let skippedFiles = 0;

function walk(dir, depth, work) {
  if (depth > MAX_DEPTH) return;
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) { skippedDirs++; continue; }
      // 扫描根下的一级子目录 = 作品；更深层归入当前作品
      const isTopLevel = depth === 0;
      const w = isTopLevel ? (workByPath.get(path.resolve(full).toLowerCase()) || work) : work;
      walk(full, depth + 1, w);
    } else if (e.isFile()) {
      const ext = path.extname(e.name).slice(1).toLowerCase();
      if (!ext && !e.name.includes('.')) { skippedFiles++; continue; }
      let st;
      try { st = fs.statSync(full); } catch { skippedFiles++; continue; }
      const rel = path.relative(ROOT, full).replace(/\\/g, '/');
      const cat = CAT_OF.get(ext) || 'other';
      const a = {
        id: crypto.createHash('sha1').update(rel).digest('hex').slice(0, 16),
        name: e.name,
        ext,
        size: st.size,
        mtimeMs: st.mtimeMs,
        cat,
        work: work?.id || null,
        rel,
        path: full, // 绝对路径仅存在于本机产物里，产物目录已被 .gitignore 排除
      };
      const media = probeMedia(full);
      if (media) a.media = media;
      assets.push(a);
      const ws = workStat.get(a.work);
      if (ws) {
        ws.files++;
        ws.bytes += a.size;
        ws.byCat[cat] = (ws.byCat[cat] || 0) + 1;
      }
    }
  }
}

const t0 = Date.now();
for (const w of works) {
  if (path.resolve(w.path).toLowerCase() === path.resolve(ROOT).toLowerCase()) {
    walk(w.path, 0, w);
  } else {
    walk(w.path, 1, w);
  }
}
const secs = ((Date.now() - t0) / 1000).toFixed(1);

// ---------- 统计 ----------
const byCat = {};
const byExt = {};
let bytes = 0;
for (const a of assets) {
  byCat[a.cat] = (byCat[a.cat] || 0) + 1;
  byExt[a.ext] = (byExt[a.ext] || 0) + 1;
  bytes += a.size;
}
const workList = [...workStat.values()].sort((x, y) => y.bytes - x.bytes);

console.log(`\n扫描完成（${secs}s）：`);
console.log(`  文件 ${assets.length} 个 / ${(bytes / 1048576).toFixed(2)} MB`);
console.log(`  作品 ${workList.length} 个`);
console.log(`  跳过目录 ${skippedDirs} 个 / 跳过文件 ${skippedFiles} 个`);
console.log('  分类：' + Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(' / '));
console.log('  作品前 8：');
for (const w of workList.slice(0, 8)) {
  console.log(`    ${w.name}  ${w.files} 个 / ${(w.bytes / 1048576).toFixed(1)} MB`);
}

if (DRY) {
  console.log('\n--dry 结束，未写入任何文件。');
  process.exit(0);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const generatedAt = new Date().toISOString();
fs.writeFileSync(
  path.join(OUT_DIR, 'index.json'),
  JSON.stringify({ generatedAt, root: ROOT, count: assets.length, assets }, null, 0),
  'utf8'
);
fs.writeFileSync(
  path.join(OUT_DIR, 'works.json'),
  JSON.stringify({ generatedAt, root: ROOT, works: workList }, null, 2),
  'utf8'
);
fs.writeFileSync(
  path.join(OUT_DIR, 'summary.json'),
  JSON.stringify({
    generatedAt,
    root: ROOT,
    totals: { files: assets.length, bytes, works: workList.length },
    byCategory: byCat,
    byExt,
  }, null, 2),
  'utf8'
);

console.log(`\n✅ 已写入：${OUT_DIR}`);
console.log('   index.json / works.json / summary.json');
console.log('   下一步：npm start 后打开 http://127.0.0.1:5178/myworks');
console.log('   ⚠ 这个目录在你的 .gitignore 里——你的作品不会被提交进仓库。');
