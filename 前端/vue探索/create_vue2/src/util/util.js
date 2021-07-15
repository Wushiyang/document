/*
 * @Author: your name
 * @Date: 2021-07-10 15:02:22
 * @LastEditTime: 2021-07-12 09:34:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /create_vue2/src/util/util.js
 */
const _toString = Object.prototype.toString
// 判断obj是否是简单对象
export function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]'
}
// 合并_from属性到to
export function extend(to, _from) {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Perform no operation.
 */
export function noop(a, b, c) {}
/**
 * Always return false.
 */
export const no = (a, b, c) => false
/**
 * Return the same value.
 */
export const identity = (_) => _

export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Define a property.
 */
export function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
