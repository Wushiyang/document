/*
 * @Author: your name
 * @Date: 2021-07-08 10:53:41
 * @LastEditTime: 2021-07-09 10:14:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_directive/src/reactive/Watcher.js
 */
import Dep from './Dep'

let uid = 0
function parsePath(str) {
  const segments = str.split('.')
  return (obj) => {
    segments.forEach((key) => {
      obj = obj[key]
    })
    return obj
  }
}
export default class Watcher {
  constructor(target, expression, callback) {
    console.log('watcher类')
    this.id = uid++
    this.target = target
    this.getter = parsePath(expression)
    this.callback = callback
    this.value = this.get()
  }
  update() {
    this.run()
  }
  run() {
    this.getAndInvoke(this.callback)
  }
  getAndInvoke(cb) {
    const value = this.getter(this.target)
    if (value !== this.value || typeof value == 'object') {
      const oldValue = this.value
      this.value = value
      cb.call(this.target, value, oldValue)
    }
  }
  get() {
    // 让全局的Dep的target设置为Watcher本身，那么就进入依赖收集阶段（进行依赖收集的get）
    Dep.target = this
    const obj = this.target
    let value
    try {
      value = this.getter(obj)
    } finally {
      Dep.target = null
    }
    return value
  }
}
