// 构建素材收集库的三个库：风格库 / 动效库 / 光影库
// 输入：
//   04_工具\_抓取缓存\atlas-effects.json     504 条 atlas 特效（含 LetzAI 提示词）
//   04_工具\_抓取缓存\motion-catalog.json    240 条 motion-prompt 元数据
//   04_工具\_抓取缓存\motion-prompts\*.txt   可复制提示词全文
//   04_工具\_抓取缓存\motion-code\*.txt      元素代码（首行 MIT 授权注释必须保留）
//   04_工具\_抓取缓存\配色板.json             从参考图实际提取的配色
//   04_工具\库源\本地风格.json                手写的本地已有风格
//   04_工具\_抓取缓存\光影库原始数据.json      全网光影资料（可选）
//   03_索引\components.json                   本地已有动效与组件
// 输出：
//   03_索引\风格库.json  03_索引\动效库.json  03_索引\光影库.json

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildLightingEntries } from './库源/光影库条目.mjs';
import { classifyCredit } from './授权分类.mjs';
import P, { IMG_STYLE, IMG_MOTION, IMG_LIGHT, rel } from './paths.mjs';

const LIB = P.root;
const CACHE = P.cache;
const IDX = P.data;
// 参考图根目录：refs 字段一律存「相对图片库根目录」的路径，用正斜杠
const IMG_ROOT = P.assets;
const IMG_DIR = path.join(IMG_ROOT, IMG_STYLE);
const STAMP = new Date().toISOString();

const readJson = (p, fallback = null) => {
  try { return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '')); } catch { return fallback; }
};
const readText = (p) => { try { return fs.readFileSync(p, 'utf8'); } catch { return ''; } };

const PAL = readJson(P.palette, {});
const LOCAL = readJson(path.join(P.tools, '库源', '本地风格.json'), { styles: [] });
const COMPONENTS = readJson(path.join(IDX, 'components.json'), []);

// ---------- 配色描述生成 ----------
function paletteOf(entry) {
  if (entry.paletteFixed?.length) {
    return { fixed: true, colors: entry.paletteFixed, desc: entry.paletteFixed.map((c) => `${c.name} ${c.hex}`).join('、') };
  }
  const file = entry.paletteFrom;
  const p = file ? PAL[file] : null;
  if (!p || !p.length) return { fixed: false, colors: [], desc: '参考图配色未提取到' };
  return { fixed: false, colors: p.map((c) => ({ name: '主色', hex: c.hex, ratio: c.ratio })), desc: p.map((c) => c.hex).join('、') };
}

// ---------- 提示词组装 ----------
function stylePrompt(e, pal) {
  const L = [];
  L.push(`【画面】${e.visual}`);
  L.push(`【配色】${pal.desc}${pal.fixed ? '（风格包固定色板）' : '（自参考图实际提取）'}`);
  L.push(`【动法】${e.motion}`);
  L.push(`【光影】${e.lighting}`);
  if (e.texture) L.push(`【质感】${e.texture}`);
  if (e.fonts) L.push(`【字体】${e.fonts}`);
  if (e.shotLanguage) L.push(`【镜头语言】${e.shotLanguage}`);
  L.push(`【适用】${e.use}`);
  L.push(`【限制】${e.limitations}`);
  if (e.mix) L.push(`【混搭边界】${e.mix}`);
  return L.join('\n');
}

// ================= 风格库 =================
const styles = [];

// ---- 1. 本地已有风格 ----
for (const e of LOCAL.styles) {
  const pal = paletteOf(e);
  styles.push({
    id: e.id,
    name: e.name,
    nameEn: e.nameEn,
    category: e.category,
    mechanism: e.mechanism,
    status: e.status || '本地已有（学习沉淀，尚未全部实现为风格包）',
    source: 'local',
    sourceUrl: null,
    sourcePath: e.sourcePath || null,
    sourcePath2: e.sourcePath2 || null,
    refs: (e.refs || []).map((f) => rel(IMG_STYLE, f)),
    visual: e.visual,
    palette: pal.colors,
    paletteDesc: pal.desc,
    motion: e.motion,
    lighting: e.lighting,
    texture: e.texture || null,
    use: e.use,
    migration: e.migration || null,
    limitations: e.limitations,
    mix: e.mix || null,
    prompt: stylePrompt(e, pal),
  });
}

