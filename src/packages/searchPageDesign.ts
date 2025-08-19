import { editPageDesign } from './editPageDesign'
import { PageDesign } from './pageDesign'
import { useHooks } from './utils/decoration'
//
export class SearchPageDesign extends PageDesign {
  isOpen = false //
  async getTinyTableData(config) {
    let realTableName = this.getRealTableName() //
    let http = this.getHttp() //
    let query = config.query || {} //
    let $limit = query.$limit
    if ($limit == null) {
      query.$limit = 10
    } //
    let _data = await http.find(realTableName, query) //
    return _data ////
  }
  //
  @useHooks((config) => {
    //
    let ctx: PageDesign = config.instance
    let args = config.args
    if (args.length == 0) {
      args[0] = {
        tableName: ctx.getTableName(),
        query: {}, //
      } //
    }
    if (typeof args[0] == 'string') {
      args[0] = {
        tableName: args[0], //
        query: {},
      }
    }
    return config
  }) //
  // async getTableData(config?: any) {
    // return //
  // } //
  onColumnResize(config) {
    //
  }
  onColumnHidden(c: any): void {} //
  async onColumnsDesign(cols: any): Promise<any> {}
  @useHooks((config) => {
    let ctx: PageDesign = config.instance //
    let args = config.args
    if ((args.length = 0)) {
      args[0] = ctx.getAddRowsArgs()
    } //
  }) //
  async addTableRows(config = this.getAddRowsArgs()) {}
  async addMainTableRow(addConfig) {}
}
