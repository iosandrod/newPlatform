import { Base } from '@/base/base'
import { Table } from './table'
import { ColumnDefine, ListTableConstructorOptions } from '@visactor/vtable'
import * as VTable from '@visactor/vtable'
import { h } from 'vue'
import { InputEditor } from '@/table/editor/string' //
const VGroup = VTable.VGroup
const VText = VTable.VText
const VImage = VTable.VImage
const VTag = VTable.VTag
import { ICustomLayout, ICustomLayoutObj, ICustomRenderElement, ICustomRenderObj } from '@visactor/vtable/es/ts-types'

export class Column extends Base {
  isChangeValue = false
  table: Table
  cacheValue?: any
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
  getSelectOptions() {
    let config = this.config
    let options = config.options
    if (Array.isArray(options)) {
      return options
    }
    let bindField = config.bindField
    if (bindField != null) {
      let system = this.system
      let selectOptions = system.selectOptions
      let arr = selectOptions[bindField] || []
      return arr
    }
    return []
  }
  getFormat() {
    let field = this.getField() //
    let _table = this.table
    let config = this.config
    let fieldFormat = config.fieldFormat //
    let formatFn = (record, row, col, table) => {
      let value = record[field] //
      let type = this.getType()
      if (type == 'select') {
        let options = this.getSelectOptions()
        let _label = options.find((item) => item.value == value)
        if (_label) {
          value = _label.label //
        }
      }
      if (typeof fieldFormat == 'function') {
        try {
          value = fieldFormat({ row: record, col: this, table: _table })
        } catch (error) {
          //
        }
      } //
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
    let edit = null
    if (this.getField() == 'id') {
      edit = new InputEditor(() => this) ////
    }
    let obj: ColumnDefine = {
      ...config,
      field: this.getField(),
      width: this.getColumnWidth(),
      type: this.getType(), //
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
      editor: edit, ////
      columns: _columns, //
    }
    return obj //
  }
  getType() {
    let config = this.config
    let type = config.type
    return type
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
  updateBindValue(config) {
    let value = config.value //值
    let row = config.row //行
    let field = this.getField()
    row[field] = value //
  }
  getBindConfig() {
    let editType = this.getEditType()
    let config = this.config
    return {
      ...config,
      type: editType,
    }
  }
  getEditType() {
    let config = this.config
    let editType = config.editType || 'string'
    return editType
  }
}
