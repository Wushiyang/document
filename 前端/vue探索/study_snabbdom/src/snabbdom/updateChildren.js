import createElement from './createElement'
import patchVnode from './patchVnode.js'
// 判断是否同一个虚拟节点
function checkSameVnode(a, b) {
  return a.sel == b.sel && a.key == b.key
}

export default function updateChildren(parentElm, oldCh, newCh) {
  console.log(parentElm, oldCh, newCh)
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let newEndIdx = newCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  let keyMap = null
  while (newStartIdx <= newEndIdx && oldStartIdx <= oldEndIdx) {
    // console.log('❤')
    // 略过已经加undefined标记的东西
    if (newStartVnode == undefined || newCh[newStartIdx] == undefined) {
      newStartVnode = newCh[++newStartIdx]
    } else if (newEndVnode == undefined || newCh[newEndIdx] == undefined) {
      newEndVnode = newCh[--newEndIdx]
    } else if (oldStartVnode == undefined || oldCh[oldEndIdx] == undefined) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (oldEndVnode == undefined || oldCh[oldEndIdx] == undefined) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (checkSameVnode(newStartVnode, oldStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode)
      // 当新前和旧前命中时，移动新前新后指针下移
      newStartVnode = newCh[++newStartIdx]
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (checkSameVnode(newEndVnode, oldEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode)
      // 当新后和旧后命中时，移动新后旧后指针上移
      newEndVnode = newCh[--newEndIdx]
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (checkSameVnode(newEndVnode, oldStartVnode)) {
      patchVnode(oldStartVnode, newEndVnode)
      // 当新后和旧前命中时，移动新后指针上移旧前指针下移，此时要移动节点，移动旧前指向的这个节点到老节点的旧后的后面
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)
      newEndVnode = newCh[--newEndIdx]
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (checkSameVnode(newStartVnode, oldEndVnode)) {
      patchVnode(oldEndVnode, newStartVnode)
      // 当新后和旧前命中时，移动新前指针下移旧后指针上移，此时要移动节点，移动旧后指向的这个节点到老节点的旧前的前面
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
      newStartVnode = newCh[++newStartIdx]
      oldEndVnode = oldCh[--oldEndIdx]
    } else {
      // 都没命中，循环
      if (!keyMap) {
        keyMap = {}
        // 制作keyMap，这样就不用每次都遍历老对象了
        for (let i = oldStartIdx; i < oldEndIdx; i++) {
          const key = oldCh[i].key
          if (key != undefined) {
            keyMap[key] = i
          }
        }
      }
      console.log(keyMap)
      // 寻找当前这项(newStartIdx)这项在keyMap中的映射的位置序号
      const idxInOld = keyMap[newStartVnode.key]
      if (idxInOld == undefined) {
        // 如果是undefined表示这是全新的项
        // 新加项插入旧前节点的前面
        parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm)
      } else {
        // 如果不是undefined，表示不是全新的项，需要移动
        const elmToMove = oldCh[idxInOld]
        patchVnode(elmToMove, newStartVnode)
        oldCh[idxInOld] = undefined
        parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm)
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }
  // 查看有无剩余节点
  console.log(newStartIdx, newEndIdx)
  console.log(oldStartIdx, oldEndIdx)
  if (newStartIdx <= newEndIdx) {
    // 还有剩余新的子节点，添加
    const before =
      newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      parentElm.insertBefore(createElement(newCh[i]), before)
    }
  } else if (oldStartIdx <= oldEndIdx) {
    // 还有剩余旧的子节点，删除
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      const ch = oldCh[i]
      if (ch) {
        parentElm.removeChild(ch.elm)
      }
    }
  }
}
