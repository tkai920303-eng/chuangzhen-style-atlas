// 开源包冒烟测试：启动包内服务，跑接口 / 页面 / 图片 / 目录穿越四类断言
//
// 用法：
//   node 04_工具/验收开源包.mjs [包目录] [端口]
//   node tools/验收开源包.mjs            （在包内运行时，包目录自动取当前目录）
//
// 端口默认 5199，避开本地工作台常用的 5178。
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
// 在包内运行时 HERE=tools/，父目录就是包根；在本地运行时 HERE=04_工具/
const PKG = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(HERE, '..');
const PORT = Number(process.argv[3] || process.env.SMOKE_PORT || 5199);
const HOST = '127.0.0.1';

let fail = 0;
const check = (label, cond, extra = '') => {
  if (!cond) fail++;
  console.log(`  ${cond ? '✅' : '❌'} ${label}${extra ? '  ' + extra : ''}`);
};

// ---------- 启动服务 ----------
const serverFile = path.join(PKG, 'server', 'server.mjs');
if (!fs.existsSync(serverFile)) {
  console.error(`✗ 找不到 ${serverFile}`);
  process.exit(1);
}
console.log(`包目录 ${PKG}\n端口   ${PORT}\n`);
const child = spawn(process.execPath, ['server/server.mjs'], {
  cwd: PKG,
  env: { ...process.env, PORT: String(PORT), HOST },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverLog = '';
child.stdout.on('data', (d) => (serverLog += d.toString()));
child.stderr.on('data', (d) => (serverLog += d.toString()));

function req(pathname) {
  return new Promise((resolve) => {
    let r;
    try {
      r = http.request({ host: HOST, port: PORT, path: pathname, method: 'GET' }, (res) => {
        const chunks = [];
        res.on('data', (d) => chunks.push(d));
        res.on('end', () =>
          resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) })
        );
      });
    } catch (e) {
      return resolve({ status: 0, headers: {}, body: Buffer.from(String(e.message)) });
    }
    r.on('error', (e) => resolve({ status: 0, headers: {}, body: Buffer.from(String(e.message)) }));
    r.end();
  });
}

// ---------- 等待就绪 ----------
let up = false;
for (let i = 0; i < 40; i++) {
  const r = await req('/api/health');
  if (r.status === 200) { up = true; break; }
  await new Promise((r) => setTimeout(r, 250));
}
if (!up) {
  console.error('✗ 服务未就绪\n' + serverLog);
  child.kill();
  process.exit(1);
}

// ---------- 断言 ----------
console.log('=== 1. 页面 ===');
const home = await req('/');
check('首页 200', home.status === 200, `${home.body.length} 字节`);
check('首页含标题', home.body.toString('utf8').includes('素材风格图鉴'));
const atlas = await req('/atlas');
check('图鉴 200', atlas.status === 200, `${(atlas.body.length / 1048576).toFixed(2)} MB`);
const atlasHtml = atlas.body.toString('utf8');
check('图鉴内联三库', atlasHtml.includes('"styles"') && atlasHtml.includes('"motions"') && atlasHtml.includes('"lighting"'));
check('图鉴零外部脚本', !/<script[^>]+src=/.test(atlasHtml));

console.log('\n=== 2. 接口 ===');
const health = await req('/api/health');
check('健康检查 ok', health.status === 200 && JSON.parse(health.body).ok === true);
const api = await req('/api/atlas');
const apiJson = JSON.parse(api.body);
check('库概要三库齐全', api.status === 200 && ['styles', 'motions', 'lighting'].every((k) => apiJson.libs[k]));
check('库概要含 Vibe 画法库', api.status === 200 && !!apiJson.libs.vibe);
console.log(
  '  条目数：' +
    ['styles', 'motions', 'lighting', 'vibe'].map((k) => `${k}=${apiJson.libs[k]?.counts?.total ?? apiJson.libs[k]?.counts?.items ?? '?'}`).join('  ')
);
const all = await req('/api/atlas/styles');
const allJson = JSON.parse(all.body);
check('风格库全量 552', all.status === 200 && allJson.total === 552, `total=${allJson.total}`);
// 搜索用首条条目的真实名字派生，保证测的是「过滤真的生效」而不是硬编码词
const firstName = allJson.items?.[0]?.name || '';
const term = firstName.slice(0, Math.min(4, firstName.length));
const q = await req('/api/atlas/styles?q=' + encodeURIComponent(term));
const qJson = JSON.parse(q.body);
check(`搜索命中「${term}」`, q.status === 200 && qJson.total > 0, `total=${qJson.total}`);
const qMiss = await req('/api/atlas/styles?q=' + encodeURIComponent('zzz-不存在-xyz'));
check('无匹配词返回 0', qMiss.status === 200 && JSON.parse(qMiss.body).total === 0);
const qMotion = await req('/api/atlas/motions?q=' + encodeURIComponent('pop-in'));
check('动效库可搜索', qMotion.status === 200 && JSON.parse(qMotion.body).total > 0, `total=${JSON.parse(qMotion.body).total}`);
const unknown = await req('/api/atlas/nope');
check('未知库名 404', unknown.status === 404);
const vibeAll = await req('/api/atlas/vibe');
const vibeJson = JSON.parse(vibeAll.body);
check('Vibe 画法库可取', vibeAll.status === 200 && vibeJson.total > 0, `total=${vibeJson.total}`);
const vibeQ = await req('/api/atlas/vibe?q=' + encodeURIComponent('转场'));
check('Vibe 画法库可搜索', vibeQ.status === 200 && JSON.parse(vibeQ.body).total > 0, `total=${JSON.parse(vibeQ.body).total}`);

