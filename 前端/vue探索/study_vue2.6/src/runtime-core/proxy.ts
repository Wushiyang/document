/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-10-12 16:22:39
 * @LastEditTime: 2021-10-13 11:20:02
 * @Description: 请描述该文件
 */
/* not type checking this file because flow doesn't play well with Proxy */

import { config } from './config'
import { warn, makeMap, isNative, noop } from '@/shared'
import { Component } from './index'

let initProxy: (vm: Component) => void = noop

if (process.env.NODE_ENV !== 'production') {
  const allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
      'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
      'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
      'require' // for Webpack/Browserify
  )

  const warnNonPresent = (target: Component, key: string) => {
    warn(
      `Property or method "${key}" is not defined on the instance but ` +
        'referenced during render. Make sure that this property is reactive, ' +
        'either in the data option, or for class-based components, by ' +
        'initializing the property. ' +
        'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    )
  }

  const warnReservedPrefix = (target: Component, key: string) => {
    warn(
      `Property "${key}" must be accessed with "$data.${key}" because ` +
        'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
        'prevent conflicts with Vue internals. ' +
        'See: https://vuejs.org/v2/api/#data',
      target
    )
  }

  const hasProxy = typeof Proxy !== 'undefined' && isNative(Proxy)

  if (hasProxy) {
    const isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact')
    config.keyCodes = new Proxy(config.keyCodes, {
      set(target, key, value) {
        if (typeof key === 'string') {
          if (isBuiltInModifier(key)) {
            warn(`Avoid overwriting built-in modifier in config.keyCodes: .${key}`)
          } else {
            target[key] = value
            return true
          }
        }
        return false
      }
    })
  }

  const hasHandler = {
    has(target: Component, key: string) {
      const has = key in target
      const isAllowed = allowedGlobals(key) || (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data))
      if (!has && !isAllowed) {
        if (key in target.$data) warnReservedPrefix(target, key)
        else warnNonPresent(target, key)
      }
      return has || !isAllowed
    }
  }

  const getHandler = {
    get(target: Component, key: keyof Component) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) warnReservedPrefix(target, key)
        else warnNonPresent(target, key)
      }
      return target[key]
    }
  }

  initProxy = function initProxy(vm: Component) {
    if (hasProxy) {
      // determine which proxy handler to use
      const options = vm.$options
      const handlers = options.render && options.render._withStripped ? getHandler : hasHandler
      vm._renderProxy = new Proxy(vm, handlers)
    } else {
      vm._renderProxy = vm
    }
  }
}

export { initProxy }
