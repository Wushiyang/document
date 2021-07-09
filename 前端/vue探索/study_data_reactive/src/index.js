/*
 * @Author: your name
 * @Date: 2021-05-27 14:56:45
 * @LastEditTime: 2021-07-08 14:43:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_data_reactive/src/index.js
 */
import observe from './observe.js'
import Watcher from './Watcher.js'
// 读取值会触发依赖收集，然后触发依赖订阅，设置值会触发依赖发布
let obj = {
  a: {
    m: {
      n: 5
    }
  },
  b: 4,
  g: [11, 22, 33, 44]
}

// obj.g.splice(2, 1, [11, 22, 33])
// window.g = obj.g
// console.log(obj.g)
// obj.g[4]
// obj.b++

// obj.a.m = 2
observe(obj)
// new Watcher(obj, 'a.m.n', (nVal, oVal) => {
//   console.log(nVal, oVal)
//   console.log('❤')
// })
obj.a.m.n = 55
// console.log(obj.a.m.n)
