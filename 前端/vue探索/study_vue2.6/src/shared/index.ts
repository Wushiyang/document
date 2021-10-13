/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:53:53
 * @LastEditTime: 2021-10-13 17:28:26
 * @Description: 请描述该文件
 */
export * from './element'
export * from './debug'
export * from './type'
export * from './env'
export * from './pref'
export * from './options'
export * from './error'

export const SSR_ATTR = 'data-server-rendered'

// export { isRegExp } from './type'

export const no: () => boolean = () => false

export const noop: () => void = () => {
  // do nothing
}

export function remove<T = unknown>(arr: Array<T>, item: T): Array<T> | void {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export function makeMap(str: string, expectsLowerCase?: boolean): (key: string) => true | undefined {
  const map = Object.create(null)
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase ? (val) => map[val.toLowerCase()] : (val) => map[val]
}

const _toString = Object.prototype.toString

export function isObject(obj: unknown): obj is Record<string, unknown> {
  return obj !== null && typeof obj === 'object'
}

export function isPlainObject(obj: unknown): boolean {
  return _toString.call(obj) === '[object Object]'
}

/**
 * Define a property.
 */
export function def(obj: Record<string, unknown>, key: string, val: unknown, enumerable = false): void {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: enumerable,
    writable: true,
    configurable: true
  })
}