console.log('\n=== 3. 参考图 ===');
// 注意：上游 vibe 的样片图未获再分发授权，不随包分发，因此这里没有「知识短片参考图」
const imgDirs = ['风格参考图', '动效预览图', '动效参考图', '光影参考图'];
for (const d of imgDirs) {
  const dir = path.join(PKG, 'assets', d);
  const f = fs.readdirSync(dir).find((x) => /\.(webp|png|jpg)$/i.test(x));
  const r = await req('/atlas-img/' + encodeURIComponent(d) + '/' + encodeURIComponent(f));
  check(`${d}/${f}`, r.status === 200 && r.body.length > 100, `${r.status} ${r.body.length} 字节 ${r.headers['content-type'] || ''}`);
}

console.log('\n=== 4. 目录穿越必须被拒 ===');
// 中文段要百分号编码（Node 客户端不接受裸中文路径），穿越结构保持原样
const enc = encodeURIComponent('风格库.json');
const encDir = encodeURIComponent('风格参考图');
const attacks = [
  '/atlas-img/../data/' + enc,
  '/atlas-img/a/b/c',
  '/atlas-img/%2e%2e%2fserver.mjs',
  '/atlas-img/..%2fdata%2f' + enc,
  '/atlas-img/' + encDir + '/../../data/' + enc,
  '/atlas-img/' + encDir + '/%2e%2e/%2e%2e/data/' + enc,
];
for (const a of attacks) {
  const r = await req(a);
  check(`拒 ${a}`, r.status === 404, `响应码 ${r.status}`);
}

console.log('\n=== 5. 第三方素材零残留 ===');
// 导出时按 tools/库源/第三方素材.json 剔除了第三方素材，
// 并把被剔除文件的 SHA-256 写进 data/third-party-exclusion.json。
// 这里对整包重算哈希做独立复核：不依赖导出脚本自己的判断。
const excludeFile = path.join(PKG, 'data', 'third-party-exclusion.json');
const SKIP_DIRS = new Set(['node_modules', '.git', '.cache', '我的作品']);
if (fs.existsSync(excludeFile)) {
  const ex = JSON.parse(fs.readFileSync(excludeFile, 'utf8'));
  const banned = new Set(ex.excludedHashes || []);
  check('剔除清单已随包分发', banned.size > 0, `${banned.size} 个哈希 / ${ex.entries?.length || 0} 个条目`);
  check('剔除记录文档存在', fs.existsSync(path.join(PKG, 'docs', '第三方素材剔除记录.md')));
  const hits = [];
  let n = 0;
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (SKIP_DIRS.has(e.name)) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        walk(p);
        continue;
      }
      n++;
      const h = crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
      if (banned.has(h)) hits.push(path.relative(PKG, p));
    }
  })(PKG);
  check(
    '包内无第三方素材字节',
    hits.length === 0,
    `扫描 ${n} 个文件，命中 ${hits.length}${hits.length ? '：' + hits.slice(0, 3).join(' ') : ''}`
  );
} else {
  check('data/third-party-exclusion.json 存在', false, '缺少剔除清单，无法复核第三方素材');
}

console.log('\n=== 6. 我的作品（用户自扫索引）===');
// 「我的作品/」是用户扫描自己目录的产物，在 .gitignore 里、不是包内容。
// 克隆者没扫过时接口应优雅降级，而不是报错。
const myPage = await req('/myworks');
check('我的作品页面可访问', myPage.status === 200 && myPage.body.length > 500, `${myPage.status} ${myPage.body.length} 字节`);
const myWorks = await req('/api/myworks');
let myJson = null;
try { myJson = JSON.parse(myWorks.body); } catch {}
check('我的作品接口返回 ok', myWorks.status === 200 && myJson && myJson.ok === true, `响应码 ${myWorks.status}`);
check(
  '未扫描时优雅降级（有 scanned 标记）',
  myJson && typeof myJson.scanned === 'boolean',
  myJson ? `scanned=${myJson.scanned}` : '无 JSON'
);
const myAssets = await req('/api/myassets');
let myA = null;
try { myA = JSON.parse(myAssets.body); } catch {}
check('我的素材接口返回数组', myAssets.status === 200 && myA && Array.isArray(myA.items), `响应码 ${myAssets.status}`);

// 媒体直出必须按 id 取，不接受裸路径
const mediaAttacks = [
  '/media/..%2f..%2fpackage.json',
  '/media/notexist',
  '/media/%2e%2e%2f%2e%2e%2fdata%2f' + encodeURIComponent('风格库.json'),
];
for (const a of mediaAttacks) {
  const r = await req(a);
  check(`拒 ${a}`, r.status === 404, `响应码 ${r.status}`);
}
if (myJson && myJson.scanned) {
  const list = JSON.parse((await req('/api/myassets?limit=1')).body);
  if (list.items && list.items.length) {
    const id = list.items[0].id;
    const r = await req('/media/' + encodeURIComponent(id));
    check(`媒体按 id 直出 ${id}`, r.status === 200 && r.body.length > 0, `${r.status} ${r.body.length} 字节`);
  }
} else {
  console.log('  ℹ 未扫描（公开仓库的常态），跳过媒体直出正向用例');
}

child.kill();
console.log(`\n${fail === 0 ? '✅ 冒烟测试全部通过' : `❌ ${fail} 项未通过`}`);
if (fail) console.log('\n服务输出：\n' + serverLog.slice(-2000));
process.exit(fail === 0 ? 0 : 1);
