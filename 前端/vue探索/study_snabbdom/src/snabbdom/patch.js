import vnode from './vnode.js'
import createElement from './createElement.js'
import patchVnode from './patchVnode.js'
/**
 * patch函数
 */
export default function patch(oldVnode, newVnode) {
  // 判断oldVnode是虚拟节点还是dom节点，如果是dom节点则包装为虚拟节点
  if (oldVnode.sel == '' || oldVnode.sel == undefined) {
    oldVnode = vnode(
      oldVnode.tagName.toLowerCase(),
      {},
      [],
      undefined,
      oldVnode
    )
  }
  // 判断oldVnode和newVnode是不是同一个节点，不是则暴力删除旧的，插入新的
  if (oldVnode.key == newVnode.key && oldVnode.sel == newVnode.sel) {
    // 精细比较
    if (oldVnode === newVnode) return
    if (
      newVnode.text != undefined &&
      (newVnode.children == undefined || newVnode.children.length == 0)
    ) {
      if (newVnode.text != oldVnode.text) {
        oldVnode.elm.innerText = newVnode.text
      }
    } else {
      if (oldVnode.children != undefined && oldVnode.children.length > 0) {
        // 新老的有children
        patchVnode(oldVnode, newVnode)
      } else {
        // 老的没children，新的有children
        // 清空老节点
        oldVnode.elm.innerText = ''
        // 添加新节点
        for (let i = 0; i < newVnode.children.length; i++) {
          const dom = createElement(newVnode.children[i])
          oldVnode.elm.appendChild(dom)
        }
      }
    }
  } else {
    // 暴力删除
    const newVnodeElm = createElement(newVnode)
    // 插入新节点
    oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm)
    // 删除老节点
    oldVnode.elm.parentNode.removeChild(oldVnode.elm)
  }
}
