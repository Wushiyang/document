/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-29 11:13:52
 * @LastEditTime: 2021-09-29 12:11:21
 * @Description: 请描述该文件
 */

import { VNode } from '@/runtime-core'
import { isObject } from '@/shared'
import { Observer } from '.'

const seenObjects = new Set()

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
export function traverse(val: unknown) {
  _traverse(val, seenObjects)
  seenObjects.clear()
}

function _traverse(val: unknown, seen: Set<unknown>) {
  let i, keys
  const isA = Array.isArray(val)
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val instanceof Observer && val.__ob__) {
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
