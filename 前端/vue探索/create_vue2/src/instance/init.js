/*
 * @Author: your name
 * @Date: 2021-07-10 14:45:56
 * @LastEditTime: 2021-07-10 15:49:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /create_vue2/src/init.js
 */
import { mergeOptions } from '../util/options'
import { initLifecycle, callHook } from './lifecycle'
let uid = 0
// 初始化混合
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm._isVue = true
    vm._uid = uid++
    if (options && options._isComponent) {
      // 内部组件处理
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(vm.constructor.options, options || {}, vm)
    }
    // 原本用作代理实例方法属性控制错误输出
    vm._renderProxy = vm
    vm._self = vm
    initLifecycle(vm)
  }
}
export function initInternalComponent(vm, options) {
  const opts = (vm.$options = Object.create(vm.constructor.options))
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}
