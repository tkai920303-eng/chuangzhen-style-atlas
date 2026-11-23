// 图鉴页面自动化验收：三个页签逐一切换，统计图片加载情况与破图
import { chromium } from 'playwright-core';

const URL = process.argv[2] || 'http://127.0.0.1:5178/atlas';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
const notFound = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('response', (r) => {
  if (r.status() === 404) notFound.push(decodeURIComponent(r.url()));
});
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 160));
});

await page.goto(URL, { waitUntil: 'load' });
await page.waitForTimeout(1500);

const tabs = [
  { label: '风格库', key: 'styles' },
  { label: '动效库', key: 'motions' },
  { label: '光影库', key: 'lighting' },
];

let bad = 0;
for (const t of tabs) {
  await page.getByRole('button', { name: new RegExp('^' + t.label) }).first().click();
  await page.waitForTimeout(1200);
  // 滚到底再回来，触发懒加载
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 1200) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);

  const r = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('.grid img, .thumb img, article img')];
    const broken = imgs.filter((i) => !i.complete || i.naturalWidth === 0);
    const anim = imgs.filter((i) => i.src.includes('.webp'));
    const missingAlt = imgs.filter((i) => !i.alt).length;
    return {
      total: imgs.length,
      broken: broken.length,
      brokenSrc: broken.slice(0, 5).map((i) => i.getAttribute('src')),
      anim: anim.length,
      missingAlt,
      cards: document.querySelectorAll('article').length,
      cnt: document.getElementById('cnt')?.textContent || '',
    };
  });
  const ok = r.broken === 0 && r.total > 0;
  if (!ok) bad++;
  console.log(
    `${ok ? '✅' : '❌'} ${t.label}：卡片 ${r.cards} 张，图片 ${r.total} 张（其中动图 ${r.anim}），破图 ${r.broken} 张，计数 ${r.cnt}`
  );
  if (r.brokenSrc.length) console.log('   破图样例:', r.brokenSrc.join('  '));
}

// 抽屉里的循环动图：切到动效库后搜一个 motion-prompt 条目再点开
await page.getByRole('button', { name: /^动效库/ }).first().click();
await page.waitForTimeout(800);
const box = page.getByRole('searchbox').first();
await box.fill('pop-in');
await page.waitForTimeout(1200);
const drawer = await page.evaluate(async () => {
  const art = [...document.querySelectorAll('article')].find((a) => a.querySelector('img'));
  art?.click();
  await new Promise((r) => setTimeout(r, 1200));
  const mv = document.querySelector('.mov-preview img');
  const full = document.querySelector('.db img.full');
  return mv
    ? { src: mv.getAttribute('src'), w: mv.naturalWidth, h: mv.naturalHeight, poster: full?.getAttribute('src') || null }
    : { poster: full?.getAttribute('src') || null, none: true };
});
if (drawer.none) {
  console.log(`❌ 抽屉未出现循环动图（海报 ${drawer.poster || '无'}）`);
  bad++;
} else {
  console.log(`✅ 抽屉循环动图：${drawer.src}（${drawer.w}×${drawer.h}）｜海报 ${drawer.poster}`);
  if (!drawer.w) bad++;
}

console.log(errors.length ? `\n控制台报错 ${errors.length} 条：\n  ${errors.slice(0, 6).join('\n  ')}` : '\n控制台无报错');
if (notFound.length) {
  console.log(`\n404 请求 ${notFound.length} 条：`);
  [...new Set(notFound)].slice(0, 10).forEach((u) => console.log('  ' + u));
} else {
  console.log('无 404 请求');
}

// 历史例图：atlas 条目的 gallery[]，远程地址 + 署名
await page.getByRole('button', { name: /^风格库/ }).first().click();
await page.waitForTimeout(600);
const sbox = page.getByRole('searchbox').first();
await sbox.fill('bloom');
await page.waitForTimeout(1000);
const gal = await page.evaluate(async () => {
  const art = [...document.querySelectorAll('article')].find((a) => a.querySelector('img'));
  art?.click();
  await new Promise((r) => setTimeout(r, 2500));
  const imgs = [...document.querySelectorAll('.gal img')];
  const caps = [...document.querySelectorAll('.gal figcaption')].map((c) => c.textContent.trim());
  const credit = document.querySelector('.db .credit')?.textContent.trim() || null;
  return {
    total: imgs.length,
    loaded: imgs.filter((i) => i.complete && i.naturalWidth > 0).length,
    broken: imgs.filter((i) => !i.complete || i.naturalWidth === 0).length,
    srcs: imgs.slice(0, 2).map((i) => i.getAttribute('src')),
    caps: caps.slice(0, 2),
    credit,
  };
});
if (!gal.total) {
  console.log('❌ 历史例图区未渲染');
  bad++;
} else {
  const ok = gal.broken === 0;
  if (!ok) bad++;
  console.log(`${ok ? '✅' : '❌'} 历史例图：${gal.total} 张，加载成功 ${gal.loaded}，破图 ${gal.broken}`);
  console.log(`   样例地址 ${gal.srcs[0] || '(无)'}`);
  if (gal.caps[0]) console.log(`   署名 ${gal.caps[0]}`);
  if (gal.credit) console.log(`   主图权利声明 ${gal.credit.slice(0, 110)}`);
}
await browser.close();
console.log(bad === 0 ? '\n全部通过' : `\n${bad} 项未通过`);
process.exit(bad === 0 ? 0 : 1);
