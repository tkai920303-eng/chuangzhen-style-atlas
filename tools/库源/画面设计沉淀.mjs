// 《画面设计沉淀》条目数据源 —— 从短视频的逆向拆解里抽象出的可复用视觉系统。
//
// 写入位置：04_工具\库源\画面设计沉淀.mjs
// 消费位置：04_工具\构建三库.mjs（合并进 风格库 / 动效库 / 光影库）
//
// 条目里的 sourcePath 一律写**库内相对路径**，不含本机绝对路径，
// 这样随开源包分发时无需脱敏、也不会泄漏本机目录。
//
// 所有参考图均为**自产示意图**（04_工具\生成画面设计参考图.py 用 PIL 渲染），
// 不含任何第三方作品的画面像素。
//
// 三个库的条目都在这里，由 04_工具\构建三库.mjs 在重建时合并进三库索引，
// 因此直接改 03_索引\*.json 会在下次重建时被覆盖——改这里才对。
//
// 条目里的 sourcePath 只是本文件的默认标注；构建脚本会按当前布局重算
// （本地 04_工具\库源\…，发布包 tools\库源\…），不用手改。
//
// 风格条目的配色走既有的 paletteFrom 机制：
// 配色由 04_工具\提取配色.mjs 从自产参考图实际提取，不手填色值。

