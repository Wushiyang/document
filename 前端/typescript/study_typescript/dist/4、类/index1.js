"use strict";
/*
 * @Author: your name
 * @Date: 2021-07-12 20:55:24
 * @LastEditTime: 2021-07-14 15:32:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_typescript/src/4、类/index.ts
 */
// es5的类
// 1、简单类
// function Person(name = '张三', age = 20) {
//   this.name = name
//   this.age = age
//   // 构造函数和原型链添加方法
//   this.run = function () {
//     console.log(this.name + '在运动')
//   }
// }
// // 原型链上添加方法和属性
// Person.prototype.sex = '男'
// Person.prototype.work = function () {
//   console.log(this.name + '在工作')
// }
// // 静态方法
// Person.getInfo = function (instance) {
//   console.log('姓名:' + instance.name, '年龄:' + instance.age)
// }
// const p = new Person()
// p.run()
// p.work()
// Person.getInfo(p)
// console.log(p)
// 2、继承
//  （1）对象冒充继承
// function Web() {
//   Person.call(this) // 对象冒充继承，原型链上级是Web.prototype，无法取得冒充对象的原型链对象
// }
// const w = new Web()
// console.log(w)
//  （2）原型链实现继承
// 原型链实现继承实例化子类的时候(Web)无法给父类(Person)传参
// function Web() {}
// Web.prototype = new Person()
// Web.prototype.constructor = Web // 重置原型的构造函数回Web
// const w = new Web()
// console.log(w)
//  （3）原型链和对象冒充组合继承
// function Web(name, age) {
//   Person.call(this, name, age)
// }
// Web.prototype = new Person()
// Web.prototype.constructor = Web // 重置原型的构造函数回Web
// const w = new Web('赵四'， 24)
// console.log(w)
