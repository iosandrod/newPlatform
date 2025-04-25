import { Base } from '@/base/base'
import { Form } from './form'
import { createPageDesignFieldConfig } from './pageDesignConfig'
import { FormItem } from './formitem'
import { Field } from './layoutType'
import { PageDesignItem } from './pageItem'
import { nextTick } from 'vue'
import { entityData } from './formEditor/testData'

export class PageDesign extends Form {
  pageType = 'pageDesign' //
  tableName = 't_SdOrder' ////
  constructor(config) {
    super(config) //
    this.init()
  } //
  init(): void {
    super.init()

  }
  setItems(items: any, setLayout?: boolean): void {
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
  async getTableData() { } //
  async createTableData() { }
  async updateTableData() { }
}
