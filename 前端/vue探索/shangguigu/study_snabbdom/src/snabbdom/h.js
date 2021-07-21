import vnode from './vnode.js'
// h('div', {}, 'text')
// h('div', {}, [])
// h('div', {}, h())
export default function h(sel = 'div', data = {}, c) {
  if (arguments.length != 3) {
    throw new Error('h函数需要3个参数')
  }
  if (typeof c == 'string' || typeof c == 'number') {
    return vnode(sel, data, undefined, c, undefined)
  } else if (Array.isArray(c)) {
    let children = []
    for (let i = 0; i < c.length; i++) {
      if (!(typeof c[i] == 'object' && c[i].hasOwnProperty('sel'))) {
        throw new Error('传入数组参数中有项不是h函数')
      }
      children.push(c[i])
    }
    return vnode(sel, data, children, undefined, undefined)
  } else if (typeof c == 'object' && c.hasOwnProperty('sel')) {
    return vnode(sel, data, [c], undefined, undefined)
  } else {
    throw new Error('第三个参数请传入字符串、数组或vnode')
  }
}
