import { PageDesign } from './pageDesign'
import { useHooks } from './utils/decoration'
//
export class MainPageDesign extends PageDesign {
  //
  @useHooks((config) => {
    let ctx: PageDesign = config.instance
    let args = config.args
    if (args.length == 0) {
      args[0] = {
        tableName: ctx.getTableName(),
        query: {}, //
      }
    }
    if (typeof args[0] == 'string') {
      args[0] = {
        tableName: args[0],
        query: {},
      }
    }
    return config
  }) //
  async getTableData(config?: any) {
    // console.log('我是主要的东西了') //
    await super.getTableData(config) //
  } //
  onColumnResize(config) {
    let tName = config.tableName
    let curTName = this.getTableName()
    if (tName == curTName) {
      let originColumn = config.originColumn
      console.log('准备更新列', originColumn) //
      let w = originColumn.width
      let id = originColumn.id
      let obj1 = {
        id: id,
        width: w,
      }
      this.updateTableColumn(obj1, false) //
      // this.updateTableColumn()
    }
  }
}
