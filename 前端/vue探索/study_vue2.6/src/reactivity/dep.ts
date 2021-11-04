/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-29 11:47:42
 * @LastEditTime: 2021-11-04 16:08:27
 * @Description: 请描述该文件
 */
import { remove } from '@/shared'
import { config } from '@/runtime-core'
import { Watcher } from './watcher'
let uid = 0

/**
 * 依赖对象，用于收集被观察者的观察者watcher
 */
export class Dep {
  static target?: Watcher // 当前订阅者
  id: number
  subs: Array<Watcher> // 控制的观察者的数组，订阅者数组，这里的订阅者是观察者watcher

  constructor() {
    this.id = uid++
    this.subs = []
  }

  /**
   * 添加控制的观察者
   */
  addSub(sub: Watcher) {
    this.subs.push(sub)
  }

  /**
   * 移除控制的观察者
   */
  removeSub(sub: Watcher) {
    remove(this.subs, sub)
  }

  /**
   * 收集依赖
   */
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  /**
   * 通知订阅者/订阅被观察者的观察者更新
   */
  notify() {
    // 稳定订阅者数组
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    // 触发订阅者更新
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = undefined
const targetStack: Array<Watcher | undefined> = [] // 订阅者收集栈

export function pushTarget(target?: Watcher) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget() {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
