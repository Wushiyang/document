"use strict";
/*
 * @Author: your name
 * @Date: 2021-07-09 11:41:50
 * @LastEditTime: 2021-07-09 20:03:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_typescript/src/2、测试/index.ts
 */
// 1、布尔类型(boolean)
var b = true;
// 2、数字类型(number)
var n = 1;
// 3、字符串类型(string)
var s = '测试';
// 4、元祖类型([type]])
var t = ['sss', false, 1];
// 5、枚举类型(enum)
var Color;
(function (Color) {
    Color[Color["red"] = 0] = "red";
    Color[Color["blue"] = 1] = "blue";
    Color[Color["pink"] = 2] = "pink";
})(Color || (Color = {}));
var c = Color.red;
var cn = Color.red;
var cs1 = Color[cn];
var cs2 = Color[c];
// 6、任意类型(any)
var anything = ['a', 'c', 'd'];
anything = 2;
// 7、null和undefined
var un;
un = 3;
un = undefined;
console.log(un);
var unull;
unull = 3;
unull = null;
console.log(unull);
// 8、void类型
function run() {
    console.log('无返回');
}
run();
// 9、never类型:其他类型的子类型（包括null和undefined），代表从不会出现的值，意味着never类型变量只能被never类型所赋值
// let neverer: never
// neverer = (() => {
//   throw new Error('错误')
// })()
// 10、数组类型
var arr1 = [1, 3, 4];
var arr2 = [3, 5, 6];
// 11、类