// ---- 2. atlas.letz.ai 504 条 ----
const ATLAS_CHAPTER_ZH = {
  1: '边缘与特征', 2: '遮罩与控制', 3: '色彩与量化', 4: '印刷与抖动',
  5: '视频与故障', 6: '空间与光学', 7: '滤镜与运动', 8: 'AI 管线',
};
const ATLAS_DECADE_ZH = {
  '1820s': '1820 年代', '1830s': '1830 年代', '1840s': '1840 年代', '1850s': '1850 年代',
  '1860s': '1860 年代', '1870s': '1870 年代', '1880s': '1880 年代', '1890s': '1890 年代',
  '1900s': '1900 年代', '1910s': '1910 年代', '1920s': '1920 年代', '1930s': '1930 年代',
  '1940s': '1940 年代', '1950s': '1950 年代', '1960s': '1960 年代', '1970s': '1970 年代',
  '1980s': '1980 年代', '1990s': '1990 年代', '2000s': '2000 年代', '2010s': '2010 年代',
  '2020s': '2020 年代',
};
const atlasEffects = readJson(path.join(CACHE, 'atlas-effects.json'), []);
const ATLAS_ORIGIN = 'https://atlas.letz.ai';
for (const a of atlasEffects) {
  const eff = a.detail?.effect || {};
  const creditInfo = classifyCredit(eff.credit);
  const prompt = a.detail?.prompt || '';
  const body = Array.isArray(eff.body) ? eff.body : [];
  const identify = body.find((b) => /identify/i.test(b.label))?.text || '';
  const principle = body.find((b) => /principle/i.test(b.label))?.text || '';
  const example = body.find((b) => /example/i.test(b.label))?.text || '';
  const highlights = Array.isArray(eff.highlights) ? eff.highlights : [];
  const margin = Array.isArray(eff.margin) ? eff.margin : [];
  const imgFile = `风格图鉴_${a.slug}.webp`;
  const hasPng = fs.existsSync(path.join(IMG_DIR, `风格图鉴_${a.slug}.png`));
  const hasGif = fs.existsSync(path.join(IMG_DIR, `风格图鉴_${a.slug}.gif`));
  const ref = fs.existsSync(path.join(IMG_DIR, imgFile)) ? imgFile : hasPng ? `风格图鉴_${a.slug}.png` : hasGif ? `风格图鉴_${a.slug}.gif` : null;
  const pal = PAL[ref] ? { colors: PAL[ref].map((c) => ({ name: '主色', hex: c.hex, ratio: c.ratio })), desc: PAL[ref].map((c) => c.hex).join('、') } : { colors: [], desc: '参考图配色未提取到' };

  const category = a.kind === 'historical'
    ? (ATLAS_DECADE_ZH[a.decade] || '历史风格')
    : (ATLAS_CHAPTER_ZH[a.chapter] || '机器特效');

  const visual = [identify, principle].filter(Boolean).join(' ') || eff.caption || eff.short || a.slug;
  const motion = a.kind === 'digital'
    ? (chapterMotion(a.chapter) || '静帧或后期处理类效果，作用于已渲染画面，不改变主体运动。')
    : (eff.dating || '历史工艺手法，静态图像特征为主。');
  const lighting = a.kind === 'digital'
    ? (chapterLighting(a.chapter) || '不改变场景原有光照，作为画面后处理叠加。')
    : '依赖原始光照与拍摄条件，本身不引入光源。';

  const promptText = [
    `【画面】${visual}`,
    `【配色】${pal.desc}`,
    `【动法】${motion}`,
    `【光影】${lighting}`,
    `【参考图】${a.detail?.gallery?.[0]?.title || eff.caption || ''}`,
    prompt ? `【效果指令】${prompt}` : '',
    eff.credit ? `【素材出处】${eff.credit}` : '',
  ].filter(Boolean).join('\n');

  styles.push({
    id: `atlas-${a.slug}`,
    name: eff.title || a.slug,
    nameEn: eff.name || a.slug,
    category,
    mechanism: a.kind === 'historical' ? '历史视觉工艺' : '数字图像处理',
    era: a.era,
    source: 'atlas',
    sourceUrl: `https://atlas.letz.ai/effect/${a.slug}`,
    sourceName: 'Atlas of Visual Effects（atlas.letz.ai，公开只读 API）',
    refs: ref ? [rel(IMG_STYLE, ref)] : [],
    // 主参考图的权利声明：atlas 只在 effect.credit 里用自由文本交代，effect.image 本身没有 license 字段。
    // atlas 的 SKILL.md 要求「reused images 要带上 author / source / license」，所以这里结构化保留。
    credit: eff.credit || null,
    imageLicense: creditInfo.cls,
    imageRedistributable: creditInfo.redistributable,
    imageLicenseNote: creditInfo.note,
    gallery: (a.detail?.gallery || []).slice(0, 6).map((g) => ({
      src: g.src,
      // gallery 的 src 有两种：根相对路径（/images/gallery/xxx.webp）与绝对 URL。
      // 根相对路径必须拼回 atlas 站点才能用，否则在本地/发布包里会 404。
      url: typeof g.src === 'string' && g.src.startsWith('/') ? ATLAS_ORIGIN + g.src : g.src,
      page: g.page,
      title: g.title,
      artist: g.artist,
      license: g.license,
    })),
    visual,
    palette: pal.colors,
    paletteDesc: pal.desc,
    motion,
    lighting,
    texture: example || null,
    use: highlights.length ? `特点：${highlights.join('；')}` : (margin.length ? `术语：${margin.map((m) => m.term).join('、')}` : null),
    migration: eff.dating || null,
    limitations: eff.distinction || null,
    mix: null,
    letzaiPrompt: prompt,
    prompt: promptText,
  });
}

