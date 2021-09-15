/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:32:10
 * @LastEditTime: 2021-09-15 16:37:33
 * @Description: 请描述该文件
 */

import { Component, VNodeComponentOptions } from '.'

export interface VNode {
  tag: string | null
  data: VNodeData | null
  children: Array<VNode> | null
  text: string | null
  elm: Element | Node | null
  ns: string | null
  context: Component | null
  key: string | number | null
  componentOptions: VNodeComponentOptions | null
  componentInstance: Component | null
  parent: VNode | null

  // strictly internal
  isStatic: boolean
  isRootInsert: boolean
  isComment: boolean
  isCloned: boolean
  asyncFactory: (() => void) | null
  asyncMeta: Record<string, unknown> | null
  isAsyncPlaceholder: boolean
  fnContext: Component | null
  fnOptions: Component | null
  fnScopeId: string | null
}

export const createBaseVNode = (
  tag: string | null = null,
  data: VNodeData | null = null,
  children: Array<VNode> | null = null,
  text: string | null = null,
  elm: Node | null = null,
  context: Component | null = null,
  componentOptions: VNodeComponentOptions | null = null,
  asyncFactory: (() => void) | null = null
): VNode => {
  return {
    tag,
    data,
    children,
    text,
    elm,
    ns: null,
    context,
    key: null,
    componentOptions,
    componentInstance: null,
    parent: null,

    isStatic: false,
    isRootInsert: false,
    isComment: false,
    isCloned: false,
    asyncFactory,
    asyncMeta: null,
    isAsyncPlaceholder: false,
    fnContext: null,
    fnOptions: null,
    fnScopeId: null
  }
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
export function cloneVNode(vnode: VNode): VNode {
  const cloned = createBaseVNode(
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
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.asyncMeta = vnode.asyncMeta
  cloned.isCloned = true
  return cloned
}

export interface VNodeData {
  key?: string | number
  slot?: string
  ref?: string
  attrs?: { [key: string]: string }
  pre?: boolean
  keepAlive?: boolean
  hook?: { [key: string]: (vnode: VNode, hydrating: boolean) => void }
  pendingInsert?: unknown
}
