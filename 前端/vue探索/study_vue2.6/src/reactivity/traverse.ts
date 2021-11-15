/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-29 11:13:52
 * @LastEditTime: 2021-11-09 15:41:11
 * @Description: 请描述该文件
 */

import { VNode } from '@/runtime-core'
import { isObject, isOfType, _Set as Set, SimpleSet } from '@/shared'
import { Observer } from '.'

const seenObjects = new Set()

/**
 *  递归的访问一个对象的所有属性，用于触发转化的getter，致使这个对象的嵌套属性进行依赖搜集
 */
export function traverse(val: unknown): void {
  _traverse(val, seenObjects)
  seenObjects.clear()
}

function _traverse(val: unknown, seen: SimpleSet) {
  let i, keys
  const isA = Array.isArray(val)
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (isOfType<{ __ob__: Observer }>(val, '__ob__')) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else if (isObject(val)) {
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
