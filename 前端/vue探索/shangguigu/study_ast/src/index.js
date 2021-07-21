/*
 * @Author: your name
 * @Date: 2021-05-25 14:58:07
 * @LastEditTime: 2021-07-07 18:09:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_ast/src/index.js
 */
import parse from './parse'
const templateString = `
  <div>
    <h3 class="test h3 yes" id="test" data-id="3">你好</h3>
    <ul>
      <li>A</li>
      <li>B</li>
      <li>C</li>
    </ul>
  </div>
`
const result = (window.result = parse(templateString))
