/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-09 16:38:42
 * @LastEditTime: 2021-10-13 14:52:43
 * @Description: 请描述该文件
 */

import { config, Component } from '@/runtime-core'
import { noop } from './index'
export let generateComponentTrace: (vm: Component) => string | void = noop
export let formatComponentName: (vm: Component, includeFile?: boolean) => string | void = noop
export let warn: (msg: string, vm?: Component) => void = noop

if (process.env.NODE_ENV !== 'production') {
  const hasConsole = typeof console !== 'undefined'
  const classifyRE = /(?:^|[-_])(\w)/g
  const classify = (str: string): string => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, '')

  warn = (msg, vm?) => {
    const trace = vm ? (<(vm: Component) => string>generateComponentTrace)(vm) : ''

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace)
    } else if (hasConsole && !config.silent) {
      console.error(`[Vue warn]: ${msg}${trace}`)
    }
  }

  formatComponentName = (vm: Component, includeFile = false): string => {
    if (vm.$root === vm) {
      return '<Root>'
    }
    // TODO: 这里待定，可能vm也可用函数
    // const options = typeof vm === 'function' && vm.cid != null
    //   ? vm.options
    //   : vm._isVue
    //     ? vm.$options || vm.constructor.options
    //     : vm
    const options = vm.$options
    let name: unknown = options.name || options._componentTag
    const file = options.__file
    if (!name && file) {
      const match = file.match(/([^/\\]+)\.vue$/)
      name = match && match[1]
    }

    return (typeof name === 'string' && name !== '' ? `<${classify(name)}>` : `<Anonymous>`) + (file && includeFile !== false ? ` at ${file}` : '')
  }

  // 返回n个str的字符串
  // ps: 比较特殊的重复字符算法
  const repeat = (str: string, n: number) => {
    let res = ''
    while (n) {
      if (n % 2 === 1) res += str
      if (n > 1) str += str
      n >>= 1
    }
    return res
  }

  generateComponentTrace = (vm: Component): string => {
    if (vm._isVue && vm.$parent) {
      const tree: Array<Component | [Component, number]> = []
      let currentRecursiveSequence = 0
      while (vm) {
        if (tree.length > 0) {
          const last = tree[tree.length - 1]
          // 大概用于判断是否component还是vue吧
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++
            vm.$parent && (vm = vm.$parent)
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [<Component>last, currentRecursiveSequence]
            currentRecursiveSequence = 0
          }
        }
        tree.push(vm)
        vm.$parent && (vm = vm.$parent)
      }
      return (
        '\n\nfound in\n\n' +
        tree
          .map(
            (vm, i) =>
              `${i === 0 ? '---> ' : repeat(' ', 5 + i * 2)}${
                Array.isArray(vm) ? `${formatComponentName(vm[0])}... (${vm[1]} recursive calls)` : formatComponentName(vm)
              }`
          )
          .join('\n')
      )
    } else {
      return `\n\n(found in ${formatComponentName(vm)})`
    }
  }
}
