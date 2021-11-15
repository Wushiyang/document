/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-10-11 12:05:06
 * @LastEditTime: 2021-11-15 10:09:32
 * @Description: 请描述该文件
 */
export const inBrowser = typeof window !== 'undefined'
// export const inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform
// export const weexPlatform = inWeex && WXEnvironment.platform.toLowerCase()
export const UA = inBrowser && window.navigator.userAgent.toLowerCase()
export const isIE = UA && /msie|trident/.test(UA)
export const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA) // (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios')

/* istanbul ignore next */
export const isNative = (Ctor: unknown): boolean => {
  return typeof Ctor === 'function' && Ctor.toString && /native code/.test(Ctor.toString())
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
// let _isServer
export const isServerRendering = () => {
  // if (_isServer === undefined) {
  //   /* istanbul ignore if */
  //   if (!inBrowser && !inWeex && typeof global !== 'undefined') {
  //     // detect presence of vue-server-renderer and avoid
  //     // Webpack shimming the process
  //     _isServer = global['process'] && global['process'].env.VUE_ENV === 'server'
  //   } else {
  //     _isServer = false
  //   }
  // }
  // return _isServer
  return false
}

export interface SimpleSetConstructor<T = string | number> {
  new <T = unknown>(values?: readonly T[] | null): SimpleSet
}

export interface SimpleSet {
  has(key: string | number): boolean
  add(key: string | number): void
  clear(): void
}

let _Set: SimpleSetConstructor
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = class Set implements SimpleSet {
    set: Record<string, unknown> = {}
    constructor() {
      this.set = Object.create(null)
    }
    has(key: string | number) {
      return this.set[key] === true
    }
    add(key: string | number) {
      this.set[key] = true
    }
    clear() {
      this.set = Object.create(null)
    }
  }
}

export { _Set }
