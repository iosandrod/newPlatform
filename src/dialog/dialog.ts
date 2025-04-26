import { Base } from '@/base/base' //
export class Dialog extends Base {
  config
  constructor(config) {
    super()
    this.config = config
    this.init()
  }
  init() {
    super.init()
  } //
}

export class TableDialog extends Dialog {
  constructor(config) {
    super(config)
    this.init()
  }
  init() {
    super.init() //
  } //
}
