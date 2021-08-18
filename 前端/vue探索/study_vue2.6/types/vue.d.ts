/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-08-17 17:14:21
 * @LastEditTime: 2021-08-18 17:52:35
 * @Description: vue声明文件
 */
import { componentsOptions, ThisTypedComponentOptionsWithArrayProps, ThisTypedComponentOptionsWithRecordProps } from './options'
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
  readonly $isServer: boolean
  readonly $data: Record<string, any>
  readonly $props: Record<string, any>
  readonly $ssrContext: any
  readonly $vnode: VNode
  readonly $attrs: Record<string, string>
  readonly $listeners: Record<string, Function | Function[]>

  $mount(elementOrSelector?: Element | string, hydrating?: boolean): this
  $forceUpdate(): void
  $destroy(): void
  // $set: typeof Vue.set
}

export type CombinedVueInstance<Instance extends Vue, Data, Methods, Computed, Props> = Instance & Vue & Data & Methods & Computed & Props

export interface VueConfiguration {}

export interface VueConstructor<V extends Vue = Vue> {
  new <Data = object, Methods = object, Computed = object, PropNames extends string = never>(
    options?: ThisTypedComponentOptionsWithArrayProps<V, Data, Methods, Computed, PropNames>
  ): CombinedVueInstance<V, Data, Methods, Computed, Record<PropNames, any>>
  new <Data = object, Methods = object, Computed = object, Props = object>(
    options?: ThisTypedComponentOptionsWithRecordProps<V, Data, Methods, Computed, Props>
  ): CombinedVueInstance<V, Data, Methods, Computed, Record<keyof Props, any>>

  config: VueConfiguration
}

export const Vue: VueConstructor
