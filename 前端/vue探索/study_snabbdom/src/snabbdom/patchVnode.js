import vnode from './vnode.js'
import createElement from './createElement.js'
import updateChildren from './updateChildren'
/**
 * patch函数
 */

/**
 * diff算法优化策略
 * 四种命中查找
 * 1、新前和旧前，相同后移
 * 2、新后和旧后，相同前移
 * 3、新后和旧前，相同插旧后
 * 4、新前和旧后，相同插旧前
 * 都找不到则循环查找旧节点，
 * 旧节点先循环完毕则插入，
 * 新节点先循环完毕则删除
 */
export default function patchVnode(oldVnode, newVnode) {
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
    // 一样的情况下让旧节点的元素和新节点的元素指向一致
    newVnode.elm = oldVnode.elm
    // 引用一样的情况下
    if (oldVnode === newVnode) return
    if (
      newVnode.text != undefined &&
      (newVnode.children == undefined || newVnode.children.length == 0)
    ) {
      // text存在且children不存在或长度为0
      if (newVnode.text != oldVnode.text) {
        // 新旧虚拟节点的text不一样则更新旧节点的text
        oldVnode.elm.innerText = newVnode.text
      }
    } else {
      if (oldVnode.children != undefined && oldVnode.children.length > 0) {
        // 新老都有children

        // patchVnode(oldVnode, newVnode)
        // let un = 0
        // for (let i = 0; i < newVnode.children.length; i++) {
        //   let ch = newVnode.children[i]
        //   let isExist = false
        //   // 再次遍历，看看oldVnode中有没有节点和它是same的，
        //   for (let j = 0; j < oldVnode.children.length; j++) {
        //     if (
        //       oldVnode.children[j].sel == ch.sel &&
        //       oldVnode.children[j].key == ch.key
        //     ) {
        //       isExist = true
        //       break
        //     }
        //   }
        //   if (!isExist) {
        //     // 对不存在的的节点进行处理
        //     console.log(ch, i)
        //     let dom = createElement(ch)
        //     ch.elm = dom
        //     if (un < oldVnode.children.length) {
        //       oldVnode.elm.insertBefore(dom, oldVnode.children[un].elm)
        //     } else {
        //       oldVnode.elm.appendChild(dom)
        //     }
        //   } else {
        //     un++
        //     // 处理存在的节点，但位置不一样
        //     // if (i != j) {
        //     // }
        //   }
        // }
        updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)
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
