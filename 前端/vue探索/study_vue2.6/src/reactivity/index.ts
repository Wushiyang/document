/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-29 11:13:59
 * @LastEditTime: 2021-09-29 12:13:43
 * @Description: 请描述该文件
 */

import { def } from '@/shared'
import { traverse } from './traverse'
import { Dep } from './dep'

export class Observer {
  value: unknown
  dep: Dep
  vmCount = 0 // number of vms that have this object as root $data

  __ob__?: Observer

  constructor(value: Object) {
    this.value = value
    def(value, '__ob__', this)
    this.dep = new Dep()
  }
}

export { traverse }
