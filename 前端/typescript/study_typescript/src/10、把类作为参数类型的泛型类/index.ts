/*
 * @Author: your name
 * @Date: 2021-07-15 20:27:55
 * @LastEditTime: 2021-07-15 20:57:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_typescript/src/10、把类作为参数类型的泛型类/index.ts
 */
// class User {
//   username: string | undefined
//   password: string | undefined
// }
// class ArticleCate {
//   title: string | undefined
//   desc: string | undefined
//   state: number | undefined
// }
// class MysqlDb<T> {
//   add(info: T): boolean {
//     console.log(info)
//     return true
//   }
// }
// const u = new User()
// u.username = '张三'
// u.password = '123456'
// const a = new ArticleCate()
// a.title = '最新新闻'
// a.desc = '这是最新新闻'
// a.state = 1
// const userDb = new MysqlDb<User>()
// userDb.add(u)
// const articleDb = new MysqlDb<ArticleCate>()
// articleDb.add(a)

// 封装一个操作数据库的库，支持mysql、mssql、mongodb
// 都有add、update、delete、get方法
interface DBI<T> {
  add(info: T): boolean
  update(info: T, id: number): boolean
  delete(id: number): boolean
  get(id: number): any[]
}

class MySqlDb<T> implements DBI<T> {
  add(info: T): boolean {
    console.log(info)
    return true
  }
  update(info: T, id: number): boolean {
    throw new Error('Method not implemented.')
  }
  delete(id: number): boolean {
    throw new Error('Method not implemented.')
  }
  get(id: number): any[] {
    throw new Error('Method not implemented.')
  }
}
class MongoDb<T> implements DBI<T> {
  add(info: T): boolean {
    throw new Error('Method not implemented.')
  }
  update(info: T, id: number): boolean {
    throw new Error('Method not implemented.')
  }
  delete(id: number): boolean {
    throw new Error('Method not implemented.')
  }
  get(id: number): any[] {
    throw new Error('Method not implemented.')
  }
}
class MsSqlDb<T> implements DBI<T> {
  add(info: T): boolean {
    throw new Error('Method not implemented.')
  }
  update(info: T, id: number): boolean {
    throw new Error('Method not implemented.')
  }
  delete(id: number): boolean {
    throw new Error('Method not implemented.')
  }
  get(id: number): any[] {
    throw new Error('Method not implemented.')
  }
}

class User {
  username: string | undefined
  password: string | undefined
}
const u = new User()
u.username = '张三'
u.password = '123456'

const mysqlDBO = new MySqlDb<User>()
mysqlDBO.add(u)
