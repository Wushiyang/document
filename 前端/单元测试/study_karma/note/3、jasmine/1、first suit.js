/*
 * @Author: your name
 * @Date: 2021-07-26 19:21:40
 * @LastEditTime: 2021-07-27 20:15:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_karma/note/3、jasmine/1、first suit.js
 */

// describe(string, () => void)
// 一组测试的描述specs

// it(string, () => void, number)
// 单个测试spec

// expect(any): matchers
// 一个测试的期待值

// toBe(any): matchers
// 相当于===

// toEqual(any): matchers
// 相当于===
// describe('A suite', function () {
//   it('contains spec with an expectation', function () {
//     expect(true).toBe(true)
//   })
// })

// describe('The "toBe" matcher compares with ===', function () {
//   it('and has a positive case', function () {
//     expect(true).toBe(true)
//   })
//   it('and can have a negative case', function () {
//     expect(false).not.toBe(true)
//   })
// })

// beforeEach(() => void)
// 在一个describe里的所有it运行前都会运行一次beforeEach

// beforeAll(() => void)
// 在所有describe运行前会触发一次beforeAll

// afterEach(() => void)
// 在一个describe里的所有it运行后都会运行一次afterEach

// afterAll(() => void)
// 在所有describe运行后会触发一次afterAll

// it，beforeEach，beforeAll，afterEach，afterAll里的this都是一个空对象，函数作用即使在函数作用域里赋值在离开函数作用域后会重置为空对象
// describe('一组生命周期的测试:\n', function () {
//   let foo = 0
//   it('beforeEach测试 1', function () {
//     this.a = '测试'
//     console.log(this)
//     expect(1).toBe(foo)
//   })
//   it('beforeEach测试 2', function () {
//     console.log('获取this', this.a)
//     expect(2).toBe(foo)
//   })
//   beforeEach(function () {
//     foo += 1
//     console.log('触发beforeEach')
//   })
//   afterEach(function () {
//     console.log('触发afterEach')
//     foo = 0
//   })
//   beforeAll(function () {
//     console.log('触发beforeAll')
//     foo = 10
//   })
//   afterAll(function () {
//     console.log('触发afterAll')
//     foo = 0
//   })

//   it('一定会fail', function () {
//     fail('失败函数')
//   })
// })

// 内嵌describe
// describe('A spec', function () {
//   let foo
//   beforeEach(function () {
//     foo = 0
//     foo += 1
//   })
//   afterEach(function () {
//     foo = 0
//   })
//   it('is just a function, so it can contain any code', function () {
//     expect(foo).toEqual(1)
//   })
//   it('can have more than one expectation', function () {
//     expect(foo).toBe(1)
//     expect(true).toEqual(true)
//   })
//   describe('nested inside a second describe', function () {
//     let bar
//     beforeEach(function () {
//       bar = 1
//     })
//     it('can reference both scopes as needed', function () {
//       expect(foo).toEqual(bar)
//     })
//   })
// })

// xdescribe 内部的结果将会无视
// xit内部的结果将会无视
// 无函数的it内部结果被无视
// it函数体力有pending则内部结果也被无视
// xdescribe('A spec', function () {
//   let foo
//   beforeEach(function () {
//     foo = 0
//     foo += 1
//   })
//   it('is just a function, so it can contain any code', function () {
//     expect(foo).toEqual(1)
//   })
// })
// describe('Pending specs', function () {
//   xit("can be declared 'xit'", function () {
//     expect(true).toBe(false)
//   })
//   it("can be declared with 'it' but without a function")
//   it("can be declared by calling 'pending' in the spec body", function () {
//     expect(true).toBe(false)
//     pending('this is why it is pending')
//   })
// })

// Spy命名空间
// spyOn(Object, string)
// 监视一个对象的某个属性,设置Object的string为Spy

// toHaveBeenCalled 如果一个被监视的函数被调用则正确
// toHaveBeenCalledTimes(number) 如果一个被监视的函数被调用准确的次数则正确
// toHaveBeenCalledWith(...) 如果一个函数被以一定的参数调用
// toBeNull 字面意义，就是等于null

// Spy.calls命名空间
// Spy.calls.any 返回是否这个监视函数被触发了
describe('A spy', function () {
  var foo,
    bar = null
  beforeEach(function () {
    foo = {
      setBar: function (value) {
        bar = value
      }
    }
    spyOn(foo, 'setBar')
    foo.setBar(123)
    foo.setBar(456, 'another param')
  })
  it('tracks that the spy was called', function () {
    expect(foo.setBar).toHaveBeenCalled()
  })
  it('tracks that the spy was called x times', function () {
    expect(foo.setBar).toHaveBeenCalledTimes(2)
  })
  it('tracks all the arguments of its calls', function () {
    expect(foo.setBar).toHaveBeenCalledWith(123)
    expect(foo.setBar).toHaveBeenCalledWith(456, 'another param')
  })

  it('stops all execution on a function', function () {
    expect(bar).toBeNull()
  })
  it('tracks if it was called at all', function () {
    foo.setBar()
    console.log(foo.setBar.calls)
    expect(foo.setBar.calls.any()).toEqual(true)
  })
})
