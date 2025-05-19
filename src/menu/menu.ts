import { Base } from '@/base/base'
import { MenuInstance } from 'element-plus'
import { MenuItem } from './menuitem'
export class Menu extends Base {
  isOpenAll = false
  config: any
  menuitems: MenuItem[] = []
  searchValue = '' ////
  constructor(config) {
    super()
    this.config = config
    this.init()
  }
  init() {
    super.init()
    const config = this.config
    const children = config.items || [] //
    this.setMenuItems(children)
  }
  searchInputChange(value) {
    let oldValue = this.searchValue
    if (oldValue.length > 0 && value.length == 0) {
      this.closeAllItems() //
    }
    this.searchValue = value //
    if (value.length > 0) {
      this.openAllItems() //
    }
    this.resetItemShow() //
  }
  getAllSubMenuItem(): MenuItem[] {
    let menuItems = this.menuitems
    let _items = menuItems
      .map((item) => {
        return item.getSubMenuItems().flat() //
      })
      .flat()
    return _items
  }
  closeAllItems() {
    let allSubMenu = this.getAllSubMenuItem().map((item) => {
      return item.getItemIndex()
    })
    let menuRef: MenuInstance = this.getRef('menuRef') //
    allSubMenu.forEach((item) => {
      menuRef.close(item) //
    })
    this.isOpenAll = false //
  }
  openAllItems() {
    let allSubMenu = this.getAllSubMenuItem().map((item) => {
      return item.getItemIndex()
    })
    let menuRef: MenuInstance = this.getRef('menuRef') //
    allSubMenu.forEach((item) => {
      menuRef.open(item) //
    })
    this.isOpenAll = true
  }
  openItem(keys: any) { } //
  getMenuDefaultOpeneds() {
    let _items = null
    _items = this.config.defaultOpeneds || []
    if (this.searchValue.length > 0) {
      _items = this.menuitems.map((item) => item.getItemIndex())
    }
    return _items ////
  }
  resetItemShow() {
    let allLast: MenuItem[] = this.getLastMenuItems()
    allLast.forEach((item) => {
      item.resetCurrentShow()
    })
    this.menuitems.forEach((item) => {
      item.resetSubShow()
    })
  }
  setMenuItems(items) {
    this.menuitems.splice(0)
    for (const item of items) {
      this.addMenuItem(item)
    }
  }
  onItemClick(item: any) {
    let config = this.config
    let onItemClick = config.onItemClick
    if (typeof onItemClick == 'function') {
      onItemClick(item.config)//
    }
  }
  getLastMenuItems() {
    let items = this.menuitems.map((item) => item.getLastMenuItems()).flat()
    return items
  }
  addMenuItem(itemConfig: any) {
    let item = new MenuItem(itemConfig, this)
    let menuitems = this.menuitems
    menuitems.push(item) //
  }
  removeMenuItem(id: any) { }
}
