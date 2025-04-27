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
    let dia: VxeModalInstance = this.getRef('dialog')
    if (dia) {
      dia.open() //
    }
  }
  close() {
    let dia: VxeModalInstance = this.getRef('dialog')
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
  onVisibleChange(bool) {}
  getMinWidth() {
    return 400 //
  }
  getMinHeight() {
    return 300 //
  }
}
