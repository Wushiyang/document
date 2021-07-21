import Observer from './Observer.js'
/**
 * 遍历每个层级，看有没有__ob__，没有则new Observer()将产生的实例添加到__ob__上，遍历属性逐个defineReactive
 * 当设置某个属性的时候，会触发set，里面有newValue,这个newValue也得被observe()一下
 */
export default function observe(value) {
  let ob
  // 不是对象什么都不做
  if (typeof value != 'object') return
  // 定义ob
  if (typeof value.__ob__ !== 'undefined') {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }
  return ob
}
