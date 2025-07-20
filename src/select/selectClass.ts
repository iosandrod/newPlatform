import { Base } from '@ER/base'
import { nextTick } from 'vue'
import { VxeSelectInstance } from 'vxe-pc-ui'

export class Select extends Base {
  templateValue = ''
  templateOptions = []
  panelVisible: boolean = false //
  searchValue: string = ''
  showSearchValue: boolean = false
  config: any
  constructor(config) {
    super()
    this.config = config //
  }
  getModelValue() {
    let searchValue = this.searchValue
    let showSearchValue = this.showSearchValue
    if (searchValue?.length > 0 || showSearchValue) {
      return searchValue //
    }
    let config = this.config
    let modelValue = config.modelValue //
    if (modelValue == null) {
      modelValue = '' //
    }
    return modelValue //
  }
  focus() {
    //
    let reg: VxeSelectInstance = this.getRef('select')
    reg?.focus() //
  }
  searchChange(value) {
    let oldS = this.searchValue
    if (oldS.length > 0 && value.length == 0) {
      this.showSearchValue = true //
    }
    let config = this.config
    let onChange = config.onChange
    if (typeof onChange == 'function') {
      //允许非下拉值的更新
      let enableOther = config.enableOther
      if (enableOther == true) {
        onChange({
          value: value, //
        })
      }
    }
    this.searchValue = value //
  }
  getSelectPanelVisible() {
    let reg: VxeSelectInstance = this.getRef('select')
    let isShow = reg.isPanelVisible()
    return isShow //
  }
  onChange(value) {
    //
  }
  getCurrentPanelShow() {
    let reg: VxeSelectInstance = this.getRef('select')
    let isShow = reg.isPanelVisible()
    return isShow //
  }
  onVisibleChange(visible) {
    this.panelVisible = visible
    if (visible == false) {
      // let modelValue = this.getModelValue()
      // if (modelValue != null) {
      //   this.searchValue = modelValue
      // } else {
      //   this.searchValue = '' //
      // }
      this.searchValue = '' //
      this.showSearchValue = false
    }
    // nextTick(() => {
    //   //什么时候把modelValue改了呢
    //   console.log(this, this.getModelValue()) //
    // })
  }
  getOptions() {
    let config = this.config
    let options = config.options
    if (!Array.isArray(options)) {
      options = [] //
    } //
    let searchValue = this.searchValue
    options = [...options, ...this.templateOptions] //
    if (searchValue != null && searchValue.length > 0) {
      options = options.filter((option) => {
        let reg = new RegExp(searchValue, 'g')
        let _value = `${option.value}^^^${option.label}`
        return reg.test(_value)
      })
    }
    return options //
  }
  getAllowCreate() {
    let config = this.config
    let allowCreate = config.allowCreate
    return allowCreate //
  }
  addTemplateOption() {
    let templateValue = this.templateValue
    if (templateValue == '') {
      return
    }
    let templateOptions = this.templateOptions
    templateOptions.unshift({ label: templateValue, value: templateValue }) //
    this.onChange({ value: templateValue }) //
    this.templateValue = ''
  }
}
