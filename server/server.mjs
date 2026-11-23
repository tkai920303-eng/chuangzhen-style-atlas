// 素材风格图鉴 · 零依赖服务
//
// 只做一件事：把三个参考库与它们的参考图，以网页形式提供出来。
// 不引入任何第三方依赖，Node ≥ 18 即可运行。
//
//   node server/server.mjs            默认 127.0.0.1:5178
//   PORT=8080 node server/server.mjs
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const DATA = path.join(ROOT, 'data');
const ASSETS = path.join(ROOT, 'assets');
const PUBLIC = path.join(HERE, 'public');
// 「我的作品」：用户扫描自己目录后生成的索引。
// 整个目录在 .gitignore 里——用户的作品是他自己的，不进公开仓库。
const MY_WORKS = path.join(ROOT, '我的作品');
const PORT = Number(process.env.PORT || 5178);
const HOST = process.env.HOST || '127.0.0.1';

const LIBS = {
  styles: path.join(DATA, '风格库.json'),
  motions: path.join(DATA, '动效库.json'),
  lighting: path.join(DATA, '光影库.json'),
  vibe: path.join(DATA, 'Vibe画法库.json'),
};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

// ---- 库文件按 mtime 缓存，避免每次请求都重新解析几 MB 的 JSON ----
const cache = new Map();
function readLib(name) {
  const file = LIBS[name];
  if (!file) return null;
  try {
    const st = fs.statSync(file);
    const hit = cache.get(name);
    if (hit && hit.mtime === st.mtimeMs) return hit.data;
    const data = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
    cache.set(name, { mtime: st.mtimeMs, data });
    return data;
  } catch {
    return null;
  }
}

const json = (res, obj, code = 200) => {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' });
  res.end(body);
};

// ---------- 「我的作品」索引（按 mtime 缓存） ----------
let myCache = { mtime: 0, data: null };
function readMyIndex() {
  const file = path.join(MY_WORKS, 'index.json');
  try {
    const st = fs.statSync(file);
    if (myCache.mtime === st.mtimeMs) return myCache.data;
    const data = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
    data.byId = new Map((data.assets || []).map((a) => [a.id, a]));
    myCache = { mtime: st.mtimeMs, data };
    return data;
  } catch {
    myCache = { mtime: 0, data: null };
    return null;
  }
}
function readMyWorks() {
  try {
    return JSON.parse(fs.readFileSync(path.join(MY_WORKS, 'works.json'), 'utf8').replace(/^\uFEFF/, ''));
  } catch {
    return null;
  }
}
const notFound = (res) => {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404');
};

function serveFile(res, file, cacheSeconds = 3600, range = null) {
  let st;
  try {
    st = fs.statSync(file);
    if (!st.isFile()) return notFound(res);
  } catch {
    return notFound(res);
  }
  const ext = path.extname(file).toLowerCase();
  const etag = `"${st.size}-${Math.round(st.mtimeMs)}"`;
  const type = MIME[ext] || 'application/octet-stream';

  // Range 支持：视频 / 音频拖动进度条要用
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    if (m) {
      let start = m[1] ? parseInt(m[1], 10) : 0;
      let end = m[2] ? parseInt(m[2], 10) : st.size - 1;
      if (!m[1] && m[2]) { start = Math.max(0, st.size - end); end = st.size - 1; }
      if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= st.size) {
        res.writeHead(416, { 'Content-Range': `bytes */${st.size}` });
        return res.end();
      }
      end = Math.min(end, st.size - 1);
      res.writeHead(206, {
        'Content-Type': type,
        'Content-Length': end - start + 1,
        'Content-Range': `bytes ${start}-${end}/${st.size}`,
        'Accept-Ranges': 'bytes',
      });
      return fs.createReadStream(file, { start, end }).pipe(res);
    }
  }

  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': st.size,
    'Accept-Ranges': 'bytes',
    'Cache-Control': `public, max-age=${cacheSeconds}`,
    ETag: etag,
  });
  fs.createReadStream(file).pipe(res);
}

// 参考图路由：只允许 assets/ 下最多一级子目录
function serveAsset(res, urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return notFound(res);
  }
  const segs = decoded.split('/').filter(Boolean);
  if (segs.length < 1 || segs.length > 2) return notFound(res);
  if (segs.some((s) => s === '.' || s === '..' || /[\\:]/.test(s))) return notFound(res);
  const full = path.join(ASSETS, ...segs);
  if (!full.startsWith(ASSETS + path.sep)) return notFound(res);
  serveFile(res, full);
}