export const styles = [
{
    "id": "vd-style-dotgrid",
    "name": "点阵纸纹底",
    "nameEn": "Dot-Grid Paper Ground",
    "category": "手绘与纸感",
    "mechanism": "图形语言",
    "paletteFrom": "风格图鉴_画面设计沉淀_vd-style-dotgrid.jpg",
    "refs": [
"风格图鉴_画面设计沉淀_vd-style-dotgrid.jpg"
    ],
    "visual": "浅米白底上铺一层规则排布的淡蓝灰小圆点阵；点距均匀、点径很小，整体像笔记本内页的印刷底纹，白色圆角卡片与深色文字压在上面仍然清晰。",
    "motion": "底纹完全静止，动效只作用在上层卡片与文字上；点阵不做闪烁或呼吸。",
    "lighting": "无方向性平光，底色均匀，没有高光、投影与光比。",
    "texture": "纸面颗粒极轻，点阵靠网点而非噪点表现印刷感，整体接近纯平色。",
    "use": "教程、清单、图文说明类版面；需要在浅底上同时放大量卡片、表格与长句正文时。",
    "migration": "用极浅的点阵代替明显的网格线，保持底面干净；点径控制在 2–3px，点距不小于 24px。",
    "limitations": "点阵过密会让浅底发灰；点径超过 4px 会变成纹理贴图而不是印刷底纹。",
    "mix": "与白底圆角卡片、细线图标、衬线大标题共享同一套浅色基调；不宜与暗底霓虹类风格同屏。",
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-style-dotgrid"
  },
{
    "id": "vd-style-starchapter",
    "name": "深空星芒章节卡",
    "nameEn": "Deep-Space Starburst Chapter Card",
    "category": "空间与光学",
    "mechanism": "数字图像处理",
    "paletteFrom": "风格图鉴_画面设计沉淀_vd-style-starchapter.jpg",
    "refs": [
"风格图鉴_画面设计沉淀_vd-style-starchapter.jpg"
    ],
    "visual": "近黑藏青底加细密星尘，画面中央一圈放射状白色星芒，标题是带描边与外发光的白色衬线大字，整体像天文台屏幕或深空观测界面。",
    "motion": "星芒以极慢角速度旋转，星尘轻微漂移，标题自中心放大淡入；所有运动都由绝对时间驱动。",
    "lighting": "画面自身发光，不依赖任何外部光源；光晕靠辉光后处理实现，底部比顶部更亮。",
    "texture": "画面干净，只有稀疏星尘颗粒，没有任何纸感或噪点纹理。",
    "use": "章节分隔、预告卡、强调幕；需要在暗场里突然重置观众注意力时。",
    "migration": "用径向渐变加细线条数组做星芒，不要用真实星空照片；辉光用双层高斯模糊而不是亮线描边。",
    "limitations": "辉光过强会吃掉文字锐度；星芒根数超过 60 条会显得廉价；深底连续看超过 30 秒容易疲劳。",
    "mix": "与金色强调字、红色语义标签天然配套；不宜与手绘纸感或实拍素材混搭。",
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-style-starchapter"
  },
{
    "id": "vd-style-blackgold",
    "name": "纯黑金红档案卡",
    "nameEn": "Black-Gold Archival Card",
    "category": "空间与光学",
    "mechanism": "美术体系",
    "paletteFrom": "风格图鉴_画面设计沉淀_vd-style-blackgold.jpg",
    "refs": [
"风格图鉴_画面设计沉淀_vd-style-blackgold.jpg"
    ],
    "visual": "纯黑底加金色渐变衬线标题（字面带辉光），配一处红色强调块与红色书法印章，整体像档案卷宗封面或典藏文献的扉页。",
    "motion": "标题自中心轻微缩放淡入；红色印章以 −2° 落位并回弹一次；底部常驻一行金色出处小字。",
    "lighting": "纯自发光，没有环境光与投影；金色靠文字填充的线性渐变模拟金属反光。",
    "texture": "无颗粒，画面极干净，色块边界锐利。",
    "use": "历史、文献、思想史类内容的章节卡与结论卡；需要厚重权威气质时。",
    "migration": "金色用文字填充渐变加外发光实现，印章用旋转的红底白字矩形，不要用真实书法图片。",
    "limitations": "纯黑底长时间观看易疲劳；金色与白色并置时需要拉开 20% 以上的亮度差才分得开。",
    "mix": "与红色语义色、档案式编号常驻层配套；与手绘类风格冲突明显。",
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-style-blackgold"
  },
{
    "id": "vd-style-studio-semantic",
    "name": "灰白影棚双色语义",
    "nameEn": "Studio Grey Dual-Code",
    "category": "信息层与界面",
    "mechanism": "图形语言",
    "paletteFrom": "风格图鉴_画面设计沉淀_vd-style-studio-semantic.jpg",
    "refs": [
"风格图鉴_画面设计沉淀_vd-style-studio-semantic.jpg"
    ],
    "visual": "摄影棚无缝背景纸（上白下灰的垂直渐变）加一条深色地平线；画面里的元素只用两支高饱和色区分身份，其余全是黑白线稿，颜色本身承担全部语义。",
    "motion": "元素沿地平线平移排队，进出只做位移与不透明度，不做形变。",
    "lighting": "柔和顶光，主体边缘不加轮廓光，投影很轻；地平线以下略暗。",
    "texture": "几乎无颗粒，只有背景纸的极轻噪点。",
    "use": "需要观众一眼分辨谁是谁的图解：博弈、分组、比例、流程、路线对比。",
    "migration": "语义色严格限制两支，其余元素一律黑白，保证颜色不承载多余信息。",
    "limitations": "只有两支颜色可用；第三个类别必须改用形状、位置或边框样式区分。",
    "mix": "与白底圆角卡片、细线人物线稿共享；不宜与霓虹辉光类风格同屏。",
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-style-studio-semantic"
  },
{
    "id": "vd-style-spotlight",
    "name": "暖褐聚光剪影",
    "nameEn": "Warm Spotlight Silhouette",
    "category": "材质与运动",
    "mechanism": "美术体系",
    "paletteFrom": "风格图鉴_画面设计沉淀_vd-style-spotlight.jpg",
    "refs": [
"风格图鉴_画面设计沉淀_vd-style-spotlight.jpg"
    ],
    "visual": "暖褐近黑暗景加顶部一道梯形聚光锥落在画面中下部，锥内是人物纯黑剪影，锥外几乎全黑，全画面覆盖细密胶片颗粒。",
    "motion": "光锥亮度轻微呼吸，人物剪影在锥内缓慢移动，锥体本身不动。",
    "lighting": "单一硬光顶光，光锥边缘柔化；锥外亮度压到极低，靠剪影与亮度的关系表达强调。",
    "texture": "明显胶片颗粒，覆盖全部画面并压住高光。",
    "use": "训练、意志、深夜坚持类内容的氛围镜；需要在暗场里制造压迫感与专注感时。",
    "migration": "用梯形渐变加边缘羽化做光锥，人物直接用纯黑剪影，不需要细节。",
    "limitations": "光锥边界太硬会像贴图；颗粒过重会掩盖剪影轮廓；剪影姿态单一时容易乏味。",
    "mix": "与心电图波形、暖色数字系统共享；可与红色强调标签搭配。",
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-style-spotlight"
  },
{
    "id": "vd-style-nodegold",
    "name": "深蓝金网几何",
    "nameEn": "Navy Gold Node Web",
    "category": "图形与信息",
    "mechanism": "图形语言",
    "paletteFrom": "风格图鉴_画面设计沉淀_vd-style-nodegold.jpg",
    "refs": [
"风格图鉴_画面设计沉淀_vd-style-nodegold.jpg"
    ],
    "visual": "极深蓝底加细密星尘，再一张由数十个金色节点与连线组成的网络，其中一个节点被高亮并被一条金色弧线引入；旁边站一个白色几何火柴人（圆头加简化躯干四肢）作为尺度参照。",
    "motion": "节点缓慢漂移、连线随之呼吸；高亮节点沿弧线移动到目标位置，路径随之点亮。",
    "lighting": "纯自发光；节点带径向辉光，高亮节点比其余节点亮两档。",
    "texture": "干净，无纸感无颗粒。",
    "use": "讲系统、讲因果、讲抽象结构的段落；用几何火柴人当尺度参照替代真人。",
    "migration": "节点与连线用 SVG 生成；高亮用更亮的色值加更粗线宽，不要只靠颜色区分。",
    "limitations": "节点过密会糊成一团；连线交叉会让人误读因果方向；人物比例失调会抢走结构注意力。",
    "mix": "与深蓝夜空底、金色数字、白色几何人物共享；与暖褐聚光风冲突。",
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-style-nodegold"
  }
];

