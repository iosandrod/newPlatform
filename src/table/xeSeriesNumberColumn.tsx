import XeColCom from './xeColCom'
import { XeColumn } from './xecolumn'

export class XeSeriesNumberColumn extends XeColumn {
  constructor(config, t) {
    super(config, t)
  } //
  getColumnWidth() {
    return 50
  } //
  getTitle() {
    return '#' //
  }

  getColumnProps() {
    let isDrag = this.getDragSort()
    let config = super.getColumnProps()
    config.fixed = 'left' //
    config.type = 'seq'
    if (isDrag == true) {
      config.dragSort = true
    }
    return config //
  } //
}
