/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:23:55
 * @LastEditTime: 2021-10-11 16:48:51
 * @Description: 运行时核心
 */

import { config } from './config'
import { Constructor, mark, warn, mergeOptions } from '@/shared/index'
import { VNode, VNodeWithData, cloneVNode } from './vnode'
import { initInternalComponent, resolveConstructorOptions } from './init'

// let componentCid = 0

interface VNodeComponentOptions {
  Ctor: Component
  propsData: Record<string, unknown>
}

interface ComponentOptions {
  __file?: string

  // misc
  name?: string

  // private
  _componentTag?: string
  _scopeId?: string
}

let uid = 0
class Vue {
  _init(this: Component, options: Record<string, unknown>) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm)
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}

class Component extends Vue {
  $el?: Element
  $options: ComponentOptions = {}
  $parent?: Component
  $root?: Component
  $refs?: { [key: string]: Component | Element | Array<Component | Element> | undefined }

  // private properties
  _uid: string | number = 0
  _isVue = true
  _vnode?: VNode

  constructor(options: Record<string, unknown>) {
    super()
    if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {
      warn('Vue is a constructor and should be called with the `new` keyword')
    }
    this._init(options)
  }
}

export { config, Vue, Component, VNode, VNodeWithData, cloneVNode, VNodeComponentOptions }
