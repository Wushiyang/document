/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:23:55
 * @LastEditTime: 2021-11-15 09:30:08
 * @Description: 运行时核心
 */

import { config } from './config'
import { mark, measure, mergeOptions, formatComponentName, warn, isPlainObject, handleError, remove, Constructor } from '@/shared/index'
import { Watcher } from '@/reactivity'
import { VNode, VNodeWithData, cloneVNode } from './vnode'
import { initMixin } from './init'
import { stateMixin } from './state'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './render'
import { initInjections, initProvide } from './inject'

interface VNodeComponentOptions {
  Ctor: Component
  propsData: Record<string, unknown>
}

interface ComponentOptions {
  // DOM
  el?: Element | string
  abstract: boolean

  // lifecycle
  errorCaptured?: () => boolean | void

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

  // private properties
  _uid: string | number = 0
  _isVue = true
  _vnode?: VNode
  _self: Component = this
  _data: Record<string, unknown> = Object.create(null)
  _props: Record<string, unknown> = Object.create(null)
  _name?: string
  _events: Record<string, unknown> = Object.create(null)
  _hasHookEvent = false // TODO initEvents的初始化待搞懂
  _watcher?: Watcher // 暂定是可能存在
  _watchers: Array<Watcher> = []
  _isDestroyed = false
  _isBeingDestroyed = false
  _renderProxy?: Component | ProxyConstructor
  __patch__?: (a: Element | VNode | void, b: VNode, hydrating?: boolean, removeOnly?: boolean, parentElm?: any, refElm?: any) => any

  constructor(options?: Record<string, unknown>) {
    this._init(options)
  }

  // initMixin
  _init!: (options?: Record<string, unknown>) => void
  // // stateMixin
  $data!: Record<string, unknown>
  $props!: Record<string, unknown>
  $set() {}
  $del() {}
  $watch!: (expOrFn: string | (() => void), cb: (value: unknown) => void, options?: Record<string, unknown>) => void
  // eventsMixin
  $on!: (event: string | Array<string>, fn: () => void) => Component
  $once!: (this: Component, event: string, fn: Function) => Component
  $off!: (event?: string | Array<string>, fn?: () => void) => Component
  $emit!: (event: string) => Component
  // lifecycleMixin
  _update!: (this: Component, vnode: VNode, hydrating?: boolean) => void
  $forceUpdate!: () => void
  $destroy!: () => void
  // renderMixin
  $nextTick!: (fn: () => void) => void
  _render!: () => VNode
  _o!: () => void
  _n!: () => void
  _s!: () => void
  _l!: () => void
  _t!: () => void
  _q!: () => void
  _i!: () => void
  _m!: () => void
  _f!: () => void
  _k!: () => void
  _b!: () => void
  _v!: () => void
  _e!: () => void
  _u!: () => void
  _g!: () => void
  _d!: () => void
  _p!: () => void
}
const a = new Component()

initMixin(Component)
stateMixin(Component)
eventsMixin(Component)
lifecycleMixin(Component)
renderMixin(Component)
export { config, Component, VNode, VNodeWithData, cloneVNode, VNodeComponentOptions }
