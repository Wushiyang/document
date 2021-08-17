/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-07-27 20:19:20
 * @LastEditTime: 2021-08-17 16:54:33
 * @Description: 虚拟节点vnode类
 */
export default class VNode {
  tag: string | void
  data: VNodeData | void
  children: ?Array<VNode>
  text: string | void
  elm: Node | void
  ns: string | void
  context: Components | void
  key: string | number | void
  componentsOptions: VNodeComponentOptions | void
  componentsInstance: Component | void
  parent: VNode | void
}
