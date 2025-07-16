import { Base } from '@ER/base'
import { Column } from './column'
import XeColCom from './xeColCom'
import { VxeColumnProps } from 'vxe-table'
import XeColHeaderCom from './xeColHeaderCom'
import { XeTable } from './xetable'
import { h } from 'vue'

export class XeColumn extends Column {
  //@ts-ignore
  columns: XeColumn[]
  constructor(config: any, table) {
    super(config, table)
  }
  addColumn(config: any) {
    let table = this.getTable()
    let columns = this.columns
    let column = new XeColumn(config, table)
    columns.push(column)
  }
  getSlots() {
    return {
      default: (config) => {
        return <XeColCom row={config.row} config={config}></XeColCom>
      },
      header: (config) => {
        let com = h(XeColHeaderCom, { config, checked: config.checked })

        return com //
        // return <div>header</div>
      },
      checkbox: (config) => {
        return (
          <XeColCom
            row={config.row}
            type="checkbox"
            checked={config.checked}
            config={config}
          ></XeColCom>
        )
      },
    }
  }

  getColumnProps() {
    let config = this.config
    const slots = this.getSlots()
    let obj: VxeColumnProps = {
      ...config,
      width: this.getColumnWidth(),
      slots, //
      params: this,
      align: 'center',
    } //
    return obj
  }
  //@ts-ignore
  getTable(): XeTable {
    let s = super.getTable() as any
    return s //
  }
  getPlaceholder() {
    return this.config.placeholder
  }
  //@ts-ignore
  updateBindValue(config: any) {}
  getDisabled() {}
  //@ts-ignore
  getBindValue(config) {
    let f = this.getField()
    let row = config.row
    return row[f] //
  }
  onBlur(config) {}
  getClearable() {
    return true
  }
  getOptions() {
    let config = this.config
    return config
  } //
  getMultiple() {
    return false //
  }
}
