/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:13:13
 * @LastEditTime: 2021-09-28 09:25:03
 * @Description: dom操作
 */
import { VNode } from '@/runtime-core'
import { namespaceMap } from '@/shared'

export type nodeOps = typeof nodeOps

export const nodeOps = {
  // 创建dom元素
  createElement(tagName: string, vnode: VNode): Element {
    const elm = document.createElement(tagName)
    if (tagName !== 'select') return elm
    // select标签下设置multiple，值为false或null会移除属性，undefined则不会移除属性，所以重新设置下
    if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) elm.setAttribute('multiple', 'multiple')
    return elm
  },
  // 创建命名空间dom元素
  createElementNS(namespace: string, tagName: string): Element {
    return document.createElementNS(namespaceMap[namespace], tagName)
  },
  // 创建文本节点
  createTextNode(text: string): Text {
    return document.createTextNode(text)
  },
  // 创建注释节点
  createComment(text: string): Comment {
    return document.createComment(text)
  },
  // 在节点前插入节点
  insertBefore(parentNode: Node, newNode: Node, referenceNode: Node | null = null): void {
    parentNode.insertBefore(newNode, referenceNode)
  },
  // 移除子节点
  removeChild(parentnode: ParentNode, child: Node): void {
    parentnode.removeChild(child)
  },
  // 添加子节点
  appendChild(node: Node, child: Node): void {
    node.appendChild(child)
  },
  // 获取父节点
  parentNode(node: Node): ParentNode | null {
    return node.parentNode
  },
  // 获取下一个兄弟节点
  nextSibling(node: Node): ChildNode | null {
    return node.nextSibling
  },
  // 获取元素标签名
  tagName(node: Element): string {
    return node.tagName
  },
  // 设置节点的textContent
  setTextContent(node: Node, text: string): void {
    node.textContent = text
  },
  // 设置元素的作用域样式
  setStyleScoped(node: Element, scopedId: string): void {
    node.setAttribute(scopedId, '')
  }
}
