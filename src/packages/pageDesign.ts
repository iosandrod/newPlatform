import { Base } from '@/base/base'
import { Form } from './form'
import { createPageDesignFieldConfig } from './pageDesignConfig'
import { FormItem } from './formitem'
import { Field } from './layoutType'
import { PageDesignItem } from './pageItem'
import { nextTick } from 'vue'
import { entityData } from './formEditor/testData'
import { useRunAfter } from './utils/decoration'

export class PageDesign extends Form {
  pageType = 'pageDesign' //
  tableName = 't_SdOrder' ////
  constructor(config) {
    super(config)
    this.init()
  } //
  init(): void {
    super.init()
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
        pc: [pcLayout],
        mobile: mobileLayout,
      }
      let fields = this.getFields()
      let obj = {
        fields,
        layout,
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
  initDefaultTemplatePage() {
    //用户表
    let mainTable = {
      tableName: 'users',
    } //
    let detailTable = {
      tableName: 'roles',
    }
    let obj = {
      mainTable,
      detailTable,
    }
  }
  getValidateRules() {
    return []
  }
  getTableName() {
    let tableName = this.tableName
    return tableName
  }
  async getTableData(tableName = this.getTableName()) {} //
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
}
