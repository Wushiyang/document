/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-18 16:45:43
 * @LastEditTime: 2021-09-24 11:37:23
 * @Description: ref模块
 */
import { VNodeWithData } from '@/runtime-core/index'
import { Component } from '@/runtime-core'
import { isOfType, remove } from '@/shared'
export default {
  create(_: unknown, vnode: VNodeWithData): void {
    registerRef(vnode)
  },
  update(oldVnode: VNodeWithData, vnode: VNodeWithData): void {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true)
      registerRef(vnode)
    }
  },
  destroy(vnode: VNodeWithData): void {
    registerRef(vnode, true)
  }
}

// 注册和注销ref
export const registerRef = (vnode: VNodeWithData, isRemoval = false): void => {
  const key = vnode.data.key
  if (key !== undefined && isOfType<Element>(vnode.elm, 'className')) {
    const vm = vnode.context
    const ref = vnode.componentInstance || vnode.elm
    const refs = vm.$refs
    const target = refs[key]
    if (isRemoval) {
      if (Array.isArray(target)) {
        remove(<Array<Component | Element>>target, ref)
      } else if (target === ref) {
        delete refs[key]
      }
    } else {
      if (vnode.data.refInFor && ref) {
        if (!Array.isArray(target)) {
          refs[key] = [ref]
        } else if ((<Array<Component | Element>>target).indexOf(ref) < 0) {
          target.push(ref)
        }
      } else {
        refs[key] = ref
      }
    }
  }
}
