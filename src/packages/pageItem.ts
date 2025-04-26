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
      tableType = 'mainTable' //
    }
    return tableType
  }
  async addNewRow() {} //
} //
