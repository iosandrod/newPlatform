import XeColCom from './xeColCom'
import { XeColumn } from './xecolumn'

export class XeCheckColumn extends XeColumn {
  constructor(config, t) {
    super(config, t)
  } //
  getColumnWidth() {
    return 50
  } //
  
  getColumnProps() {
    let config = super.getColumnProps()
    config.fixed = 'left' //
    config.type = 'checkbox'
    return config
  } //
}
