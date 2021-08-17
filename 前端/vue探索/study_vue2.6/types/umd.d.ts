/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-08-17 20:42:12
 * @LastEditTime: 2021-08-17 20:45:32
 * @Description: umd模块
 */
import * as V from './index'
declare namespace Vue {
  // vnode.d.ts
  export type VNode = V.VNode
}
