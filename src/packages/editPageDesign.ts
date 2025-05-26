import { Column } from '@/table/column'
import { PageDesign } from './pageDesign'
import { useHooks } from './utils/decoration'
import { Table } from '@/table/table'
import { getFlatTreeData } from './utils'

export class editPageDesign extends PageDesign {
  isEdit = true
  setCurrentDesignState(state) {
    super.setCurrentDesignState(state) //
  }
  async addMainTableRow(addConfig?: any): Promise<void> {
    let curRow = addConfig?.curRow || {}
    console.log('添加主表以及子表') ////
    let defaultV = await this.getDefaultValue(this.getTableName()) //
    defaultV = { ...defaultV, ...curRow } //
    let tableConfig = this.getTableRefData(this.getTableName()) //
    tableConfig.curRow = defaultV //
    this.setCurrentDesignState('add') //
    let allDetailTable = this.getAllDetailTable()
    let tref = allDetailTable //
    for (const ta of tref) {
      await ta.addRows(10)
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
    }
    return config //
  })
  async getTableData(config?: any) {
    let tableName = config.tableName || this.getTableName() //
    let rTableName = this.getRealTableName() //
    let http = this.getHttp()
    let query = config.query || {}
    let tableState = this.tableState //
    if (Object.keys(query).length == 0) {
      return
    } //
    let res = await http.get(rTableName, 'find', query) //
    let dataMap = this.getTableRefData(tableName)
    let row = res[0] || {}
    dataMap['data'] = res //
    dataMap['curRow'] = row //
    let evName = `${tableName}_getTableData` //
    let _config = {
      event: evName,
      data: res,
    }
    this.setCurrentDesignState('scan') //
    await this.publishEvent(_config) //
    return res
  }
  async getDefaultValue(tableName: string): Promise<any> {
    let columns = this.getTableColumns(tableName, true) //
    let obj1 = {}
    for (const col of columns) {
      // if(col.field=='cSdOrderNo'){//
      //   debugger//
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
        } //
        let data = dataRef.data
        let _d = getFlatTreeData(data)
        let changeD = _d.filter((row) => {
          let rowState = row['_rowState']
          return rowState == 'add' || rowState == 'change'
        })

        let obj = {
          tableName: tableName,
          data: changeD, //
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
  async validate() { } //
  setCurrentDesign(status: boolean = true) {
    //
    let configMap = this.tableConfigMap //
    super.setCurrentDesign(status)
  }
  setColumnSelect() { }
  async saveTableDesign(_config?: any) {
    let isD = this.isDialog
    let _config1 = { ..._config, refresh: !isD }
    super.saveTableDesign(_config1)
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
    } //
    this.setCurrentLoading(true) //
    let tableState = this.tableState
    let _res = null
    if (tableState == 'add') {
      _res = await this.addMainRow(config)
    } else {
      _res = await this.updateMainRow(config) //
    }
    let row0 = _res[0]
    this.setCurRow(row0)
    this.setCurrentDesignState('scan') //
  }
  async addMainRow(config) {
    let http = this.getHttp()
    let realTableName = this.getRealTableName()
    let _res = await http.create(realTableName, config)
    this.getSystem().confirmMessage('数据新增成功', 'success')
    return _res
  }
  async updateMainRow(config) {
    let http = this.getHttp()
    let realTableName = this.getRealTableName()
    let _res = await http.patch(realTableName, config) //
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
}
