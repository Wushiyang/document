/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-11-22 08:58:19
 * @LastEditTime: 2021-11-22 17:46:28
 * @Description: 将template编译成ast
 */

import { no, isIE, isEdge, isServerRendering } from '@/shared/index'
import { CompilerOptions, ASTElement, ASTAttr, baseWarn, pluckModuleFunction, parseHTML, getAndRemoveAttr } from '../index'


export const forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/ // 检测v-for的格式
export const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/
const stripParensRE = /^\(|\)$/g // 检测(或)
const invalidAttributeRE = /[\s"'<>\/=]/ // 检测是否无效属性，属性名不允许空白、单双引号、尖括号、正斜杠或等号

export let warn: (msg: string, range?: unknown) => void
let delimiters: [string, string] | undefined
let transforms: Array<(el: ASTElement) => ASTElement | undefined>
let preTransforms: Array<(el: ASTElement, options?: CompilerOptions) => ASTElement | undefined>
let postTransforms: Array<(el: ASTElement, options?: CompilerOptions) => void>
let platformIsPreTag: (attr: string) => boolean
let platformMustUseProp: (tag: string, type?: string, name?: string) => boolean
let platformGetTagNamespace: (tag: string) => string
let maybeComponent: (el: ASTElement) => boolean

export function createASTElement(
  tag: string,
  attrs: Array<ASTAttr>,
  parent?: ASTElement
): ASTElement {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    rawAttrsMap: {},
    parent,
    children: []
  }
}

/**
 * Convert HTML string to AST.
 */
