import { Base } from '@/base/base'
import { Table } from './table'
import { ColumnDefine, ListTableConstructorOptions } from '@visactor/vtable'
import { VTable } from '@visactor/vue-vtable'
import { h } from 'vue'

export class Column extends Base {
  table: Table
  config: any
  constructor(config: any, table?: any) {
    super()
    this.table = table
    this.config = config
    this.init()
  } //
  getFormitem() {}
  init(): void {
    super.init() //
    const config = this.config
  }
  getColumnProps() {
    let config = this.config
    let obj: ColumnDefine = {
      ...config,
      field: this.getField(),
      width: this.getColumnWidth(),
      customRender: null,
      customLayout: null,
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
      field = this.id//
    }//
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
