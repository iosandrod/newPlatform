import { Column } from '@/table/column'
import { PageDesign } from './pageDesign'
import { useHooks } from './utils/decoration'
import { Table } from '@/table/table'
import { getFlatTreeData } from './utils'
import { Form } from './form'
import { nextTick } from 'vue'
import { Dialog } from '@/dialog/dialog'

export class editPageDesign extends PageDesign {
  constructor(config) {
    super(config) //
    this.syncFieldTitle()
  }
  isEdit = true
  setCurrentDesignState(state) {
    super.setCurrentDesignState(state) //
  }
  syncFieldTitle() {
    //@ts-ignore
    let fields = this.config.fields
    fields.forEach((field) => {
      let type = field.type
      if (type !== 'dform') {
        return
      }
      let options = field.options
      let tableName = options?.tableName
      if (tableName != this.getTableName()) {
        return
      }
      let layoutData = options.layoutData
      let _fields = layoutData.fields
      _fields.forEach((f) => {
        let f1 = f.field //
        let title = f.label
        if (f1 == title) {
          //@ts-ignore
          let columns = this.config.columns || []
          let c = columns.find((c) => c.field == f1)
          if (c) {
            if (Boolean(c.title) && c.title != c.field) {
              //
              f.label = c.title //
            }
          }
        }
      })
    })
  } //
  async addMainTableRow(addConfig?: any): Promise<void> {
    let curRow = addConfig?.curRow || {}
    let row = addConfig?.row || {}
    curRow = { ...curRow, ...row }
    console.log('添加主表以及子表')
    let defaultV = await this.getDefaultValue(this.getTableName()) //
    defaultV = { ...defaultV, ...curRow } //
    let tableConfig = this.getTableRefData(this.getTableName()) //
    tableConfig.curRow = defaultV //
    this.setCurrentDesignState('add') //
    let allDetailTable = this.getAllDetailTable()
    let tref = allDetailTable //
    for (const ta of tref) {
      await ta.addRows({ num: 10, reset: true })
    }
  }
  @useHooks((config) => {
    let ctx: PageDesign = config.instance
    let args = config.args
    if (args.length == 0) {
      args[0] = {
        tableName: ctx.getRealTableName(),
        query: {}, //
      }
    }
    if (typeof args[0] == 'string') {
      args[0] = {
        tableName: args[0],
        query: {},
      }
    } //
    return config
  })
  async getTableData(config?: any) {
    let tableName = config.tableName || this.getRealTableName() //
    // let rTableName = this.getRealTableName()
    let rTableName = tableName //
    let http = this.getHttp()
    let getDataConfig = config
    let query = config.query || {}
    let queryArr = getDataConfig?.queryArr || []
    let _arr = queryArr
      .map((row) => {
        let field = row.field
        let value = row.value
        let operator = row.operator
        if (field == null || value == null || operator == null) {
          if (typeof row == 'object') {
            //
            let _arr = Object.entries(row).map(([key, value]) => {
              let operator = '$eq'
              let field = key
              if (Array.isArray(value)) {
                operator = '$in'
              }
              let obj = {
                field,
                operator,
                value,
              }
              return obj
            }) //
            return _arr
          }
        } else {
          return row
        }
      })
      .flat()
      .filter((d) => d != null)
    let _query = this.buildQuery(_arr)
    query = { ...query, ..._query }
    let tableState = this.tableState //
    if (tableState == 'add' && Object.keys(query).length == 0) {
      //
      //
      this.getSystem().confirmMessage('当前单据是新增', 'warning') //
      return
    }
    let keyColumn = this.getKeyColumn()
    if (Object.keys(query).length == 0) {
      let curRow = this.getCurRow() //
      let _keyValue = curRow?.[keyColumn]
      if (_keyValue != null) {
        query = {
          [keyColumn]: _keyValue,
        }
      }
    } //
    if (Object.keys(query).length == 0) {
      this.getSystem().confirmMessage('未设置查询条件', 'error')
      return //
    } //
    let tableConfig = this.getTableConfig(tableName)
    let dataSource = tableConfig.dataSource || {} //
    let _t = tableName
    let config1: any = {}
    config1.dataSource = dataSource //
    let res = await http.find(rTableName, query, config1) //
    let dataMap = this.getTableRefData(config.tableName || this.getTableName()) //
    let row = res[0] || {} //
    dataMap['data'] = res //
    // dataMap['curRow'] = row //
    this.setCurRow(row, config?.tableName || this.getTableName()) //
    let evName = `${tableName}_getTableData` //
    let _config = {
      event: evName,
      data: res,
    }
    this.setCurrentDesignState('scan') //
    await this.publishEvent(_config) //
    return res
  }
  async setCurRow(row, tableName = this.getTableName()) {
    //
    let dataMap = this.getTableRefData(tableName)
    dataMap['curRow'] = row
    let evName = `${tableName}_setCurRow`
    let _config = {
      data: row,
      event: evName,
    }
    await this.publishEvent(_config)
    let allDetailTable: string[] = this.getAllDetailTable().map((item) => {
      let tName = item.getTableName()
      return tName
    })
    if (
      tableName == this.getTableName() ||
      tableName == this.getRealTableName()
    ) {
      //
      for (let dTable of allDetailTable) {
        this.getDetailTableData(dTable) //
      } //
    }
    return row
  }
  getKeyColumn() {
    let keyColumn = super.getKeyColumn() //
    if (keyColumn == null) {
      this.getSystem().confirmMessage('请先设置主键字段', 'warning')
      throw new Error('请先设置主键字段')
    }
    return keyColumn //
  }
  async getDefaultValue(tableName: string): Promise<any> {
    let columns = this.getTableColumns(tableName, true) //
    let obj1 = {}
    for (const col of columns) {
      // if(col.field=='cSdOrderNo'){//
      // }
      let defaultValue = await this._getDefaultValue(col)
      if (defaultValue) {
        obj1 = { ...obj1, ...defaultValue } //
      } //
    } ////
    return obj1
  }
  async _getDefaultValue(col: any) {
    if (col instanceof Column) {
      return col.getDefaultValue() //
    }
    let _col = new Column(col)
    let _col1 = await _col.getDefaultValue() //
    return _col1 //
  }
  getCurRow() {
    let tableName = this.getTableName()
    let curRow = super.getCurRow(tableName) //
    return curRow //
  }
  getSaveData(): any {
    let curRow = this.getCurRow()
    let detailTables = this.getAllDetailTable()
    let _t = detailTables
      .map((item) => {
        let tableName = item.getTableName()
        let dataRef = this.getTableRefData(tableName)
        let configRef = this.getTableConfig(tableName)
        let detailTableConfig = configRef?.detailTableConfig
        if (detailTableConfig == null || typeof detailTableConfig != 'object') {
          return null
        }
        let data = dataRef.data
        let _d = getFlatTreeData(data)
        let deleteData = dataRef.deleteData || [] //
        deleteData = deleteData.map((row) => {
          let rowState = row['_rowState']
          let obj = { ...row, _rowState: rowState }
          return obj
        }) //

        _d = _d
          .map((row) => {
            let rowState = row['_rowState']
            let obj = { ...row, _rowState: rowState }
            return obj
          })
          .filter((row) => {
            let rowState = row['_rowState']
            return rowState == 'add' || rowState == 'change' //
          })

        let keyCodeColumn = configRef.keyCodeColumn
        if (keyCodeColumn) {
          _d = _d.filter((row) => {
            let _v = row[keyCodeColumn] //
            if (_v == null) {
              return false
            }
            return true //
          })
        } else {
          this.getSystem().confirmMessage(
            `子表${tableName}请设置必填字段`,
            'warning',
          ) //
          throw new Error(`子表${tableName}请设置必填字段`) //
        }
        if (this.tableState == 'add') {
          if (_d.length == 0) {
            this.getSystem().confirmMessage(
              `子表${tableName}请添加数据`,
              'warning',
            )
            throw new Error(`子表${tableName}请添加数据`) //
          }
        }
        _d = [..._d, ...deleteData] //

        let obj = {
          tableName: tableName,
          data: _d, //
          ...detailTableConfig,
        }
        return obj //
      })
      .filter((row) => row != null) //
      .reduce((res, item) => {
        res[item.tableName] = item
        return res //
      }, {})
    curRow['_relateData'] = _t
    return curRow
  }
  async validate() {
    let f = this.getAllForm()
    let fs: Form[] = f.map((item) => {
      return item.getRef('fieldCom')
    })
    for (const _f of fs) {
      if (_f) {
        await _f.validate()
      }
    }
    let allTables = this.getAllTable()
    let tRefs = allTables.map((item) => {
      return item.getRef('fieldCom')
    })
    for (const _t of tRefs) {
      if (_t) {
        await _t.validate()
      }
    } //
  } //
  setCurrentDesign(status: boolean = true) {
    //
    let configMap = this.tableConfigMap //
    super.setCurrentDesign(status)
  }
  setColumnSelect() {}
  async saveTableDesign(_config?: any) {
    let isD = this.isDialog
    let _config1 = { ..._config, refresh: !isD } //
    await super.saveTableDesign(_config1)
    let layoutData = this.getLayoutData()
    this.setLayoutData(layoutData) //
  }

