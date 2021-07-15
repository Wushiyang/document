/*
 * @Author: your name
 * @Date: 2021-07-10 11:26:15
 * @LastEditTime: 2021-07-10 12:02:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /create_vue2/rollup.config.js
 */
// import typescriptPlugin from 'rollup-plugin-typescript'
export default {
  input: './src/index.js',
  output: {
    file: './dist/bundle.js',
    format: 'esm',
    name: 'Vue'
  }
  // plugins: [
  //   typescriptPlugin({
  //     exclude: 'node_modules/**'
  //   })
  // ]
}
