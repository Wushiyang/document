/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-08-23 11:56:58
 * @LastEditTime: 2021-08-26 20:50:42
 * @Description: patch方法
//  */
import { warn, isDef, isOfType, isRegExp, isTrue, isUndef, makeMap } from '../utils/index'
import { VNode, asyncFactory, VNodeData } from './vnode'
import { isTextInputType } from '../../platforms/web/util/element'
import config from '../config'
import { Component } from '../instance'
import { registerRef } from './modules/ref'

const enum PatchHook {
  create = 'create',
  activate = 'activate',
  update = 'update',
  remove = 'remove',
  destroy = 'destroy'
}
const hooks = [PatchHook.create, PatchHook.activate, PatchHook.update, PatchHook.remove, PatchHook.destroy]

// 判断是否同一个虚拟节点
function sameVnode(a: VNode, b: VNode) {
  return (
    a.key === b.key &&
    ((a.tag === b.tag && a.isComment === b.isComment && isDef(a.data) === isDef(b.data) && sameInputType(a, b)) ||
      (a.isAsyncPlaceholder && a.asyncFactory === b.asyncFactory && isOfType<asyncFactory>(b.asyncFactory, 'error') && b.asyncFactory.error))
  )
}
// 判断是否同样的input-type，如果tag不是input则返回true
function sameInputType(a: VNode, b: VNode) {
  if (a.tag !== 'input') return true
  let i
  const typeA = isOfType<VNodeData>((i = a.data), 'tag') && isDef((i = i.attrs)) && i.type
  const typeB = isOfType<VNodeData>((i = b.data), 'tag') && isDef((i = i.attrs)) && i.type
  return typeA === typeB || (isTextInputType(typeA) && isTextInputType(typeB))
}

// 创建虚拟节点列表从key到index的映射
function createKeyToOldIndex(children, beginIdx: number, endIndex: number): object {
  let i: number, key: string | number
  const map = {}
  for (i = beginIdx; i <= endIndex; i++) {
    key = children[i].key
    if (isDef(key)) map[key] = i
  }
  return map
}

