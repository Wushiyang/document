/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-09-02 16:26:37
 * @LastEditTime: 2021-10-08 11:11:29
 * @Description: vue的配置
 */
import { no } from '@/shared'
import { Component } from './index'
export type Config = {
  // user
  optionMergeStrategies: Record<string, unknown>
  silent: boolean
  warnHandler: ((msg: string, vm?: Component, trace?: string) => void) | null
  ignoredElements: Array<string | RegExp>
  isUnknownElement: (x?: string) => boolean
}

export const config: Config = {
  optionMergeStrategies: {},
  silent: false,
  ignoredElements: [],
  warnHandler: null,
  isUnknownElement: no
}
