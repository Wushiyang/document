/*
 * @Author: your name
 * @Date: 2021-07-12 09:40:33
 * @LastEditTime: 2021-07-12 09:40:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /create_vue2/src/util/env.js
 */
let _isServer
export const isServerRendering = () => {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer =
        global['process'] && global['process'].env.VUE_ENV === 'server'
    } else {
      _isServer = false
    }
  }
  return _isServer
}
