/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-07-27 20:19:20
 * @LastEditTime: 2021-08-20 20:09:25
 * @Description: 虚拟节点vnode类
 */
import { Component, Vue } from '../instance/index'
export default class VNode {
  tag: string | void
  data: VNodeData | void
  children: Array<VNode> | void
  text: string | void
  elm: Node | void
  ns: string | void
  context: Component | void
  key: string | number | void
  componentsOptions: VNodeComponentOptions | void
  componentsInstance: Component | void
  parent: VNode | void
}

export interface VNodeComponentOptions {
  Ctor: typeof Vue
  propsData?: object
}

export interface VNodeData {
  key?: string | number
  slot?: string
  scopedSlots?: { [key: string]: ScopedSlot | undefined }
  ref?: string
  refInFor?: boolean
  tag?: string
  staticClass?: string
  class?: any
  staticStyle?: { [key: string]: any }
  style?: string | object[] | object
  props?: { [key: string]: any }
  attrs?: { [key: string]: any }
  domProps?: { [key: string]: any }
  hook?: { [key: string]: Function }
  on?: { [key: string]: Function | Function[] }
  nativeOn?: { [key: string]: Function | Function[] }
  transition?: object
  show?: boolean
  inlineTemplate?: {
    render: Function
    staticRenderFns: Function[]
  }
  directives?: VNodeDirective[]
  keepAlive?: boolean
}

export interface VNodeDirective {
  name: string
  value?: any
  oldValue?: any
  expression?: any
  arg?: string
  oldArg?: string
  modifiers?: { [key: string]: boolean }
}
