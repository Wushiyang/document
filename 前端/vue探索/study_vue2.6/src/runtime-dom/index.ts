/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 15:25:17
 * @LastEditTime: 2021-09-02 16:53:19
 * @Description: 运行时dom
 */
import { createPatchFunction } from './patch'
import { nodeOps } from './nodeOps'
import baseModules from './modules/index'
export { baseModules, nodeOps, createPatchFunction }
