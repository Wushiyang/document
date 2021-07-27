/*
 * @Author: your name
 * @Date: 2021-07-27 20:29:58
 * @LastEditTime: 2021-07-27 20:30:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_vue2.6/.eslintrc.js
 */
const eslintrc = {
  parser: '@typescript-eslint/parser', // 使用 ts 解析器
  extends: [
    'eslint:recommended', // eslint 推荐规则
    'plugin:@typescript-eslint/recommended' // ts 推荐规则
  ],
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    project: './tsconfig.eslint.json',
    ecmaVersion: 2019,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  rules: {} // 自定义
}

module.exports = eslintrc
