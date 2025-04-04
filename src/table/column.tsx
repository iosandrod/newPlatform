import { Base } from '@/base/base'
import { Table } from './table'
import { ColumnDefine, ListTableConstructorOptions } from '@visactor/vtable'
import * as VTable from '@visactor/vtable'
import { h, isProxy, shallowRef, watch, watchEffect } from 'vue'
import { InputEditor } from '@/table/editor/string' //
const VGroup = VTable.VGroup
const VText = VTable.VText
const VImage = VTable.VImage
const VTag = VTable.VTag
import { ICustomLayout, ICustomLayoutObj, ICustomRenderElement, ICustomRenderObj } from '@visactor/vtable/es/ts-types'
import { nextTick } from 'vue' //

export class Column extends Base {
  effectPool = shallowRef({})
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
  } //
  addColumn(col: any) {
    let table = this.table
    let columns = this.columns
    let column = new Column(col, table)
    columns.push(column) //
  }
  unmountedAllWatch() {
    let effectPool = this.effectPool
    Object.entries(effectPool).forEach(([key, value]) => {
      value() //
    })
    this.effectPool = shallowRef({}) //
  }
  getFormat() {
    let field = this.getField() //
    let _table = this.table
    let config = this.config
    let fieldFormat = config.fieldFormat
    let formatFn = (record, row, col, table) => {
      let value = record[field] //
      record['_cacheRow'] = row
      if (typeof fieldFormat == 'function') {
        try {
          let _index = record._index
          if (this.effectPool[_index] == null) {
            this.effectPool[`${_index}`] = watch(
              () => {
                value = fieldFormat({ row: record, col: this, table: _table })
                return value //
              },
              () => {
                //
                _table.updateIndexArr.add(_index) //
              }
            )
          } //
          value = fieldFormat({ row: record, col: this, table: _table })
        } catch (error) {
          //
        }
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
    let edit = null
    if (this.getField() == 'id') {
      edit = new InputEditor(() => this) ////
    }
    let obj: ColumnDefine = {
      ...config,
      field: this.getField(),
      width: this.getColumnWidth(),
      showSort: true,
      // customRender: (args) => {
      //   let el: ICustomRenderElement = VTable.VText({
      //     onClick: () => {},
      //   })
      //   let renderObj: ICustomRenderObj = {
      //     elements: [el], //
      //     expectedHeight: 0,
      //     expectedWidth: 0,
      //   }
      //   return renderObj
      // },
      // customRender(args) {
      //   if (args.row === 0 || args.col === 0) return null
      //   const { width, height } = args.rect //
      //   const { table, row, col } = args
      //   const elements = []
      //   let top = 30
      //   const left = 15
      //   let maxWidth = 0 //
      //   elements.push({
      //     type: 'rect',
      //     fill: '#a23be1',
      //     x: left + 20,
      //     y: top - 20,
      //     width: 300,
      //     height: 28,
      //   })
      //   elements.push({
      //     type: 'text',
      //     fill: 'white',
      //     fontSize: 20,
      //     fontWeight: 500,
      //     textBaseline: 'middle',
      //     text:
      //       col === 1
      //         ? row === 1
      //           ? 'important & urgency'
      //           : 'not important but urgency'
      //         : row === 1
      //         ? 'important but not urgency'
      //         : 'not important & not urgency',
      //     x: left + 50,
      //     y: top - 5,
      //   })
      //   return {
      //     elements,
      //     expectedHeight: top + 20,
      //     expectedWidth: maxWidth + 20,
      //   }
      // },
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
