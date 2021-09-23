/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:15:44
 * @LastEditTime: 2021-09-23 11:30:14
 * @Description: 请描述该文件
 */
import { nodeOps } from '.'
import { createBaseVNode, VNode, cloneVNode, config, VNodeWithData } from '@/runtime-core'
import { warn, isOfType } from '@/shared'
import { registerRef } from './modules/ref'

const enum PatchHook {
  create = 'create',
  activate = 'activate',
  update = 'update',
  remove = 'remove',
  destroy = 'destroy'
}
const hooks = [PatchHook.create, PatchHook.activate, PatchHook.update, PatchHook.remove, PatchHook.destroy]

export const emptyNode = createBaseVNode('', {}, [])

// 判断同一个虚拟节点
function sameVNode(a: VNode, b: VNode): boolean {
  return a.key === b.key && ((a.tag === b.tag && sameInputType(a, b)) || (a.isAsyncPlaceholder && a.asyncFactory === b.asyncFactory))
}

// 判断虚拟节点是同一个input元素
function sameInputType(a: VNode, b: VNode): boolean {
  if (a.tag !== 'input' || b.tag !== 'input') return true
  let i
  const typeA = (i = a.data) && (i = i.attrs) && (i = i.type)
  const typeB = (i = b.data) && (i = i.attrs) && (i = i.type)
  return typeA === typeB
}

// 返回一个VNode数组的key到索引的映射对象
function createKeyToOldIdx(children: VNode[], beginIdx: number, endIdx: number): Record<string, number> {
  let i, key
  const map = {}
  for (i = beginIdx; i < endIdx; i++) {
    key = children[i].key
    if (key) map[key] = i
  }
  return map
}

