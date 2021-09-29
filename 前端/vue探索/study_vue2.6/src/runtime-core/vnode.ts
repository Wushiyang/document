/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:32:10
 * @LastEditTime: 2021-09-29 11:55:34
 * @Description: 请描述该文件
 */

import { Component, VNodeComponentOptions } from '.'

export class VNode {
  tag?: string
  data?: VNodeData
  children?: Array<VNode>
  text?: string
  elm?: Element | Node
  ns?: string
  context?: Component
  key?: string | number
  componentOptions?: VNodeComponentOptions
  componentInstance?: Component
  parent?: VNode

  // strictly internal
  isStatic: boolean
  isRootInsert: boolean
  isComment: boolean
  isCloned: boolean
  isOnce: boolean
  asyncFactory?: {
    (): void
    resolved?: boolean
  }
  asyncMeta?: Record<string, unknown>
  isAsyncPlaceholder: boolean
  fnContext?: Component
  fnOptions?: Component
  fnScopeId?: string

  constructor(
    tag?: string,
    data?: VNodeData,
    children?: Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: () => void
  ) {
    this.isStatic = false
    this.isRootInsert = false
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.isAsyncPlaceholder = false

    tag && (this.tag = tag)
    data && (this.data = data)
    children && (this.children = children)
    text && (this.text = text)
    elm && (this.elm = elm)
    context && (this.context = context)
    componentOptions && (this.componentOptions = componentOptions)
    asyncFactory && (this.asyncFactory = asyncFactory)
  }
}

export interface VNodeWithData {
  tag: string
  data: VNodeData
  children?: Array<VNode>
  elm?: Element | Node
  ns?: string
  context: Component
  key?: string | number
  componentOptions?: VNodeComponentOptions
  componentInstance?: Component
  parent?: VNodeWithData
  isRootInsert: boolean
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
export function cloneVNode(vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  vnode.ns && (cloned.ns = vnode.ns)
  cloned.isStatic = vnode.isStatic
  vnode.key && (cloned.key = vnode.key)
  cloned.isComment = vnode.isComment
  vnode.fnContext && (cloned.fnContext = vnode.fnContext)
  vnode.fnOptions && (cloned.fnOptions = vnode.fnOptions)
  vnode.fnScopeId && (cloned.fnScopeId = vnode.fnScopeId)
  vnode.asyncMeta && (cloned.asyncMeta = vnode.asyncMeta)
  cloned.isCloned = true
  return cloned
}

export interface VNodeData {
  key?: string | number
  slot?: string
  staticClass?: string
  class?: unknown
  ref?: string
  attrs?: Partial<{ [key: string]: string }>
  domProps?: Partial<{ [key: string]: unknown }>
  pre?: boolean
  keepAlive?: boolean
  refInFor?: boolean
  hook?: Partial<{ [key: string]: (a: unknown, b?: unknown) => void }>
  pendingInsert?: unknown
  transition?: Record<string, unknown>
}