// 库列表查询：?q= 全文过滤，?cat= 分类过滤
function filterLib(doc, q, cat) {
  let items = doc.items || [];
  if (cat) items = items.filter((x) => x.category === cat || x.pack === cat || x.packName === cat);
  if (q) {
    const needle = q.toLowerCase();
    items = items.filter((x) =>
      [x.name, x.nameEn, x.id, x.category, x.description, x.meaning, x.prompt, x.theme, x.kind,
        (x.tags || []).join(' '), x.detail ? JSON.stringify(x.detail) : '']
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(needle)
    );
  }
  return items;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const p = url.pathname;

  if (p === '/' || p === '/index.html') return serveFile(res, path.join(PUBLIC, 'index.html'), 0);
  if (p === '/atlas' || p === '/atlas.html') return serveFile(res, path.join(PUBLIC, 'atlas.html'), 0);
  if (p === '/myworks' || p === '/myworks.html') return serveFile(res, path.join(PUBLIC, 'myworks.html'), 0);
  if (p.startsWith('/atlas-img/')) return serveAsset(res, p.slice('/atlas-img/'.length));

  // 「我的作品」：媒体直出。按 id 查表，绝不接受裸路径；再校验文件仍在扫描根之下。
  if (p.startsWith('/media/')) {
    const id = decodeURIComponent(p.slice('/media/'.length));
    const idx = readMyIndex();
    if (!idx || !idx.byId) return notFound(res);
    const a = idx.byId.get(id);
    if (!a) return notFound(res);
    const root = path.resolve(idx.root || '');
    const full = path.resolve(a.path);
    if (!root || !(full === root || full.startsWith(root + path.sep))) return notFound(res);
    return serveFile(res, full, 0, req.headers.range || null);
  }

  if (p === '/api/myworks') {
    const idx = readMyIndex();
    if (!idx) {
      return json(res, {
        ok: true,
        scanned: false,
        hint: 'node tools/扫描我的作品.mjs <你的作品目录>',
        message: '还没有扫描过自己的作品。运行上面的命令后刷新本页。',
      });
    }
    const w = readMyWorks();
    const byCat = {};
    let bytes = 0;
    for (const a of idx.assets || []) {
      byCat[a.cat] = (byCat[a.cat] || 0) + 1;
      bytes += a.size || 0;
    }
    return json(res, {
      ok: true,
      scanned: true,
      generatedAt: idx.generatedAt,
      root: idx.root,
      count: (idx.assets || []).length,
      bytes,
      byCat,
      works: (w && w.works) || [],
    });
  }
  if (p === '/api/myassets') {
    const idx = readMyIndex();
    if (!idx) return json(res, { ok: true, scanned: false, total: 0, items: [] });
    const q = (url.searchParams.get('q') || '').trim().toLowerCase();
    const work = url.searchParams.get('work') || '';
    const cat = url.searchParams.get('cat') || '';
    const limit = Math.min(Number(url.searchParams.get('limit') || 200), 2000);
    const offset = Math.max(Number(url.searchParams.get('offset') || 0), 0);
    let items = idx.assets || [];
    if (work) items = items.filter((a) => a.work === work);
    if (cat) items = items.filter((a) => a.cat === cat);
    if (q) {
      items = items.filter((a) =>
        `${a.name} ${a.rel} ${a.work || ''}`.toLowerCase().includes(q)
      );
    }
    const total = items.length;
    return json(res, { ok: true, scanned: true, total, offset, limit, items: items.slice(offset, offset + limit) });
  }
  if (p === '/api/myasset') {
    const idx = readMyIndex();
    if (!idx || !idx.byId) return json(res, { ok: false, error: '未扫描' }, 404);
    const id = url.searchParams.get('id');
    const a = idx.byId.get(id);
    if (!a) return json(res, { ok: false, error: 'not found' }, 404);
    return json(res, { ok: true, asset: a });
  }

  if (p === '/api/atlas') {
    const out = {};
    for (const name of Object.keys(LIBS)) {
      const d = readLib(name);
      out[name] = d ? { name: d.name, counts: d.counts, categories: d.categories || [], generatedAt: d.generatedAt } : null;
    }
    return json(res, { ok: true, libs: out, page: '/atlas' });
  }
  if (p.startsWith('/api/atlas/')) {
    const name = p.slice('/api/atlas/'.length);
    const d = readLib(name);
    if (!d) return json(res, { ok: false, error: '未知库名' }, 404);
    const items = filterLib(d, url.searchParams.get('q') || '', url.searchParams.get('cat') || '');
    return json(res, { ok: true, name: d.name, total: items.length, items });
  }

  if (p === '/api/health') return json(res, { ok: true, node: process.version, libs: Object.keys(LIBS) });

  // 浏览器会自动请求 favicon；给个空响应，别在访问日志里留 404 噪声
  if (p === '/favicon.ico') {
    res.writeHead(204);
    return res.end();
  }

  return notFound(res);
});

server.listen(PORT, HOST, () => {
  console.log(`素材风格图鉴已启动：http://${HOST}:${PORT}`);
  console.log(`  图鉴页面  http://${HOST}:${PORT}/atlas`);
  console.log(`  接口      http://${HOST}:${PORT}/api/atlas`);
  const idx = readMyIndex();
  if (idx) console.log(`  我的作品  http://${HOST}:${PORT}/myworks  （${(idx.assets || []).length} 个素材）`);
  else console.log(`  我的作品  http://${HOST}:${PORT}/myworks  （尚未扫描：node tools/扫描我的作品.mjs <目录>）`);
});
