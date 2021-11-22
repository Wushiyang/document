/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-11-22 09:06:39
 * @LastEditTime: 2021-11-22 15:36:18
 * @Description: 请描述该文件
 */

import { ModuleOptions, ASTElement } from './index'
export function baseWarn(msg: string, range?: unknown) {
  console.error(`[Vue compiler]: ${msg}`)
}

export function pluckModuleFunction<F extends keyof ModuleOptions>(modules?: Array<ModuleOptions>, key?: F): Array<ModuleOptions[F]> {
  return modules && key ? modules.map((m) => m[key]).filter((_) => _) : []
}

// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.
export function getAndRemoveAttr(el: ASTElement, name: string, removeFromMap?: boolean): unknown {
  let val = el.attrsMap[name]
  if (val != null) {
    const list = el.attrsList
    for (let i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1)
        break
      }
    }
  }
  if (removeFromMap) {
    delete el.attrsMap[name]
  }
  return val
}
