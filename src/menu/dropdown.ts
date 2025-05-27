import { Base } from '@/base/base'
import { watch, nextTick, toRaw } from 'vue'
import { VxePulldownInstance } from 'vxe-pc-ui'

export class Dropdown extends Base {
  isRunHiddenDropdown = false
  isRunShowDropdown = false
  dropdownout = false
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
    let _obj = toRaw(this)
    _obj.modelValue = visible //
    let _onVisibleChange = this.config?.onVisibleChange
    if (typeof _onVisibleChange == 'function') {
      _onVisibleChange(value) //
    }
  }
  showDropdown() {
    this.isRunHiddenDropdown = false //
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
  getPanelVisible() {
    let d: VxePulldownInstance = this.getRef('dropdown')
    let _s = false
    if (d) {
      _s = d.reactData.visiblePanel
    } //
    return _s
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
  async onBeforeHidden() {
    this.isRunHiddenDropdown = true
    let config = this.config
    let hiddenBefore = config?.hiddenBefore
    let s = null
    if (typeof hiddenBefore == 'function') {
      s = await hiddenBefore()
      if (s == false) {
        return false //
      }
    }
    let _promise = new Promise((resolve) => {
      setTimeout(() => {
        let _d = this.isRunHiddenDropdown
        if (_d == false) {
          resolve(false)
        } //
        this.isRunHiddenDropdown = false //
        resolve(true) //
      }, 300) //
    })
    let status = await _promise
    if (status == true) {
      console.log(status, 'testStatus我挂你巴拉')
    }
    // if (1 == 1) {
    //   return false //
    // }
    return status //
  }
}
