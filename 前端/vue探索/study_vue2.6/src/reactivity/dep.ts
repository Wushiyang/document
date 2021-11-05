/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-29 11:47:42
 * @LastEditTime: 2021-11-05 15:57:56
 * @Description: 请描述该文件
 */
import { remove } from '@/shared'
import { config } from '@/runtime-core'
import { Watcher } from './watcher'
let uid = 0

/**
 * 事件通道，用于控制订阅者watcher
 */
export class Dep {
  static target?: Watcher // “当前订阅者”
  id: number
  subs: Array<Watcher> // 订阅者数组

  constructor() {
    this.id = uid++
    this.subs = []
  }

  /**
   * 添加控制的订阅者
   */
  addSub(sub: Watcher) {
    this.subs.push(sub)
  }

  /**
   * 移除控制的订阅者
   */
  removeSub(sub: Watcher) {
    remove(this.subs, sub)
  }

  /**
   * 收集：收集依赖
   */
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  /**
   * 分发：通知订阅者更新
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
