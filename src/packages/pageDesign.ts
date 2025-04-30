import { Base } from '@/base/base'
import { Form } from './form'
import { createPageDesignFieldConfig } from './pageDesignConfig'
import { FormItem } from './formitem'
import { Field } from './layoutType'
import { PageDesignItem } from './pageItem'
import { nextTick } from 'vue'
import { _tData, _tData123, _testData, entityData } from './formEditor/testData'
import { useRunAfter } from './utils/decoration'
import pageCom from './pageCom'

export class PageDesign extends Form {
  static component = pageCom //
  pageType = 'pageDesign' //
  tableName ////
  constructor(config) {
    super(config)
    this.init()
  } //
  init(): void {
    super.init() //
  }
  setItems(items: any, setLayout?: boolean): void {
    if (!Array.isArray(items)) {
      return
    }
    this.items.splice(0) //
    for (const item of items) {
      this.addFormItem(item)
    }
    if (setLayout == true) {
      //
      let pcLayout = this.getPcLayout()
      let mobileLayout = this.getMobileLayout()
      let layout = {
        pc: pcLayout,
        mobile: mobileLayout,
      }
      let fields = this.getFields()
      let obj = {
        fields,
        layout, //
        list: [], //
      }
      this.setLayoutData(obj)
    }
  }
  addFormItem(config): any {
    // console.log(config, 'test_config')//
    let _item = new PageDesignItem(config, this) //
    //@ts-ignore
    this.items.push(_item)
    return _item //
  }
  getDesignFieldConfig() {
    return createPageDesignFieldConfig() //
  }
  //设置默认模板
  initDefaultTemplatePage() {}
  getValidateRules() {
    return []
  }
  getTableName() {
    let tableName = this.tableName
    return tableName
  }
  async getTableData(
    getDataConfig: any = {
      tableName: this.getTableName(),
    },
  ) {
    if (typeof getDataConfig == 'string') {
      getDataConfig = {
        tableName: getDataConfig,
      }
    }
    let tableName = getDataConfig.tableName //
    let http = this.getHttp()
    let res = await http.get(tableName, 'find')
    console.log(res, 'testRes') //
    return res
  }
  buildQuery() {}
  openSearchForm() {}
  async createTableData() {}
  async updateTableData() {}
  async getDefaultValue(tableName: string) {
    let columns = this.getTableColumns(tableName)
    let obj1 = {}
    for (const col of columns) {
      let defaultValue = await col.getDefaultValue()
      if (defaultValue) {
        obj1 = { ...obj1, ...defaultValue } //
      }
    } //
    return obj1
  }
  getTableColumns(tableName = this.getTableName()) {
    let tableIns = this.getRef(tableName)
    let columns = tableIns.getColumns()
    return columns //
  }
  getMainTableConfig() {}
  @useRunAfter()
  async addTableRow(data, tableName = this.getTableName()) {
    if (data == null) {
      data = await this.getDefaultValue(tableName)
    }
    return data
  } //
  @useRunAfter()
  async addTableRows(
    rows: number | Array<any> = 1, //
    tableName = this.getTableName(),
  ) {
    if (typeof rows == 'number') {
      rows = Array(rows).fill(null)
    }
    let arr1 = []
    for (let i = 0; i < rows.length; i++) {
      let d = await this.addTableRow(rows[i], tableName)
      arr1.push(d) //
    }
    let tableIns = this.getTableRef(tableName)
    tableIns.addRows({ rows: arr1 }) ////
  }
  getTableRef(tableName = this.getTableName()) {
    let tableIns = this.getRef(tableName)
    return tableIns //
  }
  async saveTableDesign() {
    //获取表格的id配置
    let config = this.config
    let id = config.id
    if (id == null) {
      await this.createTableDesign()
    } else {
      await this.updateTableDesign()
    }
  }
  async createTableDesign() {
    let _data = this.getLayoutData()
    //@ts-ignore
    _data.tableName = this.getMainTableName()
    let http = this.getHttp()
    let _res = await http.create('entity', _data) // //
    console.log(_res)
  }
  async updateTableDesign() {
    let _data = this.getLayoutData() //
    let http = this.getHttp()
    let _config = this.config
    let _config1 = { ..._config, ..._data,id: _config.id } //
    let _res = await http.patch(`entity/${_config.id}`,_config1.id, _config1) //
    console.log('保存成功')//
  }
  getMainTableName() {
    let config = this.config
    let tableName = config.tableName
    if (!tableName) {
      tableName = this.tableName
    }
    return tableName //
  }
}
