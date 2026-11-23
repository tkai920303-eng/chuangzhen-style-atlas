// 授权分类：把 atlas 的 credit 自由文本归类成可判定的授权结论
//
// 背景：atlas 的 API 只在 effect.credit 里用自由文本交代主参考图的权利状态，
// effect.image 字段只有图片路径、没有 license 字段。
// atlas 自己的 SKILL.md 要求：「Keep image author, source, and license with reused images;
// public access does not imply unrestricted image licensing.」
//
// 所以必须逐条判读。判读原则：**从严**——拿不准就归「需人工判读」，
// 不因为没写「copyright protected」就当成可自由使用。

export const CLASS = {
  PUBLIC_DOMAIN: '公有领域',
  CC0: 'CC0',
  CC_BY: 'CC 署名类',
  GFDL: 'GFDL',
  ATLAS_ILLUSTRATION: 'Atlas 自制插画',
  RESTRICTED: '版权保留',
  UNSTATED: '无明示授权',
};

// ---------------------------------------------------------------------------
// 信号词表
// ---------------------------------------------------------------------------

// ① credit 明确写了版权保留
const EXPLICIT_COPYRIGHT = /copyright\s*protected|copyrighted|all rights reserved|©/i;

// ② credit 点名了商业影视公司、工作室或版权权利人
//    典型形态：「RKO / Warner Bros.; via British Film Institute; Film still」
//    「Fleischer Studios archive」「Maya Deren / Rights Holder」
//    这类画面的版权归属清晰，默认归版权保留。
//    —— 放在「明确的自由许可」之后：若 credit 同时声明了 public domain / CC，以声明为准。
const FILM_RIGHTS_HOLDER =
  /(Warner|Universal|Paramount|\bRKO\b|Fleischer|Image West|Pioneer Pictures|\bUfa\b|\bMGM\b|Lucasfilm|Disney|Maya Deren|Man Ray|McQueen|National Film Board|British Film Institute|\bBFI\b|Film Foundation|CineStill|Museum of the Moving Image|American Society of Cinematographers)/i;

// ③ atlas 自己写明「没有可再分发的开源许可」
//    出现在片格 / 档案图上，是 atlas 在明确告知「这张不能随便分发」。
const NO_OPEN_LICENSE = /no open license stated/i;

// ④ 美国国会图书馆的「无已知限制」声明，等同公有领域
const LOC_NO_KNOWN_RESTRICTIONS = /no known restrictions/i;

// ⑤ GNU Free Documentation License：明确的自由文档许可（copyleft，需附全文并同授权）
const GFDL_LICENSE = /GNU Free Documentation License/i;

// 归类结果：cls（类别）+ redistributable（true / false / '需授权' / '需人工判读'）
const RULES = [
  [EXPLICIT_COPYRIGHT, CLASS.RESTRICTED, false],
  [NO_OPEN_LICENSE, CLASS.RESTRICTED, false],
  [/public domain|commons pdm|faithful reproduction/i, CLASS.PUBLIC_DOMAIN, true],
  [LOC_NO_KNOWN_RESTRICTIONS, CLASS.PUBLIC_DOMAIN, true],
  [GFDL_LICENSE, CLASS.GFDL, true],
  [/\bCC0\b/i, CLASS.CC0, true],
  [/\bCC BY(-SA)?\b/i, CLASS.CC_BY, true],
  [FILM_RIGHTS_HOLDER, CLASS.RESTRICTED, false],
  [/illustration generated for the atlas/i, CLASS.ATLAS_ILLUSTRATION, '需授权'],
  [/illustration|demonstration|technical|documentation|museum|no open license|official/i, CLASS.UNSTATED, '需人工判读'],
];

/**
 * 判定一条 credit 的授权类别
 * @param {string} credit atlas 的 effect.credit 原文
 * @returns {{cls:string, redistributable:boolean|string, note:string}}
 */
export function classifyCredit(credit) {
  const c = (credit || '').trim();
  if (!c) return { cls: CLASS.UNSTATED, redistributable: '需人工判读', note: 'credit 为空' };
  for (const [re, cls, red] of RULES) {
    if (re.test(c)) {
      return {
        cls,
        redistributable: red,
        note:
          cls === CLASS.RESTRICTED
            ? re === FILM_RIGHTS_HOLDER
              ? 'credit 点名了商业影视公司 / 版权权利人，画面为片格或档案素材'
              : re === NO_OPEN_LICENSE
                ? 'credit 明确写明「no open license stated」（无可再分发的开源许可）'
                : 'credit 明确标注版权保留，未经权利人许可不得再分发'
            : cls === CLASS.CC_BY
              ? '需署名；CC BY-SA 还要求衍生作品同授权'
              : cls === CLASS.GFDL
                ? 'GFDL：可再分发，但需附 GFDL 全文并以相同许可分发'
                : cls === CLASS.PUBLIC_DOMAIN || cls === CLASS.CC0
                  ? '可再分发，署名仍建议保留'
                  : cls === CLASS.ATLAS_ILLUSTRATION
                    ? 'Atlas 自制，但未公开发布授权条款'
                    : 'credit 未声明可再分发的许可',
      };
    }
  }
  return { cls: CLASS.UNSTATED, redistributable: '需人工判读', note: 'credit 未声明可再分发的许可' };
}

export default { classifyCredit, CLASS };
