import _ from 'lodash'
export const string = (v1: string, v2: string) => {
  if (typeof v1 == 'string' && typeof v2 == 'string') {
    return v1 == v2 ? true : false
  }
  return v1 == v2 ? true : false //
}

export const number = (v1: number, v2: number) => {
  return v1 == v2 ? true : false //
  //   if (v1 == null) {
  //     v1 = Number.MIN_VALUE
  //   } else if (isNaN(v1)) {
  //     v1 = Number.MIN_VALUE // 如果不是数字，视为最小值
  //   } else {
  //     v1 = Number(v1) // 将字符串转换为数字
  //   }

  //   if (v2 == null) {
  //     v2 = Number.MIN_VALUE
  //   } else if (isNaN(v2)) {
  //     v2 = Number.MIN_VALUE // 如果不是数字，视为最小值
  //   } else {
  //     v2 = Number(v2) // 将字符串转换为数字
  //   }
  //   // 使用比较运算符比较数字大小
  //   if (v1 < v2) {
  //     return -1
  //   } else if (v1 > v2) {
  //     return 1
  //   } else {
  //     return 0 // 相等
  //   }
}

export const date = (v1: string, v2: string) => {
  return 0
}

export const datetime = (v1: string, v2: string) => {
  return 0
}

export const time = (v1: string, v2: string) => {
  return 0
}

//判断是否相等

export const subObj = {
  string: (v1: string, v2: string) => {
    return _.lt(v1, v2)
  },
  number: (v1: number, v2: number) => {
    return _.lt(v1, v2)
  },
  date: (v1: string, v2: string) => {
    try {
      const date1 = new Date(v1)
      const date2 = new Date(v2)
      const dateString1 = date1.toISOString().slice(0, 10)
      const dateString2 = date2.toISOString().slice(0, 10)
      return _.lt(dateString1, dateString2)
    } catch (error) {
      return false
    }
  },
  datetime: (v1: string, v2: string) => {
    try {
      const date1 = new Date(v1)
      const date2 = new Date(v2)
      // const dateString1 = date1.toISOString().slice(0, 10);
      // const dateString2 = date2.toISOString().slice(0, 10);
      return _.lt(date1, date2)
    } catch (error) {
      return false
    }
  },
  time: (v1: string, v2: string) => {
    try {
      const date1 = new Date(v1)
      const date2 = new Date(v2)

      // 提取时分秒信息
      const time1 = _.pick(date1, ['getHours', 'getMinutes', 'getSeconds'])
      const time2 = _.pick(date2, ['getHours', 'getMinutes', 'getSeconds'])
      return
      // 使用 _.isEqual 比较两个时间对象是否相等
    } catch (error) {}
  },
}
