/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-09 11:50:47
 * @LastEditTime: 2021-09-15 16:46:14
 * @Description: 请描述该文件
 */

// const _toString = Object.prototype.toString
// export const isRegExp = (v: unknown): boolean => {
//   return _toString.call(v) === '[object RegExp]'
// }

export const isOfType = <T>(v: unknown, check: keyof T): v is T => {
  return (v as T)[check] !== undefined
}
