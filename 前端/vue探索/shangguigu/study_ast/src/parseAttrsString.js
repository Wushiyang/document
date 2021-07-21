/*
 * @Author: your name
 * @Date: 2021-07-07 10:32:39
 * @LastEditTime: 2021-07-07 18:07:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_ast/src/parseAttrsString.js
 */
export default function (attrsString) {
  if (attrsString === undefined) return []
  let isYinhao = false
  let point = 0
  const len = attrsString.length
  const result = []
  for (let i = 0; i < len; i++) {
    const char = attrsString[i]
    if (char === '"') {
      isYinhao = !isYinhao
    } else if (char === ' ' && !isYinhao) {
      // 遇见空格，并且不在引号中
      const subString = attrsString.substring(point, i)
      if (!/^\s*$/.test(subString)) {
        const propArr = subString.trim().match(/^(.+)="(.*)"$/)
        result.push({
          name: propArr[1],
          value: propArr[2]
        })
        point = i
      }
    }
  }
  // 将最后一项推进数组
  const propArr = attrsString
    .substring(point)
    .trim()
    .match(/^(.+)="(.*)"$/)
  result.push({
    name: propArr[1],
    value: propArr[2]
  })
  return result
}
