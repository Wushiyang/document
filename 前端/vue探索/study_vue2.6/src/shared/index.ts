/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:53:53
 * @LastEditTime: 2021-09-15 16:44:03
 * @Description: 请描述该文件
 */
export { namespaceMap } from './element'
export { generateComponentTrace, warn } from './debug'
export { isOfType } from './type'

// export { isRegExp } from './type'

export const no: () => boolean = () => false

export const noop: () => void = () => {
  // do nothing
}
