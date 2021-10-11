/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-10-11 12:03:22
 * @LastEditTime: 2021-10-11 12:11:42
 * @Description: 请描述该文件
 */

import { inBrowser } from './env'

export let mark = (name: string) => {}
export let measure = (measureName: string, startOrMeasureOptions: string, endMark: string) => {}

if (process.env.NODE_ENV !== 'production') {
  window.performance.mark
  const perf = inBrowser && window.performance
  /* istanbul ignore if */
  if (perf && perf.mark && perf.measure && perf.clearMarks && perf.clearMeasures) {
    mark = (tag) => perf.mark(tag)
    measure = (name, startTag, endTag) => {
      perf.measure(name, startTag, endTag)
      perf.clearMarks(startTag)
      perf.clearMarks(endTag)
      // perf.clearMeasures(name)
    }
  }
}
