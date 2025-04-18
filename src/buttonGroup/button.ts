import { Base } from '@/base/base'
import { Dropdown } from '@/menu/dropdown'

export class Button extends Base {
  config: any
  group: any
  parent: Button
  buttons: Button[] = []
  constructor(config, group?, p?: any) {
    super()
    this.config = config
    this.group = group
    this.parent = p
    this.init()
  }
  init() {
    super.init()
    let config = this.config
    let buttons = config.items || config.children || [] //
    if (buttons.length > 0) {
      this.setSubButtons(buttons) //
    }
  }
  setSubButtons(buttons: any[]) {
    this.buttons.splice(0) //
    for (const btn of buttons) {
      this.addSubButton(btn)
    }
  }
  addSubButton(btn) {
    let _btn = new Button(btn, this.group, this) //
    this.buttons.push(_btn) //
  }
  getLabel() {
    let config = this.config
    let label = config.label || '按钮' //
    return label
  }
  showDropdown() {
    const dropdown: Dropdown = this.getRef('dropdown')
    if (dropdown) {
      dropdown.showDropdown() //
    }
  }
  getSubData() {
    let buttons = this.buttons
    return buttons.map((item) => {
      let obj = {
        button: item,
        items: item.getSubData(),
      }
      return obj
    })
  }
  getDisabled() {
    let config = this.config
    let disabled = Boolean(config.disabled === true)
    return disabled
  }
  hiddenDropdown() {
    let _this = this.getParent() // //
    const dropdown: Dropdown = _this.getRef('dropdown')
    if (dropdown) {
      dropdown.closeDropdown() ////
    }
  }
  getParent() {
    let p = this.parent
    if (p != null) {
      return p.getParent()
    }
    return this
  }
  runFn(_config) {
    try {
      this.showDropdown() //
      let config = this.config
      let fn = config.fn
      if (typeof fn == 'function') {
        fn(_config)
      }
      if (this.parent != null) {
        this.hiddenDropdown() //
      }
    } catch (error) {
      console.log('报错了') //
    }
  }
}
