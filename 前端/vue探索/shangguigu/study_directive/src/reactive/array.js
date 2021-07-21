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
      const result = original.apply(this, args)
      switch (methodName) {
        case 'push':
        case 'unshift':
          inserted = args
          break
        case 'splice':
          inserted = args.slice(2)
          break
      }
      if (inserted.length > 0) {
        ob.observeArray(inserted)
      }
      console.log('啦啦啦')
      ob.dep.notify()
      return result
    },
    false
  )
})
