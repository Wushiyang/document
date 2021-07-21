/**
 * 将token嵌套
 */
export default function nestTokens(tokens) {
  // 嵌套tokens
  const nestedTokens = []
  // 声明栈
  const sections = []
  // 收集器置为嵌套tokens
  let collector = nestedTokens
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    switch (token[0]) {
      case '#':
        // 收集器和嵌套tokens放进token
        collector.push(token)
        // token入栈
        sections.push(token)
        // 将入栈token的第二项置为收集器
        collector = token[2] = []
        break
      case '/':
        // token出栈
        sections.pop()
        // 栈里是否有token，有则将栈顶的token的第二项置为收集器，无则将嵌套tokens置为收集器
        collector =
          sections.length > 0 ? sections[sections.length - 1][2] : nestedTokens
        break
      default:
        // 收集器收集token
        collector.push(token)
    }
  }
  return nestedTokens
}
