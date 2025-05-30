import { Dropdown } from '@/menu/dropdown'
import { Base } from '@ER/base'
import { VxeInputInstance, VxePulldownInstance } from 'vxe-pc-ui'

export class Input extends Base {
  config: any
  constructor(config) {
    super()
    this.config = config //
  }
  getDatePanelVisible() {
    let input: VxeInputInstance = this.getRef('input')
    if (input) {
      return input.reactData.isAniVisible //
    }
  }
  getModelValue() {
    let config = this.config
    let modelValue = config.modelValue
    return modelValue //
  }
  focus() {
    let input: VxeInputInstance = this.getRef('input')
    if (input) {
      input.focus() //
    } //
  }
  blur() {
    let input: VxeInputInstance = this.getRef('input')
    if (input) {
      input.blur() //
    } //
  } //
  showDropdown(e) {
    //
    let drop: Dropdown = this.getRef('dropdown')
    if (drop) {
      drop.showDropdown() //
    }
  }
  hiddenDropdown() {
    //
    let drop: Dropdown = this.getRef('dropdown')
    if (drop) {
      drop.closeDropdown()
    }
  }
  getIsFormInput() {
    let formitem = this.config.formitem
    if (formitem) {
      return true
    }
    return false //
  }
  onFocus(config) {
    if (this.getIsFormInput()) {
      return
    }
  }
  getSelectPanelVisible() {
    let dropdown: VxePulldownInstance = this.getRef('dropdown')
    if (dropdown == null) {
      return false
    }
    let isShow = dropdown?.isPanelVisible()
    return isShow //
  }
}
