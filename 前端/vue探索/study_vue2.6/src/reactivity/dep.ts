/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-29 11:47:42
 * @LastEditTime: 2021-09-29 12:06:44
 * @Description: 请描述该文件
 */
let uid = 0
export class Dep {
  id: number
  constructor() {
    this.id = uid++
  }
}