export const motions = [
{
    "id": "vd-fx-card-pop",
    "name": "圆角卡片弹入",
    "nameEn": "Rounded Card Pop-In",
    "category": "UI 组件",
    "pack": "local",
    "packName": "本地沉淀",
    "source": "local",
    "sourceUrl": null,
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-fx-card-pop",
    "sourceDir": null,
    "license": null,
    "status": "自产沉淀，已出规格与白模版",
    "meaning": "内容卡以轻微过冲的方式弹入版面，是清单式教程里最常用的一次性入场动作。",
    "description": "圆角卡片从 0.92 倍缩放加下移 24px 弹入，透明度 0→1，入场带一次轻微过冲后回稳。",
    "timing": "单卡入场 0.42s；出场 0.24s；同屏多卡按 0.08s 依次错开，整体不超过 0.9s",
    "easing": "入场 spring(1, 120, 18)，过冲约 6%；出场 easeIn(0.4)",
    "amplitude": "缩放 0.92→1.0；Y 位移 +24px→0；不透明度 0→1；阴影随缩放同步收紧",
    "spec": [
"0.00s 卡片 opacity=0，scale=0.92，translateY=24px",
"0.42s 卡片 opacity=1，scale=1，translateY=0，阴影回到常态",
"出场 0.24s，opacity→0，scale→0.96，easeIn(0.4)",
"多卡错开每张 +0.08s，最后一张在 0.9s 内全部落位"
    ],
    "tags": [
"卡片",
"弹入",
"过冲",
"教程版式",
"清单"
    ],
    "prompt": "圆角卡片弹入：单卡 0.42s 入场，缩放 0.92→1、Y 位移 24px→0、透明度 0→1，带 spring(1,120,18) 的一次轻微过冲后回稳；同屏多张按 0.08s 依次错开；出场 0.24s 缩回 0.96 并淡出。",
    "code": {
      "firstLine": "// 授权：MIT（自产代码，随包分发）",
      "body": "const SPRING = { damping: 120, stiffness: 18, mass: 1 };\n\nexport const CardPop = ({ index = 0, duration = 0.42, children }) => {\n  const delay = index * 0.08;\n  const p = interpolate(frame, [delay, delay + duration], [0, 1], {\n    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',\n  });\n  const s = spring({ frame: frame - delay, fps, config: SPRING });\n  return (\n    <div style={{\n      opacity: p,\n      transform: `translateY(${(1 - p) * 24}px) scale(${s})`,\n    }}>\n      {children}\n    </div>\n  );\n};"
    },
    "whitened": {
      "label": "白模版",
      "rules": "保留时序、缓动与幅度；材质改为中性灰白哑光；颜色、背景、阴影与文字全部替换为槽位。",
      "slots": [
"圆角矩形卡片",
"哑光无反射",
"{颜色}",
"纯色背景",
"极轻柔影",
"占位文字"
      ],
      "spec": [
"0.00s 卡片 opacity=0，scale=0.92，translateY=24px",
"0.42s 卡片 opacity=1，scale=1，translateY=0",
"出场 0.24s，opacity→0，scale→0.96",
"多卡错开每张 +0.08s"
      ],
      "prompt": "白色哑光圆角卡片弹入：0.42s 内从 0.92 倍缩放与下移 24px 弹到原位，带一次轻微过冲；多张按 0.08s 错开；纯色背景，极轻柔影。"
    },
    "refs": [
"动效参考图/动效规格卡_vd-fx-card-pop_圆角卡片弹入.png"
    ],
    "preview": null,
    "refKind": "规格卡",
    "local": false
  },
{
    "id": "vd-fx-typewriter",
    "name": "打字机文字",
    "nameEn": "Typewriter Reveal",
    "category": "文字动效",
    "pack": "local",
    "packName": "本地沉淀",
    "source": "local",
    "sourceUrl": null,
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-fx-typewriter",
    "sourceDir": null,
    "license": null,
    "status": "自产沉淀，已出规格与白模版",
    "meaning": "正文逐字显现并带闪烁光标，用来强调这句话是被一个字一个字敲出来的。",
    "description": "文本按时间逐字显现，结尾光标以 530ms 周期闪烁，标点后停顿 240ms。",
    "timing": "每字 45ms；标点后停 240ms；光标闪烁周期 530ms",
    "easing": "字符显现 linear；光标不透明度 0/1 硬切",
    "amplitude": "可见字符数按绝对时间推进；光标横跳 1px",
    "spec": [
"字符数 = floor((t - start) / 0.045)，遇到句读再额外停 0.24s",
"光标在 0 与 1 之间以 0.53s 周期切换不透明度",
"文本容器宽度固定，逐字增长不引起回流",
"整段结束后光标保留 1.2s 再淡出"
    ],
    "tags": [
"文字",
"逐字",
"光标",
"强调",
"口播稿"
    ],
    "prompt": "打字机文字：正文每 45ms 显现一个字，句读处额外停 240ms，结尾一个 530ms 周期的闪烁光标，整段结束后光标保留 1.2s 再淡出；字符宽度固定，不引起回流。",
    "code": {
      "firstLine": "// 授权：MIT（自产代码，随包分发）",
      "body": "const CPS = 0.045;\nconst PAUSE = 0.24;\nconst PUNCT = '，。！？；：、';\n\nexport const Typewriter = ({ text = '', start = 0 }) => {\n  const t = frame / fps - start;\n  const shown = Math.max(0, Math.min(text.length, Math.floor(t / CPS)));\n  const cursorOn = Math.floor(t / 0.53) % 2 === 0;\n  return (\n    <span>\n      {text.slice(0, shown)}\n      <i style={{ opacity: cursorOn ? 1 : 0 }}>|</i>\n    </span>\n  );\n};"
    },
    "whitened": {
      "label": "白模版",
      "rules": "保留时序、缓动与幅度；材质改为中性灰白哑光；颜色、背景、阴影与文字全部替换为槽位。",
      "slots": [
"单行文本",
"哑光无反射",
"{颜色}",
"纯色背景",
"无投影",
"占位文字"
      ],
      "spec": [
"每字 45ms 显现，标点后停 240ms",
"光标 530ms 周期闪烁",
"整段结束后光标保留 1.2s 再淡出",
"字符宽度固定，不引起回流"
      ],
      "prompt": "白色哑光文本逐字显现：每字 45ms，句读后停 240ms，结尾光标 530ms 周期闪烁，结束后保留 1.2s 再淡出；纯色背景，无投影。"
    },
    "refs": [
"动效参考图/动效规格卡_vd-fx-typewriter_打字机文字.png"
    ],
    "preview": null,
    "refKind": "规格卡",
    "local": false
  },
{
    "id": "vd-fx-callout-grow",
    "name": "引线标注生长",
    "nameEn": "Callout Leader Grow",
    "category": "图形与信息",
    "pack": "local",
    "packName": "本地沉淀",
    "source": "local",
    "sourceUrl": null,
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-fx-callout-grow",
    "sourceDir": null,
    "license": null,
    "status": "自产沉淀，已出规格与白模版",
    "meaning": "一条细引线从图形上长出来，顶端展开一个标签框，用来把文字精准挂到画面里的某个点。",
    "description": "竖向虚线引线自下向上生长，随后标签框自中心展开并轻微回弹。",
    "timing": "引线 0.30s；标签框 0.22s，滞后引线结束 0.06s；总时长 0.58s",
    "easing": "引线 easeOut(0.3)；标签 easeOutBack(1.2)",
    "amplitude": "引线长度 0→120px；标签 scale 0.86→1，Y 位移 +12px→0",
    "spec": [
"0.00s 引线长度 0，标签 opacity 0",
"0.30s 引线到 120px，标签开始展开",
"0.58s 标签 scale 1、opacity 1，引线转为虚线常驻",
"引线末端锚点先出现一个 6px 的小圆点，再长线"
    ],
    "tags": [
"标注",
"引线",
"数据图解",
"信息图"
    ],
    "prompt": "引线标注生长：一条竖向虚线引线自锚点向上生长 0.30s，随后标签框自中心展开 0.22s（scale 0.86→1、Y +12→0，带轻微回弹），锚点先出一个 6px 圆点，总时长 0.58s。",
    "code": {
      "firstLine": "// 授权：MIT（自产代码，随包分发）",
      "body": "export const Callout = ({ anchorY = 0, height = 120, label = '' }) => {\n  const lead = interpolate(frame, [0, 18], [0, height], {\n    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',\n  });\n  const pop = spring({ frame: frame - 18, fps, config: { damping: 12 } });\n  return (\n    <div style={{ position: 'absolute', left: 40, top: anchorY }}>\n      <i style={{ width: 6, height: 6, borderRadius: 3, background: '#888' }} />\n      <div style={{ borderLeft: '1px dashed #888', height: lead }} />\n      <div style={{\n        opacity: interpolate(frame, [18, 31], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),\n        transform: `translateY(${interpolate(frame, [18, 31], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px) scale(${pop})`,\n      }}>{label}</div>\n    </div>\n  );\n};"
    },
    "whitened": {
      "label": "白模版",
      "rules": "保留时序、缓动与幅度；材质改为中性灰白哑光；颜色、背景、阴影与文字全部替换为槽位。",
      "slots": [
"锚点小圆点",
"哑光无反射",
"{颜色}",
"纯色背景",
"无投影",
"占位文字"
      ],
      "spec": [
"0.00s 引线 0，标签 opacity 0",
"0.30s 引线到 120px，标签开始展开",
"0.58s 标签 scale 1、opacity 1",
"锚点先出 6px 圆点再长线"
      ],
      "prompt": "灰色哑光引线标注：锚点先出 6px 圆点，竖向虚线引线向上生长 0.30s 到 120px，标签框自中心展开 0.22s（scale 0.86→1、Y +12→0，带轻微回弹）。"
    },
    "refs": [
"动效参考图/动效规格卡_vd-fx-callout-grow_引线标注生长.png"
    ],
    "preview": null,
    "refKind": "规格卡",
    "local": false
  },
{
    "id": "vd-fx-progress-capsule",
    "name": "胶囊进度条填充",
    "nameEn": "Capsule Progress Fill",
    "category": "UI 组件",
    "pack": "local",
    "packName": "本地沉淀",
    "source": "local",
    "sourceUrl": null,
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-fx-progress-capsule",
    "sourceDir": null,
    "license": null,
    "status": "自产沉淀，已出规格与白模版",
    "meaning": "一条圆头胶囊进度条被渐变填充，用来把一个比例讲成一眼可读的数字。",
    "description": "深色胶囊轨道内，金色或青色渐变从左端圆头生长，填充头部带一圈辉光，轨道下方排 0/25/50/75/100 刻度。",
    "timing": "填充 1.10s；头部辉光 1.80s 循环；刻度标签在填充开始后 0.20s 淡入",
    "easing": "填充 easeInOut(0.35)；辉光半径用正弦循环",
    "amplitude": "填充宽度 0→100%；辉光半径 8→16px；轨道圆角等于高度一半",
    "spec": [
"0.00s 轨道以深色出现，填充宽度 0",
"0.20s 刻度标签淡入",
"1.10s 填充到达目标比例，头部辉光最强",
"1.80s 一个循环，辉光在 8–16px 之间呼吸"
    ],
    "tags": [
"进度条",
"数据图解",
"比例",
"辉光"
    ],
    "prompt": "胶囊进度条填充：深色圆头轨道内，金色渐变自左端圆头生长 1.10s（easeInOut 0.35），填充头部带 8–16px 循环呼吸的辉光，轨道下方 0/25/50/75/100 刻度在 0.20s 时淡入。",
    "code": {
      "firstLine": "// 授权：MIT（自产代码，随包分发）",
      "body": "export const CapsuleProgress = ({ progress = 0.416, color = '#F9B957' }) => {\n  const p = interpolate(frame, [0, 33], [0, progress], {\n    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',\n    easing: Easing.inOut(Easing.ease(0.35)),\n  });\n  const glow = 8 + 4 * (1 + Math.sin((frame / fps / 1.8) * Math.PI * 2));\n  return (\n    <div style={{ position: 'relative', height: 18, borderRadius: 9, background: '#1b1f2b' }}>\n      <div style={{\n        width: `${p * 100}%`, height: '100%', borderRadius: 9,\n        background: `linear-gradient(90deg, ${color}, rgba(255,255,255,0.2))`,\n        boxShadow: `0 0 ${glow}px ${color}`,\n      }} />\n    </div>\n  );\n};"
    },
    "whitened": {
      "label": "白模版",
      "rules": "保留时序、缓动与幅度；材质改为中性灰白哑光；颜色、背景、阴影与文字全部替换为槽位。",
      "slots": [
"圆头胶囊条",
"哑光无反射",
"{颜色}",
"纯色背景",
"无投影",
"占位文字"
      ],
      "spec": [
"0.00s 轨道出现，填充 0",
"0.20s 刻度标签淡入",
"1.10s 填充到位，头部辉光最强",
"1.80s 循环，辉光 8–16px 呼吸"
      ],
      "prompt": "白色哑光胶囊进度条：深色圆头轨道内渐变自左端生长 1.10s（easeInOut 0.35），头部带 8–16px 循环呼吸的柔光，刻度标签 0.20s 淡入；纯色背景，无投影。"
    },
    "refs": [
"动效参考图/动效规格卡_vd-fx-progress-capsule_胶囊进度条填充.png"
    ],
    "preview": null,
    "refKind": "规格卡",
    "local": false
  },
{
    "id": "vd-fx-particle-bloom",
    "name": "粒子聚散",
    "nameEn": "Particle Bloom & Gather",
    "category": "动态图形",
    "pack": "local",
    "packName": "本地沉淀",
    "source": "local",
    "sourceUrl": null,
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-fx-particle-bloom",
    "sourceDir": null,
    "license": null,
    "status": "自产沉淀，已出规格与白模版",
    "meaning": "粒子从一点炸开成放射状，再收拢成一个环，用来表现从一到多再回到结构。",
    "description": "数百个粒子从中心炸开成放射点阵，悬停后沿圆轨道收拢成一个发光圆环。",
    "timing": "炸开 0.90s；悬停 1.20s；收拢 1.40s；整段 3.50s",
    "easing": "炸开 easeOut(0.2)；收拢 easeInOut(0.4)",
    "amplitude": "粒子 240 个；初始半径 4px；炸开至 300px；收拢至圆环 r=120px；粒子直径 2–4px",
    "spec": [
"0.00s 粒子聚在中心一点",
"0.90s 炸开到 300px 半径的放射点阵",
"2.10s 悬停，粒子沿各自轨道缓慢公转",
"3.50s 收拢成 r=120px 的圆环"
    ],
    "tags": [
"粒子",
"数据图解",
"扩散",
"收拢",
"隐喻"
    ],
    "prompt": "粒子聚散：240 个粒子从中心一点炸开成 300px 半径的放射点阵（0.90s，easeOut 0.2），悬停 1.20s 沿轨道公转，再收拢成 r=120px 的发光圆环（1.40s，easeInOut 0.4），粒子直径 2–4px。",
    "code": {
      "firstLine": "// 授权：MIT（自产代码，随包分发）",
      "body": "export const ParticleBloom = ({ count = 240, radius = 300 }) => {\n  const t = frame / fps;\n  const out = interpolate(t, [0, 0.9], [0, radius], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.ease(0.2)) });\n  const back = interpolate(t, [2.1, 3.5], [radius, 120], { extrapolateLeft: 'clamp', extrapolateRight: 'clampl', easing: Easing.inOut(Easing.ease(0.4)) });\n  const r = t < 2.1 ? out : back;\n  return (\n    <svg viewBox=\"0 0 1920 1080\">\n      {Array.from({ length: count }, (_, i) => {\n        const a = (i / count) * Math.PI * 2 + t * 0.3;\n        return <circle key={i} cx={960 + Math.cos(a) * r} cy={540 + Math.sin(a) * r} r={2 + (i % 3)} fill=\"#F9B957\" />;\n      })}\n    </svg>\n  );\n};"
    },
    "whitened": {
      "label": "白模版",
      "rules": "保留时序、缓动与幅度；材质改为中性灰白哑光；颜色、背景、阴影与文字全部替换为槽位。",
      "slots": [
"圆形粒子群",
"哑光无反射",
"{颜色}",
"纯色背景",
"无投影",
"占位文字"
      ],
      "spec": [
"0.00s 粒子聚在中心一点",
"0.90s 炸开到 300px 半径",
"2.10s 悬停公转",
"3.50s 收拢成 r=120px 圆环"
      ],
      "prompt": "白色哑光粒子群：240 个粒子从中心一点炸开到 300px 半径（0.90s，easeOut 0.2），悬停 1.20s 公转，再收拢成 r=120px 圆环（1.40s，easeInOut 0.4）；纯色背景，无投影。"
    },
    "refs": [
"动效参考图/动效规格卡_vd-fx-particle-bloom_粒子聚散.png"
    ],
    "preview": null,
    "refKind": "规格卡",
    "local": false
  },
{
    "id": "vd-fx-chapter-burst",
    "name": "章节光爆转场",
    "nameEn": "Chapter Burst",
    "category": "镜头运动与转场",
    "pack": "local",
    "packName": "本地沉淀",
    "source": "local",
    "sourceUrl": null,
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-fx-chapter-burst",
    "sourceDir": null,
    "license": null,
    "status": "自产沉淀，已出规格与白模版",
    "meaning": "放射线从画面中心炸开并叠一次白闪，把观众从上一段硬切到新章节。",
    "description": "数十条放射线自中心炸开到 620px，中心过曝到纯白，标题在白闪之后淡入。",
    "timing": "放射线 0.38s；白闪 0.09s；标题 0.50s 淡入（白闪结束后 0.05s 开始）",
    "easing": "炸开 easeOut(0.15)；白闪 0→1→0 硬切；标题 easeOut(0.25)",
    "amplitude": "放射线 48 条，长度 0→620px；中心过曝半径 0→260px；白闪不透明度峰值 0.85",
    "spec": [
"0.00s 放射线长度 0，中心一点白",
"0.09s 中心过曝到纯白，白闪峰值 0.85",
"0.38s 放射线到 620px，白闪结束",
"0.43s 标题开始淡入，0.93s 完全显现"
    ],
    "tags": [
"转场",
"章节",
"放射",
"白闪",
"冲击"
    ],
    "prompt": "章节光爆转场：48 条放射线自中心炸开到 620px（0.38s，easeOut 0.15），中心过曝半径 0→260px 并叠一次 0.09s、峰值 0.85 的白闪；白闪结束后 0.05s 起标题用 0.50s 淡入。",
    "code": {
      "firstLine": "// 授权：MIT（自产代码，随包分发）",
      "body": "export const ChapterBurst = ({ children }) => {\n  const len = interpolate(frame, [0, 11], [0, 620], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.ease(0.15)) });\n  const flash = frame < 3 ? 0.85 : interpolate(frame, [3, 6], [0.85, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });\n  const title = interpolate(frame, [13, 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.ease(0.25)) });\n  return (\n    <div style={{ position: 'relative' }}>\n      <svg viewBox=\"0 0 1920 1080\" style={{ position: 'absolute', inset: 0 }}>\n        {Array.from({ length: 48 }, (_, i) => {\n          const a = (i / 48) * Math.PI * 2;\n          return <line key={i} x1={960} y1={540} x2={960 + Math.cos(a) * len} y2={540 + Math.sin(a) * len} stroke=\"#fff\" strokeWidth={2} />;\n        })}\n        <circle cx={960} cy={540} r={interpolate(frame, [0, 8], [0, 260], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} fill=\"#fff\" />\n      </svg>\n      <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: flash }} />\n      <div style={{ opacity: title }}>{children}</div>\n    </div>\n  );\n};"
    },
    "whitened": {
      "label": "白模版",
      "rules": "保留时序、缓动与幅度；材质改为中性灰白哑光；颜色、背景、阴影与文字全部替换为槽位。",
      "slots": [
"放射线条组",
"哑光无反射",
"{颜色}",
"纯色背景",
"无投影",
"占位文字"
      ],
      "spec": [
"0.00s 放射线 0，中心一点白",
"0.09s 白闪峰值 0.85",
"0.38s 放射线到 620px",
"0.43s 标题开始淡入，0.93s 显现"
      ],
      "prompt": "白色哑光放射转场：48 条放射线自中心炸开到 620px（0.38s，easeOut 0.15），中心过曝半径 0→260px，叠一次 0.09s、峰值 0.85 的白闪，随后标题 0.50s 淡入。"
    },
    "refs": [
"动效参考图/动效规格卡_vd-fx-chapter-burst_章节光爆转场.png"
    ],
    "preview": null,
    "refKind": "规格卡",
    "local": false
  }
];

