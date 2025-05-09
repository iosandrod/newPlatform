import { Base } from '@ER/base'
import { VxeSelectInstance } from 'vxe-pc-ui'

export class Select extends Base {
  panelVisible: boolean = false //
  searchValue: string = ''
  showSearchValue: boolean = false
  config: any
  constructor(config) {
    super()
    this.config = config //
  }
  getModelValue() {
    //
    let searchValue = this.searchValue
    let showSearchValue = this.showSearchValue
    if (searchValue.length > 0 || showSearchValue) {
      return searchValue //
    }
    let config = this.config
    let modelValue = config.modelValue
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
    } //
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
      this.searchValue = '' //
      this.showSearchValue = false
    }
  }
  getOptions() {
    let config = this.config
    let options = config.options
    let searchValue = this.searchValue
    if (searchValue != null && searchValue.length > 0) {
      options = options.filter((option) => {
        let reg = new RegExp(searchValue, 'g')
        let _value = `${option.value}^^^${option.label}`
        return reg.test(_value)
      })
    }
    return options //
  }
}
