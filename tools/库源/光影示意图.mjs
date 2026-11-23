// 从光影库原始数据解析出「示意图规格」
// 输出：04_工具\_抓取缓存\光影示意图规格.json
//
// 解析目标：
//   水平角（0°=镜头轴/正面，90°=侧面，180°=背面）
//   仰角（0°=水平，90°=顶光，负值=底光）
//   色温（K）、光比（主:辅）、光质（硬光/柔光）
// 无法解析的条目退化为「参数卡」形态，仍产出可读参考图。

const D2R = Math.PI / 180;

// 从 "45deg horizontal, 35deg elevation" 之类文本里取角度
function pickAngle(text) {
  if (!text) return null;
  const s = String(text);
  if (/omnidirectional|hemisphere|no single key|tent|multiple coloured|full dome/i.test(s)) return null;
  const m = s.match(/(\d{1,3})\s*deg/i);
  return m ? Number(m[1]) : null;
}

function pickElev(text, fallback) {
  const s = String(text || '');
  const m = s.match(/(\d{1,3})\s*deg\s*elevation/i);
  if (m) return Number(m[1]);
  const m2 = s.match(/elevation[^0-9]{0,12}(\d{1,3})/i);
  if (m2) return Number(m2[1]);
  const f = fallback != null ? parseFloat(String(fallback).replace(/[^\d.]/g, '')) : NaN;
  return Number.isFinite(f) ? f : null;
}

// 解析光位描述 → {angle, elev, special}
function parsePosition(text, role, keyAngle) {
  const s = String(text || '').trim();
  if (!s) return { angle: null, elev: null, special: null };
  if (/^none/i.test(s)) return { angle: null, elev: null, special: '无' };
  if (/omni|hemisphere|surround|tent|full dome/i.test(s)) return { angle: null, elev: 90, special: '全向/环绕' };
  if (/multiple coloured/i.test(s)) return { angle: null, elev: null, special: '多色面板' };
  if (/same as key/i.test(s)) return { angle: keyAngle ?? null, elev: null, special: '与主光同位' };
  if (/below subject|below lens/i.test(s)) return { angle: 0, elev: -25, special: '底部反射' };
  if (/ground bounce/i.test(s)) return { angle: 0, elev: -55, special: '地面反射' };
  if (/left and right/i.test(s)) return { angle: null, elev: null, special: '左右双侧', mirror: [90, -90] };
  if (/both rear sides|rear both sides|both sides/i.test(s)) return { angle: null, elev: null, special: '后侧双灯', mirror: [140, -140] };
  if (/behind subject/i.test(s)) return { angle: 180, elev: null, special: '背光' };
  if (/hair lights/i.test(s)) return { angle: null, elev: null, special: '发丝光', mirror: [150, -150] };
  if (/reflector only/i.test(s)) return { angle: keyAngle != null ? -keyAngle : null, elev: 0, special: '反光板' };
  if (/negative fill/i.test(s)) return { angle: keyAngle != null ? -keyAngle : null, elev: null, special: '负补光' };
  if (/virtual.*none|intentional darkness/i.test(s)) return { angle: null, elev: null, special: '有意压暗' };
  if (/opposing hue fill/i.test(s)) return { angle: keyAngle != null ? -keyAngle : null, elev: null, special: '对侧色补' };
  if (/full hemisphere|sky dome/i.test(s)) return { angle: null, elev: 90, special: '天空穹顶' };
  const angle = pickAngle(s);
  const elev = pickElev(s, null);
  return { angle, elev, special: null };
}

// 色温：支持 "5600K"、"3200K key / 7000K fill"、"Mixed - 440nm + 550nm"、区间 "2000–3000K"
function parseKelvin(text) {
  if (!text) return null;
  const s = String(text);
  const range = s.match(/(\d{4})\s*[–\-~]\s*(\d{4})\s*K/i);
  if (range) return { main: Number(range[1]), second: Number(range[2]), raw: s };
  const all = [...s.matchAll(/(\d{4})\s*K/gi)].map((m) => Number(m[1]));
  if (all.length) return { main: all[0], second: all[1] ?? null, raw: s };
  const nm = [...s.matchAll(/(\d{3})\s*nm/gi)].map((m) => Number(m[1]));
  if (nm.length) return { nm: nm, raw: s };
  return null;
}

