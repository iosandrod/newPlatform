import { System } from './system'

export const createColumnSelect = async (sys: System, tableName) => {
  //
  let _this = sys
  if (tableName == null) {
    return
  } //
  if (Array.isArray(tableName)) {
    tableName = tableName.map((t) => t[0])
  } else {
    tableName = [tableName]
  }
  // let _key = `${tableName}_columns`
  tableName = tableName.filter((item) => {
    if (_this.columnSelectOptions[item]) {
      return false
    }
    return true
  })
  if (tableName.length == 0) {
    return
  }
  // let _key = `${tableName[0]}_columns`
  let columnSelect = _this.columnSelectOptions
  let arr = columnSelect[tableName] //
  let _cols = null
  if (arr == null) {
    let query = null
    if (Array.isArray(tableName)) {
      let _n = new Set(tableName)
      tableName = Array.from(_n) //
      query = {
        tableName: {
          $in: tableName,
        },
      }
    } else {
      query = {
        tableName: tableName,
      }
    }
    _cols = await _this.getHttp().find('columns', query) ////
  } //
  let colObj = _cols.reduce((res: any, item: any) => {
    let tableName = item.tableName
    let arr = res[tableName]
    if (arr == null) {
      res[tableName] = []
      arr = res[tableName]
    }
    arr.push(item)
    return res //
  }, {})
  let colObjArr: any = Object.values(colObj)
  for (const obj of colObjArr) {
    let tableName = obj[0].tableName
    let _key = `${tableName}_columns`
    let _cols1 = obj.map((item) => {
      return {
        value: item.field,
        label: item.title || item.field,
      }
    })
    columnSelect[tableName] = _cols1 //
    columnSelect[_key] = true //
  }
}
