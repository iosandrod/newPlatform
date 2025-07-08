import { Base } from '@/base/base'
import { Dropdown } from '@/menu/dropdown'
import { Table } from '@/table/table'
import { runObj, stateObj } from '@ER/diabledFn'
import { MainPageDesign } from '@ER/mainPageDesign'
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
    let buttons = this.buttons
    if (buttons.length > 0) {
      label = `${label}` //
    }
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
  //@ts-ignore
  getMainPageDesign() {
    let g = this.group
    let tName = g.tableName
    let sys = this.getSystem()
    let targetDesign = sys.tableMap[tName] || sys.tableEditMap[tName]
    return targetDesign
  }
  getDisabled() {
    let config = this.config
    let disabled = Boolean(config.disabled === true)
    if (disabled) {
      return disabled //
    }
    let disabledFn = config.disabledFn
    if (typeof disabledFn == 'function') {
      try {
        let _d = disabledFn()
        if (_d == true) {
          disabled = true
        }
      } catch (error) {
        console.error('禁用脚本报错')
      }
    } else {
      if (typeof disabledFn == 'string') {
        //
        let _fn = stringToFunction(disabledFn)
        if (typeof _fn == 'function') {
          try {
            let _d = _fn({
              page: this.getMainPageDesign(),
              curRow: this.getMainPageDesign()?.getCurRow(),
              parent: this.getParent(), //
            })
            if (_d == true) {
              disabled = true
            }
          } catch (error) {
            console.error('按钮禁用脚本报错') //
            console.error(error) //
          }
        }
      } else {
        let disabledDefaultFn = this.config.disabledDefaultFn
        if (typeof disabledDefaultFn == 'string') {
          // debugger//

          let dObj = stateObj
          let _fn = dObj[disabledDefaultFn]
          if (typeof _fn == 'function') {
            let _state = _fn({
              page: this.getMainPageDesign(),
              curRow: this.getMainPageDesign()?.getCurRow(),
              parent: this.getParent(), //
            })
            if (_state == true) {
              disabled = true //
            }
          }
        }
      }
    }

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
  async getDefaultFnRun(_config) {
    let sys = this.getSystem()
    let page: MainPageDesign = _config?.page
    let _runObj = runObj
    let defaultFn = _config?.defaultFn
    let obj = _runObj
    let _fn = null
    if (page == null) {
      _fn = obj[defaultFn]
    } else {
      let tableName = page.tableName
      let type = page.getTableType()
      type = type || 'main' //
      let selectBtn = await sys.getSelectButtons(type)
      let id = this.config.id
      let _btn = null
      if (
        selectBtn
          .map((item) => item.id)
          .filter((id) => id != null)
          .includes(id)
      ) {
        _btn = selectBtn.find((item) => item.id == id)
      }
      if (_btn != null) {
        let param_value = _btn.param_value
        if (Boolean(param_value) && typeof param_value == 'string') {
          let _fn1 = stringToFunction(param_value)
          _fn = _fn1
        }
      }
    } //
    if (typeof _fn == 'function') {
      return _fn
    }
    let _fn1 = obj[defaultFn]
    return _fn1
    // return _fn
  }
  async runFn(_config) {
    try {
      let page = _config.page
      this.showDropdown() //
      let config = this.config
      let fn = config.fn //
      if (typeof fn == 'function') {
        fn = fn.bind(page)
        fn(_config)
      }
      if (typeof fn == 'string' && Boolean(fn)) {
        let _fn = stringToFunction(fn) //
        if (typeof _fn == 'function') {
          _fn = _fn.bind(page) //
          await _fn(_config)
        }
      } else {
        let defaultFn = config.defaultFn
        let drun = await this.getDefaultFnRun({ ..._config, defaultFn })
        let _fn = drun
        if (typeof _fn == 'function') {
          let _fn1 = _fn.bind(page)
          await _fn1(_config) ////
        }
        // if (typeof defaultFn == 'string') {
        // }
      }
      if (this.parent != null) {
        this.hiddenDropdown() //
      }
    } catch (error) {
      console.error(error) //
      let page: PageDesign = _config.page
      if (page) {
        page.setCurrentLoading(false) //
      }
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
  getDisplay() {
    let config = this.config
    let hidden = config.hidden
    if (Boolean(hidden)) {
      return 'none'
    }
    let hiddenFn = config.hiddenFn
    if (typeof hiddenFn == 'string') {
      try {
        let _fn = stringToFunction(hiddenFn)
        hiddenFn = _fn
      } catch (error) {}
    }
    if (typeof hiddenFn == 'function') {
      try {
        let status = hiddenFn({ page: this.getMainPageDesign() })
        if (status == true) {
          return 'none'
        }
      } catch (error) {
        return ''
      }
    }
    return ''
  } //
}
