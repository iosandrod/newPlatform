import { cloneDeep } from 'lodash'
import { FormItem } from './formitem'

export class PageDesignItem extends FormItem {
  //@ts-ignore
  //@ts-ignore
  constructor(config, d) {
    super(config, d) //
  }
  getTableConfig() {
    let config = this.config
    let columns = this.config?.columns || []
    return {
      columns: columns,
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
} //
