import Scanner from './Scanner.js'
import nestTokens from './nestTokens'

/**
 * 将模板字符串变成tokens数组
 */
export default function parseTemplateToTokens(templateStr) {
  const tokens = []
  const scanner = new Scanner(templateStr)
  let words
  while (!scanner.eos()) {
    words = scanner.scanUntil('{{')
    if (words != '') {
      // 去空格
      let isInJJH = false
      let _word = ''
      for (let i = 0; i < words.length; i++) {
        if (/\S/.test(words[i])) {
          _word += words[i]
          if (words[i] == '<') {
            isInJJH = true
          } else if (words[i] == '>') {
            isInJJH = false
          }
        } else {
          if (isInJJH) {
            _word += words[i]
          }
        }
      }
      tokens.push(['text', _word])
    }
    scanner.scan('{{')
    words = scanner.scanUntil('}}')
    scanner.scan('}}')
    if (words != '') {
      if (words[0] == '#') {
        tokens.push(['#', words.substring(1)])
      } else if (words[0] == '/') {
        tokens.push(['/', words.substring(1)])
      } else {
        tokens.push(['name', words])
      }
    }
  }
  return nestTokens(tokens)
}
