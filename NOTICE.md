# 第三方内容与授权说明

本仓库的**代码**采用 MIT 许可（见 `LICENSE`）。
仓库内的**图片素材与条目文本**来自以下第三方来源，各自适用不同授权，请勿视为 MIT 内容。

## ⚠️ 许可范围

`LICENSE` 里的 MIT 条款**只覆盖本仓库的代码与自产内容**。

本仓库包含的第三方内容（Atlas of Visual Effects 参考图与效果指令、motion-prompt 元素代码与画风卡等）
**不适用**上述 MIT 条款。其授权见：

- 本文档「来源一览」—— 逐来源授权说明
- `docs/图源署名.md` 与 `data/atlas-image-credits.json` —— atlas 主参考图的逐条判读
- `docs/数据来源与授权.md` —— 全部来源与自产内容清单
- `data/*.json` 各条目的 `license` / `credit` / `imageLicense` / `imageRedistributable` / `gallery[].license` 字段

其中 atlas 主参考图**逐条授权不同**，部分条目的权利声明为「版权保留」或未明示可再分发的许可。
商业使用前必须逐条核对，详见 `docs/图源署名.md`。

> 只读 `LICENSE` 就以为整个仓库都是 MIT，是最容易踩的坑。引用任何一张图之前，先按上面的路径查清它自己的授权。

## 来源一览