export function parse(
  template: string,
  options: CompilerOptions
): ASTElement | undefined {
  warn = options.warn || baseWarn

  platformIsPreTag = options.isPreTag || no
  platformMustUseProp = options.mustUseProp || no
  platformGetTagNamespace = options.getTagNamespace || (() => { return '' })
  const isReservedTag = options.isReservedTag || no
  maybeComponent = (el: ASTElement) => !!el.component || !isReservedTag(el.tag)

  transforms = pluckModuleFunction(options.modules, 'transformNode')
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode')
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode')

  delimiters = options.delimiters

  const stack: Array<ASTElement> = []
  const preserveWhitespace = options.preserveWhitespace !== false
  const whitespaceOption = options.whitespace
  let root: ASTElement
  let currentParent: ASTElement
  let inVPre = false // 是否v-pre，跳过编译
  let inPre = false // 是否<pre></pre>
  let warned = false

  function warnOnce(msg: string, range: unknown) {
    if (!warned) {
      warned = true
      warn(msg, range)
    }
  }

  // 关闭ASTElement
  function closeElement(element: ASTElement) {
    trimEndingWhitespace(element)
    // 不跳过编译或未编译好则处理element
    if (!inVPre && !element.processed) {
      element = processElement(element, options)
    }
    // TODO 根元素v-if处理
    // tree management
    if (!stack.length && element !== root) {
      // allow root elements with v-if, v-else-if and v-else
      if (root.if && (element.elseif || element.else)) {
        if (process.env.NODE_ENV !== 'production') {
          checkRootConstraints(element)
        }
        addIfCondition(root, {
          exp: element.elseif,
          block: element
        })
      } else if (process.env.NODE_ENV !== 'production') {
        warnOnce(
          `Component template should contain exactly one root element. ` +
            `If you are using v-if on multiple elements, ` +
            `use v-else-if to chain them instead.`,
          { start: element.start }
        )
      }
    }
    // TODO 处理element的v-if处理
    if (currentParent && !element.forbidden) {
      if (element.elseif || element.else) {
        processIfConditions(element, currentParent)
      } else {
        if (element.slotScope) {
          // scoped slot
          // keep it in the children list so that v-else(-if) conditions can
          // find it as the prev node.
          const name = element.slotTarget || '"default"'
          ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[
            name
          ] = element
        }
        currentParent.children.push(element)
        element.parent = currentParent
      }
    }

    // final children cleanup
    // filter out scoped slots
    element.children = element.children.filter((c) => !(c: any).slotScope)
    // remove trailing whitespace node again
    trimEndingWhitespace(element)

    // check pre state
    if (element.pre) {
      inVPre = false
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false
    }
    // apply post-transforms
    for (let i = 0; i < postTransforms.length; i++) {
      postTransforms[i](element, options)
    }
  }

  // 删除尾部空白
  function trimEndingWhitespace(el: ASTElement) {
    if (!inPre) {
      let lastNode
      while (
        (lastNode = el.children[el.children.length - 1]) &&
        lastNode.type === 3 &&
        lastNode.text === ' '
      ) {
        el.children.pop()
      }
    }
  }

  // check根元素约束，根元素只能为单个
  function checkRootConstraints(el: ASTElement) {
    if (el.tag === 'slot' || el.tag === 'template') {
      warnOnce(
        `Cannot use <${el.tag}> as component root element because it may ` +
          'contain multiple nodes.',
        { start: el.start }
      )
    }
    if (el.attrsMap.hasOwnProperty('v-for')) {
      warnOnce(
        'Cannot use v-for on stateful component root element because ' +
          'it renders multiple elements.',
        el.rawAttrsMap['v-for']
      )
    }
  }

  parseHTML(template, {
    warn,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    outputSourceRange: options.outputSourceRange,
    start(tag: string, attrs: Array<ASTAttr>, unary, start?: number, end?: number) {
      // check namespace.
      // inherit parent ns if there is one
      const ns =
        (currentParent && currentParent.ns) || platformGetTagNamespace(tag)

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs)
      }

      let element: ASTElement = createASTElement(tag, attrs, currentParent)
      if (ns) {
        element.ns = ns
      }

      if (process.env.NODE_ENV !== 'production') {
        if (options.outputSourceRange) {
          element.start = start
          element.end = end
          element.rawAttrsMap = element.attrsList.reduce((cumulated: Record<string, ASTAttr>, attr: ASTAttr) => {
            cumulated[attr.name] = attr
            return cumulated
          }, {})
        }
        attrs.forEach((attr) => {
          if (invalidAttributeRE.test(attr.name)) {
            warn(
              `Invalid dynamic argument expression: attribute names cannot contain ` +
                `spaces, quotes, <, >, / or =.`,
              {
                start: <number>attr.start + attr.name.indexOf(`[`),
                end: <number>attr.start + attr.name.length
              }
            )
          }
        })
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true
        process.env.NODE_ENV !== 'production' &&
          warn(
            'Templates should only be responsible for mapping the state to the ' +
              'UI. Avoid placing tags with side-effects in your templates, such as ' +
              `<${tag}>` +
              ', as they will not be parsed.',
            { start: element.start }
          )
      }

      // 编译前预处理
      for (let i = 0; i < preTransforms.length; i++) {
        element = preTransforms[i](element, options) || element
      }

      // 查看是否跳过编译，如果全局inVPre为false则查看ast元素的是有v-pre，有则置inVPre=true跳过编译
      if (!inVPre) {
        processPre(element)
        if (element.pre) {
          inVPre = true
        }
      }
      // 如果是pre标签则置inVPre = true跳过编译
      if (platformIsPreTag(element.tag)) {
        inPre = true
      }

      if (inVPre) {
        // 跳过编译处理attrs，从attrsList设置attrs
        processRawAttrs(element)
      } else if (!element.processed) {
        // 不跳过编译处理for、if、once指令
        // structural directives
        processFor(element)
        processIf(element)
        processOnce(element)
      }

      if (!root) {
        root = element
        if (process.env.NODE_ENV !== 'production') {
          checkRootConstraints(root)
        }
      }

      if (!unary) {
        currentParent = element
        stack.push(element)
      } else {
        closeElement(element)
      }
    },

    end(tag, start, end) {
      const element = stack[stack.length - 1]
      // pop stack
      stack.length -= 1
      currentParent = stack[stack.length - 1]
      if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
        element.end = end
      }
      closeElement(element)
    },

    chars(text: string, start: number, end: number) {
      if (!currentParent) {
        if (process.env.NODE_ENV !== 'production') {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.',
              { start }
            )
          } else if ((text = text.trim())) {
            warnOnce(`text "${text}" outside root element will be ignored.`, {
              start
            })
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (
        isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      const children = currentParent.children
      if (inPre || text.trim()) {
        text = isTextTag(currentParent) ? text : decodeHTMLCached(text)
      } else if (!children.length) {
        // remove the whitespace-only node right after an opening tag
        text = ''
      } else if (whitespaceOption) {
        if (whitespaceOption === 'condense') {
          // in condense mode, remove the whitespace node if it contains
          // line break, otherwise condense to a single space
          text = lineBreakRE.test(text) ? '' : ' '
        } else {
          text = ' '
        }
      } else {
        text = preserveWhitespace ? ' ' : ''
      }
      if (text) {
        if (!inPre && whitespaceOption === 'condense') {
          // condense consecutive whitespaces into single space
          text = text.replace(whitespaceRE, ' ')
        }
        let res
        let child: ?ASTNode
        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
          child = {
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text
          }
        } else if (
          text !== ' ' ||
          !children.length ||
          children[children.length - 1].text !== ' '
        ) {
          child = {
            type: 3,
            text
          }
        }
        if (child) {
          if (
            process.env.NODE_ENV !== 'production' &&
            options.outputSourceRange
          ) {
            child.start = start
            child.end = end
          }
          children.push(child)
        }
      }
    },
    comment(text: string, start, end) {
      // adding anything as a sibling to the root node is forbidden
      // comments should still be allowed, but ignored
      if (currentParent) {
        const child: ASTText = {
          type: 3,
          text,
          isComment: true
        }
        if (
          process.env.NODE_ENV !== 'production' &&
          options.outputSourceRange
        ) {
          child.start = start
          child.end = end
        }
        currentParent.children.push(child)
      }
    }
  })
  return root
}

