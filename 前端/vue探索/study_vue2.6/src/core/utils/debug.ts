/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-08-26 20:23:13
 * @LastEditTime: 2021-08-26 20:45:32
 * @Description: 请描述该文件
 */
import { Vue } from '../instance'
import { noop } from '../../shared/utils'
import config from '../config'

export let warn = noop

if (process.env.NODE_ENV !== 'production') {
  const hasConsole = typeof console !== 'undefined'
  warn = (msg: string, vm: Vue) => {
    const trace = vm ? generateComponentTrace(vm) : ''
    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace)
    } else if (hasConsole && !config.silent) {
      console.error(`[Vue warn]: ${msg}${trace}`)
    }
  }
}

function generateComponentTrace(vm: Vue) {
  return vm
}