function chapterMotion(ch) {
  return {
    1: '边缘检测与特征提取类效果，不改变主体本身的运动，只改变轮廓的呈现方式。',
    2: '遮罩与控制类效果，通过控制区域与局部干预驱动画面变化。',
    3: '色彩与量化类效果，改变像素与颜色分布，作用于静帧质感。',
    4: '印刷与抖动类效果，用网点或阈值分布模拟印刷质感。',
    5: '视频与故障类效果，直接作用于时间轴，会产生位移、撕裂与时间错乱感。',
    6: '空间与光学类效果，通过折射、辉光、景深与体积光改变空间观感。',
    7: '滤镜与运动类效果，内建时间性运动：位移、模糊、缩放与节奏。',
    8: 'AI 管线类效果，输出前需经过风格化模型处理，整体运动需另行设计。',
  }[ch];
}
function chapterLighting(ch) {
  return {
    1: '不改变光照，仅改变轮廓与边缘的对比表现。',
    2: '不改变光照，局部遮罩可能造成局部明暗错觉。',
    3: '改变色彩分布，明暗关系会被重新映射。',
    4: '网点与阈值会把连续明暗压成硬边色块。',
    5: '故障与撕裂会打断原有光影的连续性。',
    6: '直接改造光影：折射、辉光、景深、体积光与光晕。',
    7: '辉光、模糊与光晕类滤镜会提升高光扩散感。',
    8: '模型风格化会重建明暗关系，需重新评估整体光照。',
  }[ch];
}

// ---- 3. motion-prompt 的 artstyle pack（24 条画风）----
const mpCat = readJson(path.join(CACHE, 'motion-catalog.json'), { elements: [], packs: [] });
const mpByPack = {};
for (const el of mpCat.elements) (mpByPack[el.pack] = mpByPack[el.pack] || []).push(el);
const packZh = {};
for (const p of mpCat.packs) packZh[p.pack] = { title: p.title?.['zh-Hans'] || p.title?.en || p.pack, cats: p.categories };

// 画风参考图：作者公开的 packs/artstyle/img/style-NN.webp（MIT）
const ART_MAP = readJson(path.join(CACHE, '画风图映射.json'), []);
const artById = new Map(ART_MAP.map((m) => [String(m.id), m]));
const artRefFor = (el) => {
  const m = artById.get(String(el.id));
  if (!m) return [];
  return fs.existsSync(path.join(IMG_ROOT, IMG_STYLE, m.file)) ? [rel(IMG_STYLE, m.file)] : [];
};

