/*
 * @Author: your name
 * @Date: 2021-05-28 09:29:11
 * @LastEditTime: 2021-07-08 11:38:25
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /study_data_reactive/src/array.js
 */
// 改写push、pop、shift、unshift、splice、sort、reverse
// [push, pop, shift, unshift, splice, sort, reverse]

import { def } from './utils'
const methodsNeedChange = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
const arrayPrototype = Array.prototype

export const arrayMethods = Object.create(arrayPrototype)

methodsNeedChange.forEach((methodName) => {
  const original = arrayPrototype[methodName]
  def(
    arrayMethods,
    methodName,
    function (...args) {
      const ob = this.__ob__
      let inserted = []
      // 调用数组原方法
      const result = original.apply(this, args)
      // 寻找新加项
      switch (methodName) {
        case 'push':
        case 'unshift':
          inserted = args
          break
        case 'splice':
          inserted = args.slice(2)
          break
      }
      // 有新加项则进行监控
      if (inserted.length > 0) {
        ob.observeArray(inserted)
      }
      console.log('啦啦啦')
      // 通知依赖，进行更新
      ob.dep.notify()
      return result
    },
    false
  )
})
