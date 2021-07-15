/*
 * @Author: your name
 * @Date: 2021-07-15 20:18:11
 * @LastEditTime: 2021-07-15 20:25:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_typescript/src/9、泛型接口泛型类/index.ts
 */
// 泛型接口1
// interface ConfigFn {
//   <T>(value1: T): T
// }
// const getData: ConfigFn = function <T>(value1: T): T {
//   return value1
// }
// console.log(getData<string>('测试'))
// 泛型接口2
interface ConfigFn<T> {
  (value1: T): T
}
const getData: ConfigFn<string> = function <T>(value1: T): T {
  return value1
}
console.log(getData('测试'))
