/*
 * @Author: your name
 * @Date: 2021-07-15 19:50:46
 * @LastEditTime: 2021-07-15 19:59:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_typescript/src/7、接口的扩展和接口的继承/index.ts
 */
interface Animal {
  eat(): void
}
interface Person extends Animal {
  work(): void
}
class Programmer {
  public name: string
  constructor(name: string) {
    this.name = name
  }
  coding() {
    console.log(this.name + '在coding')
  }
}
class Web extends Programmer implements Person {
  constructor(name: string) {
    super(name)
  }
  eat() {
    console.log(this.name + '在吃')
  }
  work() {
    console.log(this.name + '在工作')
  }
}
const w = new Web('小样')
w.eat()
w.coding()