function processPre(el: ASTElement) {
  if (getAndRemoveAttr(el, 'v-pre') !== undefined) {
    el.pre = true
  }
}

function processRawAttrs(el: ASTElement) {
  const list = el.attrsList
  const len = list.length
  if (len) {
    const attrs: Array<ASTAttr> = (el.attrs = new Array(len))
    for (let i = 0; i < len; i++) {
      attrs[i] = {
        name: list[i].name,
        value: JSON.stringify(list[i].value)
      }
      if (list[i].start != null) {
        attrs[i].start = list[i].start
        attrs[i].end = list[i].end
      }
    }
  } else if (!el.pre) {
    // plain标识表示无根节点和属性
    // non root node in pre blocks with no attributes
    el.plain = true
  }
}

export function processElement(element: ASTElement, options: CompilerOptions) {
  processKey(element)

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain =
    !element.key && !element.scopedSlots && !element.attrsList.length

  processRef(element)
  processSlotContent(element)
  processSlotOutlet(element)
  processComponent(element)
  for (let i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element
  }
  processAttrs(element)
  return element
}

// 处理for
export function processFor(el: ASTElement) {
  let exp
  if ((exp = getAndRemoveAttr(el, 'v-for')) && typeof exp === 'string') {
    const res = parseFor(exp)
    if (res) {
      extend(el, res)
    } else if (process.env.NODE_ENV !== 'production') {
      warn(`Invalid v-for expression: ${exp}`, el.rawAttrsMap['v-for'])
    }
  }
}

interface ForParseResult {
  for: string
  alias: string
  iterator1?: string
  iterator2?: string
}

// (value, name, index) in iterator
export function parseFor(exp: string): ForParseResult | undefined {
  const inMatch = exp.match(forAliasRE)
  if (!inMatch) return
  const res: ForParseResult = { for: '', alias: '' }
  res.for = inMatch[2].trim()
  const alias = inMatch[1].trim().replace(stripParensRE, '')
  const iteratorMatch = alias.match(forIteratorRE)
  if (iteratorMatch) {
    res.alias = alias.replace(forIteratorRE, '').trim() // value
    res.iterator1 = iteratorMatch[1].trim() // name or index
    if (iteratorMatch[2]) {
      res.iterator2 = iteratorMatch[2].trim() // index
    }
  } else {
    res.alias = alias // value
  }
  return res
}

// 创建attr的{ key: value }的映射
function makeAttrsMap(attrs: Array<ASTAttr>): Record<string, unknown> {
  const map: Record<string, unknown> = {}
  for (let i = 0, l = attrs.length; i < l; i++) {
    if (
      process.env.NODE_ENV !== 'production' &&
      map[attrs[i].name] &&
      !isIE &&
      !isEdge
    ) {
      warn('duplicate attribute: ' + attrs[i].name, attrs[i])
    }
    map[attrs[i].name] = attrs[i].value
  }
  return map
}

// 禁止在模板里使用的tag，style和script不会编译且有副作用，不能用在模板里
function isForbiddenTag(el: ASTElement): boolean {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' &&
      (!el.attrsMap.type || el.attrsMap.type === 'text/javascript'))
  )
}

// TODO ie的xhtml namespace的bug，历史遗留暂时无需理解
const ieNSBug = /^xmlns:NS\d+/
const ieNSPrefix = /^NS\d+:/
function guardIESVGBug(attrs: Array<ASTAttr>): Array<ASTAttr> {
  const res = []
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i]
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '')
      res.push(attr)
    }
  }
  return res
}