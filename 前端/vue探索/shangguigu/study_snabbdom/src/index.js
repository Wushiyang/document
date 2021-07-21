import h from './snabbdom/h'
import patch from './snabbdom/patch.js'

const myVnode1 = h('section', {}, [
  h('p', { key: 'A' }, 'A'),
  h('p', { key: 'B' }, 'B'),
  h('p', { key: 'C' }, 'C'),
  h('p', { key: 'D' }, 'D'),
  h('p', { key: 'E' }, 'E')
])

// 引入容器
const container = document.getElementById('container')

// 虚拟节点上树
patch(container, myVnode1)

const button = document.getElementById('btn')

const myVnode2 = h('section', {}, [
  h('p', { key: 'Q' }, 'Q'),
  h('p', { key: 'T' }, 'T'),
  h('p', { key: 'A' }, 'A'),
  h('p', { key: 'B' }, 'B'),
  h('p', { key: 'Z' }, 'Z'),
  h('p', { key: 'C' }, 'C'),
  h('p', { key: 'D' }, 'D'),
  h('p', { key: 'E' }, 'E')
])

button.onclick = function () {
  patch(myVnode1, myVnode2)
}
