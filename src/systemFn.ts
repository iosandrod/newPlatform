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

export const changePassword = async (_this: System) => {
  try {
    let fConfig = {
      title: '修改密码',
      width: 300,
      height: 200,
      itemSpan: 24,
      items: [
        {
          type: 'input',
          label: '旧密码',
          field: 'oldPassword',
        },
        {
          type: 'input',
          label: '新密码',
          field: 'newPassword', //
        },
      ],
      confirmFn: () => {},
    }
    let _data = await _this.confirmForm(fConfig) // //
    // console.log(_data, 'test_data') //
    // return _data
    let http = _this.getHttp()
    let res = await http.post('users', 'updatePassword', _data) //
  } catch (error) {
    console.error(error)
    _this.confirmErrorMessage(`修改密码失败${error?.message}`) //
  }
}

export const installApp = async (_this: System, name) => {
  let fConfig = {
    data: {
      fromid: 0, //
    },
    title: '安装配置',
    width: 400, //
    height: 300,
    itemSpan: 24,
    items: [
      {
        type: 'input',
        label: '安装名称', //
        field: 'cnName', //
        value: name,
      },
      {
        type: 'select',
        label: '账套数据', //
        field: 'fromid', //
        options: {
          options: [
            {
              label: '默认账套', //
              value: 0, //
            },
          ],
        },
      },
    ],
    confirmFn: () => {},
  }
  let _data = await _this.confirmForm(fConfig) //

  // try {
  //   let http = _this.getHttp() //
  //   await http.create('company', { ..._data, appName: name }) //
  //   _this.confirmMessage('安装成功')
  // } catch (error) {
  //   _this.confirmErrorMessage('安装失败') //
  // }
}
