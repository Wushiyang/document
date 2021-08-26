/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-08-16 20:59:42
 * @LastEditTime: 2021-08-25 16:52:28
 * @Description: 请描述该文件
 */
export const emptyObject = Object.freeze({})

export function isOfType<T>(v: unknown, test?: string): v is T {
  return test ? v[test] !== undefined && v[test] !== null : isDef(v)
}
export function isUndef(v: any): boolean {
  return v === undefined || v === null
}
export function isDef(v: any): boolean {
  return v !== undefined && v !== null
}
export function isTrue(v: any): boolean {
  return v === true
}
export function isFalse(v: any): boolean {
  return v === false
}
export function isPrimitive(v: any): boolean {
  return typeof v === 'string' || typeof v === 'number' || typeof v === 'symbol' || typeof v === 'boolean'
}
export function isObject(obj: any): boolean {
  return obj !== null && typeof obj === 'object'
}
export const _toString = Object.prototype.toString
export function isPlainObject(v: any): boolean {
  return _toString.call(v) === '[object Object]'
}
export function isRegExp(v: any): boolean {
  return _toString.call(v) === '[object RegExp]'
}
export function isPromise(v: any): boolean {
  return isDef(v) && typeof v.then === 'function' && typeof v.catch === 'function'
}
// 转换成字符串
export function toString(v: any): string {
  return isUndef(v) ? '' : Array.isArray(v) || (isPlainObject(v) && v.toString === _toString) ? JSON.stringify(v, null, 2) : String(v)
}
// 将字符串转成数字，失败则返回原字符串
export function toNumber(v: string): number | string {
  const n = parseFloat(v)
  return isNaN(n) ? v : n
}
export function makeMap(str: string, expectsLowerCase?: boolean): (key: string) => true | void {
  const map = Object.create(null)
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase ? (v) => map[v.toLowerCase()] : (v) => map[v]
}
// 检测是否内置标签
export const isBuiltInTag = makeMap('slot,components', true)
// 检测是否预留属性
export const isReservedAttribute = makeMap('key,ref,slot,slot-scope,is')

// 从一个数组移除一个元素
export function remove(arr: Array<any>, item: any): Array<any> | void {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export const hadOwnProperty = Object.prototype.hasOwnProperty
// 检测对象或数组是否有某一属性
export function hasOwn(obj: Object | Array<any>, key: string): boolean {
  return hadOwnProperty.call(obj, key)
}

export function noop(a?: any, b?: any, c?: any) {}
export const no = (a?: any, b?: any, c?: any) => false
export const identiy = (_: any) => _
