import parseTemplateToTokens from './parseTemplateToTokens.js'
import renderTemplate from './renderTemplate.js'

window.mustache = {
  render(templateStr, data) {
    console.log(templateStr, data)
    // 将template转换成tokens
    const tokens = parseTemplateToTokens(templateStr)
    console.log(tokens)
    // 将tokens转换成dom的template
    const template = renderTemplate(tokens, data)
    return template
  }
}
