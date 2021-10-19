/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-29 11:13:59
 * @LastEditTime: 2021-10-19 17:25:40
 * @Description: 请描述该文件
 */

import { def, hasProto, isDef, isObject, hasOwn, isServerRendering, isPlainObject } from '@/shared'
import { VNode } from '@/runtime-core'
import { traverse } from './traverse'
import { Dep, pushTarget, popTarget } from './dep'
import { Watcher } from './watcher'
import { arrayMethods } from './array'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
export let shouldObserve: boolean = true

export function toggleObserving(value: boolean) {
  shouldObserve = value
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
class Observer {
  value: unknown
  dep: Dep
  vmCount = 0 // number of vms that have this object as root $data

  __ob__?: Observer

  constructor(value: Record<string, unknown> | Array<unknown>) {
    this.value = value
    this.dep = new Dep()
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      // 替换函数操作
      if (hasProto) {
        // 从继承链拦截
        protoAugment(value, arrayMethods)
      } else {
        // 直接属性覆盖
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk(obj: Record<string, unknown>) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray(items: Array<unknown>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment(target: unknown, src: unknown) {
  if (isDef(target)) {
    ;(target as { __proto__: unknown }).__proto__ = src
  }
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
function copyAugment(target: unknown, src: Record<string, unknown>, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe(value: unknown, asRootData = false): Observer | undefined {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (shouldObserve && !isServerRendering() && (Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
export { traverse, Watcher, Observer, pushTarget, popTarget }
