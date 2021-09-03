/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:26:37
 * @LastEditTime: 2021-09-03 16:11:51
 * @Description: vue的配置
 */
export type Config = {
  // user
  optionMergeStrategies: Record<string, unknown>
  silent: boolean
}

export const config: Config = {
  optionMergeStrategies: {},
  silent: false
}
