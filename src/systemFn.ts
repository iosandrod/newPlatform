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
  console.log(columnSelect, 'testSelect') //
}

export const changePassword = async (_this: System) => {
  try {
    let fConfig = {
      title: '修改密码',
      width: 400,
      height: 300, //
      itemSpan: 24,
      items: [
        {
          type: 'input',
          label: '旧密码',
          required: true,
          field: 'oldPassword',
        },
        {
          type: 'input',
          label: '新密码',
          required: true, //
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

export const installApp = async (_this: System, app) => {
  let name = app.appName
  let cnName = app.cnName
  let fConfig = {
    data: {
      fromid: 1, //
      cnName: cnName, //
    }, //
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
              value: 1, //
            },
          ],
        },
      },
    ],
    confirmFn: () => {},
  }
  let _data = await _this.confirmForm(fConfig) //
  _this.setSystemLoading(true)
  try {
    let http = _this.getHttp() //
    let res = await http.post('company', 'installApp', {
      ..._data,
      appName: name,
    })
    _this.setSystemLoading(false)
    _this.confirmMessage('安装成功')
    return res
  } catch (error) {
    _this.setSystemLoading(false) //
    _this.confirmErrorMessage(`安装失败${error?.message}`)
    return Promise.reject(error) //
  }
}

export const addTableField = async (_this: System, tableName, column) => {
  if (!Boolean(tableName)) {
    return
  } //
  let oldTableConfig = await _this.getHttp().find('tableview', { tableName })
  if (oldTableConfig.length == 0) {
    return
  } //
  let fConfig = {
    itemSpan: 24, //
    width: 350,
    height: 400, //
    items: [
      {
        type: 'input',
        label: '表名',
        field: 'tableName',
        disabled: true, //
        required: true,
      },
      {
        type: 'input',
        label: '字段名称',
        field: 'field',
        validate: async (config) => {
          let reg = /^[a-zA-Z][a-zA-Z0-9_]{0,29}$/
          let value = config.value
          if (!reg.test(value)) {
            return '字段名称格式不正确'
          } //
        },
        required: true,
      },
      {
        type: 'select',
        label: '字段类型',
        field: 'type',
        required: true,
        options: {
          options: [
            {
              value: 'varchar',
              label: '字符类型',
            },
            {
              value: 'int',
              label: '数字类型',
            }, //
          ],
        },
      },
    ],
    title: '新增字段',
    requiredValidate: true,
    validateFn: async (config) => {
      let data = config.data
      return '校验失败' //
    },
    data: column, //
  }
  await _this.confirmForm(fConfig) //
  let http = _this.getHttp() //
  let _obj = {
    tableName,
    column,
    state: 'add',
  } //
  let res = await http.post('tableview', 'changeColumns', _obj) //
  res = res[0] //
  let columns = res.columns
  await _this.confirmMessage('字段添加成功', 'success')
  return columns //
}
export const removeTableField = async (_this: System, tableName, column) => {
  if (!Boolean(tableName)) {
    return
  } //
  let field = column?.field //
  await _this.confirmMessageBox(
    `确定删除表${tableName}的${field}字段吗`,
    'warning',
  ) //
  let http = _this.getHttp() //
  let _obj = {
    tableName,
    column,
    state: 'delete', //
  }
  let res = await http.post('tableview', 'changeColumns', _obj) //
  res = res?.[0] //
  let columns = res?.columns
  if (column == null) {
    //
    return
  }
  await _this.confirmMessage('字段删除成功', 'success')
  return columns //
}
