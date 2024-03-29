/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-10-11 16:46:56
 * @LastEditTime: 2021-10-11 16:48:02
 * @Description: 请描述该文件
 */
/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */

import { Component } from '@/runtime-core'

/**
 * Validate component names
 */
function checkComponents(options: Object) {
  for (const key in options.components) {
    validateComponentName(key)
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
export function mergeOptions(parent: Record<string, unknown>, child: Record<string, unknown>, vm?: Component): Record<string, unknown> {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child)
  }

  if (typeof child === 'function') {
    child = child.options
  }

  normalizeProps(child, vm)
  normalizeInject(child, vm)
  normalizeDirectives(child)

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm)
    }
    if (child.mixins) {
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm)
      }
    }
  }

  const options = {}
  let key
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  function mergeField(key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}
