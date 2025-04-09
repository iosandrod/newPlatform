import { Base } from '@/base/base'
import { Form } from './form'
import { createPageDesignFieldConfig } from './pageDesignConfig'
import { FormItem } from './formitem'
import { Field } from './layoutType'
import { PageDesignItem } from './pageItem'
import { nextTick } from 'vue'
import { entityData } from './formEditor/testData'

export class PageDesign extends Form {
  pageType = 'pageDesign'//
  constructor(config) {
    super(config) //
    this.init()
  }
  init(): void {
    super.init()
    nextTick(() => {
      this.setLayoutData(JSON.parse(JSON.stringify(entityData)))//
    })
  }
  setItems(items: any, setLayout?: boolean): void {
    this.items.splice(0)//
    for (const item of items) {
      this.addFormItem(item)
    }
    if (setLayout == true) {//
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
    let _item = new PageDesignItem(config, this) //
    //@ts-ignore
    this.items.push(_item)
    return _item //
  }
  getDesignFieldConfig() {
    return createPageDesignFieldConfig() //
  }
  setDefaultTemplatePage() {
    let mainTableIns = {}
    let detailTableIns = {} //
  }
  // initPcLayout(): void { }
  // initMobileLayout(): void { }
  getValidateRules() {
    return []
  }
}