// 动效预览图：静态海报帧 + 循环动图（由 04_工具\预览渲染\渲染动效预览.mjs 生成）
const motionBase = (el) => `动效预览_${el.pack}_${el.slug}`;
// artstyle 包的 24 条在动效库里同样出现：用作者公开的画风卡当参考图（不重渲染动图）
const motionRefFor = (el) => {
  if (el.pack === 'artstyle') {
    const m = artById.get(String(el.id));
    if (m && fs.existsSync(path.join(IMG_ROOT, IMG_STYLE, m.file))) return [rel(IMG_STYLE, m.file)];
    return [];
  }
  const f = `${motionBase(el)}.png`;
  return fs.existsSync(path.join(IMG_ROOT, IMG_MOTION, f)) ? [rel(IMG_MOTION, f)] : [];
};
const motionPreviewFor = (el) => {
  const f = `${motionBase(el)}.webp`;
  return fs.existsSync(path.join(IMG_ROOT, IMG_MOTION, f)) ? rel(IMG_MOTION, f) : null;
};

for (const el of mpByPack.artstyle || []) {
  const pTxt = readText(path.join(CACHE, 'motion-prompts', `${el.id}.txt`));
  const nameZh = el.name?.['zh-Hans'] || el.name?.en;
  const cat = (packZh.artstyle?.cats || []).find((c) => c.slug === el.category);
  const palFile = null;
  styles.push({
    id: `mp-art-${el.id}`,
    name: nameZh,
    nameEn: el.name?.en || el.slug,
    category: cat ? (cat['zh-Hans'] || cat.en) : '画风',
    mechanism: 'AI 绘图画风名',
    source: 'motion-prompt',
    sourceUrl: `https://showheyohtaki.github.io/motion-prompt/#${el.id}`,
    sourceName: 'motion-prompt（showheyohtaki，MIT）',
    license: 'MIT',
    refs: artRefFor(el),
    visual: el.meaning?.['zh-Hans'] || el.meaning?.en || '',
    palette: [],
    paletteDesc: '该画风条目不含固定色板，配色由所选风格包提供',
    motion: '画风条目本身不含动效；动法请配合动效库条目使用。',
    lighting: '画风条目本身不含光位；光影请配合光影库条目使用。',
    texture: null,
    use: el.use?.en || '',
    migration: el.meaning?.['zh-Hans'] || '',
    limitations: '画风名称需配合具体题材描述使用，单独使用信息量不足。',
    mix: null,
    prompt: [
      `【画面】${el.meaning?.['zh-Hans'] || el.meaning?.en || ''}`,
      '【配色】由风格包提供（见风格库「低比特像素」「扁平动态」等）',
      '【动法】由动效库条目提供',
      '【光影】由光影库条目提供',
      `【可直接使用的原始问法】${el.ask?.['zh-Hans'] || el.ask?.en || ''}`,
    ].join('\n'),
    promptRaw: pTxt.trim(),
  });
}

// ================= 动效库 =================
const motions = [];

// ---- 本地已有动效与组件（引用原处，不搬运）----
for (const c of COMPONENTS) {
  if (c.type !== '动效' && c.type !== '组件源码') continue;
  // 优先用工程已渲染的真实预览（转制为动图）；否则用自产规格卡
  const realPng = `动效预览_${c.id}.png`;
  const realWebp = `动效预览_${c.id}.webp`;
  const hasReal = fs.existsSync(path.join(IMG_ROOT, IMG_MOTION, realPng));
  const cardFile = `动效规格卡_${c.id}_${String(c.name || c.id).replace(/[\\/:*?"<>|]/g, '')}.png`;
  const hasCard = fs.existsSync(path.join(IMG_ROOT, '动效参考图', cardFile));
  motions.push({
    id: c.id,
    name: c.name || c.id,
    nameEn: null,
    category: c.type === '动效' ? '本地已实现动效' : '本地组件源码',
    pack: 'local',
    packName: '本地工程',
    source: 'local',
    sourceUrl: null,
    sourcePath: c.src,
    sourceDir: c.dir || null,
    license: null,
    status: c.status || null,
    meaning: c.desc || '',
    description: c.desc || `工程内组件：${c.src}`,
    timing: null, easing: null, amplitude: null,
    spec: [],
    tags: c.tags || [],
    prompt: c.desc || `复用工程内已实现的动效组件「${c.name}」，直接引用原文件路径，不复制搬运。`,
    code: null,
    whitened: null,
    refs: hasReal
      ? [rel(IMG_MOTION, realPng)]
      : hasCard
        ? [rel('动效参考图', cardFile)]
        : [],
    preview: hasReal && fs.existsSync(path.join(IMG_ROOT, IMG_MOTION, realWebp)) ? rel(IMG_MOTION, realWebp) : null,
    refKind: hasReal ? '工程渲染预览' : hasCard ? '规格卡' : null,
    local: true,
  });
}

