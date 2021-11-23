/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-11-17 10:25:24
 * @LastEditTime: 2021-11-23 15:55:52
 * @Description: 请描述该文件
 */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'
export * from './helpers'
export * from './html-parser'
export * from './parse/index'

export interface ModuleOptions {
  // transform an AST node before any attributes are processed
  // returning an ASTElement from pre/transforms replaces the element
  preTransformNode: (el: ASTElement) => ASTElement | undefined
  // transform an AST node after built-ins like v-if, v-for are processed
  transformNode: (el: ASTElement) => ASTElement | undefined
  // transform an AST node after its children have been processed
  // cannot return replacement in postTransform because tree is already finalized
  postTransformNode: (el: ASTElement) => void
  genData: (el: ASTElement) => string // generate extra data string for an element
  transformCode?: (el: ASTElement, code: string) => string // further transform generated code for an element
  staticKeys?: Array<string> // AST properties to be considered static
}

export interface CompilerOptions {
  warn?: (msg: string) => void // allow customizing warning in different environments; e.g. node
  modules?: Array<ModuleOptions> // platform specific modules; e.g. style; class
  directives?: { [key: string]: Function } // platform specific directives
  staticKeys?: string // a list of AST properties to be considered static; for optimization
  isUnaryTag?: (tag: string) => boolean // check if a tag is unary for the platform
  canBeLeftOpenTag?: (tag: string) => boolean // check if a tag can be left opened
  isReservedTag?: (tag: string) => boolean // check if a tag is a native for the platform
  preserveWhitespace?: boolean // preserve whitespace between elements? (Deprecated)
  whitespace?: 'preserve' | 'condense' // whitespace handling strategy
  optimize?: boolean // optimize static content?

  // web specific
  mustUseProp?: (tag: string, type?: string, name?: string) => boolean // check if an attribute should be bound as a property
  isPreTag?: (attr: string) => boolean // check if a tag needs to preserve whitespace
  getTagNamespace?: (tag: string) => string // check the namespace for a tag
  expectHTML?: boolean // only false for non-web builds
  isFromDOM?: boolean
  shouldDecodeTags?: boolean
  shouldDecodeNewlines?: boolean
  shouldDecodeNewlinesForHref?: boolean
  outputSourceRange?: boolean

  // runtime user-configurable
  delimiters?: [string, string] // template delimiters
  comments?: boolean // preserve comments in template

  // for ssr optimization compiler
  scopeId?: string
}

interface WarningMessage {
  msg: string
  start?: number
  end?: number
}

interface CompiledResult {
  ast?: ASTElement
  render: string
  staticRenderFns: Array<string>
  stringRenderFns?: Array<string>
  errors?: Array<string | WarningMessage>
  tips?: Array<string | WarningMessage>
}

interface ASTIfCondition {
  exp?: string
  block: ASTElement
}
type ASTIfConditions = Array<ASTIfCondition>

export interface ASTAttr {
  name: string
  value: unknown
  dynamic?: boolean
  start?: number
  end?: number
}

interface ASTDirective {
  name: string
  rawName: string
  value: string
  arg?: string
  isDynamicArg: boolean
  modifiers?: ASTModifiers
  start?: number
  end?: number
}

type ASTModifiers = Record<string, boolean>

interface ASTElementHandler {
  value: string
  params?: Array<unknown>
  modifiers?: ASTModifiers
  dynamic?: boolean
  start?: number
  end?: number
}

type ASTElementHandlers = Record<string, ASTElementHandler | Array<ASTElementHandler>>

export interface ForParseResult {
  for?: string
  alias?: string
  iterator1?: string
  iterator2?: string
}

export interface ASTElement extends ForParseResult {
  type: 1
  tag: string
  attrsList: Array<ASTAttr>
  attrsMap: { [key: string]: unknown }
  rawAttrsMap: { [key: string]: ASTAttr }
  parent?: ASTElement
  children: Array<ASTNode>

  start?: number
  end?: number

  processed?: true

  static?: number
  staticRoot?: boolean
  staticInFor?: boolean
  staticProcessed?: boolean
  hasBindings?: boolean

  text?: string
  attrs?: Array<ASTAttr>
  dynamicAttrs?: Array<ASTAttr>
  props?: Array<ASTAttr>
  plain?: boolean
  pre?: true
  ns?: string

  component?: string
  inlineTemplate?: true
  transitionMode?: string | null
  slotName?: string
  slotTarget?: string
  slotTargetDynamic?: boolean
  slotScope?: string
  scopedSlots?: { [name: string]: ASTElement }

  ref?: string
  refInFor?: boolean

  if?: string
  ifProcessed?: boolean
  elseif?: string
  else?: true

  ifConditions?: ASTIfConditions

  forProcessed?: boolean
  key?: string
  // for?: string
  // alias?: string
  // iterator1?: string
  // iterator2?: string

  staticClass?: string
  classBinding?: string
  staticStyle?: string
  styleBinding?: string
  events?: ASTElementHandlers
  nativeEvents?: ASTElementHandlers

  transition?: string | true
  transitionOnAppear?: boolean

  model?: {
    value: string
    callback: string
    expression: string
  }

  directives?: Array<ASTDirective>

  forbidden?: true
  once?: true
  onceProcessed?: boolean
  wrapData?: (code: string) => string
  wrapListeners?: (code: string) => string

  // 2.4 ssr optimization
  ssrOptimizability?: number

  // weex specific
  appendAsTree?: boolean
}

interface ASTExpression {
  type: 2
  expression: string
  text: string
  tokens: Array<string | Object>
  static?: boolean
  // 2.4 ssr optimization
  ssrOptimizability?: number
  start?: number
  end?: number
}

interface ASTText {
  type: 3
  text: string
  static?: boolean
  isComment?: boolean
  // 2.4 ssr optimization
  ssrOptimizability?: number
  start?: number
  end?: number
}

type ASTNode = ASTElement | ASTText | ASTExpression

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile(template: string, options: CompilerOptions): CompiledResult {
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
