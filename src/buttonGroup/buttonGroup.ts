import { Base } from '@/base/base'
import { Button } from './button'

export class itemGroup extends Base {
  config
  items: Button[] = []
  _class: any
  isDesign = false
  constructor(config, _class: any = Button) {
    super()
    this.config = config
    this._class = _class
    this.init()
  }
  init(): void {
    super.init() //
    let config = this.config
    let items = config.items || []
    this.setItems(items) //
  }
  addItem(b) {
    let _class = this._class
    let _b = new _class(b, this)
    this.items.push(_b) //
  }
  setItems(items) {
    this.items.splice(0)
    for (const b of items) {
      this.addItem(b)
    }
  } //
  getTabProps() {
    let config = this.config
    let obj = {
      ...config,
      items: this.items.map((item) => {
        return { button: item }
      }),
    }
    return obj
  }
}
