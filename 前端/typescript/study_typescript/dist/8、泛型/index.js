"use strict";
/*
 * @Author: your name
 * @Date: 2021-07-15 20:01:11
 * @LastEditTime: 2021-07-15 20:19:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_typescript/src/8、泛型/index.ts
 */
// function getData<T>(value: T): T {
//   return value
// }
// console.log(getData<number>(1))
// class MinClass<T> {
//   public list: T[] = []
//   add(num: T) {
//     this.list.push(num)
//   }
//   min(): T {
//     let minNumber = this.list[0]
//     this.list.forEach((num) => {
//       if (minNumber > num) {
//         minNumber = num
//       }
//     })
//     return minNumber
//   }
// }
// const mc = new MinClass()
// mc.add('z')
// mc.add('c')
// mc.add('a')
// mc.add('d')
// mc.add('h')
// console.log(mc.min())
