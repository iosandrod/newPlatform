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
  getItemSpan() {
    let config = this.getOptions()
    let span = config.itemSpan //
    if (span == null) {
      span = 6 //
    }
    return span //
  }
  getOptions(): any {
    let config = this.config
    let options = config?.options || {}
    return options
  }
  getFormConfig() {
    let items = this.getOptions()?.items || []
    let itemSpan = this.getItemSpan()
    return {
      items: items,
      itemSpan: itemSpan, //
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
  async designForm() {
    let formConfig = this.getFormConfig()
    let _config = cloneDeep(formConfig) //
    let system = this.getSystem()
    system.openDialog({})
  }
} //
