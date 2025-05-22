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
    let eventArr = this.config.eventMap
    if (this.config.type == 'entity') {
    }
    //注册到事件对象中
    let evManager = this.eventManager
    if (Array.isArray(eventArr)) {
      for (let ev of eventArr) {
        let event = ev.event
        if (event == null || event == '') {
          continue
        }
        let tableName = ev.tableName
        let key = event
        if (tableName != null || tableName != '') {
          key = `${tableName}_${event}` //
        }
        let eArr = evManager[key]
        if (eArr == null) {
          evManager[key] = []
          eArr = evManager[key]
        }
        eArr.push(ev) //
      }
    }
  }
  getTableConfig() {
    //
    let options = this.getOptions()
    return {
      ...options,
      // columns: columns,
    }
  } //
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
  async addNewRow() { } //

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
  onColumnResize(_config) {
    let f = this.form
    f.onColumnResize(_config) //
  }
  onColumnHidden(config: any): void {
    // debugger//
    let f = this.form
    f.onColumnHidden(config) //
  }
  onColumnsDesign(config: any): void {
    let f = this.form
    f.onColumnsDesign(config)
  }
  onColumnConfigChange(config: any): void {
    let f = this.form
    f.onColumnConfigChange(config)
  }
}
