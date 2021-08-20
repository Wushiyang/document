/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-08-17 16:13:34
 * @LastEditTime: 2021-08-20 17:07:39
 * @Description: vnode模块声明文件
 */
import { Vue } from './vue'
// TODO: ScopedSlot和NormalizedScopedSlot区别暂未知
export type ScopedSlot = (props: any) => ScopedSlotReturnValue
type ScopedSlotReturnValue = VNode | string | boolean | null | undefined | ScopedSlotReturenArray
interface ScopedSlotReturenArray extends Array<ScopedSlotReturnValue> {}
// 在Vue2.6后确保作用域插槽(scoped slot)返回Vnode数组
export type NormalizedScopedSlot = (props: any) => ScopedSlotChildren
export type ScopedSlotChildren = VNode[] | undefined

export type VNodeChildren = VNodeChildrenArrayContents | [ScopedSlot] | string | boolean | null | undefined
export interface VNodeChildrenArrayContents extends Array<VNodeChildren | VNode> {}

export interface VNode {
  tag?: string
  data?: VNodeData
  children?: VNode[]
  text?: string
  elm?: Node
  ns?: string
  context?: Vue
  key?: string | number
  componentsOptions?: VNodeComponentOptions
  componentsInstance?: Vue
  parent?: VNode
  raw?: boolean
  isStatic?: boolean
  isRootInsert: boolean
  isComment: boolean
}

export interface VNodeComponentOptions {
  // Ctor: typeof Vue
  propsData?: object
  listeners?: object
  children?: VNode[]
  tag?: string
}

declare interface VNodeData {
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
  drectives?: VNodeDirective[]
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
