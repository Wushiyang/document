// 虚拟节点的属性
// {
//   children,
//   data,
//   elm,
//   key,
//   sel,
//   text
// }

import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h
} from 'snabbdom'

// 服务于虚拟节点上树
const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule
])
// 创建虚拟节点
// const myVnode1 = h(
//   'a',
//   { props: { href: 'http://www.baidu.com', target: '_blank' } },
//   '百度'
// )

// const myVnode2 = h('div', { class: { box: true } }, '我是一个盒子')

const myVnode3 = h('ul', {}, [
  h('li', { key: '可乐' }, '可乐'),
  h('li', { key: '雪碧' }, '雪碧'),
  h('li', { key: '七喜' }, '七喜')
])

// 引入容器
const container = document.getElementById('container')

// 虚拟节点上树
patch(container, myVnode3)

const button = document.getElementById('btn')

const myVnode4 = h('ol', {}, [
  h('li', { key: '可乐' }, '可乐'),
  h('li', { key: '雪碧' }, '雪碧'),
  h('li', { key: '七喜' }, '七喜'),
  h('li', { key: '芬达' }, '芬达')
])

button.onclick = function () {
  patch(myVnode3, myVnode4)
}
