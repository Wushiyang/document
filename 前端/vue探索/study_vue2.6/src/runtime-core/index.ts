/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:23:55
 * @LastEditTime: 2021-09-08 15:38:12
 * @Description: 运行时核心
 */

import { config } from './config'
import { VNode } from './vnode'
class Vue {
  $el: Element | null
}

class Component {
  $el: Element | null
}

interface VNodeComponentOptions {
  Ctor: Component
  propsData: Record<string, unknown>
}
export { config, Vue, VNode, Component, VNodeComponentOptions }