// 光比："2:1"、"6.7:1"、"3:1 到 4:1"
function parseRatio(text) {
  if (!text) return null;
  const s = String(text);
  const m = s.match(/(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[2]);
  if (!a || !b) return null;
  return { key: a, fill: b, raw: s };
}

function parseHardness(text) {
  if (!text) return null;
  const s = String(text);
  if (/soft|柔|大型|diffuse/i.test(s)) return '柔光';
  if (/hard|硬|direct|sun/i.test(s)) return '硬光';
  if (/mixed|多色/i.test(s)) return '混合光';
  return null;
}

// 文本里抽取第一个角度（人物光位 / 自然光用）
function parseFreeAngle(text) {
  if (!text) return null;
  const m = String(text).match(/(\d{1,3})\s*[°度]/);
  return m ? Number(m[1]) : null;
}

/**
 * @param {object} raw  光影库原始数据
 * @returns {Array} 示意图规格数组
 */
export function buildLightingSchematics(raw) {
  const specs = [];

  // ---------- XO3D 布光方案 24 条：完整三灯俯视图 ----------
  (raw.rigs || []).forEach((r, i) => {
    const keyPos = parsePosition(r.keyPosition, 'key', null);
    const keyAngle = keyPos.angle;
    const fillPos = parsePosition(r.fillPosition, 'fill', keyAngle);
    const rimPos = parsePosition(r.rimPosition, 'rim', keyAngle);
    const kel = parseKelvin(r.colorTemp);
    const ratio = parseRatio(r.fillRatio);
    const hard = parseHardness(r.sourceType);

    const lights = [];
    const push = (role, pos, color, size) => {
      if (pos.angle == null && !pos.special) return;
      lights.push({ role, angle: pos.angle, elev: pos.elev, color, size, note: pos.special });
      if (pos.mirror) for (const a of pos.mirror) lights.push({ role, angle: a, elev: pos.elev, color, size, note: pos.special });
    };
    push('主光', keyPos, '#ffb347', 13);
    push('辅光', fillPos, '#7fb6ff', 10);
    push('轮廓光', rimPos, '#ff7ab8', 10);

    specs.push({
      id: `rig-${String(i + 1).padStart(2, '0')}`,
      file: `光影示意_布光方案_${String(i + 1).padStart(2, '0')}_${r.name.replace(/[\\/:*?"<>|]/g, '')}.png`,
      title: r.name,
      subtitle: r.nameEn && r.nameEn !== r.name ? r.nameEn : '',
      chip: r.category || '布光方案',
      kind: 'rig',
      lights,
      kelvin: kel,
      ratio,
      hardness: hard,
      desc: r.description || '',
      facts: r.useCases?.length ? [`适用：${r.useCases.join('、')}`] : [],
      source: 'XO3D Labs · Lighting Rig Reference Library',
      palette: r.palette || [],
    });
  });

  // ---------- 光影术语 6 条 ----------
  (raw.terms || []).forEach((r, i) => {
    const v = r.values || {};
    const angle = parseFreeAngle(v['水平角度'] || v['位置']);
    const kel = parseKelvin(v['色温']);
    const ratio = parseRatio(v['光比']);
    const hard = parseHardness(v['硬光'] || v['柔光'] || v['光质']);
    specs.push({
      id: `term-${String(i + 1).padStart(2, '0')}`,
      file: `光影示意_术语_${String(i + 1).padStart(2, '0')}_${String(r.termZh || r.term).replace(/[\\/:*?"<>|]/g, '')}.png`,
      title: r.termZh || r.term,
      subtitle: r.term,
      chip: '光影术语',
      kind: 'card',
      lights: angle != null ? [{ role: '主光', angle, elev: null, color: '#ffb347', size: 13, note: null }] : [],
      kelvin: kel,
      ratio,
      hardness: hard,
      desc: r.definition || '',
      facts: Object.entries(v).map(([k, val]) => `${k}：${val}`),
      source: 'Filmfarm · 灯光术语库',
    });
  });

  // ---------- 自然光与实用光源 15 条 ----------
  (raw.natural || []).forEach((r, i) => {
    const angle = parseFreeAngle(r.direction);
    const kel = parseKelvin(r.colorTemp);
    const ratio = parseRatio(r.ratio);
    const hard = parseHardness(r.hardness);
    specs.push({
      id: `nat-${String(i + 1).padStart(2, '0')}`,
      file: `光影示意_自然光_${String(i + 1).padStart(2, '0')}_${String(r.nameZh || r.name).replace(/[\\/:*?"<>|]/g, '')}.png`,
      title: r.nameZh || r.name,
      subtitle: r.name || '',
      chip: '自然光与实用光源',
      kind: 'card',
      lights: angle != null ? [{ role: '主光', angle, elev: null, color: '#ffb347', size: 13, note: null }] : [],
      kelvin: kel,
      ratio,
      hardness: hard,
      desc: r.effect || '',
      facts: [
        r.direction ? `光位：${r.direction}` : '',
        r.hardness ? `光质：${r.hardness}` : '',
        r.colorTemp ? `色温：${r.colorTemp}` : '',
      ].filter(Boolean),
      source: '公开光影资料汇总',
    });
  });

  // ---------- 人物光位 8 条 ----------
  (raw.patterns || []).forEach((r, i) => {
    const angle = parseFreeAngle(r.keyAngle);
    const ratio = parseRatio(r.ratio);
    specs.push({
      id: `pat-${String(i + 1).padStart(2, '0')}`,
      file: `光影示意_人物光位_${String(i + 1).padStart(2, '0')}_${String(r.name).replace(/[\\/:*?"<>|]/g, '')}.png`,
      title: r.name,
      subtitle: r.nameEn || '',
      chip: '人物光位',
      kind: 'card',
      lights: angle != null ? [{ role: '主光', angle, elev: null, color: '#ffb347', size: 13, note: null }] : [],
      kelvin: null,
      ratio,
      hardness: null,
      desc: r.shadowCue || '',
      facts: [
        r.keyAngle ? `光位角度：${r.keyAngle}` : '',
        r.faceShape ? `适合脸型：${r.faceShape}` : '',
        r.mood ? `情绪：${r.mood}` : '',
      ].filter(Boolean),
      source: '公开人像布光资料汇总',
    });
  });

  return specs;
}
