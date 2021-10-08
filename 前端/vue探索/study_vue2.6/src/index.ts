/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 20:52:18
 * @LastEditTime: 2021-10-08 12:10:52
 * @Description: 请描述该文件
 */
import { VNode } from './runtime-core'
import { nodeOps } from './runtime-dom'
const div = document.createElement('div')
const node = new VNode(nodeOps.tagName(div).toLowerCase(), {}, [], undefined, div)
console.log(node)
