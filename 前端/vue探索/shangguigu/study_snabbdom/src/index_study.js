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
const myVnode1 = h(
  'a',
  { props: { href: 'http://www.baidu.com', target: '_blank' } },
  '百度'
)

const myVnode2 = h('div', { class: { box: true } }, '我是一个盒子')

const myVnode3 = h('ul', {}, [
  h('li', {}, '可乐'),
  h('li', {}, '雪碧'),
  h('li', {}, '七喜')
])

// 引入容器
const container = document.getElementById('container')

// 虚拟节点上树
patch(container, myVnode3)
