---
name: style-atlas
description: "查找视觉风格、动效语言与布光方案，产出可直接使用的提示词与参考图。Use when choosing a look, a motion behaviour, or a lighting setup for an image, video, UI, or motion-graphics piece."
---

# 素材风格图鉴 · Style & Motion Atlas

三个**可直接复制使用**的参考库。每一条都带参考图与成品提示词。

| 库 | id | 条目 | 解决什么问题 |
|---|---|---|---|
| 风格库 | `styles` | 552 | 这个画面长什么样：画面 / 配色 / 动法 / 光影四位一体 |
| 动效库 | `motions` | 370 | 这个动效怎么动：时序 / 缓动 / 幅度三段参数 |
| 光影库 | `lighting` | 130 | 光打在哪、软不软、比多少、多冷 |

全部条目与参考图都在仓库里，**不需要联网、不需要 API key、不需要起服务**。

---

## 数据在哪

以**本文件所在仓库的根目录**为基准（下面的路径都相对于它）：

```
data/风格库.json            552 条
data/动效库.json            370 条
data/光影库.json            130 条
data/配色板.json            915 条参考图的实解码配色（键 = 文件名）
data/atlas-image-credits.json  504 张 atlas 主图的逐条授权判读
data/third-party-exclusion.json  被剔除的第三方素材清单（SHA-256）+ 剔除结果
assets/风格参考图/           514 张   atlas 主图（54 张版权保留已剔除）+ 本地风格截图 + 24 张画风卡 + 自产参考板
assets/动效预览图/           436 个   216 条的静态海报帧 + 循环动图 + 2 条工程实拍
assets/动效参考图/           130 张   本地动效与组件的规格卡
assets/光影参考图/           53 张    自产布光示意图
tools/检索.mjs               离线检索（推荐入口）
我的作品/                    （可选）用户自己扫描的作品索引，在 .gitignore 里，不入库
```

---

## 检索条目

**首选 `tools/检索.mjs`** —— 它已把来源、授权、可再分发标记一并打出来：

```sh
node tools/检索.mjs styles bloom --limit=3        # 风格库按关键词
node tools/检索.mjs motions pop-in --cat=镜头运动   # 动效库 + 分类
node tools/检索.mjs lighting 逆光                  # 光影库
node tools/检索.mjs all --source=atlas --limit=5    # 跨库 + 按来源
node tools/检索.mjs motions --list-cats            # 先看有哪些分类
node tools/检索.mjs styles bloom --json            # JSON 输出，供脚本消费
node tools/检索.mjs styles bloom --ids             # 只出 id，便于批量取图
node tools/检索.mjs styles bloom --full            # 完整 prompt（默认截断到 160 字）
```

关键词匹配：名称 / 英文名 / id / 分类 / 标签 / 提示词正文，不区分大小写。

### 备选：起服务走 HTTP

需要搜索或浏览时才值得起：

```sh
npm start        # → http://127.0.0.1:5178（PORT / HOST 环境变量可改）
```

```sh
curl http://127.0.0.1:5178/api/atlas                     # 三库概要与分类列表
curl "http://127.0.0.1:5178/api/atlas/styles?q=bloom"    # 搜索
curl "http://127.0.0.1:5178/api/atlas/motions?cat=镜头运动"  # 分类（精确匹配）
```

`?cat=` 是**精确匹配**，分类名先从 `/api/atlas` 的 `libs.<库>.categories` 里取。

---

## 读一条条目

### 风格库

```jsonc
{
  "id": "atlas-anamorphic-lens-flare",
  "name": "Anamorphic Lens Flare", "nameEn": "...",
  "category": "2000 年代",
  "prompt": "【画面】…\n【配色】#xxxxxx、#yyyyyy\n【动法】…\n【光影】…\n【质感】…\n【适用】…\n【限制】…",
  "letzaiPrompt": "atlas 原始效果指令（英文原文）",
  "visual": "画面观察", "motion": "动法", "lighting": "光影", "texture": "质感",
  "palette": [{ "hex": "#929c95", "ratio": 0.42 }],
  "paletteDesc": "#929c95、#767b78、#304859",
  "use": "适用契机", "migration": "迁移方案",
  "limitations": "限制", "mix": "混搭边界",
  "refs": ["风格参考图/风格图鉴_anamorphic-lens-flare.webp"],
  "gallery": [{ "url": "https://…", "title": "…", "artist": "…", "license": "CC BY 2.0" }],
  "credit": "Paramount Pictures / American Cinematographer. © Paramount Pictures; …",
  "imageLicense": "版权保留",
  "imageRedistributable": false
}
```

