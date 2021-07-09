/*
 * @Author: your name
 * @Date: 2021-07-02 09:59:10
 * @LastEditTime: 2021-07-07 10:40:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_ast/src/parse.js
 */
import parseAttrsString from './parseAttrsString'
export default function parse(templateString) {
  templateString = templateString.trim()
  console.log('parse', templateString)
  let index = 0 // 指针
  let stack = []
  // let stack2 = []
  let result
  const startRegExp = /^\<([1-9a-zA-Z]+)([^\<]+)?\>/
  const endRegExp = /^\<\/([1-9a-zA-Z]+)\>/
  const wordRegExp = /^([^\<\>]+)\<\/([1-9a-zA-Z]+)\>/
  while (index < templateString.length - 1) {
    let target = templateString.substring(index)
    if (startRegExp.test(target)) {
      const tag = target.match(startRegExp)[1]
      const attrsString = target.match(startRegExp)[2]
      stack.push({
        tag,
        type: 1,
        children: [],
        attrs: parseAttrsString(attrsString)
      })
      const len = attrsString === undefined ? 0 : attrsString.length
      index += tag.length + 2 + len
      console.log('检测start标签', tag)
    } else if (endRegExp.test(target)) {
      const tag = target.match(endRegExp)[1]
      const popItem = stack.pop()
      const startTag = popItem.tag
      if (tag === startTag) {
        if (stack.length > 0) {
          stack[stack.length - 1].children.push(popItem)
        } else {
          result = popItem
        }
      } else {
        throw new Error('标签' + startTag + '没封闭')
      }
      index += tag.length + 3
      console.log('检测end标签', tag)
    } else if (wordRegExp.test(target)) {
      const content = target.match(wordRegExp)[1]
      if (/^\s+$/.test(content)) {
        index += content.length
        continue
      }
      // console.log(content)
      stack[stack.length - 1].children.push({
        type: 3,
        text: content
      })
      index += content.length
    } else {
      index++
    }
  }
  console.log(result)
  return result
}
