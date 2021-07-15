/*
 * @Author: your name
 * @Date: 2021-07-10 17:03:30
 * @LastEditTime: 2021-07-10 17:18:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /create_vue2/src/observer/dep.js
 */
import { remove } from '../util/util'
let uid = 0
export default class Dep {
  static target
  id
  subs

  constructor() {
    this.id = uid++
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  removeSub(sub) {
    remove(this.subs, sub)
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify() {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    // if (process.env.NODE_ENV !== 'production' && !config.async) {
    //   // subs aren't sorted in scheduler if not running async
    //   // we need to sort them now to make sure they fire in correct
    //   // order
    //   subs.sort((a, b) => a.id - b.id)
    // }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
Dep.target = null
const targetStack = []

// 作用待定
export function pushTarget(target) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget() {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
