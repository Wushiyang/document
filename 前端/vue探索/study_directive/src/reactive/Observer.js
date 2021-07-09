import { def } from './utils.js'
import defineReative from './defineReative.js'
import { arrayMethods } from './array.js'
import Dep from './Dep.js'
export default class Observer {
  constructor(obj) {
    // 每一个Observer实例里面都有个Dep
    this.dep = new Dep()
    // 将包装对象__ob__属性置为当前Observer实例
    def(obj, '__ob__', this, false)
    if (Array.isArray(obj)) {
      // 数组
      Object.setPrototypeOf(obj, arrayMethods)
      this.observeArray(obj)
    } else {
      this.walk(obj)
    }
  }
  walk(value) {
    for (let k in value) {
      defineReative(value, k)
    }
  }

  observeArray(arr) {
    for (let i = 0; i < arr.length; i++) {
      defineReative(arr, i)
    }
  }
}
