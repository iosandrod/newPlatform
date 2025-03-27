import { Base } from '@ER/base'
import { Menu } from './menu'

export class MenuItem extends Base {
  config: any
  menu: Menu
  menuitems: MenuItem[] = []
  constructor(config, menu: any) {
    super()
    this.config = config
    this.menu = menu
    this.init()
  }
  init() {
    super.init()
    let children = this.config.children || []
    this.setMenuItems(children)//
  }
  setMenuItems(items) {
    this.menuitems.splice(0)
    for (const item of items) {
      this.addMenuItem(item)
    }
  }
  addMenuItem(itemConfig: any) {
    let item = new MenuItem(itemConfig, this.menu)
    let menuitems = this.menuitems
    menuitems.push(item) //
  }
  getProps() {
    let id = this.id
    let config = this.config
    let _id = config.id
    if (_id != null) { 
      id = _id
    }
    const obj = {
      index: id,
      teleported: true, //
    }
    return obj
  }
}
