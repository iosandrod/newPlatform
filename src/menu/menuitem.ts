import { Base } from '@ER/base'
import { Menu } from './menu'

export class MenuItem extends Base {
  currentShow = true
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
    this.setMenuItems(children) //
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
  getItemIndex() {
    let id = this.id
    let config = this.config
    let _id = config.id
    if (_id != null) {
      id = _id
    } //
    return `${id}`
  }
  getProps() {
    let id = this.getItemIndex()
    const obj = {
      index: `${id}`, //
      teleported: true, //
    }
    return obj
  }
  getLabel() {
    let config = this.config
    let label = config.label //
    if (label == null) {
      return
    }
    return label //
  }
  resetSubShow() {
    let allItems = this.getLastMenuItems()
    let hasShow = allItems.filter((item) => item.currentShow == true)
    let bool = false
    if (hasShow.length == 0) {
      bool = false
    } else {
      bool = true
    }
    this.showRoot(bool)
    if (bool == false) {
      //
      return
    }
    this.menuitems.forEach((item) => item.resetSubShow()) //
  }
  showRoot(status = true) {
    let rootDiv: HTMLDivElement = this.getRef('root') //
    rootDiv.style.display = status ? 'block' : 'none' //
  }
  resetCurrentShow() {
    //
    let menu = this.menu
    let searchFn = menu.config.searchFn
    let searchValue = menu.searchValue
    let bool = false
    if (searchValue == '' || searchValue == null) {
      bool = true
      this.currentShow = bool
      return
    }
    if (typeof searchFn == 'function') {
      bool = searchFn({ menu: menu, item: this, value: searchValue })
    } else {
      let label = this.getLabel() //
      let reg = new RegExp(searchValue, 'g')
      if (reg.test(label)) {
        //包含
        bool = true //可以显示
      }
    } //
    this.currentShow = bool
  }
  getLastMenuItems() {
    let menuitems = this.menuitems
    if (menuitems.length == 0) {
      return [this] //
    } else {
      return menuitems.map((item) => item.getLastMenuItems()).flat() //
    }
  }
  getSubMenuItems() {
    let menuitems = this.menuitems
    if (menuitems.length == 0) {
      return [] //
    } else {
      return [this, ...menuitems.map((item) => item.getSubMenuItems()).flat()] //
    }
  }
}
/* 
这个警告是什么
 Invalid prop: type check failed for prop "index". Expected String with value "61", got Number with value 61. 
*/
