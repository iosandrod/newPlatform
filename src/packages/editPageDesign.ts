import { Column } from '@/table/column'
import { PageDesign } from './pageDesign'
import { useHooks } from './utils/decoration'

export class editPageDesign extends PageDesign {
  async addMainTableRow(addConfig?: any): Promise<void> {
    console.log('添加主表以及子表') //
    let defaultV = await this.getDefaultValue(this.getTableName()) //
    console.log(defaultV, 'testDV')
    this.tableDataMap.curRow = defaultV //
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
    } //
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
    let curRow = super.getCurRow()
    return curRow //
  }
  getSaveData(): any {
    let curRow = this.getCurRow()
    return {}
  }
  @useHooks((config) => {
    let ctx: PageDesign = config.instance //
    let args = config.args
    if ((args.length = 0)) {
      args[0] = ctx.getSaveData()
    } //
  })
  async saveTableData(config = this.getSaveData()): Promise<any> {
    console.log('保存数据') //
  }
}
