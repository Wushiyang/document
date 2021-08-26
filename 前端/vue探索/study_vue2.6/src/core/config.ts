/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-08-25 10:36:14
 * @LastEditTime: 2021-08-26 20:41:24
 * @Description: 请描述该文件
 */
import { no, noop } from '../shared/utils'
import { Vue } from './instance'
export type Config = {
  // user
  silent: boolean
  ignoredElement: Array<string | RegExp>
  warnHandler: (msg: string, vm: Vue, trace: string) => void
  // platform
  isUnknownElement: (x?: string) => boolean
}
const config: Config = {
  silent: false, // 是否隐藏警告
  ignoredElement: [], // 是Vue忽略Vue之外的自定义元素，否则会假设你忘记注册全局组件或拼错组件名字从而抛出`Unknown custom element`警告
  isUnknownElement: no, // 检测一个元素是否是未知元素，依赖于平台
  warnHandler: null // 警告处理函数
}
export default config
