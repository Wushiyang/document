/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:32:10
 * @LastEditTime: 2021-09-08 15:37:51
 * @Description: 请描述该文件
 */

import { Component, VNodeComponentOptions } from '.'

export class VNode {
  tag: string | null
  key: string | number | null
  data: VNodeData | null
  children: Array<VNode> | null
  text: string | null
  elm: Node | null
  context: Component | null
  componentOptions: VNodeComponentOptions | null

  isAsyncPlaceholder: boolean
  asyncFactory: (() => void) | null

  constructor(
    tag: string | null = null,
    data: VNodeData | null = null,
    children: Array<VNode> | null = null,
    text: string | null = null,
    elm: Node | null = null,
    context: Component | null = null,
    componentOptions: VNodeComponentOptions | null = null,
    asyncFactory: (() => void) | null = null
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.context = context
    this.componentOptions = componentOptions
    this.asyncFactory = asyncFactory
    this.key = null
    this.isAsyncPlaceholder = false
  }
}

export interface VNodeData {
  key?: string | number
  slot?: string
  ref?: string
  attrs?: { [key: string]: string }
}
