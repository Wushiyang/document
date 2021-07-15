/*
 * @Author: your name
 * @Date: 2021-07-10 11:28:35
 * @LastEditTime: 2021-07-10 15:48:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /create_vue2/src/index.js
 */
import { initMixin } from './init'
export default class Vue {
  constructor(options) {
    this._init(options)
  }
}

initMixin(Vue)
