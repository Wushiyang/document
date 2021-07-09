/*
 * @Author: your name
 * @Date: 2021-05-28 16:19:24
 * @LastEditTime: 2021-07-09 10:16:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_data_reactive/src/Watcher.js
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
  // 让全局的Dep的target设置为Watcher本身，那么就进入依赖收集阶段（进行依赖收集的get）
  get() {
    Dep.target = this
    const obj = this.target
    let value
    try {
      // 这里读取监控值的同时会进行依赖收集
      value = this.getter(obj)
    } finally {
      Dep.target = null
    }
    return value
  }
}
