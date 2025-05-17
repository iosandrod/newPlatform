import { Base } from '@/base/base'
import { Dropdown } from '@/menu/dropdown'
import { Table } from '@/table/table'
import { PageDesign } from '@ER/pageDesign'
import { stringToFunction } from '@ER/utils'

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
  getDefaultFnRun() {
    let page = this.getMainPageDesign()
    let obj = {
      openSearchDialog: (config) => {
        let page: PageDesign = config.page
        page.openSearchDialog() //
      },
      addTableRows: (config) => {
        let page: PageDesign = config.page
        //新增一行数据
        let tableName = page.getTableName() //
        let tRef: Table = page.getRef(tableName) //
        if (tRef == null) {
          return
        }
        tRef.addRows(1) //
      },
      saveTableData: async (config) => {
        //
        let page: PageDesign = config.page
        await page.saveTableData() //
      }, //
    }
    return obj //
  }
  async runFn(_config) {
    try {
      let page = _config.page
      this.showDropdown() //
      let config = this.config
      let fn = config.fn
      if (typeof fn == 'function') {
        fn = fn.bind(page)
        fn(_config)
      }
      if (typeof fn == 'string') {
        let _fn = stringToFunction(fn) //
        if (typeof _fn == 'function') {
          _fn = _fn.bind(page) //
          await _fn(_config)
        }
      } else {
        let defaultFn = config.defaultFn
        if (typeof defaultFn == 'string') {
          let drun = this.getDefaultFnRun()
          let _fn = drun[defaultFn]
          if (typeof _fn == 'function') {
            await _fn(_config) //
          }
        }
      }
      if (this.parent != null) {
        this.hiddenDropdown() //
      }
    } catch (error) {
      console.error(error) //
      console.log('报错了') //
    }
  }
  getButtonWidth() {
    let config = this.config
    let width = config.width
    if (width == null) {
      let _w = this?.group?.getButtonWidth()
      if (_w) {
        width = _w
      }
    }
    return width
  }
}
