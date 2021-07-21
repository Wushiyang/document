/*
 * @Author: your name
 * @Date: 2021-07-08 10:53:41
 * @LastEditTime: 2021-07-09 10:21:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_directive/src/reactive/defineReative.js
 */
import observe from './observe.js'
import Dep from './Dep.js'
export default function defineReative(data, key, val) {
  const dep = data.__ob__.dep // 该方法用在Observer对象里，确保已经存在__ob__
  if (arguments.length == 2) {
    val = data[key]
  }
  // 子元素进行observe
  let childOb = observe(val)
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      console.log(`访问了属性${key}`)
      // 如果处于依赖收集阶段
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
        }
      }
      return val
    },
    set(newValue) {
      if (val === newValue) return
      console.log(`修改了属性${key}`)
      val = newValue
      childOb = observe(val)
      // 发布订阅模式，通知dep
      dep.notify()
    }
  })
}
