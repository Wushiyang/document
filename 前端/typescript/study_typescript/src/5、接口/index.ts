/*
 * @Author: your name
 * @Date: 2021-07-14 16:34:15
 * @LastEditTime: 2021-07-15 18:05:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_typescript/src/5、接口/index.ts
 */
//  1、属性接口
interface FullName {
  firstName: string
  lastName: string
  secondName?: string // 可选属性
}
function printLabel(name: FullName) {
  console.log(
    name.firstName +
      (name.secondName ? '~' + name.secondName : '') +
      '~' +
      name.lastName
  )
}
// printLabel({ age: 20, firstName: 'John', lastName: 'Wu' }) // ts报错，这样写要完成符合FullName接口才行
// const obj = { age: 20, firstName: 'John', lastName: 'Wu' }
// printLabel(obj)

// ts封装ajax
interface Config {
  type: string
  url: string
  data?: string
  dataType: string
}
function ajax(config: Config) {
  const xhr = new XMLHttpRequest()
  xhr.open(config.type, config.url)
  if (config.data) {
    xhr.send(config.data)
  } else {
    xhr.send()
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log('成功')
      if (config.dataType === 'json') {
        console.log(JSON.parse(xhr.responseText))
      } else {
        console.log(xhr.responseText)
      }
    }
  }
}
ajax({
  type: 'GET',
  url: 'http://www.baidu.com',
  dataType: 'json'
})

// 加密函数接口
interface Encrypt {
  (key: string, value: string): string
}
const md5: Encrypt = function (key: string, value: string): string {
  return key + value
}
console.log(md5('name', '张三'))
