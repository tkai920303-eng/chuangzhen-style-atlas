# 第三方内容与授权说明

本仓库的**代码**采用 MIT 许可（见 `LICENSE`）。
仓库内的**图片素材与条目文本**来自以下第三方来源，各自适用不同授权，请勿视为 MIT 内容。

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

## ⚠️ atlas 主参考图：逐条授权不同

atlas 的 API 只在 `effect.credit` 自由文本里交代主图的权利状态，`effect.image` 字段只有路径、**没有 license 字段**。
atlas 自己的 SKILL.md 写明：

> Keep image author, source, and license with reused images;
> **public access does not imply unrestricted image licensing.**

逐条判读结果（判读从严：拿不准即归「无明示授权」；`credit` 里出现 © 署名即判为版权保留）：

| 判读类别 | 数量 | 再分发 |
|---|---:|---|
| 公有领域 | 174 | ✅ 可（建议保留署名） |
| CC 署名类 | 94 | ⚠️ 需署名；BY-SA 还要求衍生作品同授权 |
| CC0 | 90 | ✅ 可（建议保留署名） |
| 无明示授权 | 71 | ⚠️ 需人工判读 |
| Atlas 自制插画（未公开发布授权条款） | 37 | ⚠️ 需单独确认 |
| **版权保留** | **38** | ❌ **未经权利人许可不得再分发** |

38 条版权保留里包含 Disney、Paramount、Warner Bros.、Universal、MGM、Lucasfilm / ILM、
Snap Inc.、Stability AI、Man Ray Trust、VG Bild-Kunst、Estate of Roy Lichtenstein / DACS 等权利方的署名。

逐条清单见 [`docs/图源署名.md`](docs/图源署名.md)，机器可读版本见 `data/atlas-image-credits.json`。

**那 38 张版权保留的主图已在本仓库中剔除**（构建时自动执行）：

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
「无明示授权」的 71 条与「Atlas 自制」的 37 条不在自动剔除范围内，需自行确认后再决定是否保留。

## 自产内容

以下内容由本项目自行生成，版权归本项目所有（MIT）：

- `assets/光影参考图/*.png` —— 依据布光参数绘制的布光示意图（俯视灯位图 + 色温条 + 光比条 + 光质标记），**53 张**
- `assets/动效参考图/*.png` —— 本地工程动效与组件的规格卡（源码位置、参数、依赖、状态），**130 张**
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
