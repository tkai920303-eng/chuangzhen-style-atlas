// 路径脱敏：把本机绝对路径换成「相对示意路径」
//
// 开源包要公开，不能带出 Windows 用户名、本机盘符、内部工程根与 AI 工程 ID。
// 规则（确定性、可复核）：
//   1. **只保留最后一段**（文件名或末级目录名），其余整段丢弃 —— 中间层全是内部工程结构
//   2. 额外丢弃像 ID 的目录名（如 g-p-<hex>），它们会从倒数第二段绕回来
//   3. `#符号` 后缀保留（这是条目在源码里的调用点，最有定位价值）
//
// 例（这里用占位路径演示，实际脚本里不写真实用户名）：
//   <盘符>\私有根\AI工程\g-p-xxxxxxxx\动效库\effects\FX-EP002-SPARK-001
//     → <私有工程>/FX-EP002-SPARK-001
//   <盘符>\项目根\deliveries\批次号\06_工程\src\components.tsx
//     → <私有工程>/components.tsx
//   <用户目录>\工作区\日期戳\仓库名\src\...\assets\docs-intro-banner.png
//     → <私有工程>/docs-intro-banner.png
//
// 说明：本地素材库里的 JSON 保留**真实路径**（本地复现需要），
// 只有导出的开源包会被脱敏。脱敏发生在 `04_工具\导出开源包.mjs`。

const PLACEHOLDER = '<私有工程>';
// 像 ID 的目录名：AI 工程 ID、纯十六进制长串
const ID_LIKE = /^(g-p-)?[0-9a-f]{16,}$/i;

/** 把任意路径（绝对 / 相对 / 带 ..）脱敏成相对示意路径 */
export function sanitizePath(input) {
  if (!input || typeof input !== 'string') return '';
  const raw = input.trim();
  if (!raw) return '';

  // 拆出 #符号 后缀
  const hashAt = raw.indexOf('#');
  const symbol = hashAt >= 0 ? raw.slice(hashAt) : '';
  let body = hashAt >= 0 ? raw.slice(0, hashAt) : raw;

  // 统一分隔符，去掉盘符与开头的 ../
  body = body.replace(/\\/g, '/');
  body = body.replace(/^[A-Za-z]:\//, '');
  const segs = body
    .split('/')
    .filter((s) => s && s !== '.' && s !== '..')
    .filter((s) => !ID_LIKE.test(s));

  if (!segs.length) return symbol ? `${PLACEHOLDER}${symbol}` : '';

  return `${PLACEHOLDER}/${segs[segs.length - 1]}${symbol}`;
}

/** 批量脱敏对象里的若干路径字段 */
export function sanitizeFields(obj, fields = ['sourcePath', 'sourcePath2', 'dir', 'file']) {
  if (!obj || typeof obj !== 'object') return obj;
  for (const f of fields) {
    if (typeof obj[f] === 'string' && obj[f]) obj[f] = sanitizePath(obj[f]);
  }
  return obj;
}

export default { sanitizePath, sanitizeFields };
