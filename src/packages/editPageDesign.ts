import { Column } from '@/table/column'
import { PageDesign } from './pageDesign'

export class editPageDesign extends PageDesign {
  async addMainTableRow(addConfig?: any): Promise<void> {
    console.log('添加主表以及子表') //
    let defaultV = await this.getDefaultValue(this.getTableName()) //
    console.log(defaultV, 'testDV') //
  }
  async saveTableData(config) {}
  async getDefaultValue(tableName: string): Promise<any> {
    let columns = this.getTableColumns(tableName, true) //
    let obj1 = {}
    for (const col of columns) {
      let defaultValue = await this._getDefaultValue(col)
      if (defaultValue) {
        obj1 = { ...obj1, ...defaultValue } //
      } //
    } //
    return obj1
  }
  _getDefaultValue(col: any) {
    if (col instanceof Column) {
      return col.getDefaultValue() //
    }
    let _col = new Column(col)
    let _col1 = _col.getDefaultValue()
    return _col1 //
  }
}
