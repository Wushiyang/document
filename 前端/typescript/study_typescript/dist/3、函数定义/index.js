"use strict";
/*
 * @Author: your name
 * @Date: 2021-07-09 20:05:21
 * @LastEditTime: 2021-07-09 20:39:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_typescript/src/3、函数定义/index.ts
 */
/*
// ES5函数定义
function run () {
  return 'run'
}

var run = function () {
  return 'run'
}
*/
// 一、ts的函数定义
// 定义返回值
function fn1() {
    return 'run';
}
var fn2 = function () {
    return 111;
};
// 定义传参
function fn3(name, age) {
    return name + " --- " + age;
}
// 无返回值
function fn4() { }
// 可选参数，可选参数必须配置到参数的最后面
function fn5(name, age) {
    if (age) {
        return name + " --- " + age;
    }
    return name + " --- \u5E74\u9F84\u4FDD\u5BC6";
}
// 默认参数
function fn6(name, age) {
    if (age === void 0) { age = 18; }
    return name + " --- " + age;
}
// 剩余参数，三点运算符
function fn7(init) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    return rest.reduce(function (acc, cur) { return (acc += cur); }, init);
}
function getInfo(src) {
    if (typeof src === 'string') {
        return 'John';
    }
    else if (typeof src === 'number') {
        return 14;
    }
}
// getInfo('john') // 正确
// getInfo(11) // 正确
// getInfo(false) // 报错，没有重载boolean类型
// 三、箭头函数，es6箭头函数
var fn8 = function () { };
