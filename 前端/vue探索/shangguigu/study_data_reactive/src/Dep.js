// import './Watcher.js'
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
  // 收集依赖
  depend() {
    if (Dep.target) {
      this.addSubs(Dep.target)
    }
  }
  // 通知收集的每个依赖进行更新
  notify() {
    console.log('notify')
    const subs = this.subs.slice()

    for (let i = 0, len = subs.length; i < len; i++) {
      subs[i].update()
    }
  }
}
