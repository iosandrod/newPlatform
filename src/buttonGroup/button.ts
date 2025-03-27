import { Base } from '@/base/base'
import { Dropdown } from '@/menu/dropdown'

export class Button extends Base {
  config: any
  group: any
  parent: Button
  buttons: Button[] = []
  constructor(config, group, p?: any) {
    super()
    this.config = config
    this.group = group
    this.parent = p
    this.init()
  }
  init() {
    super.init()
    let config = this.config
    let buttons = config.children || [] //
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
    // let obj1:any={}
    // if(this.buttons.length>0){
    //   obj1.children=this.buttons.map((b)=>{
    //     return b.getSubData()
    //   })
    //   obj1.button=this
    // } 
    // return obj1
    return [
      {
        button: {
          label: 'ff',
          getLabel: function () {
            return this.getLabel()
          },
        },
        children: [
          {
            label: 'ff',
            getLabel: function () {
              return this.getLabel()
            },
          },
          {
            label: 'ff',
            getLabel: function () {
              return this.getLabel()
            },
          },
          {
            label: 'ff',
            getLabel: function () {
              return this.getLabel()
            },
          },
        ],
      },
    ]
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
