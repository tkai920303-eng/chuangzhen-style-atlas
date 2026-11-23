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

export const PLACEHOLDER = '<私有工程>';
// 像 ID 的目录名：AI 工程 ID、纯十六进制长串
const ID_LIKE = /^(g-p-)?[0-9a-f]{16,}$/i;
// 包内自有目录名：这些是**要公开的**相对路径，不能动
const PKG_DIRS = new Set([
  'assets', 'data', 'docs', 'server', 'tools',
  '风格参考图', '动效预览图', '动效参考图', '光影参考图',
]);

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

/**
 * 脱敏**自由文本里嵌的相对路径**。
 *
 * 为什么单独做：字段名像路径的（sourcePath / dir / file）由 sanitizePath 整段处理；
 * 但自由文本（description / _说明 …）里也常嵌着相对路径，例如
 *   「工程内组件：../../../<项目根>/<版本目录>/src/<文件名>#<调用点>」
 * 这类值**没有盘符**，绝对路径规则抓不到，却照样会带出内部工程根与目录结构。
 *
 * 规则（确定性、可复核）：
 *   - 保留前缀文字（如「工程内组件：」）与 `#调用点` 后缀
 *   - 路径主体只留最后一段（文件名），其余整段丢弃
 *   - 放行：URL、以 `/` 开头的站点路径、包内自有目录名（风格参考图/动效预览图/…）
 *   - 放行：末段没有「字母开头」的扩展名（避免把 `f/1.4` 这种参数当成路径）
 */
export function sanitizeRelativeInText(input) {
  if (!input || typeof input !== 'string') return input;
  if (!/[\\/]/.test(input)) return input;

  return input
    .split(/(\s+)/)
    .map((tok) => {
      if (!/[\\/]/.test(tok)) return tok;
      if (/^(https?:)?\/\//i.test(tok)) return tok;   // URL
      if (tok.startsWith('/')) return tok;            // 站点根相对路径

      const hashAt = tok.indexOf('#');
      const symbol = hashAt >= 0 ? tok.slice(hashAt) : '';
      const body = hashAt >= 0 ? tok.slice(0, hashAt) : tok;

      // 路径起点：优先取第一个 ../ 或 ./；没有就从头算
      const updown = body.search(/\.\.?[\\/]/);
      let start = updown >= 0 ? updown : 0;
      let prefix = body.slice(0, start);
      let pathBody = body.slice(start);

      // 首段里可能还混着说明文字（如「工程内组件：<版本目录>」）：
      // 以最后一个「散文分隔符」为界，之后才算路径本体，前面的文字原样保留
      if (updown < 0) {
        const firstSep = pathBody.search(/[\\/]/);
        if (firstSep > 0) {
          const head = pathBody.slice(0, firstSep);
          const cut = Math.max(...[...'：:，,。;；、！!？?）)】」』'].map((c) => head.lastIndexOf(c)));
          if (cut >= 0) {
            prefix = prefix + head.slice(0, cut + 1);
            pathBody = head.slice(cut + 1) + pathBody.slice(firstSep);
          }
        }
      }

      const segs = pathBody.split(/[\\/]/).filter((s) => s && s !== '.' && s !== '..');
      if (segs.length < 2) return tok;
      if (PKG_DIRS.has(segs[0])) return tok;           // 包内自有目录，放行

      const isUpdown = updown >= 0;
      const last = segs[segs.length - 1];
      const hasExt = /\.[A-Za-z][A-Za-z0-9]{0,4}$/.test(last);
      // 判据：有 ../ 前缀、或末段带字母开头的扩展名、或段数 ≥ 3（明显是目录树）
      if (!isUpdown && !(hasExt && segs.length >= 2) && segs.length < 3) return tok;

      return `${prefix}${PLACEHOLDER}/${last}${symbol}`;
    })
    .join('');
}

/**
 * 判断一个作品名是否「有辨识度」——过于通用的名字要放行，否则会误伤图鉴内容。
 *
 * 放行两类：
 *   1. 纯小写英文单词（如 experiments、research）——图鉴正文里经常出现这些普通词
 *   2. 纯集数编号（如 EP001、EP012）——它是参考库自己的**条目主键**的一部分
 *      （id 形如 FX-EP002-SPARK-001），已经随条目一起公开，
 *      在散文里再替换只会造成前后不一致，并不多提供任何隐私保护
 */
export function isDistinctiveWorkName(name) {
  if (!name || typeof name !== 'string') return false;
  if (/^[a-z]+$/.test(name)) return false;          // 普通英文单词
  if (/^EP\d{1,3}$/i.test(name)) return false;       // 集数编号
  return true;
}

/**
 * 生成作品名脱敏器：把文本里的作品名换成占位符。
 * 长名优先（先替长的），否则短名会先把长名的一部分吃掉、留下残渣。
 */
export function makeWorkNameSanitizer(workNames) {
  const list = [...new Set(workNames || [])]
    .filter(isDistinctiveWorkName)
    .sort((a, b) => b.length - a.length);
  return (text) => {
    if (typeof text !== 'string' || !text) return text;
    let out = text;
    for (const n of list) {
      if (out.includes(n)) out = out.split(n).join(PLACEHOLDER);
    }
    return out;
  };
}

/** 批量脱敏对象里的若干路径字段 */
export function sanitizeFields(obj, fields = ['sourcePath', 'sourcePath2', 'dir', 'file']) {
  if (!obj || typeof obj !== 'object') return obj;
  for (const f of fields) {
    if (typeof obj[f] === 'string' && obj[f]) obj[f] = sanitizePath(obj[f]);
  }
  return obj;
}

export default { PLACEHOLDER, sanitizePath, sanitizeRelativeInText, sanitizeFields };
