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
    let isTree = this.getIsTree()

    let obj: VxeColumnProps & { order: number } = {
      ...config,
      width: this.getColumnWidth(),
      slots, //
      params: this,
      order: this.getOrder(),
      align: 'center',
      treeNode: isTree, //
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
  async updateBindValue(config: any) {
    //
    let value = config.value //值
    let row = config.row //行
    let field = config.field || this.getField()
    let table = this.getTable()
    if (config.validate === false) {
      row[field] = value //
      return true
    }
    let _res = await this.validateValue({ ...config, table })
    if (_res == true) {
      let oldv = row[field]
      if (oldv == value) {
        return true
      }
      row[field] = value //
      if (row['_rowState'] == 'unChange') {
        row['_rowState'] = 'change' //
      }
      return true
    } else {
      let table = this.getTable() //
      //@ts-ignore
      table.validateMap[row._index] = [_res] //
    }
  }
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
  getFlatColumns() {
    let columns = this.columns
    if (columns.length > 0) {
      return columns
        .map((col) => {
          return col.getFlatColumns()
        })
        .flat()
    }
    return [this] //
  }
  getBindShowValue(config) {
    return ''
  }
  getCheckBindValue(config) {
    let row = config.row
    let f = this.getField()
    let v = row[f]
    if (Boolean(v)) {
      return 1
    }
    return 0 //
  }
  getAlign() {
    let a = this.config.align
    if (['left', 'center', 'right'].includes(a)) {
      return a
    }
    return 'center' //
  }
  getCellStyle(config) {
    let isTree = this.getIsTree()
    let style: any = {
      height: '100%',
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      position: 'relative',
    }
    if (isTree == true) {
      style.justifyContent = 'flex-start'
    } else {
      let align = this.getAlign()
      if (align == 'left') {
        style.justifyContent = 'flex-start'
      } else if (align == 'center') {
        style.justifyContent = 'center'
      } else if (align == 'right') {
        style.justifyContent = 'flex-end'
      }
    } //
    return style
  }
}
