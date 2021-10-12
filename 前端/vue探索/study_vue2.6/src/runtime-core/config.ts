/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:26:37
 * @LastEditTime: 2021-10-12 16:34:15
 * @Description: vue的配置
 */
import { no } from '@/shared'
import { Component } from './index'
export type Config = {
  // user
  optionMergeStrategies: Record<string, unknown>
  silent: boolean
  performance: boolean
  warnHandler: ((msg: string, vm?: Component, trace?: string) => void) | null
  ignoredElements: Array<string | RegExp>
  keyCodes: { [key: string]: number | Array<number> }
  isUnknownElement: (x?: string) => boolean
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
  warnHandler: null,
  isUnknownElement: no
}