// ---- motion-prompt 240 条 ----
const COLOR_WORDS = /\b(coral|blue|yellow|mint|red|green|white|black|grey|gray|teal|cyan|purple|violet|orange|pink|brown|indigo|gold|golden|silver|magenta|lime|navy|beige|tan|cream|coral)\b/gi;
const SLOT_MAP = ['主体形状', '材质', '主色', '背景', '投影', '文字'];

function whitenSpec(lines) {
  return lines.map((l) => l.replace(COLOR_WORDS, '{颜色}'));
}
// 互斥分桶：每条规格只归入一类，避免时序/缓动/幅度三段出现同一批行
function bucketize(lines) {
  const timing = [], easing = [], amplitude = [];
  const used = new Set();
  for (const l of lines) {
    if (used.has(l)) continue;
    if (/(spring|ease|back|cubic|linear|overshoot|tween)/i.test(l)) { easing.push(l); used.add(l); continue; }
    if (/(\d+\s*px|scale|degree|rad|%|radius|width|height|diameter)/i.test(l)) { amplitude.push(l); used.add(l); continue; }
    if (/(\d+(\.\d+)?\s*s\b|cycle|per\s|start|exit)/i.test(l)) { timing.push(l); used.add(l); continue; }
  }
  for (const l of lines) {
    if (used.has(l)) continue;
    if (/(\d+(\.\d+)?\s*s\b)/i.test(l)) { timing.push(l); used.add(l); }
  }
  for (const l of lines) {
    if (used.has(l)) continue;
    if (timing.length < 4) { timing.push(l); used.add(l); }
  }
  return { timing: timing.slice(0, 4), easing: easing.slice(0, 4), amplitude: amplitude.slice(0, 4) };
}

for (const el of mpCat.elements) {
  const pTxt = readText(path.join(CACHE, 'motion-prompts', `${el.id}.txt`));
  const cTxt = readText(path.join(CACHE, 'motion-code', `${el.id}.txt`));
  const specEn = Array.isArray(el.spec?.en) ? el.spec.en : [];
  const specZh = Array.isArray(el.spec?.['zh-Hans']) ? el.spec['zh-Hans'] : [];
  const specLines = specZh.length ? specZh : specEn;
  const wSpec = whitenSpec(specLines);

  const bucket = bucketize(specLines);
  const timingLines = bucket.timing;
  const easingLines = bucket.easing;
  const amplitudeLines = bucket.amplitude;

  const code = cTxt ? { firstLine: cTxt.split(/\r?\n/)[0], body: cTxt } : null;

  const nameZh = el.name?.['zh-Hans'] || el.name?.en || el.slug;
  const cat = (packZh[el.pack]?.cats || []).find((c) => c.slug === el.category);

  const wPrompt = [
    `【白模版 · 去风格化】把「${nameZh}」的时序与节奏移植到一张中性占位画面上。`,
    '· 造型：中性灰白几何体（哑光 #e8e8e8），无贴图、无光泽、无反射、无金属感，无任何风格化笔触；轮廓用 1px 浅灰描边（#b4b4b4）保持可读性。',
    '· 阴影：单层柔和接触阴影（不透明度约 0.12），仅用于指示物体与地面的关系，不参与造型塑造。',
    '· 背景：纯白或单一浅灰平涂，不加渐变、不加纹理、不加氛围粒子。',
    '· 唯一继承项是运动学（时序、缓动、幅度），外观全部替换为中性材质。',
    timingLines.length ? `· 时序：${timingLines.join(' ')}` : '',
    easingLines.length ? `· 缓动：${easingLines.join(' ')}` : '',
    amplitudeLines.length ? `· 幅度：${amplitudeLines.join(' ')}` : '',
    `· 可替换槽位：${SLOT_MAP.map((s) => `{${s}}`).join(' / ')} —— 先在此白模版上验证节奏，确认后再套具体风格的配色、材质与质感。`,
  ].filter(Boolean).join('\n');

  motions.push({
    id: `mp-${el.id}`,
    name: nameZh,
    nameEn: el.name?.en || el.slug,
    slug: el.slug,
    category: cat ? (cat['zh-Hans'] || cat.en) : el.category,
    pack: el.pack,
    packName: packZh[el.pack]?.title || el.pack,
    source: 'motion-prompt',
    sourceUrl: `https://showheyohtaki.github.io/motion-prompt/#${el.id}`,
    sourceName: 'motion-prompt（showheyohtaki，MIT 许可）',
    license: 'MIT',
    status: null,
    meaning: el.meaning?.['zh-Hans'] || el.meaning?.en || '',
    description: el.summary?.en || el.summary?.['zh-Hans'] || '',
    ask: el.ask?.['zh-Hans'] || el.ask?.en || '',
    timing: timingLines.join(' '),
    easing: easingLines.join(' '),
    amplitude: amplitudeLines.join(' '),
    spec: specLines,
    specWhiten: wSpec,
    canvas: { width: el.width, height: el.height, cycle: el.cycle, scalable: el.pack === 'ui' || el.pack === 'lp' || el.pack === 'lp2' || el.pack === 'photo' || el.pack === 'artstyle' || el.pack === 'diagram' },
    tags: el.tags || [],
    prompt: [
      `【动效】${el.meaning?.['zh-Hans'] || el.meaning?.en || ''}`,
      `【说明】${el.summary?.en || el.summary?.['zh-Hans'] || ''}`,
      `【问法】${el.ask?.['zh-Hans'] || el.ask?.en || ''}`,
      timingLines.length ? `【时序】${timingLines.join(' ')}` : '',
      easingLines.length ? `【缓动】${easingLines.join(' ')}` : '',
      amplitudeLines.length ? `【幅度】${amplitudeLines.join(' ')}` : '',
      `【画布】${el.width}×${el.height}，循环 ${el.cycle}s`,
    ].filter(Boolean).join('\n'),
    promptRaw: pTxt.trim(),
    code,
    whitened: {
      label: '白模版',
      rules: '保留时序、缓动与幅度；材质改为中性灰白哑光；颜色、背景、阴影与文字全部替换为槽位。',
      slots: SLOT_MAP,
      spec: wSpec,
      prompt: wPrompt,
    },
    refs: motionRefFor(el),
    preview: motionPreviewFor(el),
    local: false,
  });
}

