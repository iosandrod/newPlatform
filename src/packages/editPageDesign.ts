import { Column } from '@/table/column'
import { PageDesign } from './pageDesign'
import { useHooks } from './utils/decoration'
import { Table } from '@/table/table'
import { getFlatTreeData } from './utils'

export class editPageDesign extends PageDesign {
  async addMainTableRow(addConfig?: any): Promise<void> {
    console.log('添加主表以及子表') ////
    let defaultV = await this.getDefaultValue(this.getTableName()) //
    let tableConfig = this.getTableRefData(this.getTableName()) //
    tableConfig.curRow = defaultV //
    let allDetailTable = this.getAllDetailTable()
    let tref = allDetailTable
    // .map((t) => {
    //   return t.getRef('fieldCom')
    // })
    // .filter((t) => {
    //   let _t: Table = t
    //   if (_t == null) {
    //     return false
    //   }
    //   return true
    // })
    for (const ta of tref) {
      await ta.addRows(10)
    } //
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
    let tableName = config.tableName || this.getRealTableName() //
    let rTableName = this.getRealTableName() //
    let http = this.getHttp()
    let query = config.query || {}
    let tableState = this.tableState //
    if (Object.keys(query).length == 0) {
      return
    }
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
  async validate() {} //
  setCurrentDesign(status: boolean = true) {
    //
    let configMap = this.tableConfigMap //
    super.setCurrentDesign(status)
  }
  setColumnSelect() {}
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
    console.log(config, 'testConfig') //
    // console.log('saveTableData') //
    let realTableName = this.getRealTableName()
    let http = this.getHttp()
    // await http.runCustomMethod(realTableName, 'batchUpdate', config) //批量更新//
    await http.create(realTableName, config)
  } //
  async editTableRows() {
    console.log('编辑当前行') //
  }
}
