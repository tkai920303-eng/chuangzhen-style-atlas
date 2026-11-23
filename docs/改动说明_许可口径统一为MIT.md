# 改动说明 · 许可口径统一为 MIT

日期：2026-11-23
范围：开源发布包（`LICENSE` / `NOTICE.md` / `README.md`）

## 背景

公开仓库上线后，三个地方对「这个仓库是什么许可」的说法对不上：

| 位置 | 原来的说法 |
|---|---|
| `package.json` | `"license": "MIT"` |
| `README.md` 的 License 段 | `MIT · 第三方内容见 NOTICE.md` |
| GitHub 仓库页的 License 标签 | **Other** |

`gh repo view` 的实测结果是 `licenseInfo: { key: "other", name: "Other" }`。
npm 生态里读到的却是 MIT，别人看仓库首页却看到 Other——同一件事两种答案。

## 原因

`LICENSE` 的写法是「MIT 全文 + `---` + 第三方条款段落」。

GitHub 用 Licensee 识别许可证，它比对的是**整份文件的模板相似度**。MIT 正文之后多出一整段
第三方条款，相似度掉到阈值以下，就不再判成 MIT，落到了兜底分类 Other。

这不是误解上游，也不需要换许可证：那段第三方条款本来就是必要且正确的，只是**放错了文件**。

## 改动

1. **`LICENSE` 只保留 MIT 原文**（版权行 + 授权条款 + 免责条款），一字未删。
2. 原本挂在 `LICENSE` 末尾的第三方条款段落，**原样移入 `NOTICE.md` 开头新设的「⚠️ 许可范围」小节**，
   并补一句指路：只看 `LICENSE` 就以为整个仓库都是 MIT 是最容易踩的坑。
3. **`README.md` 标题下方加一行醒目的许可范围提示**，让还没点开任何文件的人第一眼就看到
   「图片素材不适用 MIT」，避免只扫一眼 License 标签就误用。

## 为什么这样改

- **条款没有丢**。`NOTICE.md` 原文第 3–4 行本来就已经写明「代码采用 MIT，图片素材与条目文本
  请勿视为 MIT 内容」，第三方条款只是被**前置**到了 NOTICE 顶部，措辞未弱化。
- **MIT + NOTICE 是通行组合**。多数「代码 MIT + 素材另计」的项目都把素材例外放在 NOTICE，
  而不是把 LICENSE 写成混合文本。
- **法律含义不变**。代码仍是 MIT；图片仍是「逐条授权不同」，逐条判读结果仍完整保留在
  `docs/图源署名.md` 与 `data/atlas-image-credits.json` 里。

## 改完之后

- GitHub 仓库页的 License 标签变成 **MIT**，与 `package.json`、README 三处口径一致。
- 授权边界依然清楚：图片素材不适用 MIT，商业使用前逐条核对 `NOTICE.md` 与 `docs/图源署名.md`。

## 怎么复核

```bash
gh repo view tkai920303-eng/chuangzhen-style-atlas --json licenseInfo
# 期望：{"key":"mit","name":"MIT License",...}
```

## 没有变的部分

- 38 张版权保留主图仍然不随包分发，剔除逻辑仍然做在导出流程里（不是手工跑一次）。
- 「无明示授权」的 71 条与「Atlas 自制」的 37 条仍然在包内，需要单独确认的结论没有变化。
- 个人内容三道防线（`.gitignore` 隔离 → 工具链全部跳过 → `verify` 硬断言）不受本次改动影响。
