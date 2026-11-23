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
const PORT = Number(process.env.PORT || 5178);
const HOST = process.env.HOST || '127.0.0.1';

const LIBS = {
  styles: path.join(DATA, '风格库.json'),
  motions: path.join(DATA, '动效库.json'),
  lighting: path.join(DATA, '光影库.json'),
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
const notFound = (res) => {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404');
};

function serveFile(res, file, cacheSeconds = 3600) {
  let st;
  try {
    st = fs.statSync(file);
    if (!st.isFile()) return notFound(res);
  } catch {
    return notFound(res);
  }
  const ext = path.extname(file).toLowerCase();
  const etag = `"${st.size}-${Math.round(st.mtimeMs)}"`;
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Content-Length': st.size,
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
      [x.name, x.nameEn, x.id, x.category, x.description, x.meaning, x.prompt, (x.tags || []).join(' ')]
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
  if (p.startsWith('/atlas-img/')) return serveAsset(res, p.slice('/atlas-img/'.length));

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
});
