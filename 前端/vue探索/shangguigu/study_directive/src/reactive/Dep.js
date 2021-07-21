/*
 * @Author: your name
 * @Date: 2021-07-08 10:53:41
 * @LastEditTime: 2021-07-09 09:59:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_directive/src/reactive/Dep.js
 */
let uid = 0
export default class Dep {
  constructor() {
    // console.log('Dep类')
    this.id = uid++
    // 用数组存储订阅者
    // 这里面放的是Watcher的实例
    this.subs = []
  }
  // 添加订阅
  addSubs(sub) {
    this.subs.push(sub)
  }
  // 添加依赖
  depend() {
    if (Dep.target) {
      this.addSubs(Dep.target)
    }
  }
  // 通知更新
  notify() {
    console.log('notify')
    const subs = this.subs

    for (let i = 0, len = subs.length; i < len; i++) {
      subs[i].update()
    }
  }
}
