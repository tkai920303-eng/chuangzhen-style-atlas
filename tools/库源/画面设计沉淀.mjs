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
,
{
    "id": "vd-style-starfield-glyph",
    "name": "暗场粒子成字",
    "nameEn": "Starfield Particle Glyph",
    "category": "暗场粒子",
    "mechanism": "点云文字",
    "paletteFrom": "风格图鉴_画面设计沉淀_vd-style-starfield-glyph.jpg",
    "refs": [
        "风格图鉴_画面设计沉淀_vd-style-starfield-glyph.jpg"
    ],
    "visual": "深蓝黑纯色底上铺一层静止金白星点，中央一个由数千个亮点汇聚拼成的大号数字；笔画由点的疏密构成而非实心填充，字外围仍留有零散星尘。",
    "motion": "星点完全静止；数字由粒子汇聚而成——点先在画面里随机散布，再沿字形轮廓吸附到位；成型后整体带极轻的辉光呼吸；底部一条粒子拖尾细线缓慢生长。",
    "lighting": "无方向性自发光：光源就是粒子本身（点与线的 bloom），底色无高光无投影，光比只存在于「亮点」与「底」之间。",
    "texture": "颗粒感强，点径 2–3px 硬边无抗锯齿；底色干净无噪点，无材质纹理。",
    "use": "知识类 MG 的标题卡与数字强调；需要「一个大数字压住画面」又不想用实心字形时；也适合「积累 / 天数 / 次数」这类抽象量。",
    "migration": "用文字轮廓做遮罩、撒点吸附；点径 2–3px、密度按笔画宽度调，别用发光点代替实心字。",
    "limitations": "点数上千时渲染成本高，手机端建议降到 1200 点以内；字形笔画太细时点会漏到轮廓外。",
    "mix": "与暗底粒子、纯色卡片、细线图标共享同一套点云语言；不宜与实拍画面同屏。",
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-style-starfield-glyph"  }
,
{
    "id": "vd-style-athlete-hud",
    "name": "运动员数据 HUD",
    "nameEn": "Athlete Telemetry HUD",
    "category": "数据仪表",
    "mechanism": "实时数据面板",
    "paletteFrom": "风格图鉴_画面设计沉淀_vd-style-athlete-hud.jpg",
    "refs": [
        "风格图鉴_画面设计沉淀_vd-style-athlete-hud.jpg"
    ],
    "visual": "近黑底上四边被 HUD 面板压住：左上 LOCK 计数与 SPEED 速度，中上「目标·终点」剩余距离，右上终点直方图，左列「KILL 墨迹」百分比与空速/步速/圈速/自我怀疑四条，右下心率波形与 BPM；画面下半是一张 2D 透视网格地平面，网格上散着发光短条。",
    "motion": "HUD 数值随时间跳变、进度条与心电波形滚动；地平线短条随速度向后滑动；主体在网格上奔跑。",
    "lighting": "没有真实布光。光来自图形自发光：HUD 数字与描边、HUD 面板的细描边、网格短条都是纯色描边加 bloom；底色近纯黑。",
    "texture": "全矢量：数字、描边、波形折线、网格直线，无任何材质纹理与噪点。",
    "use": "把抽象的「努力 / 坚持 / 消耗」变成可计量的画面；适合励志、训练、比赛、进度类叙事。",
    "migration": "先搭 HUD 再搭场景：HUD 是骨架，画面是填充。四个数字（速度 / 心率 / 剩余距离 / 进度百分比）各自对应一个叙事变量。",
    "limitations": "面板信息量一大就抢戏；主叙事必须有一到两个数字是真的在动，否则像仪表盘演示。",
    "mix": "与霓虹描边、暗底网格、线框主体共享同一套冷色语言；不宜与暖色纸质版面同屏。",
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-style-athlete-hud"  }
,
{
    "id": "vd-style-neon-chain",
    "name": "四色霓虹锁链",
    "nameEn": "Four-Colour Neon Chains",
    "category": "暗场霓虹",
    "mechanism": "颜色语义编码",
    "paletteFrom": "风格图鉴_画面设计沉淀_vd-style-neon-chain.jpg",
    "refs": [
        "风格图鉴_画面设计沉淀_vd-style-neon-chain.jpg"
    ],
    "visual": "近黑底上横着四条由椭圆轮廓串成的锁链，每条一种颜色：青蓝、品红、橙红、紫；链节描边均匀、尺寸一致，沿地面延伸或缠在主体上。画面里另有白色描边的线框主体与若干紫白色霓虹短条。",
    "motion": "链节沿路径依次出现并沿路径延伸；主体在链之间穿行；短条随机漂移。",
    "lighting": "没有真实布光。全部是描边自发光——每条链一种色，靠同色 bloom 浮在暗底上；画面里没有阴影与物体间的光照关系。",
    "texture": "纯描边矢量：椭圆链节、折线主体、圆角短条，描边宽度均匀、无材质。",
    "use": "把「欲望 / 妥协 / 嘲笑 / 自我怀疑」这类抽象束缚画成看得见的物件；也适合任何「一条链＝一种压力」的叙事。",
    "migration": "先定颜色语义表（哪把链＝哪种阻力），再画链；链节尺寸与间距全片不变，观众靠颜色认得出来。",
    "limitations": "颜色一多会乱，控制在四种以内；链节过密会糊成一条实线，过疏会像弹簧。",
    "mix": "与运动员数据 HUD、暗底粒子共享同一套暗场霓虹语言；与纯色卡片版式不混。",
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-style-neon-chain"  }
,
{
    "id": "vd-style-ink-mist",
    "name": "墨绿雾原分层景",
    "nameEn": "Ink-Green Mist Layers",
    "category": "水墨雾气",
    "mechanism": "分层剪影",
    "paletteFrom": "风格图鉴_画面设计沉淀_vd-style-ink-mist.jpg",
    "refs": [
        "风格图鉴_画面设计沉淀_vd-style-ink-mist.jpg"
    ],
    "visual": "深墨绿柔边噪声雾作底，其上是三层暗色山峦剪影（越远越亮）；一条青绿细地平线横贯画面，线上等距排着一排细密灯火；下方是水面的模糊倒影；空中浮着青绿光点。",
    "motion": "雾层极缓慢流动；浮空光点向上漂移；地平线灯火轻微明灭；水面倒影随雾同步晃动。",
    "lighting": "没有真实布光。光来自图形自发光——地平线的青绿细线、灯火的暖金点、浮空光点的青绿；其余全部是暗部，靠明度分层而不是靠打光。",
    "texture": "雾是柔边噪声（分形噪声或高斯模糊的椭圆团），山峦是纯色多边形硬边；两者质感对比是这一套的核心。",
    "use": "东方意绪、禅意、孤独、迷途、启蒙类叙事；也适合当品牌片的底，把主体衬成「雾里唯一的光」。",
    "migration": "背景分三层画：底噪雾 → 远山 → 近山，靠透明度拉开；地平线与灯火是画面唯一的高频细节，务必程序生成而不是贴图。",
    "limitations": "雾层太多会糊成灰面；山峦层数少于三层就没有纵深；倒影不做模糊会露馅。",
    "mix": "与发光线稿角色、灯球点光共享同一套青绿 + 暖金双色；与高饱和霓虹、暖色纸质版面不混。",
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-style-ink-mist"  }
,
{
    "id": "vd-style-line-figure",
    "name": "发光线稿角色",
    "nameEn": "Glowing Line Figure",
    "category": "角色线稿",
    "mechanism": "矢量线稿 + 外发光",
    "paletteFrom": "风格图鉴_画面设计沉淀_vd-style-line-figure.jpg",
    "refs": [
        "风格图鉴_画面设计沉淀_vd-style-line-figure.jpg"
    ],
    "visual": "暗底上站着一个白色描边的线稿人物（宽檐帽、长须、宽袍），全部由细线勾成；头后一枚月牙光环，胸口一颗暖白光核，手里一根细杆，杆顶一颗带星芒的金色光球。",
    "motion": "角色整体轻微摆动，手臂与光杆分别动；光球的光晕缓慢呼吸；浮空光点向上漂。",
    "lighting": "没有真实布光。光全部来自图形自发光：线稿的白色描边本身带同色外发光，胸口与灯杆顶端是两个过曝光源。",
    "texture": "纯线条，无填充、无材质、无投影；所有体积感都靠「线在哪、线有多密」表达。",
    "use": "寓言、东方哲思、IP 吉祥物、人物品牌片；适合需要「人物很轻但很醒目」的叙事。",
    "migration": "角色只用描边不填充：先画外轮廓，再补衣褶与胡须的内部线，最后统一加同色外发光。",
    "limitations": "线条太细在手机上会断；描边亮度一高就容易和背景光点混；动作幅度大时线稿会露怯。",
    "mix": "与墨绿雾原、灯球点光是同一套；与实拍角色、3D 质感角色不混。",
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-style-line-figure"  }
,
{
    "id": "vd-style-woodblock-print",
    "name": "木刻版画套色",
    "nameEn": "Woodblock Print Color Separation",
    "category": "版画套色",
    "mechanism": "有限套色 + 硬边色块",
    "paletteFrom": "风格图鉴_画面设计沉淀_vd-style-woodblock-print.jpg",
    "refs": [
        "风格图鉴_画面设计沉淀_vd-style-woodblock-print.jpg"
    ],
    "visual": "像一块被印出来的木刻版画：画面由有限套色（白 + 群青系 4 阶 + 青绿 2 阶 + 柠檬黄 + 橙 3 阶 + 朱红 2 阶 + 草绿 3 阶 + 棕 2 阶 + 米白）拼成，色块之间是硬边、没有中间过渡；所有形体（房檐、灯笼、旗、披风）都被简化成几条轮廓色块；纸面保留颗粒与轻微套印错位。",
    "motion": "画面本身不动，动的是色块的更替：印刷机每落一次版就换一组色块（uBlocks 控制每个色块的印刷量），最后盖上一枚朱红印章收尾。",
    "lighting": "没有真实布光。光感来自套色本身的明度关系：受光面用亮黄/米白，背光面用群青与棕，明暗交界永远是硬边而不是渐变。",
    "texture": "纸纹颗粒 + 色块边缘的轻微套印错位与毛边；无渐变、无高光、无软阴影。",
    "use": "讲市集、旅行、节庆这类「热闹的日常」；也适合把 3D 渲染统一压成版画质感；品牌片片尾落款。",
    "migration": "先定一套 18 色的套色表（每色有明确用途：群青系走暗部、柠檬黄走光部、朱红只做点缀），再把所有材质映射到表内；色块之间允许硬边，但同一形体内部用同色阶的明暗两档。",
    "limitations": "套色数一多就失去版画味，控制在 8–18 色之间；渐变、高光、软阴影都会破坏质感，必须一并压掉。",
    "mix": "与纸纹底、印章落款共享同一套语言；与霓虹辉虹、写实材质、渐变 UI 不混。",
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-style-woodblock-print"  }
,
{
    "id": "vd-style-gouache-dawn",
    "name": "水粉夜景云海",
    "nameEn": "Gouache Night Cloud Sea",
    "category": "手绘水粉",
    "mechanism": "颜料笔触 + 分层大气",
    "paletteFrom": "风格图鉴_画面设计沉淀_vd-style-gouache-dawn.jpg",
    "refs": [
        "风格图鉴_画面设计沉淀_vd-style-gouache-dawn.jpg"
    ],
    "visual": "赛璐璐手绘背景：近黑蓝紫的夜空向地平线渐变成粉霞与乳白，翻涌的云海由无数团块堆叠成有体积的层；中景一座石头图书馆塔（铜绿穹顶、缠着常春藤与松树）立在崖上，前景是几丛被风压弯的芒草。整体像吉卜力的黎明远景。",
    "motion": "云海与芒草极缓慢地起伏，镜头几乎不动；变化集中在天光（夜蓝 → 粉 → 白）随时间推移。",
    "lighting": "典型赛璐璐背光：主体被背后的亮天空勾出一圈亮边，正面几乎全黑；天光是唯一光源，色温从地平线的暖粉过渡到高空的冷蓝。",
    "texture": "颜料笔触（可见的刷痕与颜料边缘）、纸面颗粒、轻微的套色晕开；云有团块状的手绘结构而不是体积渲染的均匀噪声。",
    "use": "黎明/黄昏的大远景、孤独的旅人、宏大但安静的开场；也给「用代码画手绘背景」提供可复制的路径。",
    "migration": "背景分层做（天光 / 远云 / 中景山体 / 前景草），每层单独一块画布再合成；主体用纯黑剪影 + 背光勾边，不要给正面任何细节。",
    "limitations": "云团的手绘结构很难程序生成——要么写专门的笔刷函数，要么接受噪声云；近景草木的笔触最费工。",
    "mix": "与深空星尘、纸本分层共享同一套低饱和冷调；与暖色木刻、霓虹高饱和不混。",
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-style-gouache-dawn"  }
,
{
    "id": "vd-style-box-anatomy",
    "name": "盒模型解剖色块",
    "nameEn": "Box Model Anatomy Blocks",
    "category": "技术图解",
    "mechanism": "四色层框 + 标签",
    "paletteFrom": "风格图鉴_画面设计沉淀_vd-style-box-anatomy.jpg",
    "refs": [
        "风格图鉴_画面设计沉淀_vd-style-box-anatomy.jpg"
    ],
    "visual": "把 CSS 的盒模型画成四个叠在一起的圆角框：margin（橙）、border（黄）、padding（绿）、content（蓝），每个框上直接印着自己的名字，框体在三维里互相穿插、带柔和落影；页面底色是极浅的灰绿。",
    "motion": "框体沿各自的轴缓慢错位与旋转，像一本被拆开的说明书；标签始终贴在框的左上角。",
    "lighting": "没有真实布光。体积感来自三档明度（框面本色 + 顶部高光带 + 柔和落影），落影一律偏冷。",
    "texture": "纯色圆角矩形 + 1px 描边，无材质无噪点；字是深墨色无衬线。",
    "use": "讲结构、讲层级、讲「这个东西是怎么搭的」；技术讲解、产品文档、网站自己的「解剖」章节。",
    "migration": "四种语义色固定绑定四层（橙=外扩、黄=描边、绿=内衬、蓝=内容），全站复用；标签用小号字直接印在框上，不要做引线。",
    "limitations": "四层叠在一起时最内层容易被挡住；标签压在框上会牺牲可读性，字号不能太小。",
    "mix": "与极简白底、纸纹底共享同一套克制配色；与暗场霓虹、木刻套色不混。",
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-style-box-anatomy"  }
,
{
    "id": "vd-style-boring-editor",
    "name": "编辑器拟真界面",
    "nameEn": "Editor-Spoof Interface",
    "category": "极简版式",
    "mechanism": "设计工具拟真",
    "paletteFrom": "风格图鉴_画面设计沉淀_vd-style-boring-editor.jpg",
    "refs": [
        "风格图鉴_画面设计沉淀_vd-style-boring-editor.jpg"
    ],
    "visual": "极简白底的一页演示：左上一个大标题、右侧一张折线图、页脚一条粗蓝条与页码；某一页的标题上会套着一个蓝色的选中框（八个圆形控制柄），像正在设计软件里被选中——故意「无聊」到像工作稿。",
    "motion": "条目逐条淡入（stagger），标题的选中框与控制柄在切换时出现又消失；图表是真实图表库画的。",
    "lighting": "纯平面 UI，无光影；层次只靠字号、字重与留白。",
    "texture": "无纹理：纯白底 + 深灰字 + 一条品牌蓝。",
    "use": "技术演讲、内部评审、反 AI 炫技的「朴素」表达；也适合作为「演示工具」的视觉基调。",
    "migration": "只留三档层级（标题/正文/注释）+ 一条强调色；把编辑器选中框当成一种「反高潮」的装饰，比加特效更有效。",
    "limitations": "没有图表与图形能力，纯文字页面容易显空；需要接一个真实图表库才有说服力。",
    "mix": "与盒模型解剖、纸本分层共享同一套极简语言；与手绘水粉、霓虹动效不混。",
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-style-boring-editor"  }
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
,
{
    "id": "vd-fx-particle-gather",
    "name": "粒子汇聚成字",
    "nameEn": "Particle Gather Into Glyph",
    "category": "点云文字",
    "pack": "local",
    "packName": "本地沉淀",
    "source": "local",
    "sourceUrl": null,
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-fx-particle-gather",
    "sourceDir": null,
    "license": null,
    "status": "自产沉淀，已出规格与白模版",
    "meaning": "散落的点汇聚成一个字，用一次「聚拢」把抽象概念（天数、次数、积累）变成可读的量。",
    "description": "点云先随机散布在画面下半，再逐点吸附到目标字形的轮廓上，全部到位后字形带轻微辉光呼吸。",
    "timing": "散布 0.00–0.45s；吸附 0.45–1.10s；到位后辉光呼吸 1.10s 起循环（周期 2.4s）",
    "easing": "吸附 easeOut(0.3)，每点带 0–0.35s 随机延迟；呼吸 easeInOut(0.5)",
    "amplitude": "吸附半径 0→6px；字号 96px；点径 2–3px；辉光强度 1.0→1.25",
    "spec": [
        "0.00s 点云随机散布在画面下半，点数 2400",
        "0.45s 起逐点开始吸附，每点延迟 0–0.35s",
        "1.10s 全部点到位，字形可读",
        "1.10s 起辉光按 2.4s 周期在 1.0–1.25 之间呼吸"
    ],
    "tags": [
        "粒子",
        "汇聚",
        "文字",
        "辉光",
        "数据强调"
    ],
    "prompt": "粒子汇聚成字：点云先随机散布在画面下半，0.45 秒起逐点吸附到目标字形轮廓（每点延迟 0–0.35 秒、easeOut 0.3），1.10 秒全部到位后字形带辉光按 2.4 秒周期轻微呼吸；点径 2–3 像素，纯黑底。",
    "code": {
        "firstLine": "// 授权：MIT（自产代码，随包分发）",
        "body": "const GLYPH_PTS = 2400;\nconst ADHERE = 0.65;\n\n// 用文字轮廓做遮罩，散点落在字形内\nconst mask = makeTextMask(text, size);\nconst pts = scatterInMask(mask, GLYPH_PTS);\n\nexport const ParticleGather = ({ text, size = 96 }) => {\n  const t = frame / fps;\n  return pts.map((p, i) => {\n    const delay = hash01(i) * 0.35;\n    const k = clamp((t - 0.45 - delay) / ADHERE);\n    const e = 1 - Math.pow(1 - k, 3);            // easeOut(0.3)\n    const x = lerp(p.sx, p.tx, e);\n    const y = lerp(p.sy, p.ty, e);\n    const breathe = 1 + 0.25 * (0.5 + 0.5 * Math.sin((t - 1.1) / 2.4 * Math.PI * 2));\n    return <circle cx={x} cy={y} r={1.6} fill='#F6ECC8' opacity={breathe} />;\n  });\n};"
    },
    "whitened": {
        "label": "白模版",
        "rules": "保留时序、缓动与幅度；材质改为中性灰白哑光；颜色、背景、阴影与文字全部替换为槽位。",
        "slots": [
            "目标文字轮廓",
            "哑光无反射",
            "{颜色}",
            "纯色背景",
            "极轻柔影",
            "占位文字"
        ],
        "spec": [
            "0.00s 点云随机散布，点数 2400",
            "0.45s 起逐点吸附，每点延迟 0–0.35s",
            "1.10s 全部到位，字形可读",
            "1.10s 起辉光按 2.4s 周期呼吸"
        ],
        "prompt": "白色哑光粒子汇聚成字：点云先随机散布在画面下半，0.45 秒起逐点吸附到目标字形轮廓（每点延迟 0–0.35 秒），1.10 秒全部到位后带轻微辉光呼吸；点径 2–3 像素，纯色背景，无投影。"
    },
    "refs": [
        "动效参考图/动效规格卡_vd-fx-particle-gather_粒子汇聚成字.png"
    ],
    "preview": null,
    "refKind": "规格卡",
    "local": false  }
,
{
    "id": "vd-fx-trail-grow",
    "name": "发光轨迹线生长",
    "nameEn": "Glowing Trail Growth",
    "category": "路径动效",
    "pack": "local",
    "packName": "本地沉淀",
    "source": "local",
    "sourceUrl": null,
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-fx-trail-grow",
    "sourceDir": null,
    "license": null,
    "status": "自产沉淀，已出规格与白模版",
    "meaning": "一条发光的线沿路径长出来，把「过程 / 轨迹 / 方向」画成可读的路径，也是全片最容易复用的母题之一。",
    "description": "贝塞尔路径按长度揭示，两层同路径描边叠出芯线与辉光；线首可选挂一个光球，线尾可选挂站点圆环。",
    "timing": "起笔 0.20s；生长 1.40s 到 100%；停留后 0.60s 淡出；整体不超过 2.4s",
    "easing": "生长 easeInOut(0.35)；淡出 easeIn(0.4)",
    "amplitude": "路径长 1600px；芯线 1px；外描边 6px + 高斯模糊 12px；辉光强度 1.0",
    "spec": [
        "0.00s 路径不可见（length=0）",
        "0.20s 起笔，光球挂在线首",
        "1.60s 生长到 100%，站点圆环依次点亮",
        "2.20s 起 0.60s 淡出"
    ],
    "tags": [
        "轨迹",
        "生长",
        "贝塞尔",
        "辉光",
        "母题"
    ],
    "prompt": "发光轨迹线生长：一条青蓝色贝塞尔路径自 0.20 秒起笔、1.40 秒内沿长度生长到 100%（easeInOut 0.35），线首挂一颗光球、线尾的站点圆环依次点亮；两层同路径描边（1px 芯线 + 6px 描边加 12px 高斯模糊）做出芯线与辉光；结束后 0.60 秒淡出。",
    "code": {
        "firstLine": "// 授权：MIT（自产代码，随包分发）",
        "body": "const TRAIL_LEN = 1600;\nconst GLOW_BLUR = 12;\n\nexport const TrailGrow = ({ path, duration = 1.4, head = true }) => {\n  const t = frame / fps - 0.2;\n  const k = clamp(t / duration);\n  const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;  // easeInOut(0.35)\n  const len = TRAIL_LEN * e;\n  const pt = path.pointAt(len / TRAIL_LEN);\n  return (\n    <g>\n      <path d={path.d} stroke={path.color} strokeWidth={6} opacity={0.55 * (1 - k)}\n            filter={`url(#blur${GLOW_BLUR})`} />\n      <path d={path.d} stroke={path.color} strokeWidth={1} strokeDasharray={len} strokeDashoffset={0} />\n      {head && t >= 0 ? <circle cx={pt.x} cy={pt.y} r={5} fill={path.color} /> : null}\n    </g>\n  );\n};"
    },
    "whitened": {
        "label": "白模版",
        "rules": "保留时序、缓动与幅度；材质改为中性灰白哑光；颜色、背景、阴影与文字全部替换为槽位。",
        "slots": [
            "贝塞尔路径",
            "哑光无反射",
            "{颜色}",
            "纯色背景",
            "极轻柔影",
            "占位文字"
        ],
        "spec": [
            "0.00s 路径不可见（length=0）",
            "0.20s 起笔，光球挂在线首",
            "1.60s 生长到 100%，站点圆环依次点亮",
            "2.20s 起 0.60s 淡出"
        ],
        "prompt": "白色哑光轨迹线生长：一条路径自 0.20 秒起笔、1.40 秒内沿长度生长到 100%，线首挂一颗圆点、线尾的站点圆环依次点亮；1px 芯线加 6px 柔和描边做出辉光；结束后 0.60 秒淡出；纯色背景，无投影。"
    },
    "refs": [
        "动效参考图/动效规格卡_vd-fx-trail-grow_发光轨迹线生长.png"
    ],
    "preview": null,
    "refKind": "规格卡",
    "local": false  }
,
{
    "id": "vd-fx-chain-link",
    "name": "锁链链节生长",
    "nameEn": "Chain Link Growth",
    "category": "路径动效",
    "pack": "local",
    "packName": "本地沉淀",
    "source": "local",
    "sourceUrl": null,
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-fx-chain-link",
    "sourceDir": null,
    "license": null,
    "status": "自产沉淀，已出规格与白模版",
    "meaning": "一节一节长出来的链子，把「束缚在收紧」演成看得见的动作，而不是一句旁白。",
    "description": "沿路径等距排布的椭圆链节依次出现并描边生长；链节沿路径轻微起伏，最后几节可以转向主体缠上去。",
    "timing": "每节出现间隔 0.08s；单节描边生长 0.30s；一条链 12 节约 1.26s；缠身段再加 0.40s 收束",
    "easing": "单节描边 easeOut(0.4)；收束 easeInOut(0.35)",
    "amplitude": "链节椭圆 26×13px；间距 52px；描边 3px；路径起伏 ±16px",
    "spec": [
        "0.00s 链路径已存在，链节不可见",
        "0.08s 起每 0.08 秒出现一节，描边 0.30 秒内长成",
        "约 1.26s 十二节全部到位",
        "1.66s 起最后几节转向主体并收束，缠在身上"
    ],
    "tags": [
        "锁链",
        "链节",
        "路径",
        "描边生长",
        "束缚"
    ],
    "prompt": "锁链链节生长：一条青蓝色锁链沿路径等距排布，每 0.08 秒出现一节椭圆链节、描边在 0.30 秒内 easeOut 长成（链节 26×13 像素、间距 52 像素），十二节约 1.26 秒全部到位；最后几节转向主体缠上去；纯黑底，带同色辉光。",
    "code": {
        "firstLine": "// 授权：MIT（自产代码，随包分发）",
        "body": "const LINK_GAP = 0.08;\nconst LINK_DRAW = 0.30;\nconst LINK_RX = 26;\nconst LINK_RY = 13;\n\nexport const ChainLink = ({ path, color = '#35E0F0', count = 12 }) => {\n  const t = frame / fps;\n  return Array.from({ length: count }, (_, i) => {\n    const born = i * LINK_GAP;\n    const k = clamp((t - born) / LINK_DRAW);\n    if (k <= 0) return null;\n    const e = 1 - Math.pow(1 - k, 4);          // easeOut(0.4)\n    const p = path.pointAt(i / (count - 1));\n    const a = p.angle + Math.PI / 2;\n    return (\n      <ellipse cx={p.x} cy={p.y} rx={LINK_RX * e} ry={LINK_RY * e}\n               stroke={color} strokeWidth={3} fill=\"none\"\n               transform={`rotate(${(a * 180) / Math.PI} ${p.x} ${p.y})`} />\n    );\n  });\n};"
    },
    "whitened": {
        "label": "白模版",
        "rules": "保留时序、缓动与幅度；材质改为中性灰白哑光；颜色、背景、阴影与文字全部替换为槽位。",
        "slots": [
            "贝塞尔路径",
            "哑光无反射",
            "{颜色}",
            "纯色背景",
            "极轻柔影",
            "占位文字"
        ],
        "spec": [
            "0.00s 链路径已存在，链节不可见",
            "0.08s 起每 0.08 秒出现一节，描边 0.30 秒内长成",
            "约 1.26s 十二节全部到位",
            "1.66s 起最后几节转向主体并收束"
        ],
        "prompt": "白色哑光锁链生长：一条链沿路径等距排布，每 0.08 秒出现一节椭圆链节、描边在 0.30 秒内长成（链节 26×13 像素、间距 52 像素），十二节约 1.26 秒全部到位，最后几节转向主体缠上去；纯色背景，无投影。"
    },
    "refs": [
        "动效参考图/动效规格卡_vd-fx-chain-link_锁链链节生长.png"
    ],
    "preview": null,
    "refKind": "规格卡",
    "local": false  }
,
{
    "id": "vd-fx-dissolve-act",
    "name": "柔边溶解分幕",
    "nameEn": "Soft Dissolve Act Break",
    "category": "转场",
    "pack": "local",
    "packName": "本地沉淀",
    "source": "local",
    "sourceUrl": null,
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-fx-dissolve-act",
    "sourceDir": null,
    "license": null,
    "status": "自产沉淀，已出规格与白模版",
    "meaning": "不用硬切也能分幕：两幕同时在场，旧幕淡出、新幕淡入，信息靠字幕与徽章推进而不是靠剪辑。",
    "description": "两个幕的图层在 1.2 秒里交叉溶解，相机与构图保持不变；段落的区分交给右上角的徽章与字幕。",
    "timing": "溶解 1.20s；段内其余元素不动；可连做多次",
    "easing": "交叉溶解用 smoothstep(0.35)，两幕的 alpha 互补",
    "amplitude": "溶解时长 1.20s；不透明度 1→0 与 0→1；无位移无缩放",
    "spec": [
        "0.00s 第一幕 alpha=1，第二幕 alpha=0",
        "0.60s 两幕 alpha 各 0.5，相机不动",
        "1.20s 第一幕 alpha=0，第二幕 alpha=1",
        "全程零位移零缩放，只有不透明度在变"
    ],
    "tags": [
        "溶解",
        "分幕",
        "零位移",
        "字幕推进",
        "徽章"
    ],
    "prompt": "柔边溶解分幕：两幕画面同时在场交叉溶解 1.20 秒（旧幕不透明度 1→0、新幕 0→1，smoothstep 0.35），相机与构图完全不动、无位移无缩放；段落区分交给右上角徽章与字幕。",
    "code": {
        "firstLine": "// 授权：MIT（自产代码，随包分发）",
        "body": "const DISSOLVE = 1.20;\n\nconst smooth = (k) => k * k * (3 - 2 * k);\n\nexport const DissolveAct = ({ actA, actB, at = 0 }) => {\n  const t = (frame / fps - at) / DISSOLVE;\n  const k = smooth(clamp(t));\n  return (\n    <g>\n      <g opacity={1 - k}>{actA}</g>\n      <g opacity={k}>{actB}</g>\n    </g>\n  );\n};"
    },
    "whitened": {
        "label": "白模版",
        "rules": "保留时序、缓动与幅度；材质改为中性灰白哑光；颜色、背景、阴影与文字全部替换为槽位。",
        "slots": [
            "第一幕图层",
            "哑光无反射",
            "{颜色}",
            "纯色背景",
            "极轻柔影",
            "占位文字"
        ],
        "spec": [
            "0.00s 第一幕 alpha=1，第二幕 alpha=0",
            "0.60s 两幕 alpha 各 0.5，相机不动",
            "1.20s 第一幕 alpha=0，第二幕 alpha=1",
            "全程零位移零缩放"
        ],
        "prompt": "白色哑光柔边溶解分幕：两幕同时在场交叉溶解 1.20 秒（旧幕不透明度 1→0、新幕 0→1，smoothstep 0.35），相机与构图完全不动、无位移无缩放；纯色背景，无投影。"
    },
    "refs": [
        "动效参考图/动效规格卡_vd-fx-dissolve-act_柔边溶解分幕.png"
    ],
    "preview": null,
    "refKind": "规格卡",
    "local": false  }
,
{
    "id": "vd-fx-score-driven",
    "name": "乐谱驱动画面",
    "nameEn": "Score-Driven Picture",
    "category": "音画同步",
    "pack": "local",
    "packName": "本地沉淀",
    "source": "local",
    "sourceUrl": null,
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-fx-score-driven",
    "sourceDir": null,
    "license": null,
    "status": "自产沉淀，已出规格与白模版",
    "meaning": "一份音符列表同时喂给合成器和画面：声音不是配乐、画面不是动画，而是同一份数据的两种呈现。",
    "description": "每个乐器对应一件画面元素：古筝音高＝纸灯笼的明暗与高度，长笛旋律＝杯口蒸汽带的起伏与宽度，音符＝柠檬的每一次接触，鼓＝地砖的下沉，铃＝水面涟漪，垫底和弦＝热气球 burner 的喷火。",
    "timing": "100 BPM / 34 小节；一个音＝一个画面事件；每小节 8 盏纸灯笼（一音一盏）；长笛句长＝蒸汽带的长度",
    "easing": "画面事件用音符的包络驱动（起音快、衰减慢）；灯笼的亮灭用音量而非线性插值",
    "amplitude": "灯笼亮度 0.3→1.0；蒸汽带高度 0→18px、宽度随呼吸；柠檬下落 1.0s/次；水面涟漪半径 0→140px",
    "spec": [
        "0.00s 乐谱开始，纸灯笼按音高依次点亮（每小节 8 盏）",
        "长笛进句时，杯口蒸汽带随旋律起伏——高度是音高，宽度是气息",
        "马林巴段落（12–17 小节）：一颗柠檬自由落体，撞到器皿就是谱上的一个音",
        "鼓点落在铺路石与摄影师的手上；铃声落在水面涟漪与星星上",
        "每次切镜都落在和弦上；镜头结束时乐句收束"
    ],
    "tags": [
        "乐谱驱动",
        "音画同步",
        "一数一图",
        "合成器",
        "事件映射"
    ],
    "prompt": "乐谱驱动画面：一份音符列表同时驱动合成器与画面；古筝音高对应纸灯笼的明暗与高度（每小节八盏，一音一盏），长笛旋律对应杯口蒸汽带的起伏（高度是音高、宽度是气息），马林巴段落让柠檬自由落体且每次撞到器皿就是谱上的一个音，鼓点落在铺路石上，铃声落在水面涟漪上；画面事件用音符包络驱动，起音快、衰减慢。",
    "code": {
        "firstLine": "// 授权：MIT（自产代码，随包分发）",
        "body": "const BPM = 100;\nconst SPB = 60 / BPM;              // 每拍秒数\n\n// 乐谱是唯一事实来源：画面元素都向它查询\nconst score = [\n  { t: 0, dur: 0.5, inst: 'koto', pitch: 62 },\n  { t: 0.5, dur: 0.5, inst: 'koto', pitch: 65 },\n  // ... 共 34 小节\n];\n\nexport const ScoreDriven = () => {\n  const now = clock.getTime();\n  const notes = score.filter((n) => now >= n.t && now < n.t + n.dur);\n  return notes.map((n, i) => {\n    switch (n.inst) {\n      case 'koto': {              // 纸灯笼：音高定高度，音量定亮度\n        const env = envelope(now - n.t, n.dur);\n        return <Lantern key={i} y={lanternRow(n.pitch)} glow={env} />;\n      }\n      case 'flute': {             // 蒸汽带：高度是音高，宽度是气息\n        const env = envelope(now - n.t, n.dur);\n        return <SteamRibbon key={i} height={n.pitch - 55} width={4 + env * 6} />;\n      }\n      case 'marimba':             // 柠檬：每次接触器皿就是一个音\n        return <Lemon key={i} falling={now - n.t} />;\n      default:\n        return null;\n    }\n  });\n};"
    },
    "whitened": {
        "label": "白模版",
        "rules": "保留时序、缓动与幅度；材质改为中性灰白哑光；颜色、背景、阴影与文字全部替换为槽位。",
        "slots": [
            "发光灯笼",
            "哑光无反射",
            "{颜色}",
            "纯色背景",
            "极轻柔影",
            "占位文字"
        ],
        "spec": [
            "0.00s 乐谱开始，纸灯笼按音高依次点亮（每小节八盏）",
            "长笛进句时，杯口蒸汽带随旋律起伏",
            "马林巴段落：柠檬自由落体，每次撞到器皿就是一个音",
            "鼓点落在铺路石上；铃声落在水面涟漪上"
        ],
        "prompt": "白色哑光乐谱驱动画面：一份音符列表同时驱动画面；古筝音高对应纸灯笼的明暗与高度（每小节八盏，一音一盏），长笛旋律对应杯口蒸汽带的起伏（高度是音高、宽度是气息），马林巴段落让柠檬自由落体且每次撞到器皿就是谱上的一个音，鼓点落在铺路石上，铃声落在水面涟漪上；纯色背景，无投影。"
    },
    "refs": [
        "动效参考图/动效规格卡_vd-fx-score-driven_乐谱驱动画面.png"
    ],
    "preview": null,
    "refKind": "规格卡",
    "local": false  }
,
{
    "id": "vd-fx-paper-break-open",
    "name": "纸面破开进三维",
    "nameEn": "Paper Break-Open",
    "category": "转场",
    "pack": "local",
    "packName": "本地沉淀",
    "source": "local",
    "sourceUrl": null,
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-fx-paper-break-open",
    "sourceDir": null,
    "license": null,
    "status": "自产沉淀，已出规格与白模版",
    "meaning": "用一次「平面印刷品裂开」把观众从纸上带进三维世界——比任何转场都更有实感，因为破的是一张真实的纸。",
    "description": "开场是一张平铺的木刻版画纸，四个节拍每落一次版就多印一色；第 4.8 秒太阳亮起；随后纸面沿着折痕破开，碎片向两侧卷起，露出背后的三维市场。",
    "timing": "木刻落版 4 拍（每拍 0.5s）→ 太阳点亮 4.8s → 纸面破裂 5.2–7.0s → 三维世界进入 7.0s",
    "easing": "落版用硬切（每拍一次）；太阳点亮 0.6s easeOut；破裂用刚体模拟，无缓动",
    "amplitude": "四色版位（uBlocks 0→1 逐个）；破裂碎片 24–40 片，初速 1.5–4m/s",
    "spec": [
        "0.00s 纸面全白，只剩木刻轮廓",
        "0.5/1.0/1.5/2.0s 每拍落一版版（蓝、红、黄绿），四版齐",
        "4.80s 太阳点亮，画面第一次出现暖光",
        "5.20s 纸面沿折痕裂开，碎片向两侧卷起",
        "7.00s 碎片落尽，三维市场完全进入"
    ],
    "tags": [
        "转场",
        "落版",
        "破裂",
        "纸片",
        "平面进三维"
    ],
    "prompt": "纸面破开进三维转场：开场是一张平铺的木刻版画纸，四个节拍每 0.5 秒落一版版（蓝、红、黄绿依次叠印），第 4.8 秒太阳点亮并第一次出现暖光，第 5.2 秒纸面沿折痕裂开、24 到 40 片碎片以 1.5 到 4 米每秒向两侧卷起，第 7 秒碎片落尽、露出背后的三维市场。",
    "code": {
        "firstLine": "// 授权：MIT（自产代码，随包分发）",
        "body": "const PLATES = ['blue', 'red', 'yellowGreen'];   // 每拍落一版\nconst SUN_AT = 4.8;\nconst BREAK_AT = 5.2;\n\nexport const PaperBreakOpen = ({ video }) => {\n  const t = clock.getTime();\n  const plates = PLATES.map((k, i) =>\n    t >= i * 0.5 ? { plate: k, amount: 1 } : null\n  ).filter(Boolean);\n  const sun = t >= SUN_AT ? clamp((t - SUN_AT) / 0.6) : 0;      // 太阳 0.6s easeOut\n  const broken = t >= BREAK_AT;\n  return (\n    <group>\n      {broken ? <PaperShards seed={7} /> : <PaperSheet plates={plates} />}\n      <Sun amount={sun} />\n    </group>\n  );\n};"
    },
    "whitened": {
        "label": "白模版",
        "rules": "保留时序、缓动与幅度；材质改为中性灰白哑光；颜色、背景、阴影与文字全部替换为槽位。",
        "slots": [
            "平面纸面",
            "哑光无反射",
            "{颜色}",
            "纯色背景",
            "极轻柔影",
            "占位文字"
        ],
        "spec": [
            "0.00s 纸面全白，只剩木刻轮廓",
            "0.5/1.0/1.5/2.0s 每拍落一版版",
            "4.80s 太阳点亮",
            "5.20s 纸面沿折痕裂开，碎片向两侧卷起",
            "7.00s 碎片落尽，三维世界完全进入"
        ],
        "prompt": "白色哑光纸面破开进三维转场：开场是一张平铺的纸，四个节拍每 0.5 秒落一版版，第 4.8 秒一盏灯点亮，第 5.2 秒纸面沿折痕裂开、碎片向两侧卷起，第 7 秒碎片落尽、露出背后的场景；纯色背景，无投影。"
    },
    "refs": [
        "动效参考图/动效规格卡_vd-fx-paper-break-open_纸面破开进三维.png"
    ],
    "preview": null,
    "refKind": "规格卡",
    "local": false  }
,
{
    "id": "vd-fx-brush-selfdraw",
    "name": "笔触自绘",
    "nameEn": "Self-Drawing Brush Stroke",
    "category": "书写动效",
    "pack": "local",
    "packName": "本地沉淀",
    "source": "local",
    "sourceUrl": null,
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-fx-brush-selfdraw",
    "sourceDir": null,
    "license": null,
    "status": "自产沉淀，已出规格与白模版",
    "meaning": "让笔画自己长出来：不是把一段动画贴上去，而是让一条真实绘制的笔触按长度逐步显形。",
    "description": "笔刷在加速光栅（numba）里逐笔画出，带鬃毛分叉与压力变化；标题字与印章用同一套笔刷逻辑自绘，落笔时能看到笔锋起收。",
    "timing": "单笔 0.6–1.2s（按笔画长度）；字与印 1.4s；笔画之间错开 0.15s",
    "easing": "按弧长均匀揭示（不是时间均匀），所以转弯处笔画会显得慢——这是手写的节奏",
    "amplitude": "线宽随压力 1–6px；笔锋分叉 3–7 根；墨色 #1B2430，边缘轻微洇开",
    "spec": [
        "0.00s 笔尖落在起笔点，纸面空白",
        "0.10–1.20s 笔画沿弧长逐段长出，带鬃毛分叉",
        "1.20s 收笔，末端带一个墨点",
        "1.40s 起落印章，朱红半透明"
    ],
    "tags": [
        "笔触",
        "自绘",
        "鬃毛",
        "墨线",
        "书写"
    ],
    "prompt": "笔触自绘：一条带鬃毛分叉的手写笔画按弧长均匀长出（0.10 到 1.20 秒），线宽随压力在 1 到 6 像素之间变化，笔尖起收自然、末端留一个墨点；随后用同一套笔刷落下一枚朱红半透明印章；纸面为暖白底，无投影。",
    "code": {
        "firstLine": "// 授权：MIT（自产代码，随包分发）",
        "body": "const BRUSH_SPLITS = 5;          // 鬃毛分叉数\n\n// 按弧长揭示：转弯处自然变慢，像手写\nexport const SelfDraw = ({ stroke, duration = 1.2, ink = '#1B2430' }) => {\n  const t = clock.getTime() / duration;\n  const len = stroke.length * Math.min(1, t);\n  const hairs = Array.from({ length: BRUSH_SPLITS }, (_, h) =>\n    stroke.sample(h / BRUSH_SPLITS, len)\n  );\n  const w = 1 + 5 * pressure(stroke, len);          // 压力决定线宽\n  return (\n    <g stroke={ink} fill=\"none\" strokeLinecap=\"round\">\n      {hairs.map((h, i) => (\n        <path key={i} d={h.d} strokeWidth={w * (1 - i * 0.12)} />\n      ))}\n    </g>\n  );\n};"
    },
    "whitened": {
        "label": "白模版",
        "rules": "保留时序、缓动与幅度；材质改为中性灰白哑光；颜色、背景、阴影与文字全部替换为槽位。",
        "slots": [
            "手写笔画",
            "哑光无反射",
            "{颜色}",
            "纯色背景",
            "极轻柔影",
            "占位文字"
        ],
        "spec": [
            "0.00s 笔尖落在起笔点，纸面空白",
            "0.10–1.20s 笔画沿弧长逐段长出，带鬃毛分叉",
            "1.20s 收笔，末端带一个墨点",
            "1.40s 起落印章"
        ],
        "prompt": "白色哑光笔触自绘：一条带鬃毛分叉的手写笔画按弧长均匀长出（0.10 到 1.20 秒），线宽随压力在 1 到 6 像素之间变化，笔尖起收自然、末端留一个墨点；随后落下一枚半透明印章；暖白纸底，无投影。"
    },
    "refs": [
        "动效参考图/动效规格卡_vd-fx-brush-selfdraw_笔触自绘.png"
    ],
    "preview": null,
    "refKind": "规格卡",
    "local": false  }
,
{
    "id": "vd-fx-font-stretch",
    "name": "可变字宽拉伸",
    "nameEn": "Variable Font Width Stretch",
    "category": "排版动效",
    "pack": "local",
    "packName": "本地沉淀",
    "source": "local",
    "sourceUrl": null,
    "sourcePath": "04_工具\\库源\\画面设计沉淀.mjs#vd-fx-font-stretch",
    "sourceDir": null,
    "license": null,
    "status": "自产沉淀，已出规格与白模版",
    "meaning": "用可变字体的字宽轴做「呼吸」与「强调」，比缩放更干净：字形不变形，只是变胖变瘦。",
    "description": "标题逐行把 font-variation-settings 的 wdth 从 50% 推到 150%，用 clip-path 遮罩逐字显现；滚动时同一手法用来做段落展开。",
    "timing": "单行 0.7s；多行错开 0.08s；滚动触发的段落展开 0.6s",
    "easing": "easeOut(0.35)；wdh 与 opacity 同步，遮罩在最后 0.15s 收齐",
    "amplitude": "wdth 50%↔150%（100 个字重宽度单位）；位移 0；缩放 1.0",
    "spec": [
        "0.00s 标题行 wdth=50%，被 clip-path 遮住看不见",
        "0.20s 起 wdth 推到 150%，同时 clip-path 从左向右展开",
        "0.70s 该行到位，下一行以 0.08s 错开跟上",
        "滚动进入视口时，同一手法用来展开折叠段落（grid-template-rows: 0fr → 1fr）"
    ],
    "tags": [
        "可变字体",
        "字宽",
        "遮罩",
        "逐字显现",
        "滚动动画"
    ],
    "prompt": "可变字宽拉伸：标题逐行把可变字体的 wdth 从 50% 推到 150%，同时用 clip-path 遮罩从左向右展开（单行 0.70 秒、easeOut 0.35、多行错开 0.08 秒）；字形不变形只是变胖变瘦；滚动进入视口时用同一手法展开折叠段落。",
    "code": {
        "firstLine": "// 授权：MIT（自产代码，随包分发）",
        "body": "const WDTH = { from: 50, to: 150 };\nconst EASE = (k) => 1 - Math.pow(1 - k, 3);   // easeOut(0.35)\n\nexport const FontStretch = ({ lines, delay = 0.08 }) => {\n  const t = frame / fps;\n  return lines.map((text, i) => {\n    const local = clamp((t - i * delay) / 0.7);\n    const e = EASE(local);\n    const wdth = WDTH.from + (WDTH.to - WDTH.from) * e;\n    return (\n      <span key={i}\n            style={{\n              fontVariationSettings: `\"wdth\" ${wdth}, \"wght\" 800`,\n              clipPath: `inset(0 ${100 - e * 100}% 0 0)`,\n              display: 'inline-block',\n            }}>\n        {text}\n      </span>\n    );\n  });\n};"
    },
    "whitened": {
        "label": "白模版",
        "rules": "保留时序、缓动与幅度；材质改为中性灰白哑光；颜色、背景、阴影与文字全部替换为槽位。",
        "slots": [
            "标题文字",
            "哑光无反射",
            "{颜色}",
            "纯色背景",
            "极轻柔影",
            "占位文字"
        ],
        "spec": [
            "0.00s 标题行 wdth=50%，被遮罩挡住",
            "0.20s 起 wdth 推到 150%，遮罩同时展开",
            "0.70s 该行到位，下一行以 0.08s 错开跟上",
            "滚动进入视口时同一手法展开折叠段落"
        ],
        "prompt": "白色哑光可变字宽拉伸：标题逐行把可变字体的 wdth 从 50% 推到 150%，同时用遮罩从左向右展开（单行 0.70 秒、easeOut 0.35、多行错开 0.08 秒）；字形不变形只是变胖变瘦；纯色背景，无投影。"
    },
    "refs": [
        "动效参考图/动效规格卡_vd-fx-font-stretch_可变字宽拉伸.png"
    ],
    "preview": null,
    "refKind": "规格卡",
    "local": false  }
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
,
{
    "id": "vd-light-bloom-pipeline",
    "name": "暗底辉光管线",
    "nameEn": "Dark-Back Bloom Pipeline",
    "category": "光影效果",
    "direction": "无方向：光源就是画面里的元素本身（点、线、字），不是打上去的光",
    "hardness": "硬芯 + 柔光晕：元素本体是硬的，晕是外发光自然扩散出来的",
    "ratio": "芯 : 晕 ≈ 4:1（晕不是独立一层，是 bloom 的溢出）",
    "colorTemp": "随元素本色：青蓝、品红、橙红、金各随语义走",
    "palette": [],
    "effect": "把发光做成一条管线而不是一层：先画硬芯，再叠一层同色加宽描边，最后高斯模糊一次得到外晕。元素颜色一换，整条管线跟着换，所以同一条线稿可以承载完全不同的情绪。",
    "useCases": [
        "暗底粒子字",
        "霓虹描边图形",
        "轨迹线与光球",
        "线稿角色"
    ],
    "mistakes": [
        "外发光层数太多会糊成一团白，晕的直径控制在芯的 6–10 倍",
        "辉光强度跟着底色走：底越亮辉光越难看见",
        "同一个画面里辉光颜色超过三种就会失去「谁在发光」的指向"
    ],
    "prompt": "暗底辉光管线：元素本体是硬芯，先画实心/描边本体，再叠一层同色加宽描边，最后高斯模糊一次得到外晕；芯与晕的亮度比约 4:1；辉光颜色随元素语义走（青蓝 / 品红 / 橙红 / 金）；纯黑底。",
    "source": "local",
    "sourceUrl": null,
    "sourceName": "本地沉淀（自产示意图）",
    "license": null,
    "refs": [
        "光影参考图/光影示意_光影效果_vd-light-bloom-pipeline_暗底辉光管线.png"
    ],
    "preview": null  }
,
{
    "id": "vd-light-rim-neon",
    "name": "霓虹轮廓光",
    "nameEn": "Neon Rim Light",
    "category": "光影效果",
    "direction": "沿图形轮廓：光只出现在描边上，图形内部几乎不亮",
    "hardness": "柔光：轮廓线本身均匀，外侧一层均匀的辉光衰减",
    "ratio": "轮廓 : 内部 ≈ 8:1（内部可以是纯黑，靠轮廓把形体「读」出来）",
    "colorTemp": "青绿 / 品红 / 紫，随语义色变化；同一画面里不超过两种轮廓色",
    "palette": [],
    "effect": "形体不靠填充色交代，只靠一圈发亮的轮廓线交代。内部留黑，轮廓外扩一层辉光，于是主体像被通电的线框浮在暗底上——也是「线稿角色」成立的前提。",
    "useCases": [
        "线稿角色与吉祥物",
        "霓虹图形与锁链",
        "暗底 UI 控件",
        "半透明叠加元素"
    ],
    "mistakes": [
        "内部一填色就失去「线框」感，轮廓光的价值全在留黑",
        "描边粗细不统一会看着像描图不像发光",
        "轮廓色与背景色太近会看不见（青绿配墨绿就出事）"
    ],
    "prompt": "霓虹轮廓光：形体只用一圈描边交代，内部保持纯黑，描边外扩一层同色柔和辉光（轮廓与内部的亮度比约 8:1）；描边颜色全画面不超过两种；纯黑底，无投影、无填充色。",
    "source": "local",
    "sourceUrl": null,
    "sourceName": "本地沉淀（自产示意图）",
    "license": null,
    "refs": [
        "光影参考图/光影示意_光影效果_vd-light-rim-neon_霓虹轮廓光.png"
    ],
    "preview": null  }
,
{
    "id": "vd-light-lamp-orb",
    "name": "灯球点光",
    "nameEn": "Lamp Orb Point Light",
    "category": "自然光与实用光源",
    "direction": "灯杆顶端的一点：光源是一个具体可见的实物（灯），不是一个无形的方向",
    "hardness": "硬光：点光源加多向星芒，边缘清晰；地面上有一小片明确的光斑",
    "ratio": "光球 : 地面 ≈ 6:1（其余环境几乎全黑，靠这一盏灯撑起画面）",
    "colorTemp": "暖金 3000K，与底部的青绿冷调形成冷暖对撞",
    "palette": [],
    "effect": "把「光源」做成画面里的一个道具：一个人举着一盏灯，光就是他手里那颗球。它同时是光源、是道具、还是象征——三种身份叠在一个图形上，所以观众不需要字幕就懂「他在给别人照路」。",
    "useCases": [
        "提灯 / 举火把的人物",
        "寓言与哲思叙事",
        "品牌片的光源落款",
        "暗场唯一的亮源"
    ],
    "mistakes": [
        "星芒射线太长会变成装饰，先定光球直径再定芒长",
        "光斑要跟着灯杆位置走，固定在画面某处会露馅",
        "光源只有一个时，地面其余部分必须真的压黑，不能靠整体提亮"
    ],
    "prompt": "灯球点光：一颗暖金色光球（3000K）位于灯杆顶端，带 8 方向星芒；光球是画面唯一光源，地面只有一小片对应光斑，其余压到近黑；光球与冷调底色形成冷暖对撞；纯黑背景，无环境光。",
    "source": "local",
    "sourceUrl": null,
    "sourceName": "本地沉淀（自产示意图）",
    "license": null,
    "refs": [
        "光影参考图/光影示意_自然光与实用光源_vd-light-lamp-orb_灯球点光.png"
    ],
    "preview": null  }
,
{
    "id": "vd-light-lantern-field",
    "name": "灯笼光场",
    "nameEn": "Lantern Light Field",
    "category": "自然光与实用光源",
    "direction": "多点实用光源：几百盏纸灯笼与天灯各自是一个光源，没有主光",
    "hardness": "软光：纸罩把点光源摊开，边缘不锐；远处的灯笼靠自发光而不是照明",
    "ratio": "亮处（灯本身） : 街面 ≈ 30:1，街面靠大量灯叠加才勉强抬起来",
    "colorTemp": "灯罩内 2200–2600K 暖橙；天灯更冷（因为隔着雾与纸）",
    "palette": [],
    "effect": "夜里一条街被几百盏灯照亮：不是一盏主光打亮全场，而是每个光源各自照一小圈，圈与圈之间留黑，靠数量把整体亮度顶上去。天空因此可以整片压黑，只留灯的形状与暖色。",
    "useCases": [
        "夜市 / 祭典 / 灯会",
        "结尾的万家灯火",
        "任何需要「人多、热闹」的夜景"
    ],
    "mistakes": [
        "光源数量一多性能先崩——先用发光贴图假装照明，只给近处几盏真光源",
        "所有灯用同一种亮度会像贴图，亮度要按到光源的距离分层",
        "街面没有环境反弹会显得贴地，补一层很弱的暖色环境光"
    ],
    "prompt": "灯笼光场：夜里一条街被几百盏纸灯笼与天灯照亮，每个灯是一个独立的暖橙实用光源（2200 到 2600K），各自照亮一小圈地面，圈与圈之间留黑；靠光源数量而非主光把整体亮度顶上去，天空整片压黑；地面有很弱的暖色环境反弹。",
    "source": "local",
    "sourceUrl": null,
    "sourceName": "本地沉淀（自产示意图）",
    "license": null,
    "refs": [
        "光影参考图/光影示意_自然光与实用光源_vd-light-lantern-field_灯笼光场.png"
    ],
    "preview": null  }
,
{
    "id": "vd-light-sun-shaft",
    "name": "后期体积光束",
    "nameEn": "Post-Processed Sun Shaft",
    "category": "光影效果",
    "direction": "沿光源方向：从画面高处的光源斜切下来，方向感靠光束的平行条纹给出",
    "hardness": "软光：光束边缘被噪声打散，没有清晰的边界线",
    "ratio": "光束 : 环境 ≈ 4:1（靠后期叠加，不是真实散射）",
    "colorTemp": "跟随场景主光（这里取 3200–4200K 的暖白）",
    "palette": [],
    "effect": "体积光做成后期的一层：先从深度缓冲里取到遮挡关系，再沿光源方向做一次带噪声的射线积分，最后与原图叠加。好处是零几何成本，且强度可以单独调；代价是它不参与阴影计算。",
    "useCases": [
        "晨光穿过窗棂",
        "树冠缝隙的光柱",
        "灯笼与烛火周围的光雾"
    ],
    "mistakes": [
        "不做深度缓冲就会穿墙——光束必须被前景遮挡裁断",
        "光束不能太干净，要有随时间流动的噪声，否则像一张静态贴图",
        "与 bloom 同时开容易糊成一团白，先定好谁占主导"
    ],
    "prompt": "后期体积光束：从深度缓冲取遮挡关系，沿光源方向做带噪声的射线积分得到光柱，叠加在画面上（强度约为环境的四倍，暖白 3200 到 4200K）；光柱边缘被噪声打散没有硬边，随时间缓慢流动；前景必须能遮挡光柱。",
    "source": "local",
    "sourceUrl": null,
    "sourceName": "本地沉淀（自产示意图）",
    "license": null,
    "refs": [
        "光影参考图/光影示意_光影效果_vd-light-sun-shaft_后期体积光束.png"
    ],
    "preview": null  }
,
{
    "id": "vd-light-dawn-gradation",
    "name": "黎明色温渐变",
    "nameEn": "Dawn Color-Temperature Gradation",
    "category": "人物光位",
    "direction": "全画面渐变光：光源在画面外的地平线，方向由色带位置暗示而非由投影给出",
    "hardness": "无光源实体，是天光本身；地平线附近最亮，向上迅速转冷",
    "ratio": "地平线 : 高空 ≈ 8:1（这是明度比，不是照度比）",
    "colorTemp": "地平线 2000–2500K（粉霞）→ 中空 4500K → 高空 9000K（深蓝紫）",
    "palette": [],
    "effect": "黎明的光不来自一个点，而来自一条带：天光沿垂直方向做色温渐变，暖粉只贴在地平线一线，往上经乳白迅速转成冷蓝紫。主体在这个光里几乎全黑，只被亮天空勾出一圈边——赛璐璐夜景最省力也最像画的一条光。",
    "useCases": [
        "黎明/黄昏的开场大远景",
        "剪影人物",
        "梦境与回忆段"
    ],
    "mistakes": [
        "渐变带太宽会失去日出的方向感，暖色只留地平线上下各一成",
        "主体正面给任何细节就破功——必须纯剪影加背光边",
        "忘了保留高空的冷色，夜空会变成发灰的暖调"
    ],
    "prompt": "黎明色温渐变：一条竖直的色温带从地平线的暖粉（2000 到 2500K）经乳白（4500K）向上迅速过渡到深蓝紫（9000K）；地平线最亮、向上明度比约八比一；主体是纯黑剪影，只被亮天空勾出一圈边；地平线以下压到近黑。",
    "source": "local",
    "sourceUrl": null,
    "sourceName": "本地沉淀（自产示意图）",
    "license": null,
    "refs": [
        "光影参考图/光影示意_人物光位_vd-light-dawn-gradation_黎明色温渐变.png"
    ],
    "preview": null  }
];

