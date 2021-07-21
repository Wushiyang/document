/**
 * 真正创建节点，将vnode创建为DOM，插入到pivot这个元素之前
 */
export default function createElement(vnode) {
  let domNode = document.createElement(vnode.sel)
  if (
    (vnode.text != '' && vnode.children == undefined) ||
    vnode.children.length == 0
  ) {
    // 文本节点
    domNode.innerText = vnode.text
  } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
    // 含有子节点
    for (let i = 0; i < vnode.children.length; i++) {
      let ch = vnode.children[i]
      const childrenVnodeElm = createElement(ch)
      ch.elm = childrenVnodeElm
      domNode.appendChild(childrenVnodeElm)
    }
  }
  vnode.elm = domNode
  return vnode.elm
}
