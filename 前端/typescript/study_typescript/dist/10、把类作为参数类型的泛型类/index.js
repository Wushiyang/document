"use strict";
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
var MySqlDb = /** @class */ (function () {
    function MySqlDb() {
    }
    MySqlDb.prototype.add = function (info) {
        console.log(info);
        return true;
    };
    MySqlDb.prototype.update = function (info, id) {
        throw new Error('Method not implemented.');
    };
    MySqlDb.prototype.delete = function (id) {
        throw new Error('Method not implemented.');
    };
    MySqlDb.prototype.get = function (id) {
        throw new Error('Method not implemented.');
    };
    return MySqlDb;
}());
var MongoDb = /** @class */ (function () {
    function MongoDb() {
    }
    MongoDb.prototype.add = function (info) {
        throw new Error('Method not implemented.');
    };
    MongoDb.prototype.update = function (info, id) {
        throw new Error('Method not implemented.');
    };
    MongoDb.prototype.delete = function (id) {
        throw new Error('Method not implemented.');
    };
    MongoDb.prototype.get = function (id) {
        throw new Error('Method not implemented.');
    };
    return MongoDb;
}());
var MsSqlDb = /** @class */ (function () {
    function MsSqlDb() {
    }
    MsSqlDb.prototype.add = function (info) {
        throw new Error('Method not implemented.');
    };
    MsSqlDb.prototype.update = function (info, id) {
        throw new Error('Method not implemented.');
    };
    MsSqlDb.prototype.delete = function (id) {
        throw new Error('Method not implemented.');
    };
    MsSqlDb.prototype.get = function (id) {
        throw new Error('Method not implemented.');
    };
    return MsSqlDb;
}());
var User = /** @class */ (function () {
    function User() {
    }
    return User;
}());
var u = new User();
u.username = '张三';
u.password = '123456';
var mysqlDBO = new MySqlDb();
mysqlDBO.add(u);
