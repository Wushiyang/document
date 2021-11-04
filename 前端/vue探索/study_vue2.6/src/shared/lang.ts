/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-11-04 17:42:29
 * @LastEditTime: 2021-11-04 17:42:29
 * @Description: 请描述该文件
 */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
export const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/

/**
 * Parse simple path.
 */
const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`)
export function parsePath(path: string): undefined | ((obj: Record<string, unknown>) => unknown | undefined) {
  if (bailRE.test(path)) {
    return
  }
  const segments: Array<string> = path.split('.')
  return function (obj: Record<string, unknown>) {
    let reVal: unknown
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      // 取最后一项符合值返回
      reVal = obj[segments[i]]
    }
    return reVal
  }
}
