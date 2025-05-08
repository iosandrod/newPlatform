import { cloneDeep } from 'lodash'
import { FormItem } from './formitem'
import { PageDesign } from './pageDesign'

export class PageDesignItem extends FormItem {
  //@ts-ignore
  //@ts-ignore
  constructor(config, d) {
    super(config, d) //
  }
  init() {
    super.init()
    let eventArr = this.config.eventArr //
    //注册到事件对象中
  }
  getTableConfig() {
    //
    let options = this.getOptions()
    return {
      ...options,
      // columns: columns,
    }
  }
  getTableColumns() {
    let columns = this.config?.options?.columns || [] //
    return columns
  }
  getTableData() {
    return []
  }
  getTableName() {
    let config = this.config
    let tableName = config?.options?.tableName
    return tableName
  }
  getTableType() {
    let config = this.config
    let tableType = config?.options?.tableType
    if (!tableType) {
      tableType = 'main' ////
    }
    return tableType
  }
  async addNewRow() {} //

  getShowHeaderButtons() {
    // debugger //
    let options = this.getOptions()
    let tableType = this.getTableType()
    if (tableType == 'detail') {
      return false
    }
    if (tableType == 'main') {
      return false //
    }
    let showHeaderButtons = options?.showHeaderButtons
    return showHeaderButtons
  }
  getTitle() {
    return ''
  }
  isShowTitle() {
    //
    return false
  }
  isEntity() {
    let type = this.getType()
    if (type == 'entity') {
      return true
    }
  }
  getEntityType() {
    let config = this.config
    let entityType = config?.options?.tableType
    return entityType //
  }
  getdBindData() {
    let design: PageDesign = this.form as any //
    // let curRow = design.tableDataMap[tName]?.curRow || {}//
    let curRow = design.getCurRow()
    return curRow
  }
  getTableCnName() {
    let tConfig = this.getTableConfig()
    return tConfig.tableCnName
  }
  getRelateKey() {
    let options = this.getOptions()
    return options.relateKey
  }
  getMainRelateKey() {
    let options = this.getOptions()
    return options.mainRelateKey
  }
}
