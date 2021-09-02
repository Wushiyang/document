/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-08-20 17:42:44
 * @LastEditTime: 2021-08-26 20:08:57
 * @Description: 请描述该文件
 */

import { VNode } from '../vdom/vnode'
import { ComponentOptions } from './options'

// export class Vue {
//   $el: Node | null
//   $refs: any
//   _vnode: VNode | null
// }
export interface Vue {
  $el: Element
  $options: ComponentOptions
  $parent: Vue
  $root: Vue
  $refs: { [key: string]: Vue | Node | Array<Vue | Node> | null }

  // 内部属性
  _vnode: VNode | null
}

export interface VueConstructor {}

// export const Vue: VueConstructor

export type Component = VueConstructor
