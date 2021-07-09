/*
 * @Author: your name
 * @Date: 2021-07-09 20:05:21
 * @LastEditTime: 2021-07-09 20:39:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_typescript/src/3、函数定义/index.ts
 */

/*
// ES5函数定义
function run () {
  return 'run'
}

var run = function () {
  return 'run'
}
*/
// 一、ts的函数定义
// 定义返回值
function fn1(): string {
  return 'run'
}
const fn2 = function (): number {
  return 111
}
// 定义传参
function fn3(name: string, age: number) {
  return `${name} --- ${age}`
}
// 无返回值
function fn4(): void {}
// 可选参数，可选参数必须配置到参数的最后面
function fn5(name: string, age?: number) {
  if (age) {
    return `${name} --- ${age}`
  }
  return `${name} --- 年龄保密`
}
// 默认参数
function fn6(name: string, age: number = 18) {
  return `${name} --- ${age}`
}
// 剩余参数，三点运算符
function fn7(init: number, ...rest: number[]) {
  return rest.reduce((acc, cur) => (acc += cur), init)
}
// console.log(fn7(1, 2, 3, 4, 5)) // 15

// 二、函数重载
function getInfo(name: string): string
function getInfo(age: number): number
function getInfo(src: any): any {
  if (typeof src === 'string') {
    return 'John'
  } else if (typeof src === 'number') {
    return 14
  }
}
// getInfo('john') // 正确
// getInfo(11) // 正确
// getInfo(false) // 报错，没有重载boolean类型

// 三、箭头函数，es6箭头函数

const fn8 = () => {}
