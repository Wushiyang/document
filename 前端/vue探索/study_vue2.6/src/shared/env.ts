/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-10-11 12:05:06
 * @LastEditTime: 2021-10-13 17:33:53
 * @Description: 请描述该文件
 */
export const inBrowser = typeof window !== 'undefined'

/* istanbul ignore next */
export const isNative = (Ctor: unknown): boolean => {
  return typeof Ctor === 'function' && Ctor.toString && /native code/.test(Ctor.toString())
}