- **`prompt` 是主要取用物**：七段式，可直接贴进生成工具
- 需要 atlas 原文时用 `letzaiPrompt`；需要分维度取用时用 `visual` / `motion` / `lighting` / `texture`

### 动效库

```jsonc
{
  "id": "mp-001", "name": "弹性入场",
  "prompt": "【动效】元素弹跳着出现\n【说明】An app icon pops in with a bounce…\n【问法】让标志以弹性入场出现…",
  "timing": "One pop per 2.35 s (twice per 4.7 s cycle: a star on coral first, then a heart on blue).",  // 时序
  "easing": "From 0.28 s, scale 0→1 with a spring: 1 − e^(−6.5t)·cos(15t), peaking at about 1.26.",  // 缓动
  "amplitude": "Floor shadow: 62 × 8 ellipse that scales with the icon (clamped to 0–1).",  // 幅度
  "spec": ["One pop per 2.35 s …"], "specWhiten": ["One pop per 2.35 s (twice per 4.7 s cycle: a star on {颜色} …"],
  "code": { "firstLine": "// Motion Prompt #001 · MIT License (c) 2026 Shohei Ohtaki · https://showheyohtaki.github.io/motion-prompt/#001",
            "body": "…" },
  "whitened": {
    "rules": "…",
    "slots": ["主体形状", "材质", "主色", "背景", "投影", "文字"],
    "prompt": "【白模版 · 去风格化】把「弹性入场」的时序与节奏移植到一张中性占位画面上。…"
  },
  "canvas": { "width": 539, "height": 208, "cycle": 4.7 },
  "refs": ["动效预览图/动效预览_motion_pop-in.png"],
  "preview": "动效预览图/动效预览_motion_pop-in.webp"
}
```

- **白模版（`whitened`）是这套库的特色**：只继承运动学（时序/缓动/幅度），外观全部中性灰白，
  留 6 个槽位。**先在白模上验证节奏，再套具体风格的配色与材质**
- `code.body` 是 motion-prompt 的 MIT 元素代码，**首行授权注释必须原样保留**——不要删掉那行再分发

### 光影库

```jsonc
{
  "id": "mp-photo-097", "name": "逆光",
  "prompt": "【光影】…",
  "direction": "光源位于主体后方", "hardness": null, "ratio": null, "colorTemp": null,
  "effect": "The sun moves from outside the frame to directly behind the …",
  "useCases": ["For airy, glowing portraits or any image that should feel bathed in light."],
  "mistakes": [],
  "refs": ["动效预览图/动效预览_photo_backlighting.png"]
}
```

部分条目的 `direction` / `hardness` / `ratio` / `colorTemp` 为空（源数据未给离散参数），
这种情况直接用 `prompt`。

---

## 取参考图

`refs[]` 里的值是**相对 `assets/` 根目录**的路径（正斜杠，含子目录）：

```sh
# 离线：直接读文件
cat "assets/动效预览图/动效预览_motion_pop-in.png"

# 起服务时：
curl -O "http://127.0.0.1:5178/atlas-img/动效预览图/动效预览_motion_pop-in.png"
```

- `refs[0]` = 静态参考图；`preview` = **循环动图**（218 条有），用于看真实运动
- `gallery[].url` 是**远程地址**（atlas 站点），不在本仓库里；每条都带 `artist` 与 `license`
- 规格卡（`assets/动效参考图/`）是本地工程条目的**规格卡**：源码位置、可调参数、依赖、状态，
  **不是画面渲染**——这些条目本来就没有独立预览，不要假装它们有

### 配色

`data/配色板.json` 以**文件名**为键（各目录前缀不重名）：

```json
{ "风格图鉴_15种风格_01逐帧手绘_012s.jpg": [{ "hex": "#493b31", "ratio": 0.42 }] }
```

用条目 `refs[0]` 的**文件名**（去掉子目录）去查。色板是从参考图**实际解码量化**出来的，不是手填。

---

## 授权红线（对外分发前必读）

