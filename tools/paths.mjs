// 统一路径解析：同一套脚本同时服务于「本地素材库」与「开源发布包」两种布局
//
// 本地素材库布局（开发态）
//   <根>/03_索引/            三个库 JSON + components.json
//   <根>/02_素材/图片库/      参考图（风格参考图 / 动效预览图 / 动效参考图 / 光影参考图）
//   <根>/04_工具/_抓取缓存/   采集与构建中间产物
//   <根>/05_工作台/public/    工作台前端
//
// 开源发布包布局（交付态）
//   <根>/data/                三个库 JSON + components.json
//   <根>/assets/              参考图（同样的四个子目录）
//   <根>/.cache/              采集与构建中间产物（不入库）
//   <根>/server/public/       工作台前端
//
// 判定顺序：先看 ATLAS_HOME 环境变量，再按目录特征自动识别。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

function isPackageRoot(root) {
  return (
    fs.existsSync(path.join(root, 'data', '风格库.json')) &&
    fs.existsSync(path.join(root, 'assets')) &&
    fs.existsSync(path.join(root, 'server'))
  );
}

function isLocalRoot(root) {
  return fs.existsSync(path.join(root, '03_索引')) || fs.existsSync(path.join(root, '02_素材'));
}

function resolveLayout() {
  const env = process.env.ATLAS_HOME;
  if (env) {
    const root = path.resolve(env);
    if (isPackageRoot(root)) return { layout: 'package', root };
    if (isLocalRoot(root)) return { layout: 'local', root };
    throw new Error(`ATLAS_HOME 指向的目录既不是素材库也不是发布包：${root}`);
  }
  if (isPackageRoot(ROOT)) return { layout: 'package', root: ROOT };
  if (isLocalRoot(ROOT)) return { layout: 'local', root: ROOT };
  throw new Error(`无法识别素材库根目录（${ROOT}）`);
}

const { layout, root } = resolveLayout();

export const P = {
  layout,
  root,
  // 索引 / 数据目录
  data: layout === 'package' ? path.join(root, 'data') : path.join(root, '03_索引'),
  // 参考图根目录
  assets: layout === 'package' ? path.join(root, 'assets') : path.join(root, '02_素材', '图片库'),
  // 采集与构建中间产物
  cache: layout === 'package' ? path.join(root, '.cache') : path.join(root, '04_工具', '_抓取缓存'),
  // 工作台前端
  public: layout === 'package' ? path.join(root, 'server', 'public') : path.join(root, '05_工作台', 'public'),
  // 工具脚本所在目录（本地为 04_工具，开源包为 tools）
  tools: HERE,
};

// 配色板：本地是采集中间产物，发布包随包分发（CI 无 ffmpeg，无法重新提取）
P.palette = layout === 'package' ? path.join(P.data, '配色板.json') : path.join(P.cache, '配色板.json');

export const IMG_STYLE = '风格参考图';
export const IMG_MOTION = '动效预览图';
export const IMG_MOTION_CARD = '动效参考图';
export const IMG_LIGHT = '光影参考图';
// 注：vibe 的样片图在本地库是 02_素材\图片库\知识短片参考图\，但**不随开源包分发**
// （上游 MIT 授权未覆盖 examples/ 下的图），所以这里没有对应的导出目录常量。

/** 把裸文件名转成「相对参考图根目录」的路径，正斜杠分隔 */
export const rel = (dir, file) => (file.includes('/') ? file : `${dir}/${file}`);

/** 把「相对参考图根目录」的路径转成绝对路径 */
export const abs = (relPath) => path.join(P.assets, ...relPath.split('/'));

export default P;
