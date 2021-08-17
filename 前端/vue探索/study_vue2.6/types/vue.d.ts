/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-08-17 17:14:21
 * @LastEditTime: 2021-08-17 20:57:44
 * @Description: vue声明文件
 */
import { componentsOptions } from './options'
import { VNode, VNodeData, NormalizedScopedSlot } from './vnode'
export interface Vue {
  readonly $el: Element
  readonly $options: componentsOptions
  readonly $parent: Vue
  readonly $root: Vue
  readonly $children: Vue
  readonly $refs: { [key: string]: Vue | Element | Vue[] | Element[] }
  readonly $slots: { [key: string]: VNode[] | undefined }
  readonly $scopedSlots: { [key: string]: NormalizedScopedSlot | undefined }
}
