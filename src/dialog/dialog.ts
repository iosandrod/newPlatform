import { Base } from '@/base/base' //
import { VxeModalInstance } from 'vxe-pc-ui'
export class Dialog extends Base {
  config: any
  constructor(config) {
    super()
    this.config = config
    this.init()
  }
  init() {
    super.init()
  } //
  open(config: any = {}) {
    let dia: VxeModalInstance = this.getRef('modal')
    if (dia) {
      dia.open() //
    }
  }
  close() {
    let dia: VxeModalInstance = this.getRef('modal') //
    if (dia) {
      dia.close()
    }
  }
  getWidth() {
    let width = this.config?.width
    if (width == null) {
      width = 400
    }
    return width
  }
  getHeight() {
    let height = this.config?.height
    if (height == null) {
      height = 300
    }
    return height
  }
  getModelValue() {
    return true //
  }
  getTitle() {
    let title = this.config.title || '窗口'
    return title
  }
  onVisibleChange(bool) {}
  getMinWidth() {
    return 400 //
  }
  getMinHeight() {
    return 300 //
  }
  getInnerInstance() {
    let _createFn = this.config.createFn
    let _ins = null
    if (typeof _createFn == 'function') {
      let config = this.config
      _ins = _createFn({ props: config }) //
    }
    return _ins
  } //
  async confirm() {
    let config = this.config
    let confirmFn = config.confirmFn
    if (typeof confirmFn == 'function') {
      let status = await confirmFn(this) ////
      if (status == false) {
        return //
      }
    }
    this.close() //
  }
}
