/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:23:55
 * @LastEditTime: 2021-10-13 17:27:49
 * @Description: 运行时核心
 */

import { config } from './config'
import { mark, measure, mergeOptions, formatComponentName, warn, isPlainObject, handleError } from '@/shared/index'
import { Watcher } from '@/reactivity'
import { VNode, VNodeWithData, cloneVNode } from './vnode'
import { initInternalComponent, resolveConstructorOptions } from './init'
import { initProxy } from './proxy'
import { initLifecycle, callHook } from './lifecycle'
import { initEvents } from './events'
import { initRender } from './render'
import { initInjections, initProvide } from './inject'
import { initState, createWatcher } from './state'

interface VNodeComponentOptions {
  Ctor: Component
  propsData: Record<string, unknown>
}

interface ComponentOptions {
  // DOM
  el?: Element | string

  // misc
  name?: string
  render?: {
    (): VNode
    _withStripped: boolean
  }

  // private
  _componentTag?: string
  _scopeId?: string
  __file?: string
}

let uid = 0
class Component {
  get $data() {
    return this._data
  }
  set $data(val: unknown) {
    if (process.env.NODE_ENV !== 'production') {
      warn('Avoid replacing instance root $data. ' + 'Use nested data properties instead.', this)
    }
  }
  get $props() {
    return this._props
  }
  set $props(val: unknown) {
    if (process.env.NODE_ENV !== 'production') {
      warn(`$props is readonly.`, this)
    }
  }

  $set() {}

  $del() {}

  $watch(expOrFn: string | (() => void), cb: (value: unknown) => void, options?: Record<string, unknown>): () => void {
    const vm = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value)
      } catch (error) {
        handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
      }
    }
    return function unwatchFn() {
      watcher.teardown()
    }
  }

  $options: ComponentOptions = Object.create(null)

  $el?: Element
  $parent?: Component
  $root?: Component
  $refs?: { [key: string]: Component | Element | Array<Component | Element> | undefined }

  // public methods
  $mount?: (el?: Element | string, hydrating?: boolean) => Component

  // private properties
  _uid: string | number = 0
  _isVue = true
  _vnode?: VNode
  _self: Component = this
  _data: Record<string, unknown> = Object.create(null)
  _props: Record<string, unknown> = Object.create(null)
  _name?: string
  _renderProxy?: Component | ProxyConstructor

  constructor(options: Record<string, unknown>) {
    this._init(options)
  }

  _init(options?: Record<string, unknown>) {
    const vm = this
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
      vm._name = <string>formatComponentName(vm, false)
      mark(<string>endTag)
      measure(`vue ${vm._name} init`, <string>startTag, <string>endTag)
    }

    if (vm.$options.el) {
      vm.$mount && vm.$mount(vm.$options.el)
    }
  }
}

export { config, Component, VNode, VNodeWithData, cloneVNode, VNodeComponentOptions }
