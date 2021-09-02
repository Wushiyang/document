/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-08-25 09:04:33
 * @LastEditTime: 2021-08-25 09:15:23
 * @Description: 补丁文件
 */
import { nodeOps } from './node-ops'
import baseModules from '../../../core/vdom/modules/index'
import { createPatchFunction } from '../../../core/vdom/patch'
import platformModules from './modules/index'

const modules = platformModules.concat(baseModules)
export const patch: Function = createPatchFunction({ nodeOps, modules })
