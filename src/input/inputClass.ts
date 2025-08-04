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
  async getIsShowPanel() {
    let input: VxeInputInstance = this.getRef('input')
    console.log(input, 'testInput') //
  } //
  getModelValue() {
    let config = this.config
    let modelValue = config.modelValue
    return modelValue //
  }
  focus() {
    let input: VxeInputInstance = this.getRef('input')
    if (input) {
      input.focus() //
      this.onFocus()
    } //
  }
  getType() {
    let config = this.config
    let type = config.type
    if (['datetime', 'date', 'time'].includes(type)) {
      console.log(type,'fkjklsdfjslfjslfsd')//
      return 'date' //
    }
    return type
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
  onFocus(config?: any) {
    if (this.getIsFormInput()) {
      return
    } //
    // const input = this.getRef('input')
    // console.log(input, 'testInput')
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
