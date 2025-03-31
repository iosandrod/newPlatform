import { Base } from '@/base/base'
import { itemGroup } from './buttonGroup'

export class BMenu extends itemGroup {
  modelValue = false
  constructor(config, _class = BMenuItem) {
    super(config, _class) //
  }
  setPosition() { }
  getModelValue() {
    return this.modelValue
  }
  open(config) {
    let menu = this.getRef('contextmenu')
    if (menu) {
      menu.show(config) //
    }
  }
}

export class BMenuItem extends Base {
  config: any
  menu: BMenu
  items: BMenuItem[] = []
  parent: any
  constructor(config, m, p?: any) {
    super()
    this.config = config
    this.menu = m
    this.parent = p
    this.init()
  }
  init() {
    super.init()
    let config = this.config
    let items = config.items || []
    this.setItems(items) //
  }
  show() { }
  setItems(items) {
    this.items.splice(0)
    for (const b of items) {
      this.addItem(b)
    }
  }
  getLabel() {
    let config = this.config
    let label = config.label || '按钮' //
    return label //
  }
  addItem(b) {
    let _class = BMenuItem
    let _b = new _class(b, this.menu, this)
    this.items.push(_b)
  }
  onClick() {
    const menu = this.menu
    const config = menu.config
    const _config = this.config
    const fn = _config.fn
    if (typeof fn == 'function') fn(this)
    // const onItemClick=config.onItemClick()
  }
}
