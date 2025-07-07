import { Base } from '@/base/base'
import { itemGroup } from './buttonGroup'
import { stringToFunction } from '@ER/utils'

export class BMenu extends itemGroup {
  modelValue = false
  constructor(config, _class = BMenuItem) {
    super(config, _class) //
  }
  setPosition() {}
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
  show() {}
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
  async onClick() {
    const menu = this.menu
    const config = menu.config
    const _config = this.config
    let beforeHidden = config.beforeHidden
    let fn = _config.fn
    let p = this.menu
    let page = this.menu.getMainPageDesign()
    let _parent = p.config.parent //
    if (typeof fn == 'function') {
      await fn({ item: this, parent: _parent, page: page }) //
    }
    if (typeof fn == 'string' && Boolean(fn)) {
      let _fn = stringToFunction(fn)
      if (typeof _fn == 'function') {
        ////
        await _fn.call(page, { item: this, parent: _parent, page: page }) //
      }
    }
    if (typeof beforeHidden == 'function') {
      //
      beforeHidden()
    }
  }
  getDisabled() {
    let config = this.config //
    let disabled = config.disabled
    if (typeof disabled === 'function') {
      disabled = disabled({ menu: this })
      if (disabled === true) {
        return true
      } //
    }
    return disabled //
  }
  getVisible() {
    let config = this.config //
    let visible = config.visible
    if (typeof visible === 'function') visible = visible({ menu: this })
    return visible
  }
}
