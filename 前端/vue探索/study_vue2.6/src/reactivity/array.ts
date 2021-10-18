/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-10-15 16:05:50
 * @LastEditTime: 2021-10-18 09:11:56
 * @Description: 请描述该文件
 */
import { Observer } from './index'
import { def } from '@/shared'
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)
const methodsToPatch: Array<keyof Array<unknown>> = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']
/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method as string, function mutator(this: Observer, ...args: unknown[]) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