| 来源 | 内容 | 授权 | 本仓库怎么用 |
|---|---|---|---|
| [Atlas of Visual Effects](https://atlas.letz.ai) | 504 条特效条目的**主参考图**（`assets/风格参考图/风格图鉴_<slug>.webp`） | **逐条不同**，判读结果见 [`docs/图源署名.md`](docs/图源署名.md) | 主图落盘随仓库分发；条目的 `credit` / `imageLicense` / `imageRedistributable` 字段保留权利声明 |
| 同上 | 504 条特效的 **LetzAI 效果指令原文**（`data/风格库.json` 的 `letzaiPrompt`） | Atlas 未公开发布提示词授权条款；其 SKILL.md 允许「原样保留提示词、改写版另行说明」 | `letzaiPrompt` 为**原文**，`prompt` 为本项目的中文七段改写版，二者并存 |
| 同上 | **历史例图**（`gallery[]`） | 逐张不同，见 `gallery[].license` 与 `gallery[].artist` | **未随仓库分发**；图鉴页面运行时从 `atlas.letz.ai` 远程读取，并在图下标出作者与授权 |
| [motion-prompt](https://github.com/showheyohtaki/motion-prompt) | 240 条动效的提示词与元素代码、24 张画风卡 | **MIT** | 元素代码首行保留原作者授权注释；画风卡为作者原图 |
| [XO3D Labs](https://labs.xo3d.co.uk/lighting-rig-library/) | 24 套布光方案的参数（光位、仰角、光比、色温） | 免费工具，页面注明 © XO3D Ltd | **未复制其图片**，仅使用参数并据此**自产**示意图 |
| [Filmfarm](https://filmfarm.de/zh/key-light-2) | 光影术语、自然光、人物光位的文字描述 | 公开网页内容 | **未复制其图片**，仅使用文字参数并据此**自产**示意图 |
| [LabNol](https://www.labnol.com/photography/portrait-lighting) | 人物光位的文字描述 | 公开网页内容 | 同上 |
| [HeyChengC/vibe-knowledge-film](https://github.com/HeyChengC/vibe-knowledge-film) | **Vibe 画法库**的方法条目（`data/Vibe画法库.json`）、件名表（`data/vibe件清单.json`）、引擎件源码（`tools/vibe引擎/`） | **MIT**（引擎件源码随 `tools/vibe引擎/LICENSE`）；字体为 **SIL OFL** | 方法条目由本项目**重新组织与转述**（不逐句复制上游参考片的字幕原文）；引擎件源码原样分发并保留 MIT 声明 |

## ⚠️ atlas 主参考图：逐条授权不同

atlas 的 API 只在 `effect.credit` 自由文本里交代主图的权利状态，`effect.image` 字段只有路径、**没有 license 字段**。
atlas 自己的 SKILL.md 写明：

> Keep image author, source, and license with reused images;
> **public access does not imply unrestricted image licensing.**

逐条判读结果（判读从严：拿不准即归「无明示授权」）：

判为**版权保留**的信号有四类——credit 明确写版权保留或带 © 署名；点名商业影视公司 / 工作室与版权权利人；
credit 自己写明 `no open license stated`；以及其它表明画面归属他人的表述。

| 判读类别 | 数量 | 再分发 |
|---|---:|---|
| 公有领域 | 175 | ✅ 可（建议保留署名） |
| CC 署名类 | 94 | ⚠️ 需署名；BY-SA 还要求衍生作品同授权 |
| CC0 | 90 | ✅ 可（建议保留署名） |
| GFDL | 2 | ⚠️ 可，但需附 GFDL 全文并同授权 |
| 无明示授权 | 52 | ⚠️ 需人工判读 |
| Atlas 自制插画（未公开发布授权条款） | 37 | ⚠️ 需单独确认 |
| **版权保留** | **54** | ❌ **未经权利人许可不得再分发** |

54 条版权保留里包含 Disney、Paramount、Warner Bros.、Universal、MGM、Lucasfilm / ILM、
Snap Inc.、Stability AI、Man Ray Trust、VG Bild-Kunst、Estate of Roy Lichtenstein / DACS 等权利方的署名。

逐条清单见 [`docs/图源署名.md`](docs/图源署名.md)，机器可读版本见 `data/atlas-image-credits.json`。

**那 54 张版权保留的主图已在本仓库中剔除**（构建时自动执行）：

```bash
npm run verify   # 断言「版权保留主图未随包分发」
```

剔除只移除图片文件与对应条目的参考图引用；条目文本、提示词、来源链接与逐条署名
**完整保留**在 `data/风格库.json` 与 `docs/图源署名.md` 中。
若你自行补入了受限图片，可用下面这条幂等命令再清一次：

```bash
npm run strip:restricted:dry   # 先看清单，不改文件
npm run strip:restricted        # 删掉「版权保留」的主图，并把对应条目的参考图置空
```
「无明示授权」的 52 条与「Atlas 自制」的 37 条不在自动剔除范围内，需自行确认后再决定是否保留。

## ⚠️ GFDL 主图：许可全文随包分发

上面判读表里的 **GFDL 2 条**（`kaleidoscope`、`mirror-repeat`，来源为 GIMP Documentation Team）
是**随包分发**的。GFDL 允许再分发，但要求**随分发附上许可全文**，
因此本仓库把 **GNU Free Documentation License v1.3 全文**放在：

```
docs/GFDL许可全文.txt
```

处置口径：

- 这 2 张图**不适用**仓库根目录的 MIT 许可，它们**仍按 GFDL 分发**；
- 原始权利声明（`GIMP Documentation Team, GNU Free Documentation License`）保留在
  `data/atlas-image-credits.json` 与 `docs/图源署名.md` 里；
- 本仓库**未修改**这 2 张图的内容，只是随包分发原件；
- 仓库的其余部分（代码与自产内容）仍是 MIT——GFDL 第 7 条允许把独立作品以聚合形式
  与本仓库并列分发，聚合本身不改变各作品的授权。

引用这 2 张图时，请连同 `docs/GFDL许可全文.txt` 一起带上。

## ⚠️ Vibe 画法库：上游的分段许可

「Vibe 画法库」（`data/Vibe画法库.json`）来自开源项目
[HeyChengC/vibe-knowledge-film](https://github.com/HeyChengC/vibe-knowledge-film)。
上游的许可声明是**按段**给的，不是整仓一个许可：

> 引擎、脚本和文档里的方法说明使用 MIT 许可，见 `LICENSE`。
> `references/analysis.md`、`references/prompts.md` 里按成片填好的 brief，
> 以及 `examples/stim_B`、`info_C`，字幕和画面设计来自他人的短片，版权属于原作者。

因此本仓库的处理是：

| 上游内容 | 处置 |
|---|---|
| 引擎代码（`vk.js` / `vk-kit.js`，MIT） | **随包分发**于 `tools/vibe引擎/`，MIT 声明见同目录 `LICENSE` |
| 方法说明文档（MIT） | **只留本地，原文不随包分发**——这些文档通篇引用他人短片的字幕原句作讲解例子；本仓库改为在 `data/Vibe画法库.json` 里**重新组织与转述**，只留方法规则与参数 |
| `references/analysis.md` / `references/prompts.md`（版权属原作者） | **只入本地对照目录**（便于学习对照），**未进入公开包** |
| `examples/stim_B` / `examples/info_C` 及其截图（版权属原作者） | **只入本地对照目录**（便于学习对照），**未进入公开包** |
| 上游自有题目的样片拼图（4 张） | **未随包分发**——上游的 MIT 授权是枚举式的，只覆盖「引擎、脚本和文档里的方法说明」，未列举 `examples/` 下的图；`examples/README.md` 亦明写「能带走的是做法，不是画面」。本仓库按「无明示再分发授权不外发」处理，只在本地库留存 |
| 字体（Noto Serif/Sans SC、Cormorant Garamond、Lora、JetBrains Mono、Courier Prime） | 字体文件不入包；许可文本（SIL OFL）随引擎件分发 |

> 上游文档的完整原文在其仓库内（MIT）。本仓库只做**方法层面**的转述，
> 不复制他人短片的字幕与画面设计。需要完整原文请直接取上游仓库。

`npm run verify` 有一条断言「**包内无版权受限文件（brief / 复刻片）**」，
按 SHA-256 逐文件比对本地库保留的受限目录，防止它们被误带进公开包。

## 自产内容

以下内容由本项目自行生成，版权归本项目所有（MIT）：

- `assets/光影参考图/*.png` —— 依据布光参数绘制的布光示意图（俯视灯位图 + 色温条 + 光比条 + 光质标记），**58 张**
- `assets/动效参考图/*.png` —— 本地工程动效与组件的规格卡（源码位置、参数、依赖、状态），**136 张**
- `assets/风格参考图/风格图鉴_画面设计沉淀_*.jpg` —— 《画面设计沉淀》条目的自绘风格示意图，**6 张**
- `assets/光影参考图/光影示意_*.png` 与 `assets/动效参考图/动效规格卡_vd-*.png` —— 《画面设计沉淀》条目的自绘示意图，**11 张**
- `assets/动效预览图/动效预览_<pack>_<slug>.{webp,png}` —— 由 motion-prompt 的 MIT 元素代码**在本机渲染**得到（Canvas 绘制函数原样执行，未改动作者内容），**216 条**
- `assets/动效预览图/动效预览_FX-KIT-PARTICLES-001.*`、`动效预览_FX-ML-SHUTTER-001.*` —— 作者自有工程的渲染实拍，**2 条**
- `data/*.json` 中由本项目组装的提示词与结构化字段

## 使用须知

1. **条目级授权优先**。`data/` 里每个条目都带 `license` / `credit` / `imageLicense` / `imageRedistributable` / `sourceName` / `sourceUrl`，引用时请以条目字段为准。
2. **Atlas 主参考图逐条授权不同**，商业使用前请逐条核对 `docs/图源署名.md`。
3. **历史例图未随仓库分发**，页面运行时从 `atlas.letz.ai` 热链；作者与授权在图下标注。
4. 本项目对第三方内容只做**索引、提示词组装与本地再渲染**，未修改作者原始文件内容。
5. 仓库内的**路径已脱敏**：本机绝对路径统一替换为 `<私有工程>/…` 示意路径，见 `tools/脱敏.mjs`。

详细条目级溯源见 `data/*.json` 的字段与 [`docs/数据来源与授权.md`](docs/数据来源与授权.md)。
