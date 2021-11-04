/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:53:53
 * @LastEditTime: 2021-11-04 17:43:11
 * @Description: 请描述该文件
 */
export * from './element'
export * from './debug'
export * from './type'
export * from './env'
export * from './pref'
export * from './options'
export * from './error'
export * from './lang'

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

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn(obj: Object | Array<unknown>, key: string): boolean {
  return hasOwnProperty.call(obj, key)
}

/**
 * Define a property.
 */
export function def<T>(obj: T, key: string, val: unknown, enumerable = false): void {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: enumerable,
    writable: true,
    configurable: true
  })
}