1. **条目级授权优先**：每个条目都带 `license` / `credit` / `imageLicense` / `imageRedistributable` / `sourceUrl`。
2. **atlas 主参考图逐条授权不同**。判读结果（逐条见 `data/atlas-image-credits.json`）：

   | 类别 | 数量 | 能否再分发 |
   |---|---:|---|
   | 公有领域 / CC0 / CC 署名类 / GFDL | 361 | ✅ 可，CC 署名类需保留署名，BY-SA 需同授权，GFDL 需附全文并同授权 |
   | 无明示授权 | 52 | ⚠️ 需人工判读 |
   | Atlas 自制插画 | 37 | ⚠️ 需单独确认授权条款 |
   | **版权保留** | **54** | ❌ **不可再分发——已在本仓库中剔除** |

   那 54 条含 Disney、Paramount、Warner Bros.、Universal、MGM、Lucasfilm/ILM、Snap Inc.、
   Stability AI、Man Ray Trust、Estate of Roy Lichtenstein/DACS 等权利方署名。
   **它们的图片文件不在本仓库里**（构建时自动剔除），但条目文本、提示词与署名信息完整保留；
   涉及的条目在 `data/*.json` 里带 `refsStripped: true` 标记。

   **判断方法**：看条目的 `imageRedistributable`。为 `false` 的**不要外发**；
   为 `true` 的按 `imageLicense` 履行署名义务。

3. **motion-prompt 为 MIT**：元素代码首行的授权注释必须保留。
4. **XO3D / Filmfarm / LabNol 的图片一张都没复制**，只用了参数与文字；`assets/光影参考图/` 的示意图是自产的。
5. **自产内容**（MIT）：布光示意图 53 张、规格卡 130 张、本机渲染的动效预览 216 条 + 2 条工程实拍、暗紫数据可视化演播室自产参考板 1 张。
6. **第三方作品已剔除**：本地库保留第三方素材供检索与复刻参考，发布包一律剔除（路径 / 内容哈希 / 引用三道防线）。
   被剔除文件的 SHA-256 与统计见 `data/third-party-exclusion.json`，逐条说明见 `docs/第三方素材剔除记录.md`。
   包内若出现与该清单哈希相同的文件，即为剔除失效，属发布事故。

> 受限主图已在构建时自动剔除；仓库维护者若要再清一次：`npm run strip:restricted`（幂等，先用 `npm run strip:restricted:dry` 看清单）。

---

## 索引你自己的作品

参考库和你的作品库是两回事。仓库自带扫描器，**只读**扫描你自己的目录：

```sh
node tools/扫描我的作品.mjs "D:/你的作品目录"
npm start                      # 打开 http://127.0.0.1:5178/myworks
```

- 扫描根下的**一级子目录**各算一个作品；自动跳过 `node_modules`、`.git`、构建产物等
- 产物：`我的作品/{index,works,summary}.json` —— **该目录在 `.gitignore` 里，不会入库**
- 接口：`/api/myworks`（作品清单）、`/api/myassets?q=`（检索）、`/media/<id>`（取文件）
- `npm run verify` 有断言：「个人作品索引未被 git 追踪」——个人内容进了仓库就是发布事故

---

## 可靠调用

```sh
# 检索
node tools/检索.mjs styles bloom --limit=3
node tools/检索.mjs motions pop-in --json

# 起服务
PORT=5178 node server/server.mjs &

# 健康检查
curl -fsS http://127.0.0.1:5178/api/health

# 校验仓库完整性（结构 / 引用 / 脱敏）
npm run verify
```

Windows 上 `PORT=5178 node …` 要写成 `$env:PORT=5178; node …`。
本机 Node 直连外网会 DNS 失败（走系统代理），抓外网用 `curl.exe`；读本仓库文件不受影响。

---

## 边界

- **不要**编造条目里没有的参数：条目缺 `ratio` / `colorTemp` 时，用 `prompt` 原文，不要自己填数
- **不要**把规格卡当渲染预览描述给用户——它是规格，不是画面
- **不要**删掉 motion-prompt 元素代码的首行授权注释
- **不要**把 `imageRedistributable: false` 的主图再分发（这 38 张已从本仓库剔除）
- **不要**把用户自己的作品索引（`我的作品/`）提交进仓库——它是个人内容，`npm run verify` 会拦
- 条目文本、参考图、作者信息都**保持原样**引用；改写版要另行标注，不要混进原文