// 创建patch函数
export function createPatchFunction(backend: { modules: Array<{ [key in PatchHook]?: Function }>; nodeOps: { [key: string]: Function } }) {
  let i: number, j: number
  const cbs: { [key in PatchHook]?: Array<Function> } = {}
  const { modules, nodeOps } = backend

  // cbs搜集modules里的生命周期函数
  for (i = 0; i < hooks.length; i++) {
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; j++) {
      isDef(modules[j][hooks[i]]) && cbs[hooks[i]].push(modules[j][hooks[i]])
    }
  }

  function emptyNodeAt(elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb(childElm, listeners) {
    function remove() {
      if (--remove.listeners === 0) removeNode(childElm)
    }
    remove.listeners = listeners
    return remove
  }

  function removeNode(el) {
    const parent = nodeOps.parentNode(el)
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el)
    }
  }

  function isUnknownElement(vnode: VNode, inVPre: boolean) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElement.length &&
        config.ignoredElement.some((ignore) => {
          return isOfType<RegExp>(ignore, 'test') ? ignore.test(vnode.tag) : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }

  let createElmInVPre = 0
  function createElm(vnode?: VNode, insertedVnodeQueue?, parentElm?, refElm?, nested?, ownerArray?: VNode[], index?) {
    if (isDef(vnode.elm && isDef(ownerArray))) {
      vnode = ownerArray[index] = VNode.cloneVNode(vnode)
    }
    vnode.isRootInsert = !nested // 用于过度进入检测
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) return

    const data = vnode.data
    const children = vnode.children
    const tag = vnode.tag

    if (isDef(tag)) {
      if (process.env.NODE_ENV !== 'production') {
        if (data && data.pre) {
          createElmInVPre++
        }
        if (isUnknownElement(vnode, !!createElmInVPre)) {
          warn(
            'Unknown custom element: <' +
              tag +
              '> - did you ' +
              'register the component correctly? For recursive components, ' +
              'make sure to provide the "name" option.',
            vnode.context
          )
        }
      }
    }
  }

  function createComponent(vnode: VNode, insertedVnodeQueue, parentElm: Node, refElm: Node): boolean {
    let i = isOfType<VNodeData>(vnode.data) && vnode.data,
      j
    if (isDef(i)) {
      const isReacttivated = isDef(vnode.componentsInstance) && i.keepAlive
      if (isDef((j = i.hook)) && isDef((j = j.init))) {
        j(vnode, false /* hydrating */)
      }
      // 运行init钩子后，如果vnode是一个子组件，那么他应该早已创建一个子组件实例并装载他，这个子组件同样已经设置了vnode的elm，故我们仅仅返回这个元素和完成标识
      if (isDef(vnode.componentsInstance)) {
        initComponent(vnode, insertedVnodeQueue)
        isOfType<Node>(vnode.elm) && insert(parentElm, vnode.elm, refElm)
        if (isTrue(isReacttivated)) {
          reactiveComponent(vnode, insertedVnodeQueue, parentElm, refElm)
        }
        return true
      }
    }
    return false
  }

  function initComponent(vnode: VNode, insertedVnodeQueue) {
    const vnodeData = isOfType<VNodeData>(vnode.data) && vnode.data.pendingInsert
    const componentsInstance = isOfType<Component>(vnode.componentsInstance) && vnode.componentsInstance
    // 如果节点数据有pendingInsert则加进插入虚拟节点队列(insertedVnodeQueue)
    if (isDef(vnodeData.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnodeData.pendingInsert)
      vnodeData.pendingInsert = null
    }
    vnode.elm = componentsInstance.$el
    // 如果是可patch的节点则触发create钩子
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue)
    } else {
      // 如果是不可patch的节点则注册节点的ref并把节点放进插入虚拟节点队列(insertedVnodeQueue)
      registerRef(vnode)
      insertedVnodeQueue.push(vnode)
    }
  }

  function reactiveComponent(vnode: VNode, insertedVnodeQueue, parentElm: Node, refElm: Node) {}

  function insert(parent: Node, elm: Node, ref) {}

  function createChildren(vnode: VNode, children, insertedVnodeQueue) {}

  function isPatchable(vnode: VNode) {
    while (vnode.componentsInstance) {
      vnode = isOfType<VNode>(vnode.componentsInstance._vnode, 'tag') && vnode.componentsInstance._vnode
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks(vnode: VNode, insertedVnodeQueue) {}

  function setScope(vnode: VNode) {}

  function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {}

  // 触发vnode及其子节点的destroy这个hook，先触发自身hook再出发模块hook，最后触发子节点hook
  function invokeDestroyHook(vnode: VNode) {
    let i, j
    const data: VNodeData = isOfType<VNodeData>(vnode.data) && vnode.data
    const children: Array<VNode> = isOfType<Array<VNode>>(vnode.children) && vnode.children
    if (isDef(data)) {
      if (isDef((i = data.hook)) && isDef((i = i.destroy))) i(vnode)
      for (i = 0; i < cbs.destroy.length; i++) cbs.destroy[i](vnode)
    }
    if (isDef(children)) {
      for (i = 0; j < children.length; j++) invokeDestroyHook(children[j])
    }
  }

  function removeVnodes(vnodes, startIdx, endIdx) {}

  function removeAndInvokeRemoveHook(vnode, rm) {}

  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOny) {}

  function findIdxInOld(node, oldCh, start, end) {}

  function patchVnode(oldVnode: VNode, vnode: VNode, insertedVnodeQueue, ownerArray, index, removeOnly) {}

  function invokeInsertHook(vnode, queue, initial) {}

  let hydrationBailed = false

  // 这里列出的模块在hydration期间跳过create阶段，因为他们早已在客户端渲染或者不必初始化。
  // note: style是例外，因为他依赖于未来的深度更新的初始化克隆
  const isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key')

  // 这是客户（浏览器）端运行函数，所以我们可以假设elm是dom的节点
  function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {}

  function assertNodeMatch(node, vnode, inVPre) {}

  return function patch(oldVnode: VNode, vnode: VNode, hydrating: boolean, removeOnly: boolean) {
    // 如果新节点不存在且老节点存在，则触发invokeDestroyHook销毁钩子并结束patch
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }

    let isInitialPatch = false // 是否
    const insertedVnodeQueue = []

    if (isUndef(oldVnode)) {
      isInitialPatch = true
      createElm(vnode, insertedVnodeQueue)
    } else {
    }
  }
}
