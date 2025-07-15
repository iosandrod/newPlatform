import { Base } from '@ER/base'
import { Column } from './column'
import XeColCom from './xeColCom'
import { VxeColumnProps } from 'vxe-table'

export class XeColumn extends Column {
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
        return <XeColCom config={config}></XeColCom>
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
}
