import lookup from './lookup.js'

/**
 * 渲染数组
 */
function parseArray(token, data) {
  let resultStr = ''
  const arr = lookup(data, token[1])
  arr.forEach((item) => {
    resultStr += renderTemplate(token[2], { '.': item, ...item })
  })
  return resultStr
}

/**
 *  tokens渲染dom template
 */
export default function renderTemplate(tokens, data) {
  const len = tokens.length
  let resultStr = ''
  for (let i = 0; i < len; i++) {
    let token = tokens[i]
    if (token[0] == 'text') {
      resultStr += token[1]
    } else if (token[0] == 'name') {
      resultStr += lookup(data, token[1])
    } else if (token[0] == '#') {
      resultStr += parseArray(token, data)
    }
  }
  return resultStr
}
