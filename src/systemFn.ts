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



/* 
let _data = await this.getHttp().find('navs')
    let tableConfig = {
      showHeaderButtons: false, //
      enableDragRow: true,
      treeConfig: {
        id: 'id',
        parentId: 'pid',
        rootId: 0,
      },
      contextItems: [
        {
          label: '添加菜单',
          fn: async (config) => {
            let p = config.parent
            console.log('parent', p) //
          },
        },
        {
          label: '添加子菜单', //
          fn: async () => {},
        },
      ],
      buttons: [],
      columns: [
        {
          field: 'id',
          title: 'id',
          tree: true,
          frozen: 'left',
        },
        {
          field: 'navname', //
          title: '导航名称',
          editType: 'string', //
          width: 200, //
        },
        {
          field: 'tableName',
          editType: 'string', //
          title: '表格或者视图名称',
        },
        {
          field: 'status',
          title: '是否启用', //
          editType: 'boolean', //
        },
      ],
      data: _data,
      height: 600,
      width: 800, //
      dragRowFn: (config) => {
        return true //
      },
      confirmFn: async (dialog) => {
        let data = dialog.getRef('innerCom').getFlatTreeData()
        // console.log(data, 'testData')//
        let _data1 = data.filter((item) => {
          return item['_rowState'] == 'change'
        })
        // console.log(_data1)//
        let http = this.getHttp()
        await http.patch('navs', _data1) //
        this.confirmMessage('更新菜单成功') ////
        this.clearCacheValue('getMenuData') //
        await this.getMenuData() //
      },
      dragRowAfterFn: (config) => {
        let data = config.data
        data.forEach((item, i) => {
          item['_rowState'] = 'change'
          item['sort'] = Number(i) + 1 ////
        })
      },
      showRowSeriesNumber: true,
    }
    await this.confirmTable(tableConfig) //
    return tableConfig


*/