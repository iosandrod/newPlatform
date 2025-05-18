import { Base } from '@/base/base' //
import { nextTick } from 'vue'
import { VxeModalInstance } from 'vxe-pc-ui'
export class Dialog extends Base {
  config: any
  once = true //
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
      let closeFn = this.config.closeFn
      if (typeof closeFn == 'function') {
        closeFn() //
      }
      dia.close()
      if (this.once == true) {
        nextTick(() => {
          //
          let system = this.getSystem()
          let diaArr = system.dialogArr
          let index = diaArr.indexOf(this) //
          if (index > -1) {
            diaArr.splice(index, 1) //
          }
        })
      }
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
  getFooterButtons() {
    let dialog = this
    let defaultBtns = [
      {
        label: '取消',
        fn: () => {
          // console.log('取消')
          dialog.close() //
        },
      },
      {
        label: '确定',
        fn: () => {
          dialog.confirm() //
        },
      },
    ]
    let extendButtons = this.config.buttons
    if (Array.isArray(extendButtons) && extendButtons.length > 0) {
      // defaultBtns=defaultBtns.concat(extendButtons)
      defaultBtns.push(...extendButtons)
    }
    return defaultBtns//
  }
}
