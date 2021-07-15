/*
 * @Author: your name
 * @Date: 2021-07-10 14:53:36
 * @LastEditTime: 2021-07-10 15:28:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /create_vue2/src/util/options.js
 */
import { isPlainObject, extend, hasOwn } from './util'
// 选项合并策略
const strats = config.optionMergeStrategies
// 默认选项合并策略
const defaultStrat = function (parentVal, childVal) {
  return childVal === undefined ? parentVal : childVal
}
export function mergeOptions(parent, child, vm) {
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
// 规范化props属性 { type }
function normalizeProps(options, vm) {
  const props = options.props
  if (!props) return
  const res = {}
  let i, val
  if (Array.isArray(props)) {
    i = props.length
    while (i--) {
      val = props[i]
      if (typeof val === 'string') {
        res[val] = { type: null }
      }
    }
  } else if (isPlainObject(props)) {
    for (const key in props) {
      val = props[key]
      res[key] = isPlainObject(val) ? val : { type: val }
    }
  } else {
    return console.error('util - options.js - normalizeProps 出错了', vm)
  }
  return res
}
// 规范化inject属性 { from }
function normalizeInject(options, vm) {
  const inject = options.inject
  if (!inject) return
  const normalized = (options.inject = {})
  if (Array.isArray(inject)) {
    for (let i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] }
    }
  } else if (isPlainObject(inject)) {
    for (const key in inject) {
      const val = inject[key]
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val }
    }
  } else {
    return console.error('util - options.js - normalizeInject 出错了', vm)
  }
}
// 规范化directives属性 { bind, update }
function normalizeDirectives(options) {
  const dirs = options.directives
  if (dirs) {
    for (const key in dirs) {
      const def = dirs[key]
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def }
      }
    }
  }
}
