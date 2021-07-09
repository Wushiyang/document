import h from './snabbdom/h.js'

let vnode1 = h('div', {}, [
  h('p', {}, '可乐'),
  h('p', {}, '雪碧'),
  h('p', {}, h('span', {}, 'test'))
])

console.log(vnode1)
