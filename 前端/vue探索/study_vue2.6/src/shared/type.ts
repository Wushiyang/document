/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-09 11:50:47
 * @LastEditTime: 2021-10-18 10:25:08
 * @Description: 请描述该文件
 */

// const _toString = Object.prototype.toString
// export const isRegExp = (v: unknown): boolean => {
//   return _toString.call(v) === '[object RegExp]'
// }
const _toString = Object.prototype.toString

export const hasProto = '__proto__' in {}

export function isObject(obj: unknown): obj is Record<string, unknown> {
  return obj !== null && typeof obj === 'object'
}

export function isPlainObject(obj: unknown): boolean {
  return _toString.call(obj) === '[object Object]'
}

export const isOfType = <T>(v: unknown, check: keyof T): v is T => {
  return (v as T)[check] !== undefined
}

export type Constructor<T> = new (...args: any[]) => T

export function isDef(v: unknown): v is string | boolean | number | object | symbol {
  return v !== undefined && v !== null
}
