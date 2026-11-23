// 把全网光影原始数据转成光影库条目（提示词为可直接复制的完整中文格式）
export function buildLightingEntries(rawLight) {
  const out = [];
  if (!rawLight) return out;

  // ---- 布光方案 ----
  (rawLight.rigs || []).forEach((r, i) => {
    const L = [];
    L.push(`【布光方案】${r.name}${r.nameEn && r.nameEn !== r.name ? '（' + r.nameEn + '）' : ''}`);
    if (r.keyPosition) L.push(`【主光】${r.keyPosition}`);
    if (r.fillPosition) L.push(`【辅光】${r.fillPosition}`);
    if (r.rimPosition) L.push(`【轮廓光】${r.rimPosition}`);
    if (r.sourceType) L.push(`【光质】${r.sourceType}`);
    if (r.fillRatio) L.push(`【光比】主光 : 辅光 = ${r.fillRatio}${r.rimIntensity ? '，轮廓光强度 ' + r.rimIntensity : ''}`);
    if (r.colorTemp) L.push(`【色温与环境】${r.colorTemp}${r.hdri ? '，环境光 ' + r.hdri : ''}${r.ev ? '，环境曝光 ' + r.ev : ''}`);
    if (r.description) L.push(`【效果】${r.description}`);
    if (r.useCases?.length) L.push(`【适用】${r.useCases.join('、')}`);
    if (r.proTips?.length) L.push(`【操作要点】${r.proTips.join('；')}`);
    out.push({
      id: `rig-${String(i + 1).padStart(2, '0')}`,
      name: r.name,
      nameEn: r.nameEn,
      category: r.category || '布光方案',
      direction: r.keyPosition || null,
      hardness: r.sourceType || null,
      ratio: r.fillRatio || null,
      colorTemp: r.colorTemp || null,
      palette: (r.palette || []).map((hex) => ({ name: '主色', hex })),
      effect: r.description || '',
      useCases: r.useCases || [],
      mistakes: [],
      prompt: L.join('\n'),
      source: 'web',
      sourceUrl: r.sourceUrl || 'https://labs.xo3d.co.uk/lighting-rig-library/',
      sourceName: 'XO3D Labs · Lighting Rig Reference Library',
      license: null,
      refs: [],
      extra: { hdri: r.hdri, ev: r.ev, proTips: r.proTips, discipline: r.discipline, palette: r.palette, fillPosition: r.fillPosition, rimPosition: r.rimPosition },
    });
  });

  // ---- 光影术语 ----
  (rawLight.terms || []).forEach((r, i) => {
    const L = [`【术语】${r.term}${r.termZh ? '（' + r.termZh + '）' : ''}`, `【定义】${r.definition}`];
    for (const [k, v] of Object.entries(r.values || {})) L.push(`【${k}】${v}`);
    out.push({
      id: `term-${String(i + 1).padStart(2, '0')}`,
      name: r.termZh || r.term,
      nameEn: r.term,
      category: '光影术语',
      direction: r.values?.['水平角度'] || r.values?.位置 || null,
      hardness: r.values?.['光质'] || null,
      ratio: r.values?.['光比'] || null,
      colorTemp: null,
      effect: r.definition,
      useCases: [],
      mistakes: r.values?.注意 ? [r.values.注意] : [],
      prompt: L.join('\n'),
      source: 'web',
      sourceUrl: r.sourceUrl || '',
      sourceName: 'Filmfarm · 灯光术语库',
      license: null,
      refs: [],
      extra: { values: r.values },
    });
  });

  // ---- 自然光与实用光源 ----
  (rawLight.natural || []).forEach((r, i) => {
    const L = [
      `【光影】${r.nameZh}${r.name ? '（' + r.name + '）' : ''}`,
      `【光位】${r.direction}`,
      `【光质】${r.hardness}`,
      r.ratio && r.ratio !== '—' ? `【光比】${r.ratio}` : '',
      `【色温】${r.colorTemp}`,
      `【效果】${r.effect}`,
      `【适用】${(r.useCases || []).join('、')}`,
    ].filter(Boolean);
    out.push({
      id: `nat-${String(i + 1).padStart(2, '0')}`,
      name: r.nameZh,
      nameEn: r.name,
      category: '自然光与实用光源',
      direction: r.direction,
      hardness: r.hardness,
      ratio: r.ratio,
      colorTemp: r.colorTemp,
      effect: r.effect,
      useCases: r.useCases || [],
      mistakes: [],
      prompt: L.join('\n'),
      source: 'web',
      sourceUrl: r.sourceUrl || '',
      sourceName: '公开光影资料汇总',
      license: null,
      refs: [],
      extra: {},
    });
  });

  // ---- 人物光位 ----
  (rawLight.patterns || []).forEach((r, i) => {
    const L = [
      `【人物光位】${r.name}${r.nameEn ? '（' + r.nameEn + '）' : ''}`,
      `【识别特征】${r.shadowCue}`,
      `【光位角度】${r.keyAngle}`,
      `【光比】${r.ratio}`,
      `【适合脸型】${r.faceShape}`,
      `【情绪】${r.mood}`,
    ];
    out.push({
      id: `pat-${String(i + 1).padStart(2, '0')}`,
      name: r.name,
      nameEn: r.nameEn,
      category: '人物光位',
      direction: r.keyAngle,
      hardness: null,
      ratio: r.ratio,
      colorTemp: null,
      effect: r.shadowCue,
      useCases: [r.mood, r.faceShape].filter(Boolean),
      mistakes: [],
      prompt: L.join('\n'),
      source: 'web',
      sourceUrl: r.sourceUrl || '',
      sourceName: '公开人像布光资料汇总',
      license: null,
      refs: [],
      extra: { faceShape: r.faceShape, mood: r.mood },
    });
  });

  return out;
}