  @useHooks((config) => {
    let ctx: editPageDesign = config.instance //
    let args = config.args
    if ((args.length = 0)) {
      args[0] = ctx.getSaveData()
    } //
  })
  async saveTableData(config = this.getSaveData()) {
    if (this.tableState == 'scan') {
      return //
    }
    this.setCurrentLoading(true) //
    let tableState = this.tableState
    let _res = null
    try {
      if (tableState == 'add') {
        _res = await this.addMainRow(config)
      } else {
        _res = await this.updateMainRow(config) //
      }
    } catch (error) {
      this.getSystem().confirmErrorMessage(error?.message) //
      return Promise.reject('error') //
    }
    let row0 = _res[0]
    this.setCurRow(row0)
    this.setCurrentDesignState('scan') //
  }
  async addMainRow(config) {
    let http = this.getHttp()
    let realTableName = this.getRealTableName()
    let _res = await http.create(realTableName, config) //
    this.getSystem().confirmMessage('数据新增成功', 'success')
    return _res
  }
  async updateMainRow(config) {
    let http = this.getHttp()
    let realTableName = this.getRealTableName()
    let _res = await http.patch(realTableName, config)
    this.getSystem().confirmMessage('数据更新成功', 'success') //
    return _res
  }
  async editTableRows() {
    let tableState = this.tableState //
    if (tableState == 'edit' || tableState == 'add') {
      return
    } //
    await this.setCurrentDesignState('edit')
  }
  async syncErpCols() {
    let oldTableColumn = await this.getSystem().getOldErpTableColumns(
      this.getRealTableName(),
    ) //
    let _columns = oldTableColumn.filter((col) => {
      return Boolean(col.editType) == true
    })

    let _f = _columns.reduce((res, col) => {
      //
      let tabName = col.tabName
      let _arr = res[tabName]
      if (!_arr) {
        _arr = []
        res[tabName] = _arr
      } //
      _arr.push(col)
      return res
    }, {})
    let obj1 = Object.values(_f).map((items: any[]) => {
      let arr = []
      for (let item of items) {
        //
        let field: any = {
          options: {},
          field: item.field, //
        }
        let editType = item.editType
        //类型
        field.type = editType.toLowerCase() //
        if (field.type == 'bool') {
          field.type = 'boolean' //
        }
        if (
          ![
            'image',
            'buttongroup',
            'string',
            'input',
            'entity',
            'stable',
            'number',
            'sform',
            'radio',
            'select',
            'divider',
            'dform',
            'code',
            'time',
            'date',
            'datetime',
            'checkbox',
            'boolean',
            'baseinfo',
            'color',
            'gantt',
          ].includes(field.type)
        ) {
          field.type = 'string' ////
        }
        if (['int', 'float', 'number'].includes(field.type)) {
          field.type = 'number' //
        }

        let options = item.options
        field.label = item.editTitle //
        let optionsField = item.optionsField //
        options.optionsField = optionsField //
        options.options = options //
        options.required = item.required //
        arr.push(field)
      }
      return arr //
    })
    let f = obj1[0] //

    let com: editPageDesign = this
    let items = com.items
    let allF = items
      .filter((item) => {
        return item.config.type == 'dform'
      })
      .map((f) => {
        // return f.getRef('fieldCom')
        return f
      })
    allF.forEach((f1, i) => {
      //
      let f = f1.getRef('fieldCom')
      let _f: Form = f
      _f.setItems(obj1[i]) //
      nextTick(() => {
        let layout = _f.getLayoutData() //
        let options = f1.getOptions()
        options.layoutData = layout //
      })
    })
  }
}
