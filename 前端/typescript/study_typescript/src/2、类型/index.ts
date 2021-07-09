/*
 * @Author: your name
 * @Date: 2021-07-09 11:41:50
 * @LastEditTime: 2021-07-09 20:03:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_typescript/src/2、测试/index.ts
 */

// 1、布尔类型(boolean)
let b: boolean = true
// 2、数字类型(number)
let n: number = 1
// 3、字符串类型(string)
let s: string = '测试'
// 4、元祖类型([type]])
let t: [string, boolean, number] = ['sss', false, 1]
// 5、枚举类型(enum)
enum Color {
  red,
  blue,
  pink
}
let c: Color = Color.red
let cn: number = Color.red
let cs1: string = Color[cn]
let cs2: string = Color[c]
// 6、任意类型(any)
let anything: any = ['a', 'c', 'd']
anything = 2
// 7、null和undefined
let un: number | undefined
un = 3
un = undefined
console.log(un)
let unull: number | null
unull = 3
unull = null
console.log(unull)
// 8、void类型
function run(): void {
  console.log('无返回')
}
run()
// 9、never类型:其他类型的子类型（包括null和undefined），代表从不会出现的值，意味着never类型变量只能被never类型所赋值
// let neverer: never
// neverer = (() => {
//   throw new Error('错误')
// })()
// 10、数组类型
const arr1: number[] = [1, 3, 4]
const arr2: Array<number> = [3, 5, 6]
// 11、类
