/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:23:55
 * @LastEditTime: 2021-09-09 20:58:37
 * @Description: 运行时核心
 */

import { config } from './config'
import { VNode, createBaseVNode, cloneVNode } from './vnode'

// let componentCid = 0
interface Vue {
  $el: Element | null
}

interface Component {
  // public properties
  $el: Element | null
  $parent: Component | null
  $root: Component
  $options: ComponentOptions

  // private properties
  _isVue: boolean
  _vnode: VNode | null
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
}

export { config, Vue, Component, VNode, createBaseVNode, cloneVNode, VNodeComponentOptions }
