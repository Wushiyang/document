/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-10-11 12:05:06
 * @LastEditTime: 2021-10-19 17:25:23
 * @Description: 请描述该文件
 */
export const inBrowser = typeof window !== 'undefined'

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
