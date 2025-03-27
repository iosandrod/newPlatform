import { Base } from '@/base/base'
import { watch, nextTick } from 'vue'

export class Dropdown extends Base {
  config: any
  modelValue: any = false
  constructor(config) {
    super()
    this.config = config
    this.init()
  }
  init() {
    super.init()
  }
  onVisibleChange(value) {
    let visible = value.visible
    this.modelValue = visible //
  }
  showDropdown() {
    this.modelValue = true
    let dropdown = this.getRef('dropdown')
    if (dropdown) {
      dropdown.showPanel() //
    }
  }
  closeDropdown() {
    this.modelValue = false
    let dropdown = this.getRef('dropdown')
    if (dropdown) {
      dropdown.hidePanel() //
    }
  }
  getModelValue() {
    let config = this.config
    let modelValue = config?.modelValue
    if (modelValue == false) {
      let _modelValue = this.modelValue
      if (_modelValue == true) {
        modelValue = _modelValue
      }
    }
    return modelValue
  }
}
