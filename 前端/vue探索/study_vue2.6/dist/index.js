'use strict';

/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:32:10
 * @LastEditTime: 2021-09-03 16:03:50
 * @Description: 请描述该文件
 */
var VNode = function () {
  function VNode(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.context = context;
    this.componentOptions = componentOptions;
    this.asyncFactory = asyncFactory;
  }

  return VNode;
}();

/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:57:43
 * @LastEditTime: 2021-09-02 16:59:00
 * @Description: 请描述该文件
 */
var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var nodeOps = {
  // 创建dom元素
  createElement: function createElement(tagName, vnode) {
    var elm = document.createElement(tagName);
    if (tagName !== 'select') return elm; // select标签下设置multiple，值为false或null会移除属性，undefined则不会移除属性，所以重新设置下

    if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) elm.setAttribute('multiple', 'multiple');
    return elm;
  },
  // 创建命名空间dom元素
  createElementNS: function createElementNS(namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName);
  },
  // 创建文本节点
  createTextNode: function createTextNode(text) {
    return document.createTextNode(text);
  },
  // 创建注释节点
  createComment: function createComment(text) {
    return document.createComment(text);
  },
  // 在节点前插入节点
  insertBefore: function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  },
  // 移除子节点
  removeChild: function removeChild(node, child) {
    node.removeChild(child);
  },
  // 添加子节点
  appendChild: function appendChild(node, child) {
    node.appendChild(child);
  },
  // 获取父节点
  parentNode: function parentNode(node) {
    return node.parentNode;
  },
  // 获取下一个兄弟节点
  nextSibling: function nextSibling(node) {
    return node.nextSibling;
  },
  // 获取元素标签名
  tagName: function tagName(node) {
    return node.tagName;
  },
  // 设置节点的textContent
  setTextContent: function setTextContent(node, text) {
    node.textContent = text;
  },
  // 设置元素的作用域样式
  setStyleScoped: function setStyleScoped(node, scopedId) {
    node.setAttribute(scopedId, '');
  }
};

/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 20:52:18
 * @LastEditTime: 2021-09-03 15:58:34
 * @Description: 请描述该文件
 */
var div = document.createElement('div');
var node = new VNode(nodeOps.tagName(div).toLowerCase(), {}, [], undefined, div);
console.log(node);
