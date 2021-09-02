/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-07-27 20:19:20
 * @LastEditTime: 2021-08-26 20:17:01
 * @Description: 虚拟节点vnode类
 */
import { Component, Vue, VueConstructor } from '../instance/index'
import { ComponentOptions } from '../instance/options'

export class VNode {
  tag?: string | null
  data?: VNodeData | null
  children?: Array<VNode> | null
  text?: string | null
  elm?: Node | null
  ns?: string | null
  context?: Vue | null
  key?: string | number | null
  componentsOptions?: VNodeComponentOptions | null
  componentsInstance?: Vue | null
  parent?: VNode | null

  // 内部属性
  raw?: boolean | null = false
  isStatic?: boolean | null = false
  isRootInsert?: boolean | null = true
  isComment?: boolean | null = false
  isCloned?: boolean | null = false
  isOnce?: boolean | null = false
  isAsyncPlaceholder?: boolean | null = false
  asyncFactory?: asyncFactory | null
  asyncMeta?: Object | null
  fnContext?: Vue | null
  fnOptions?: ComponentOptions | null
  fnScopeId?: string | null

  constructor(
    tag?: string | null,
    data?: VNodeData | null,
    children?: Array<VNode> | null,
    text?: string | null,
    elm?: Node | null,
    context?: Vue | null,
    componentsOptions?: VNodeComponentOptions | null,
    asyncFactory?: asyncFactory | null
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.context = context
    this.componentsOptions = componentsOptions
    this.asyncFactory = asyncFactory
  }

  get child(): Component | void {
    return this.componentsInstance
  }

  static createEmptyVNode(text: string = '') {
    const node = new VNode()
    node.text = text
    node.isComment = true
    return node
  }

  static createTextVNode(val: string | number) {
    return new VNode(null, null, null, String(val))
  }

  // 优化浅克隆
  // 用于静态节点和插槽节点，因为他们在重复渲染中可能被多次使用，克隆他们避免在基于他们elm引用的dom操作发生的错误
  static cloneVNode(vnode: VNode) {
    const cloned = new VNode(
      vnode.tag,
      vnode.data,
      vnode.children && vnode.children.slice(),
      vnode.text,
      vnode.elm,
      vnode.context,
      vnode.componentsOptions,
      vnode.asyncFactory
    )
    cloned.ns = vnode.ns
    cloned.isStatic = vnode.isStatic
    cloned.key = vnode.key
    cloned.isComment = vnode.isComment
    cloned.isCloned = true
    return cloned
  }
}

export interface asyncFactory {
  (): void
  error: any
}

export interface VNodeComponentOptions {
  Ctor: VueConstructor
  propsData?: object
}

export interface VNodeData {
  key?: string | number
  slot?: string
  scopedSlots?: { [key: string]: Function | undefined }
  ref?: string
  refInFor?: boolean
  tag?: string
  pre?: boolean
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
  // 内部属性
  pendingInsert?: any
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
