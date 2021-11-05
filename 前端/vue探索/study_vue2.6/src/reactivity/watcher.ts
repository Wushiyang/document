/* @flow */

import { warn, remove, isObject, parsePath, _Set as Set, SimpleSet, handleError, noop } from '@/shared'
import { Component } from '@/runtime-core'
import { traverse } from './traverse'
import { queueWatcher } from './scheduler'
import { Dep, pushTarget, popTarget } from './dep'
let uid = 0

export interface watcherOptions {
  deep?: boolean
  user?: boolean
  lazy?: boolean
  sync?: boolean
  dirty?: boolean
  active?: boolean
  before?: Function
}

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
export class Watcher {
  vm: Component
  expression: string
  cb: Function
  id: number
  deep: boolean
  user: boolean
  lazy: boolean
  sync: boolean
  dirty: boolean
  active: boolean
  deps: Array<Dep> // 关联的事件通道数组
  newDeps: Array<Dep> // 新的关联的事件通道数组
  depIds: SimpleSet // 关联的事件通道的id集合
  newDepIds: SimpleSet // 新的关联的事件通道的id集合
  before?: Function
  getter: Function
  value: unknown

  constructor(vm: Component, expOrFn: string | Function, cb: Function, options?: watcherOptions, isRenderWatcher = false) {
    this.vm = vm
    // 如果是渲染watcher则附加上
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production' ? expOrFn.toString() : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      const parsePathFn = parsePath(expOrFn)
      if (parsePathFn) {
        this.getter = parsePathFn
      } else {
        this.getter = noop
        process.env.NODE_ENV !== 'production' &&
          warn(`Failed watching path: "${expOrFn}" ` + 'Watcher only accepts simple dot-delimited paths. ' + 'For full control, use a function instead.', vm)
      }
    }
    this.value = this.lazy ? undefined : this.get()
  }

  /**
   * 返回被观察者的值并将此“订阅者”设为“当前订阅者”，调用被观察者的属性触发依赖收集
   */
  get() {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(<Error>e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw <Error>e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  /**
   * 添加关联事件通道
   */
  addDep(dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  /**
   * 清除关联事件通道
   */
  cleanupDeps() {
    let i = this.deps.length
    // 循环删除关联的事件中心
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmpIds = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmpIds
    this.newDepIds.clear()
    let tmps = this.deps
    this.deps = this.newDeps
    this.newDeps = tmps
    this.newDeps.length = 0
  }

  /**
   * 更新订阅者
   */
  update() {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }

  /**
   * 运行订阅回调
   */
  run() {
    if (this.active) {
      const value = this.get()
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(<Error>e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  evaluate() {
    this.value = this.get()
    this.dirty = false
  }

  /**
   * 通知相关事件通道进行依赖收集
   */
  depend() {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  /**
   * 将该订阅者从关联事件通道里移除
   */
  teardown() {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this)
      }
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }
}