// ================= 光影库 =================
const lighting = [];

// ---- 1. motion-prompt photo pack 的 lighting 分类 ----
for (const el of mpByPack.photo || []) {
  if (el.category !== 'lighting') continue;
  const pTxt = readText(path.join(CACHE, 'motion-prompts', `${el.id}.txt`));
  lighting.push({
    id: `mp-photo-${el.id}`,
    name: el.name?.['zh-Hans'] || el.name?.en,
    nameEn: el.name?.en || el.slug,
    category: '摄影布光',
    direction: (el.meaning?.['zh-Hans'] || el.meaning?.en || ''),
    hardness: null,
    ratio: null,
    colorTemp: null,
    effect: el.summary?.en || el.summary?.['zh-Hans'] || '',
    useCases: el.use?.en ? [el.use.en] : [],
    mistakes: [],
    prompt: [
      `【光影】${el.meaning?.['zh-Hans'] || el.meaning?.en || ''}`,
      `【说明】${el.summary?.en || el.summary?.['zh-Hans'] || ''}`,
      `【问法】${el.ask?.['zh-Hans'] || el.ask?.en || ''}`,
      `【配色】由风格包提供`,
    ].join('\n'),
    promptRaw: pTxt.trim(),
    source: 'motion-prompt',
    sourceUrl: `https://showheyohtaki.github.io/motion-prompt/#${el.id}`,
    sourceName: 'motion-prompt（showheyohtaki，MIT 许可）',
    license: 'MIT',
    refs: motionRefFor(el),
    preview: motionPreviewFor(el),
  });
}