export const lighting = [
{
    "id": "vd-light-spot-cone",
    "name": "顶部聚光锥",
    "nameEn": "Top Spotlight Cone",
    "category": "光影效果",
    "direction": "光源位于主体正上方偏后，光线沿竖直方向向下",
    "hardness": "硬光：光锥边界清晰，锥外几乎全黑",
    "ratio": "主光 : 环境 ≈ 16:1",
    "colorTemp": "3000–4000K 暖白",
    "palette": [],
    "effect": "一道梯形光锥自画面顶部垂直落下，锥内主体被照亮并留下清晰投影，锥外亮度压到接近纯黑；常见于暗场舞台、训练或审讯式场面。",
    "useCases": [
"暗场人物",
"舞台式演示",
"训练 / 坚持主题",
"产品揭幕"
    ],
    "mistakes": [
"光锥边缘太硬会像贴图而不是光",
"锥外如果还有环境亮度会失去聚焦",
"锥体太宽会变成普通顶光"
    ],
    "prompt": "【光影】顶部聚光锥\n【说明】一道梯形光锥自画面顶部垂直落下，锥内主体被照亮并留下清晰投影，锥外亮度压到接近纯黑\n【适用】暗场人物、舞台式演示、训练 / 坚持主题、产品揭幕",
    "source": "local",
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-light-spot-cone",
    "sourceUrl": null,
    "sourceName": "本地沉淀（自产示意图）",
    "license": null,
    "refs": [
"光影参考图/光影示意_光影效果_vd-light-spot-cone_顶部聚光锥.png"
    ],
    "preview": null
  },
{
    "id": "vd-light-radial-glow",
    "name": "暗底径向光晕",
    "nameEn": "Dark Radial Glow",
    "category": "光影效果",
    "direction": "无方向性：光从画面中心的虚拟点向外扩散",
    "hardness": "柔光：中心亮、边缘快速衰减，没有明确光源方向",
    "ratio": "中心 : 边缘 ≈ 8:1",
    "colorTemp": "中性偏冷（约 5500K）",
    "palette": [],
    "effect": "深色底上以画面中心为原点叠一层径向辉光，越靠近中心越亮；常与粒子、连线、印章等自发光图形叠加，用来把视线压到中心。",
    "useCases": [
"数据可视化",
"章节卡",
"产品特写",
"抽象界面"
    ],
    "mistakes": [
"光晕半径过大会让整屏发灰",
"与高亮文字叠加会吃掉文字锐度",
"中心光源没有实体依据会显得假"
    ],
    "prompt": "【光影】暗底径向光晕\n【说明】深色底上以画面中心为原点叠一层径向辉光，越靠近中心越亮，中心与边缘亮度比约 8:1\n【适用】数据可视化、章节卡、产品特写、抽象界面",
    "source": "local",
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-light-radial-glow",
    "sourceUrl": null,
    "sourceName": "本地沉淀（自产示意图）",
    "license": null,
    "refs": [
"光影参考图/光影示意_光影效果_vd-light-radial-glow_暗底径向光晕.png"
    ],
    "preview": null
  },
{
    "id": "vd-light-self-emissive",
    "name": "暗底自发光线条",
    "nameEn": "Self-Emissive Line",
    "category": "光影效果",
    "direction": "无方向性：线本身即光源",
    "hardness": "硬芯加柔光晕：中心线细而实，外圈一层渐隐辉光",
    "ratio": "线芯 : 背景 ≈ 20:1",
    "colorTemp": "随线条颜色，通常为高饱和暖色或青蓝",
    "palette": [],
    "effect": "细线在深底上以自发光方式呈现：线芯保持锐利，外圈用渐变或高斯模糊叠出辉光，线交叉处辉光叠加更亮；常用来表示路径、信号或能量流。",
    "useCases": [
"路线图",
"信号 / 数据流",
"科幻界面",
"暗底地图"
    ],
    "mistakes": [
"辉光半径过大会让线条看起来发虚",
"多条线同时发光会互相干扰",
"背景不够黑时辉光几乎看不见"
    ],
    "prompt": "【光影】暗底自发光线条\n【说明】细线在深底上以自发光方式呈现，线芯锐利、外圈叠渐隐辉光，交叉处辉光叠加更亮\n【适用】路线图、信号 / 数据流、科幻界面、暗底地图",
    "source": "local",
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-light-self-emissive",
    "sourceUrl": null,
    "sourceName": "本地沉淀（自产示意图）",
    "license": null,
    "refs": [
"光影参考图/光影示意_光影效果_vd-light-self-emissive_暗底自发光线条.png"
    ],
    "preview": null
  },
{
    "id": "vd-light-rim-edge",
    "name": "边缘轮廓光",
    "nameEn": "Rim Edge Light",
    "category": "人物光位",
    "direction": "光源在主体正后方略偏侧，与相机几乎成 180 度",
    "hardness": "柔光：大面积柔光箱或反光板，边缘线条连续不断",
    "ratio": "轮廓光 : 主光 ≈ 1:1（此时主体面部几乎全暗，属剪影边缘光）",
    "colorTemp": "偏冷（约 6500K），与主光形成冷暖对比",
    "palette": [],
    "effect": "主体轮廓被身后的一盏灯勾出一条连续亮边，正面几乎不亮；在深色底上能把剪影从背景里切出来，是暗场人物最省事的光。",
    "useCases": [
"暗场人物",
"剪影",
"产品边缘",
"游戏角色立绘"
    ],
    "mistakes": [
"轮廓光过强会变成白边描边，失去体积感",
"光源太正会让边缘线断成两段",
"与主光色温差太小就看不出层次"
    ],
    "prompt": "【光影】边缘轮廓光\n【说明】主体轮廓被身后一盏灯勾出连续亮边，正面几乎不亮，在深底上把剪影从背景里切出来\n【适用】暗场人物、剪影、产品边缘、游戏角色立绘",
    "source": "local",
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-light-rim-edge",
    "sourceUrl": null,
    "sourceName": "本地沉淀（自产示意图）",
    "license": null,
    "refs": [
"光影参考图/光影示意_人物光位_vd-light-rim-edge_边缘轮廓光.png"
    ],
    "preview": null
  },
{
    "id": "vd-light-paper-diffuse",
    "name": "纸纹漫射平光",
    "nameEn": "Paper Diffuse",
    "category": "自然光与实用光源",
    "direction": "无方向性：均匀漫射，无投影方向",
    "hardness": "极柔：光比接近 1:1，阴影几乎不存在",
    "ratio": "约 1:1",
    "colorTemp": "中性偏暖（约 5000–5500K）",
    "palette": [],
    "effect": "整幅画面被均匀照亮，没有明确投影；纸面颗粒与印刷底纹成为唯一可读的细节，适合需要把注意力交给文字与图形的平面版面。",
    "useCases": [
"图文排版",
"清单 / 教程版面",
"信息图",
"产品说明页"
    ],
    "mistakes": [
"完全没有投影会让画面显得平、缺立体感",
"底色过灰会削弱文字对比",
"颗粒过密会让正文发脏"
    ],
    "prompt": "【光影】纸纹漫射平光\n【说明】整幅画面均匀照亮，无明确投影，纸面颗粒与印刷底纹成为唯一细节\n【适用】图文排版、清单 / 教程版面、信息图、产品说明页",
    "source": "local",
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-light-paper-diffuse",
    "sourceUrl": null,
    "sourceName": "本地沉淀（自产示意图）",
    "license": null,
    "refs": [
"光影参考图/光影示意_自然光与实用光源_vd-light-paper-diffuse_纸纹漫射平光.png"
    ],
    "preview": null
  }
];

