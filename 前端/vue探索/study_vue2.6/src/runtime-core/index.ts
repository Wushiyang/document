/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:23:55
 * @LastEditTime: 2021-09-23 20:47:17
 * @Description: 运行时核心
 */

import { config } from './config'
import { VNode, VNodeWithData, createBaseVNode, cloneVNode } from './vnode'

// let componentCid = 0
interface Vue {
  $el: Element | null
}

interface Component {
  // public properties
  $el?: Element
  $parent?: Component
  $root: Component
  $options: ComponentOptions
  $refs: { [key: string]: Component | Element | Array<Component | Element> | void }

  // private properties
  _isVue: boolean
  _vnode?: VNode
}

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

export { config, Vue, Component, VNode, VNodeWithData, createBaseVNode, cloneVNode, VNodeComponentOptions }
