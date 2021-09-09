/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 20:52:18
 * @LastEditTime: 2021-09-09 09:18:16
 * @Description: 请描述该文件
 */
import { createBaseVNode } from './runtime-core'
import { nodeOps } from './runtime-dom'
const div = document.createElement('div')
const node = createBaseVNode(nodeOps.tagName(div).toLowerCase(), {}, [], undefined, div)
console.log(node)
