/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:53:53
 * @LastEditTime: 2021-09-23 20:49:54
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

export function remove<T = unknown>(arr: Array<T>, item: T): Array<T> | void {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
