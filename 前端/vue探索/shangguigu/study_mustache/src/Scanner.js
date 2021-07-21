export default class Scanner {
  constructor(templateStr) {
    this.templateStr = templateStr
    this.pos = 0
    this.tail = templateStr
  }
  // l路过指定内容，无返回
  scan(tag) {
    if (this.tail.indexOf(tag) == 0) {
      this.pos += tag.length
      this.tail = this.templateStr.substr(this.pos)
    }
  }

  // 扫描直到指定内容结束，并返回结束之前路过的文字
  scanUntil(stopTag) {
    // 记录一下执行本方法的时候pos的值
    const pos_backup = this.pos
    while (!this.eos() && this.tail.indexOf(stopTag) != 0) {
      this.pos++
      this.tail = this.templateStr.substr(this.pos)
    }
    return this.templateStr.substring(pos_backup, this.pos)
  }
  // 模板字符串是否到头
  eos() {
    return this.pos >= this.templateStr.length
  }
}
