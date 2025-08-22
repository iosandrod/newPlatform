import _, { cloneDeep } from 'lodash'
import { FormItem } from './formitem'
import { PageDesign } from './pageDesign'
import { Column } from '@/table/column'
import { stringToFunction } from './utils'
import { getDesignTableConfig } from '@/table/tabFConfig'

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
  getDetailTableConfig() {
    let config = this.config
    let detailTableConfig = config?.options?.detailTableConfig
    return detailTableConfig
  }
  getTableName() {
    //
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
    let design: PageDesign = this.form as any
    let curRow = design.getCurRow()
    let formName = this.getOptions().formName
    if (typeof formName == 'string' && formName.length > 0) {
      let _config = this.form.formConfigMap[formName]?.data || {} //
      curRow = _config //
    }
    return curRow //
  }
  getTableCnName() {
    let tConfig = this.getTableConfig()
    return tConfig.tableCnName
  }
  getRelateKey() {
    let options = this.getOptions()?.detailTableConfig //
    return options?.relateKey
  }
  getMainRelateKey() {
    let options = this.getOptions()?.detailTableConfig //
    return options?.mainRelateKey
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
    let f = this.form //
    f.onColumnsDesign(config) //
  }
  onColumnConfigChange(config: any): void {
    let f = this.form
    f.onColumnConfigChange(config)
  }
  onTableConfigChange(config: any): void {
    //
    let f = this.form
    let options = this.getOptions()
    let _config = { ...config }
    delete _config['tableName'] //
    Object.entries(_config).forEach(([key, value]) => {
      options[key] = value
    }) //
    f.onTableConfigChange(config)
  }
  getShowCheckboxColumn() {
    let options = this.getOptions()
    let bool = options.showCheckboxColumn
    if (bool == null) {
      bool = true
    }
    bool = Boolean(bool) //
    return bool
  }
  getShowRowSeriesNumber() {
    //
    let options = this.getOptions()
    let bool = options.showRowSeriesNumber
    if (bool == null) {
      bool = true
    }
    bool = Boolean(bool) //
    return bool //
  }
  getTreeConfig() {
    let options = this.getOptions()
    let treeConfig = options?.treeConfig
    return treeConfig //
  }
  getContextItems() {
    let options = this.getOptions()
    let _items = options?.contextItems || [] //
    let _items1 = _items.map((item) => {
      return item //
    }) //
    return _items1 //
  }
  getPageCurRow() {
    let tableName = this.getOptions().tableName
    if (tableName == null) {
      return null
    } //
    let design: PageDesign = this.form as any //
    let curRow = design.getCurRow(tableName) //
    return curRow //
  }
  async onCurRowChange(config) {
    let row = config.row //
    let config1: any = this.getOptions() //
    let _conCurRowChange = config1.onCurRowChange
    let design: PageDesign = this.form as any //
    if (typeof _conCurRowChange == 'string') {
      let _fn = stringToFunction(_conCurRowChange)
      if (typeof _fn == 'function') {
        await _fn.call(design, { row, ...config })
      }
    }
    let _config = { ...config, tableName: this.getTableName() } //
    await design.onCurRowChange(_config) //
  }
  async addRows(config) {
    // debugger//
    if (typeof config == 'number') {
      config = {
        num: config,
      }
    }
    let _config = this.config
    let detailTableConfig = _config?.options?.detailTableConfig || {}
    let defaultAdd = detailTableConfig.defaultAdd
    let _num = Number(defaultAdd)
    if (isNaN(_num)) {
      _num = 10
    }
    // debugger //
    if (_num <= 0) {
      return //
    }
    config.num = _num//
    let design: PageDesign = this.form as any //
    let fCom = this.getRef('fieldCom')
    let tName = this.getTableName()
    let columns = this.getOptions()?.columns || [] //
    let _cols: Column[] = columns.map((col) => {
      return new Column(col) //
    })
    let mainRow = design.getCurRow()
    let _arr = []
    for (let i = 0; i < config.num; i++) {
      let obj = {}
      for (const col of _cols) {
        let _dValue = await col.getDefaultValue({
          design: design,
          curRow: mainRow,
        })
        obj = { ...obj, ..._dValue } //
      }
      Object.defineProperty(obj, '_rowState', {
        value: 'add',
        enumerable: false,
        writable: true,
      }) //
      _arr.push(obj)
    } //
    // debugger //
    let tDataMap = design.getTableRefData(tName)
    let _d = tDataMap?.data
    if (_d == null || !Array.isArray(_d)) {
      return
    }
    if (config.reset == true) {
      _d.splice(0, _d.length)
    } //
    _d.push(..._arr)
  }
  getFormDisabled(config?: any) {
    let _tableName = config?.tableName
    let _tableName1 = this.getOptions().tableName //
    let status1 = _tableName == _tableName1 && _tableName != null
    let design: PageDesign = this.form as any //
    let tableState = design.tableState //
    let status = false //
    if (tableState == 'scan' && status1) {
      status = true //
    }
    return status //
  }
  async onTableDesign(config: any) {
    let _fConfig = getDesignTableConfig(this)
    let sys = this.getSystem() //
    let _d = await sys.confirmForm(_fConfig) //
    this.onTableConfigChange(_d) //
  }
  getTableRowHeight() {
    let options = this.getOptions()
    let rowHeight = options?.rowHeight
    return rowHeight
  }
  getFormitemDisabled(config) {
    let field = config.field //
    let tableName = config.tableName
  }
  getDisabledColumnResize() {
    let options = this.getOptions()
    let dragConfig = options?.dragConfig
    let enableResizeColumn = dragConfig?.enableResizeColumn //
    if (enableResizeColumn == null) {
      enableResizeColumn = true //
    }
    if (enableResizeColumn == 0) {
      return true
    } //
    return !enableResizeColumn //
  }
}
