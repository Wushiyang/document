/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-08-25 09:11:48
 * @LastEditTime: 2021-08-26 17:37:40
 * @Description: ref模块
 */
import { isDef, isOfType, remove } from '../../../shared/utils'
import { VNode } from '../vnode'
import { Vue } from '../../instance'

export default {
  create: () => {},
  update: () => {},
  destroy: () => {}
}

// 注册vnode为ref或注销为vnode的ref
export function registerRef(vnode: VNode, isRemoval: boolean = false) {
  const key = vnode.data.ref
  if (!isDef(key)) return

  const vm = vnode.context
  const ref = vnode.componentsInstance || vnode.elm
  const refs = vm.$refs
  const target = refs[key]
  // 注销ref，如果refs[key]是数组则删除那项否则删除ref
  if (isRemoval) {
    if (Array.isArray(target)) {
      remove(target, ref)
    } else if (target === ref) {
      delete refs[key]
    }
  } else {
    // 注册ref，如果是refInFor是true，则注册数组否则就注册单个组件或元素
    if (vnode.data.refInFor) {
      if (!Array.isArray(target)) {
        refs[key] = [ref]
      } else if (target.indexOf(ref) < 0) target.push(ref)
    } else {
      refs[key] = ref
    }
  }
}
