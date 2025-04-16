import { workerPool } from '@/base/base'
import { combineAdjacentEqualElements } from '@ER/utils'
import _ from 'lodash'
let _fn1 = () => {
  return _.add(1, 2)
}
export const calculate = async (config) => {
  let _fn = (config) => {
    function lt(value: any, other: any): boolean {
      const val = toComparable(value)
      const oth = toComparable(other)

      if (val === undefined || oth === undefined) return false
      if (Number.isNaN(val) || Number.isNaN(oth)) return false

      return val < oth
    }

    /**
     * 将任意类型转换为可比较的基本类型
     */
    function toComparable(input: any): number | string {
      if (input == null) return undefined

      // 如果是 Symbol，不能比较
      if (typeof input === 'symbol') return undefined

      // 如果是 Date，转为时间戳
      if (input instanceof Date) return input.getTime()

      // 如果是对象，尝试 valueOf 和 toString
      if (typeof input === 'object') {
        if (typeof input.valueOf === 'function') {
          const val = input.valueOf()
          if (typeof val !== 'object') return toComparable(val)
        }
        if (typeof input.toString === 'function') {
          return toComparable(input.toString())
        }
        return undefined
      }

      // 对于布尔值和数字
      if (typeof input === 'boolean' || typeof input === 'number') {
        return Number(input)
      }

      // 对于字符串，尝试转为数字（但也可能是不可转换的字符串）
      if (typeof input === 'string') {
        const trimmed = input.trim()
        const num = +trimmed
        return Number.isNaN(num) ? trimmed : num
      }

      return undefined
    }
    let _ = {
      lt,
    }
    let subObj = {
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
          // 提取时分秒信息
          return
          // 使用 _.isEqual 比较两个时间对象是否相等
        } catch (error) {}
      },
    }
    const string = (v1: string, v2: string) => {
      if (typeof v1 == 'string' && typeof v2 == 'string') {
        return v1 == v2 ? true : false
      }
      return v1 == v2 ? true : false //
    }

    const number = (v1: number, v2: number) => {
      return v1 == v2 ? true : false //
    }

    const date = (v1: string, v2: string) => {
      return 0
    }

    const datetime = (v1: string, v2: string) => {
      return 0
    }

    const time = (v1: string, v2: string) => {
      return 0
    }
    let equal = {
      string,
      number,
      date,
      datetime,
      time,
      subObj,
    }
    const combineAdjacentEqualElements = (
      arr, //原始的数组
      field,
      num,
      type = 'number', //类型
      sType = 'asc',
    ) => {
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
      let subFn = equal.subObj[type] //
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
      })
      // debugger//
      // 使用快速排序
      const result = []
      let equFn = equal[type as keyof typeof equal] //
      if (typeof equFn != 'function') {
        equFn = equal['string']
      }
      // console.log(equFn.toString(),'123123213')//
      for (let i = 0; i < sortedArr.length; i++) {
        let combined = [sortedArr[i]]
        // 检查相邻元素是否相等/
        //sortedArr[i][field] === sortedArr[i + 1][field]
        //@ts-ignore
        while (
          i + 1 < sortedArr.length &&
          //@ts-ignore
          equFn(sortedArr[i][field], sortedArr[i + 1][field]) //
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
    let data = config.data
    let sortState = config.sortState
    let filterConfig = config.filterConfig
    let _filterConfig = filterConfig
    let globalValue = config.globalValue
    let _data1 = data
    if (globalValue.length > 0) {
      _data1 = _data1.filter((v) => {
        let _shtml = v['_shtml'] //
        let reg = new RegExp(globalValue, 'g') //
        if (reg.test(_shtml)) {
          return true
        }
        return false
      })
    }
    let _sortState = sortState
    const sortconfig = _sortState //自定义的排序配置
    //@ts-ignore
    const _sortConfig = sortconfig?.sort((s1, s2) => {
      //@ts-ignore
      return 0 //
    })
    let _data3 = _sortConfig
      ?.reduce((res, item, i) => {
        const field = item.field
        const type = item.type
        let order = item.order
        // debugger//
        const colType: string = 'number' //类型//
        const _data4 = combineAdjacentEqualElements(
          res, //
          field,
          i,
          // colType,
          // type,
          type,
          order,
        )
        return _data4
      }, _data1)
      .flat(sortconfig?.length)

    if (_filterConfig.length > 0) {
      for (const { field, indexArr } of _filterConfig) {
        if (indexArr?.length > 0) {
          const indexSet = new Set(indexArr)
          _data3 = _data3.filter((item) => indexSet.has(item[field]))
        }
      }
    }
    return _data3.map((item) => item._index) //
  }
  let _config = JSON.parse(JSON.stringify(config))
  let value = await workerPool.exec(_fn, [_config])
  return value
}
  