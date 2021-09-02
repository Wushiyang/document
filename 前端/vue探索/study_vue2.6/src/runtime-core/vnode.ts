/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:32:10
 * @LastEditTime: 2021-09-02 20:51:32
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
  asyncFactory: Function

  constructor(
    tag?: string | null,
    data?: VNodeData | null,
    children?: Array<VNode> | null,
    text?: string | null,
    elm?: Node | null,
    context?: Component | null,
    componentOptions?: VNodeComponentOptions | null,
    asyncFactory?: Function | null
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.context = context
    this.componentOptions = componentOptions
    this.asyncFactory = asyncFactory
  }
}

export interface VNodeData {
  key?: string | number | null
  slot?: string | null
  ref?: string | null
  attrs?: { [key: string]: string } | null
}
