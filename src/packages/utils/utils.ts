export const isEmpty = (v) =>
  v === '' || v === null || v === undefined || (Array.isArray(v) && !v.length)
import { globalConfig } from '@ER/formEditor/componentsConfig'
import _ from 'lodash'
import { nanoid } from 'nanoid'
import * as equal from './equal' //
export const generateOptions = (len) => {
  const result = []
  while (len--) {
    result.push({
      label: 'Option',
      value: nanoid(),
    })
  }
  return result
}
export const generateData = (layoutType = 1) => {
  const result: any = {
    config: _.cloneDeep(globalConfig),
  }
  result.logic = result.data = {}
  if (layoutType === 1) {
    result.list = []
  }
  if (layoutType === 2) {
    result.layout = []
  }
  return result
}

export const combineAdjacentEqualElements = (
  arr: any[], //原始的数组
  field: string,
  num: number,
  type: string = 'number', //类型
  sType: string = 'asc',
): any[][] => {
  if (num > 0) {
    //
    return arr.map((v) => {
      if (Array.isArray(v)) {
        return combineAdjacentEqualElements(v, field, num - 1, type, sType)
      }
      return v
    }) as any
  }
  //@ts-ignore
  let subFn = equal.subObj[type]//
  if (typeof subFn !== 'function') {
    subFn = equal.subObj['string']
  }
  const sortedArr = arr.sort((a, b) => {
    let v1 = a[field]
    let v2 = b[field]
    let value = null
    if (sType == 'asc') {
      //使用直接相减的方式吗
      value = subFn(v1, v2) ? 1 : -1
    } else {
      value = subFn(v1, v2) ? -1 : 1
    }
    return value //
  }) as any
  // debugger//
  // 使用快速排序
  const result: any[][] = []
  let equFn = equal[type as keyof typeof equal] //
  if (typeof equFn != 'function') {
    equFn = equal['string']
  }
  // console.log(equFn.toString(),'123123213')//
  for (let i = 0; i < sortedArr.length; i++) {
    let combined: any[] = [sortedArr[i]]
    // 检查相邻元素是否相等/
    //sortedArr[i][field] === sortedArr[i + 1][field]
    //@ts-ignore
    while (
      i + 1 < sortedArr.length &&
      //@ts-ignore
      equFn(sortedArr[i][field], sortedArr[i + 1][field])//
    ) {
      //这里是判断相等
      combined.push(sortedArr[i + 1])
      i++
    }
    result.push(combined)
  }
  return result.map((item) => {
    if (item.length == 1) {
      return item[0]
    }
    return item
  })
}
