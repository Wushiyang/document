/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-08-24 10:34:38
 * @LastEditTime: 2021-08-24 17:06:02
 * @Description: dom元素映射
 */
import { makeMap } from '../../../shared/utils'

export const nameSpaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
}

export const isTextInputType = makeMap('text,number,password,search,email,tel,url')
