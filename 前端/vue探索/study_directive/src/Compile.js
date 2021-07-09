/*
 * @Author: your name
 * @Date: 2021-07-08 09:11:17
 * @LastEditTime: 2021-07-09 10:12:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_directive/src/Compile.js
 */
import { Watcher } from './reactive/index'
// 多点获取
function parsePath(str) {
  const segments = str.split('.')
  return (obj) => {
    segments.forEach((key) => {
      obj = obj[key]
    })
    return obj
  }
}
export default class Compile {
  constructor(el, vue) {
    // vue实例
    this.$vue = vue
    // 挂载点
    this.$el = document.querySelector(el)
    // 如果用户传入了挂载点
    if (this.$el) {
      // 调用函数，让节点变为fragment，类似于mustache中的tokens。实际上用的是AST，这里是轻量级的，fragment
      const fragment = this.node2Fragment(this.$el)
      this.compile(fragment)
      this.$el.appendChild(fragment)
    }
  }
  node2Fragment(el) {
    const fragment = document.createDocumentFragment()
    let child
    while ((child = el.firstChild)) {
      fragment.appendChild(child)
    }
    // console.log(fragment)
    return fragment
  }
  compile(el) {
    const childNodes = el.childNodes
    const reg = /\{\{(.*)\}\}/
    childNodes.forEach((node) => {
      const text = node.textContent
      if (node.nodeType === 1) {
        this.compileElement(node)
      } else if (node.nodeType === 3) {
        if (reg.test(text)) {
          this.compileText(node, text.match(reg)[1])
        }
      }
    })
  }
  compileElement(node) {
    // 真正的属性列表
    const nodeAttributes = node.attributes
    // console.log(node, nodeAttributes)
    Array.prototype.slice.call(nodeAttributes).forEach((attr) => {
      const attrName = attr.name
      const attrValue = attr.value
      const dir = attrName.substring(2)
      console.log('attr: ', attrName, attrValue, dir)
      // v-开头的是指令
      if (attrName.indexOf('v-') === 0) {
        if (dir === 'model') {
          console.log('发现了model指令')
          // 初始填值
          const v = this.getVueVal(this.$vue, attrValue)
          node.value = v
          // 双向绑定
          new Watcher(this.$vue._data, attrValue, (value) => {
            console.log('watch', value)
            node.value = value
          })
          node.addEventListener('input', (e) => {
            console.log('input')
            this.setVueVal(this.$vue, attrValue, e.target.value)
          })
        } else if (dir === 'for') {
        } else if (dir === 'if') {
          console.log('发现了if指令', attrValue)
        }
      }
    })
    this.compile(node)
  }
  compileText(node, name) {
    node.textContent = this.getVueVal(this.$vue, name)
    new Watcher(this.$vue._data, name, (newVal, oldVal) => {
      node.textContent = newVal
    })
  }

  compileDirective() {}

  getVueVal(vue, exp) {
    const getter = parsePath(exp)
    return getter(vue)
  }
  setVueVal(vue, exp, value) {
    const index = exp.lastIndexOf('.')
    // 说明exp存在.
    if (index > 0) {
      const getter = parsePath(exp.slice(0, index))
      const obj = getter(vue)
      obj[exp.slice(index + 1)] = value
    } else {
      vue[exp] = value
    }
  }
}
