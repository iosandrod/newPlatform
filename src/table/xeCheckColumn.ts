import { XeColumn } from './xecolumn'

export class XeCheckColumn extends XeColumn {
  constructor(config, t) {
    super(config, t)
  } //
  getColumnProps() {
    let config = super.getColumnProps()
    config.type = 'checkbox'
    return config
  } //
}
