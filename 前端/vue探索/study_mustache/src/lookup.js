/**
 * 连续点符号寻找属性
 */
export default function loopup(dataObj, keyName) {
  if (keyName.indexOf('.') > -1 && keyName != '.') {
    const keys = keyName.split('.')
    let temp = dataObj
    for (let i = 0; i < keys.length; i++) {
      temp = temp[keys[i]]
    }
    return temp
  }
  return dataObj[keyName]
}
