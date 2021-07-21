import Compile from './Compile'
import { observe, Watcher } from './reactive/index'
/*
 * @Author: your name
 * @Date: 2021-07-08 09:09:37
 * @LastEditTime: 2021-07-09 10:11:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_directive/src/Vue.js
 */
export default class Vue {
  constructor(options) {
    this.$options = options || {}
    this._data = options.data || undefined
    // observe(this._data)
    // 默认数据变为响应式，这里就是生命周期
    this._initData()
    this._initWatch()
    // this._initComputed()
    new Compile(options.el, this)
    options.created && options.created.call(this)
  }
  _initData() {
    const that = this
    observe(this._data)
    // 将_data的数据挂载到vue实例上
    Object.keys(this._data).forEach((key) => {
      Object.defineProperty(this, key, {
        get() {
          return that._data[key]
        },
        set(value) {
          that._data[key] = value
        }
      })
    })
  }

  _initWatch() {
    if (
      Object.prototype.toString.call(this.$options.watch) === '[object Object]'
    ) {
      Object.keys(this.$options.watch).forEach((key) => {
        new Watcher(this._data, key, this.$options.watch[key])
      })
    }
  }
}