// ---- 2. atlas 中的光影相关条目 ----
const LIGHT_KEYS = /(light|lit|glow|ray|rays|shadow|bloom|flare|haze|beam|sun|moon|neon|caustic|dark|shine|specular|reflect|halo|dappl|shade|backlit|rim)/i;
for (const a of atlasEffects) {
  const eff = a.detail?.effect || {};
  const hay = `${a.slug} ${eff.title || ''} ${eff.short || ''} ${eff.category || ''}`;
  const isChapter = a.chapter === 6;
  if (!isChapter && !LIGHT_KEYS.test(hay)) continue;
  const pal = PAL[`风格图鉴_${a.slug}.webp`] || [];
  lighting.push({
    id: `atlas-light-${a.slug}`,
    name: eff.title || a.slug,
    nameEn: eff.name || a.slug,
    category: a.chapter === 6 ? '空间与光学' : '光影效果',
    direction: null,
    hardness: null,
    ratio: null,
    colorTemp: null,
    effect: a.detail?.prompt || eff.caption || '',
    useCases: [],
    mistakes: [],
    prompt: [
      `【光影】${a.detail?.prompt || ''}`,
      `【原理】${(a.detail?.effect?.body || []).map((b) => b.text).join(' ')}`,
      pal.length ? `【配色】${pal.map((c) => c.hex).join('、')}` : '',
    ].filter(Boolean).join('\n'),
    promptRaw: a.detail?.prompt || '',
    source: 'atlas',
    sourceUrl: `https://atlas.letz.ai/effect/${a.slug}`,
    sourceName: 'Atlas of Visual Effects（atlas.letz.ai，公开只读 API）',
    license: null,
    // 与风格库同一套：主参考图的权利声明只存在于 effect.credit 自由文本里
    credit: eff.credit || null,
    imageLicense: classifyCredit(eff.credit).cls,
    imageRedistributable: classifyCredit(eff.credit).redistributable,
    imageLicenseNote: classifyCredit(eff.credit).note,
    refs: fs.existsSync(path.join(IMG_DIR, `风格图鉴_${a.slug}.webp`)) ? [rel(IMG_STYLE, `风格图鉴_${a.slug}.webp`)] : [],
  });
}

// ---- 3. 全网光影资料（子代理产出）----
const rawLight = readJson(path.join(CACHE, '光影库原始数据.json'), null);
if (rawLight) {
  // 自产布光示意图：按条目 id 对应文件名
  const LIGHT_SCHEMAS = readJson(path.join(CACHE, '光影示意图规格.json'), []);
  const schemaById = new Map(LIGHT_SCHEMAS.map((s) => [s.id, s]));
  const webEntries = buildLightingEntries(rawLight);
  for (const e of webEntries) {
    const s = schemaById.get(e.id);
    if (s && fs.existsSync(path.join(IMG_ROOT, IMG_LIGHT, s.file))) {
      e.refs = [rel(IMG_LIGHT, s.file)];
      e.refKind = '自产示意图';
    }
  }
  lighting.push(...webEntries);
}

// ---- 写出 ----
const styleCats = [...new Set(styles.map((s) => s.category))];
const motionPacks = [...new Set(motions.map((m) => m.packName))];
const lightCats = [...new Set(lighting.map((l) => l.category))];

const styleDoc = {
  schema: '素材收集库/风格库/1',
  name: '素材风格库',
  generatedAt: STAMP,
  counts: { total: styles.length, bySource: countBy(styles, 'source'), byCategory: countBy(styles, 'category') },
  categories: styleCats,
  items: styles,
};
const motionDoc = {
  schema: '素材收集库/动效库/1',
  name: '动效参考库',
  generatedAt: STAMP,
  counts: { total: motions.length, bySource: countBy(motions, 'source'), byPack: countBy(motions, 'packName') },
  packs: motionPacks,
  items: motions,
};
const lightDoc = {
  schema: '素材收集库/光影库/1',
  name: '光影库',
  generatedAt: STAMP,
  counts: { total: lighting.length, bySource: countBy(lighting, 'source'), byCategory: countBy(lighting, 'category') },
  categories: lightCats,
  items: lighting,
};

fs.writeFileSync(path.join(IDX, '风格库.json'), JSON.stringify(styleDoc), 'utf8');
fs.writeFileSync(path.join(IDX, '动效库.json'), JSON.stringify(motionDoc), 'utf8');
fs.writeFileSync(path.join(IDX, '光影库.json'), JSON.stringify(lightDoc), 'utf8');

console.log('风格库', styles.length, '条 ——', JSON.stringify(styleDoc.counts.bySource));
console.log('动效库', motions.length, '条 ——', JSON.stringify(motionDoc.counts.bySource));
console.log('光影库', lighting.length, '条 ——', JSON.stringify(lightDoc.counts.bySource));
console.log('白模化条目', motions.filter((m) => m.whitened).length, '条');
console.log('带参考图', styles.filter((s) => s.refs.length).length, '条风格');

function countBy(arr, key) {
  const o = {};
  for (const a of arr) { const k = a[key] || '未分类'; o[k] = (o[k] || 0) + 1; }
  return o;
}