export const createPatchFunction = (backend: { modules: Array<{ [key in PatchHook]?: (a: unknown, b: unknown) => void }>; nodeOps: nodeOps }): (() => void) => {
  let i: number, j: number
  const { modules, nodeOps } = backend

  const cbs: {
    [key in PatchHook]?: Array<(a: unknown, b: unknown) => void>
  } = {}
  // 钩子到cbs
  for (i = 0; i < hooks.length; i++) {
    const hook = hooks[i]
    const cbis: Array<(a: unknown, b: unknown) => void> = (cbs[hook] = [])
    for (j = 0; i < modules.length; j++) {
      const hookFn = modules[j][hooks[i]]
      if (hookFn) {
        cbis.push(hookFn)
      }
    }
  }

  function emptyNodeAt(elm): VNode {
    return createBaseVNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  // 创建移除回调函数的函数
  function createRmCb(childElm, listeners) {
    function remove() {
      if (--remove.listeners === 0) {
        removeNode(childElm)
      }
    }
    remove.listeners = listeners
    return remove
  }

  function removeNode(el: Node) {
    const parent = nodeOps.parentNode(el)
    if (parent) {
      nodeOps.removeChild(parent, el)
    }
  }

  // 检测是否vue未知元素
  function isUnknownElement(vnode: VNode, inVPre: boolean) {
    const tag = vnode.tag
    return (
      !inVPre &&
      tag &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some((ignore) => {
          return typeof ignore === 'string' ? ignore === tag : ignore.test(tag)
        })
      ) &&
      config.isUnknownElement(tag)
    )
  }

  let creatingElmInVPre = 0

  // 创建元素
  function createElm(vnode: VNode, insertedVnodeQueue, parentElm: Element, refElm, nested, ownerArray, index) {
    if (vnode.elm && ownerArray) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      vnode = ownerArray[index] = cloneVNode(vnode)
    }

    vnode.isRootInsert = !nested // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    const data = vnode.data
    const children = vnode.children
    const tag = vnode.tag
    if (tag) {
      if (process.env.NODE_ENV !== 'production') {
        if (data && data.pre) {
          creatingElmInVPre++
        }
        if (isUnknownElement(vnode, !!creatingElmInVPre) && vnode.context) {
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

      vnode.elm = vnode.ns ? nodeOps.createElementNS(vnode.ns, tag) : nodeOps.createElement(tag, vnode)
      setScope(vnode)

      createChildren(vnode, children, insertedVnodeQueue)
      if (data) {
        invokeCreateHooks(vnode, insertedVnodeQueue)
      }
      insert(parentElm, vnode.elm, refElm)

      if (process.env.NODE_ENV !== 'production' && data && data.pre) {
        creatingElmInVPre--
      }
    } else if (vnode.isComment) {
      vnode.elm = nodeOps.createComment(vnode.text + '')
      insert(parentElm, vnode.elm, refElm)
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text + '')
      insert(parentElm, vnode.elm, refElm)
    }
  }

  // 重新激活组件，用于<keep-alive>组件的激活
  function reactivateComponent(vnode: VNode, insertedVnodeQueue: Array<unknown>, parentElm: Node, refElm: Node) {
    let innerNode = vnode
    if (vnode.elm) {
      // 这块用于：因为内部节点的create钩子不会再次调用，重新激活的组件的过渡效果将不会触发
      while (innerNode.componentInstance) {
        innerNode.componentInstance._vnode && (innerNode = innerNode.componentInstance._vnode)
        if (innerNode.data && innerNode.data.transition && cbs.activate) {
          for (let i = 0; i < cbs.activate.length; ++i) {
            cbs.activate[i](emptyNode, innerNode)
          }
          insertedVnodeQueue.push(innerNode)
          break
        }
      }
      // 不像一个新创建的组件，一个重新激活的组件不会重新插入自身，所以这里进行插入
      insert(parentElm, vnode.elm, refElm)
    }
  }

  // 往parent子节点里的ref前插入elm或往parent子节点里的最末尾添加elm
  function insert(parent: Node, elm: Node, ref: Node | null = null) {
    if (ref) {
      if (nodeOps.parentNode(ref) === parent) {
        nodeOps.insertBefore(parent, elm, ref)
      }
    } else {
      nodeOps.appendChild(parent, elm)
    }
  }

  // 创建子节点，如果children是虚拟节点数组，则以vnode.elm为父节点，children列表内虚拟节点为子节点创建节点；否则如果vnode.text为字符串或数字，则以vnode.elm为父节点，vnode.text的文本节点为子节点创建节点
  function createChildren(vnode: VNode, children?: Array<VNode>, insertedVnodeQueue = []) {
    if (isOfType<Element>(vnode.elm, 'setAttribute')) {
      if (children) {
        if (process.env.NODE_ENV !== 'production') {
          checkDuplicateKeys(children)
        }
        for (let i = 0; i < children.length; ++i) {
          createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
        }
      } else if (vnode.text) {
        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
      }
    }
  }

  // 检查是否创建了重复的key，并在内部建映射用于检索存在
  function checkDuplicateKeys(children: Array<VNode>) {
    const seenKeys = {}
    for (let i = 0; i < children.length; i++) {
      const vnode = children[i]
      const key = vnode.key
      if (key) {
        if (seenKeys[key] && vnode.context) {
          warn(`Duplicate keys detected: '${key}'. This may cause an update error.`, vnode.context)
        } else {
          seenKeys[key] = true
        }
      }
    }
  }

  // 循环触发modules里的create钩子，如果传进来的vnode.data.hook也存在create钩子，则调用。
  function invokeCreateHooks(vnode: VNode, insertedVnodeQueue) {
    if (cbs.create) {
      for (let i = 0; i < cbs.create.length; ++i) {
        cbs.create[i](emptyNode, vnode)
      }
      if (vnode.data && vnode.data.hook) {
        vnode.data.hook.create(emptyNode, vnode)
        vnode.data.hook.insert && insertedVnodeQueue.push(vnode)
      }
      // i = vnode.data.hook // Reuse variable
      // if (isDef(i)) {
      //   if (isDef(i.create)) i.create(emptyNode, vnode)
      //   if (isDef(i.insert)) insertedVnodeQueue.push(vnode)
      // }
    }
  }

  // 设置 scope id 属性给scoped CSS
  function setScope(vnode: VNode) {
    if (isOfType<Element>(vnode.elm, 'setAttribute')) {
      // fnScopeId存在则在该虚拟节点绑定的节点上附加scope id
      if (vnode.fnScopeId) {
        nodeOps.setStyleScoped(vnode.elm, vnode.fnScopeId)
      } else {
        // 如果不存在，则从该节点的context上找scope id附加上，并循环向父层添加scope id
        let ancetor = vnode
        while (ancetor) {
          if (ancetor.context && ancetor.context.$options._scopeId) {
            nodeOps.setStyleScoped(vnode.elm, ancetor.context.$options._scopeId)
          }
          ancetor.parent && (ancetor = ancetor.parent)
        }
      }
      // TODO: activeInstance从外部导进来的,逻辑先省略
      // if (activeInstance) {

      // }
    }
  }

  // 创建组件
  function createComponent(vnode: VNode, insertedVnodeQueue, parentElm: Element, refElm: Element) {
    const vnodeData = vnode.data
    if (vnodeData) {
      const isReactivated = vnode.componentInstance && vnodeData.keepAlive
      const hook = vnodeData.hook
      hook && hook.init && hook.init(vnode, false /* hydrating */)

      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (vnode.componentInstance && vnode.elm) {
        initComponent(vnode, insertedVnodeQueue)
        insert(parentElm, vnode.elm, refElm)
        if (isReactivated) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
        }
        return true
      }
    }
  }

  // 初始化组件
  function initComponent(vnode: VNode, insertedVnodeQueue: Array<unknown>) {
    const vnodeData = vnode.data
    if (vnodeData && vnodeData.pendingInsert) {
      insertedVnodeQueue.push(vnodeData.pendingInsert)
      vnodeData.pendingInsert = null
    }

    if (vnode.componentInstance) {
      vnode.elm = vnode.componentInstance.$el
    }

    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue)
      setScope(vnode)
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      if (vnode.tag && vnode.data && vnode.context) {
        registerRef(<VNodeWithData>vnode)
      }
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode)
    }
  }

  // 该vnode是否patch了
  function isPatchable(vnode: VNode): boolean {
    while (vnode.componentInstance && vnode.componentInstance._vnode) {
      vnode = vnode.componentInstance._vnode
    }
    return !!vnode.tag
  }

  return () => {
    //do something
  }
}
