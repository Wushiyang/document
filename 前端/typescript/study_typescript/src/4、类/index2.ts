/*
 * @Author: your name
 * @Date: 2021-07-12 20:55:24
 * @LastEditTime: 2021-07-15 19:52:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_typescript/src/4、类/index.ts
 */

// ts的类
/**
 * 修饰符
 * public
 * protected
 * private
 * 静态属性
 * static
 */
// class Person {
//   public name: string
//   protected age: number
//   private className: string = 'Person'
//   static oid = 3
//   constructor(name = '张三', age = 20) {
//     this.name = name
//     this.age = age
//   }
//   run(): void {
//     console.log(this.name + '在运动')
//   }

//   printClassName(): void {
//     console.log(this.className)
//   }
// }
// const p = new Person()
// p.run()
// console.log(p)
// class Web extends Person {
//   constructor(name = '李四') {
//     super(name)
//   }
//   run(): void {
//     console.log(this.name + '在运动-子类')
//   }
//   work(): void {
//     console.log(this.name + '在工作')
//   }
//   printAge() {
//     console.log(this.age)
//   }
// }
// const w = new Web()
// w.run()
// w.work()
// w.printAge()
// w.printClassName()
// // console.log('外部打印: ', w.className) // ts报错
// // console.log('外部打印: ', w.age) // ts报错
// console.log('静态属性oid: ', Person.oid)
// console.log(w)

// 多态
// class Animal {
//   name: string
//   constructor(name: string) {
//     this.name = name
//   }
//   eat() {
//     // 具体吃什么不知道，由继承的子类取实现
//     console.log('吃的方法')
//   }
// }
// class Dog extends Animal {
//   constructor(name: string) {
//     super(name)
//   }
//   eat() {
//     console.log(this.name + '在吃shit')
//   }
// }

// class Cat extends Animal {
//   constructor(name: string) {
//     super(name)
//   }
//   eat() {
//     console.log(this.name + '在吃鱼')
//   }
// }

// 抽象方法，用abstract关键字定义抽象类和抽象方法，抽象类中的抽象方法不包含具体实现并且必须在派生类中实现
// 抽象方法只能在抽象类中
// abstract class Animal {
//   public name: string
//   constructor(name: string) {
//     this.name = name
//   }
//   abstract eat(): void
// }
// class Dog extends Animal {
//   constructor(name: string) {
//     super(name)
//   }
//   eat() {
//     console.log(this.name + '在吃shit')
//   }
// }
// const d = new Dog('旺财')
// d.eat()
