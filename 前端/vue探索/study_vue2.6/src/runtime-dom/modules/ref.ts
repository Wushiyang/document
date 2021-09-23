/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-18 16:45:43
 * @LastEditTime: 2021-09-23 20:59:04
 * @Description: ref模块
 */
import { VNodeWithData } from '@/runtime-core/index'
import { Component } from '@/runtime-core'
import { remove } from '@/shared'
export default {}

export const registerRef = (vnode: VNodeWithData, isRemoval: Boolean = false) => {
  const key = vnode.data.key
  if (key === undefined) return
  const vm = vnode.context
  const ref = vnode.componentInstance || vnode.elm
  const refs = vm.$refs
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(<Array<Component | Element>>refs[key], ref)
    } else if (refs[key] === ref) {
      delete refs[key]
    }
  } else {
    if (vnode.data.refInFor && ref) {
      if (Array.isArray(refs[key])) {
        refs[key] = [ref]
      } else if (refs[key] === ref) {
        delete refs[key]
      }
    }
  }
}
