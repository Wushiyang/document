/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:26:37
 * @LastEditTime: 2021-10-27 11:48:52
 * @Description: vue的配置
 */
import { no } from '@/shared'
import { Component } from './index'
export type Config = {
  // user
  optionMergeStrategies: Record<string, unknown>
  silent: boolean
  performance: boolean
  errorHandler?: (err: Error, vm: Component, info: string) => void
  warnHandler?: (msg: string, vm?: Component, trace?: string) => void
  ignoredElements: Array<string | RegExp>
  keyCodes: { [key: string]: number | Array<number> }
  isUnknownElement: (x?: string) => boolean
  async: boolean
}

export const config: Config = {
  optionMergeStrategies: {},
  silent: false,
  /**
   * Whether to record perf
   */
  performance: false,
  ignoredElements: [],
  keyCodes: Object.create(null),
  isUnknownElement: no,
  async: true
}
