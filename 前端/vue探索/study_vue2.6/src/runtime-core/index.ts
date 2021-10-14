/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:23:55
 * @LastEditTime: 2021-10-14 18:15:05
 * @Description: 运行时核心
 */

import { config } from './config'
import { mark, measure, mergeOptions, formatComponentName, warn, isPlainObject, handleError, remove } from '@/shared/index'
import { Watcher } from '@/reactivity'
import { VNode, VNodeWithData, cloneVNode } from './vnode'
import { initInternalComponent, resolveConstructorOptions } from './init'
import { initState, createWatcher } from './state'
import { initEvents } from './events'
import { initLifecycle, callHook, setActiveInstance } from './lifecycle'
import { initRender } from './render'
import { initProxy } from './proxy'
import { initInjections, initProvide } from './inject'

interface VNodeComponentOptions {
  Ctor: Component
  propsData: Record<string, unknown>
}

interface ComponentOptions {
  // DOM
  el?: Element | string
  abstract: boolean

  // misc
  name?: string
  render?: {
    (): VNode
    _withStripped: boolean
  }

  // private
  _componentTag?: string
  _parentListeners?: Record<string, unknown>
  _scopeId?: string
  __file?: string
}

let uid = 0
class Component {
  $options: ComponentOptions = Object.create(null)
  $el?: Element & { __vue__?: Component }
  $parent?: Component
  $children?: Array<Component>
  $root?: Component
  $refs?: { [key: string]: Component | Element | Array<Component | Element> | undefined }
  $vnode?: VNode // the placeholder node for the component in parent's render tree

  // public methods
  $mount?: (el?: Element | string, hydrating?: boolean) => Component
  $off: (event?: string | Array<string>, fn?: Function) => Component

  // private properties
  _uid: string | number = 0
  _isVue = true
  _vnode?: VNode
  _self: Component = this
  _data: Record<string, unknown> = Object.create(null)
  _props: Record<string, unknown> = Object.create(null)
  _name?: string
  _watcher: Watcher
  _watchers: Array<Watcher>
  _isDestroyed = false
  _isBeingDestroyed = false
  _renderProxy?: Component | ProxyConstructor
  __patch__?: (a: Element | VNode | void, b: VNode, hydrating?: boolean, removeOnly?: boolean, parentElm?: any, refElm?: any) => any

  constructor(options: Record<string, unknown>) {
    this._init(options)
  }

  // initMixin
  _init(this: Component, options: Record<string, unknown>): void {
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
  // stateMixin
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
        handleError(<Error>error, vm, `callback for immediate watcher "${watcher.expression}"`)
      }
    }
    return function unwatchFn() {
      watcher.teardown()
    }
  }
  // eventsMixin
  _events: Record<string, unknown> = Object.create(null)
  _hasHookEvent = false // TODO initEvents的初始化待搞懂
  // lifecycleMixin
  _update(vnode: VNode, hydrating = false) {
    const vm = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()
    // update __vue__ reference
    if (prevEl) {
      delete prevEl.__vue__
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }
  $forceUpdate() {
    const vm = this
    if (vm._watcher) {
      vm._watcher.update()
    }
  }
  $destroy() {
    const vm = this
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy')
    vm._isBeingDestroyed = true
    // remove self from parent
    const parent = vm.$parent
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(<Array<Component>>parent.$children, vm)
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown()
    }
    let i = vm._watchers.length
    while (i--) {
      vm._watchers[i].teardown()
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--
    }
    // call the last hook...
    vm._isDestroyed = true
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null) // TODO 有矛盾 待证实
    // fire destroyed hook
    callHook(vm, 'destroyed')
    // turn off all instance listeners.
    vm.$off()
    // remove __vue__ reference
    if (vm.$el) {
      delete vm.$el.__vue__
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      delete vm.$vnode.parent
    }
  }
}
export { config, Component, VNode, VNodeWithData, cloneVNode, VNodeComponentOptions }
