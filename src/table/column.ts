import { Base } from '@/base/base'
import { Table } from './table'
import { ColumnDefine, ListTableConstructorOptions } from '@visactor/vtable'
import { VTable } from '@visactor/vue-vtable'
import { h } from 'vue'

export class Column extends Base {
  table: Table
  config: any
  columns: Column[] = []
  constructor(config: any, table?: any) {
    super()
    this.table = table
    this.config = config
    this.init()
  } //
  getFormitem() {}
  init(): void {
    super.init() //
    this.setColumns()
  }
  setColumns() {
    this.columns.splice(0) //
    const config = this.config
    let _columns = config.columns || [] //
    for (const col of _columns) {
      this.addColumn(col)
    }
  }
  addColumn(col: any) {
    let table = this.table
    let columns = this.columns
    let column = new Column(col, table)
    columns.push(column) //
  }
  getFormat() {
    let field = this.getField() //
    let _table = this.table
    let formatFn = (record, row, col, table) => {
      let value = record[field] //
      if (_table.clickOpt == 1) {
        return 'test' //
      }
      return value
    }
    return formatFn
  }
  getColumnProps() {
    let table = this.table
    let config = this.config
    let _columns = this.columns.map((col) => {
      return col.getColumnProps()
    })
    if (_columns.length == 0) {
      _columns = null
    }
    let _this = this
    let obj: ColumnDefine = {
      ...config,
      field: this.getField(),
      width: this.getColumnWidth(),
      customRender: null,
      customLayout: null,
      fieldFormat: _this.getFormat(),
      style: {
        bgColor: (config) => {
          let _table = config.table
          let record = _table.getRecordByCell(config.col, config.row)
          if (record == table.tableData.curRow) {
            return 'RGB(200, 190, 230)'
          }
        }, //
      },
      columns: _columns, //
    }
    return obj //
  }
  getIsShow() {
    let config = this.config
    let hidden = config.hidden
    if (hidden == true) {
      return false
    }
    return true
  }
  getField() {
    let config = this.config
    let field = config.field
    if (field == null) {
      field = this.id //
    } //
    return field //
  }
  getColumnWidth() {
    let config = this.config
    let width = config.width
    if (width == null) {
      let table = this.table
      let defaultWidth = table.getDefaultWidth()
      width = defaultWidth
    }
    return width
  }
}
