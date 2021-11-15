/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-29 11:13:59
 * @LastEditTime: 2021-11-15 17:52:41
 * @Description: 请描述该文件
 */

import { def, hasProto, isDef, isObject, hasOwn, isServerRendering, isPlainObject } from '@/shared'
import { VNode } from '@/runtime-core'
import { traverse } from './traverse'
import { Dep, pushTarget, popTarget } from './dep'
import { Watcher } from './watcher'
import { arrayMethods } from './array'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * 某些情况下想要在组件更新计算里关闭观察
 */
export let shouldObserve: boolean = true

export function toggleObserving(value: boolean) {
  shouldObserve = value
}

/**
 * “发布者”Observer被绑定到被观察对象上，将被观察对象的可枚举属性值转成getter和setter，管理被观察对象的可枚举属性的读取和赋值，使用事件通道dep去收集依赖和分发更新
 * 所有属性可枚举将被监视，调用触发getter进行依赖收集。
 * 被观察者有个可写可配置不可枚举的属性__ob__，该属性指向该被观察者的“发布者”(Observer)。
 * value被观察者，dep事件通道，Observer“发布者”，watcher订阅者
 */
class Observer {
  value: unknown
  dep: Dep // “发布者”通过该事件通道来控制订阅者
  vmCount = 0 // 将该观察者作为根data的vue实例的数量

  constructor(value: Record<string, unknown> | Array<unknown>) {
    // 1、绑定__ob__
    this.value = value
    this.dep = new Dep() // 被观察对象的事件通道，附加在“发布者”上
    def(value, '__ob__', this) // value是被观察者，绑定“发布者”到被观察者上
    // 2、数组拦截操作并
    if (Array.isArray(value)) {
      // 替换函数操作
      if (hasProto) {
        // 从继承链拦截
        protoAugment(value, arrayMethods)
      } else {
        // 直接属性覆盖观察子项，对象直接观察属性
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  /**
   * 遍历全部属性并将它们转成getter和setter，当被观察对象是对象的时候使用
   */
  walk(obj: Record<string, unknown>) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  /**
   * 观察数组子项
   */
  observeArray(items: Array<unknown>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

// helpers

/**
 * 定义一个对象target继承自另一个对象src
 */
function protoAugment(target: unknown, src: unknown) {
  if (isDef(target)) {
    ;(target as { __proto__: unknown }).__proto__ = src
  }
}

/**
 * 定义一个对象target的一组属性keys是另一个对象src的同名属性并且非遍历的
 */
function copyAugment(target: unknown, src: Record<string, unknown>, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

/**
 * 观察value值，如果value是被观察者则返回观察对象，否则生成观察对象附加上并返回
 */
export function observe(value: unknown, asRootData = false): Observer | undefined {
  // 非对象或是VNode则返回空
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    // 存在观察对象则返回
    ob = value.__ob__
  } else if (shouldObserve && !isServerRendering() && (Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
    // 不存在则生成
    ob = new Observer(value)
  }
  // 是根data则计数vmCount
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}

/**
 * 将一个对象的一个属性变为被可观察者
 */
export function defineReactive(obj: Record<string, unknown>, key: string, val?: unknown, customSetter?: Function, shallow = false) {
  const dep = new Dep() // 该属性的事件通道

  // 如果该属性不可配置则返回
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  const getter = property && property.get
  const setter = property && property.set
  // 该属性无getter或有setter并且只传了obj和key，则val取obj[key]
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  // shallow非true则深观察（观察子项）
  let childOb = !shallow && observe(val)
  // 设置响应式，观察该属性
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      // 属性存在getter则调用原getter，不存在则读取value。
      const value = getter ? getter.call(obj) : val
      // 如果“当前订阅者”存在则进行依赖收集，一般初始化组件时会将当前组件watcher设为“当前订阅者”
      if (Dep.target) {
        dep.depend() // “当前订阅者”收集该依赖
        // 子项存在则进行子项的依赖收集，如果该属性是数组，则还要进行数组子项的依赖收集
        if (childOb) {
          childOb.dep.depend() // 对象触发收集依赖其实并没有用，因为无法通过修改对象来触发setter（只能通过修改对象属性触发setter）来发布更新，这里可能只是为了记录这个对象被订阅了吧
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      } // 可能用作测试
      /* eslint-enable no-self-compare */ if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal) // 新值如果是对象则添加“发布者”监视
      dep.notify() // 依赖分发更新
    }
  })
}

/**
 * 数组子项的依赖收集
 */
function dependArray(value: Array<any>) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
export { traverse, Watcher, Observer, pushTarget, popTarget }
