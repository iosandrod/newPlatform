import { Base } from '@/base/base'
import { Table } from './table'
import { ColumnDefine, ListTableConstructorOptions } from '@visactor/vtable'
import * as VTable from '@visactor/vtable'
import { h, isProxy, shallowRef, watch, watchEffect } from 'vue'
import { InputEditor } from '@/table/editor/string' //
import {
  CheckBox,
  createGroup,
  createText,
  Radio,
} from '@visactor/vtable/es/vrender'
const VGroup = VTable.VGroup
const VText = VTable.VText
const VImage = VTable.VImage
const VTag = VTable.VTag
import {
  CheckboxColumnDefine,
  ColumnIconOption,
  ICustomLayout,
  ICustomLayoutObj,
  ICustomRenderElement,
  ICustomRenderObj,
} from '@visactor/vtable/es/ts-types'
import { nextTick } from 'vue' //
let cellType = ['text', 'link', 'image', 'video', 'checkbox']
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
  createSort() {
    let field = this.getField()
    let sort = null
    let type = this.getColType()
    return {
      field,
      sort,
      type,
    }
  }
  getType() {
    let config = this.config
    let type = config.type
    if (type == null || !cellType.includes(type)) {
      return 'text'
    } //
    return type
  }
  getSubColumns() {
    let columns = this.columns
    return [this, ...columns.map((col) => col.getSubColumns()).flat()] //
  }
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
    if (typeof fieldFormat !== 'function') {
      //
      fieldFormat = (config) => {
        let row = config.row
        let field = config.field
        return row[field] //
      }
    } //
    let formatFn = (record, row, col, table) => {
      let value = record[field] //
      if (typeof fieldFormat == 'function') {
        try {
          let _index = record._index
          if (this.effectPool[_index] == null) {
            this.effectPool[`${_index}`] = watch(
              () => {
                value = fieldFormat({
                  row: record,
                  col: this,
                  table: _table,
                  field: field,
                })
                return value //
              },
              () => {
                //
                _table.updateIndexArr.add(_index) //
              },
            )
          } //
          value = fieldFormat({
            row: record,
            col: this,
            table: _table,
            field: field,
          })
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
    let hIconColor = '#1890ff'
    let enterType = 'mouseenter_cell'
    let item = _this.table.columnFilterConfig.filterConfig.find(
      (item) => item.field == _this.getField(),
    )
    if (item != null) {
      let indexArr = item.indexArr
      if (indexArr.length > 0) {
        hIconColor = 'red'
        enterType = null
      }
    }
    //@ts-ignore
    let headerIcon: ColumnIconOption = {
      // type: 'svg',
      type: 'svg',
      svg: `<svg t="1707378931406" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1587" width="200" height="200"><path d="M741.248 79.68l-234.112 350.08v551.488l55.296 24.704v-555.776l249.152-372.544c8.064-32.96-10.496-59.712-41.152-59.712h-709.248c-30.464 0-49.28 26.752-41.344 59.712l265.728 372.544v432.256l55.36 24.704v-478.592l-248.896-348.864h649.216z m-68.032 339.648c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-14.016-27.264-30.848z m0 185.216c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.256-27.264-14.016-27.264-30.848z m0 185.28c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-13.952-27.264-30.848z" p-id="1588" fill="${hIconColor}"></path></svg>`,
      width: 20,
      height: 20,
      marginRight: 6, //
      positionType: VTable.TYPES.IconPosition.right,
      cursor: 'pointer',
      name: 'filter', //
      //@ts-ignore
      visibleTime: enterType, //
    }
    if (this.columns.length > 0) {
      headerIcon = undefined //
    }
    if (this.table.config.showColumnFilterTable == false) {
      headerIcon = undefined //
    }
    let obj: ColumnDefine = {
      ...config,
      disableColumnResize: true,
      field: this.getField(),
      width: this.getColumnWidth(),
      showSort: true,
      cellType: this.getType(),
      sort: () => {
        return 0
      },
      fieldFormat: _this.getFormat(),
      headerIcon: headerIcon, //
      style: {
        bgColor: (config) => {
          let _table = config.table
          let record = _table.getRecordByCell(config.col, config.row)
          // console.log(config, 'testConfig') //
          let gValue = table.globalConfig.value
          let value = config.value
          if (gValue.length > 0) {
            let reg = new RegExp(gValue, 'g')
            if (reg.test(value)) {
              return 'RGB(230, 220, 230)' //
            }
          }
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
  getColType() {
    let config = this.config
    let type = config.type
    if (type == null) {
      type = 'string'
    } //
    return type
  }
}

export class CheckboxColumn extends Column {
  getEditType() {
    return 'checkbox'
  }
  getType() {
    return 'checkbox'
  }
  getField() {
    return 'checkboxField' //
  }
  getColumnProps() {
    let _this = this
    let _props: CheckboxColumnDefine = super.getColumnProps()
    _props.showSort = false //
    _props.headerIcon = undefined //
    _props.width = 60
    _props.checked = (config) => {
      //@ts-ignore
      let table: VTable.ListTable = config.table
      let row = table.getRecordByCell(config.col, config.row)
      let checkboxField = row?.checkboxField //
      return checkboxField //
    }
    _props.disable = (config) => {
      let table = config.table
      let row = table.getRecordByCell(config.col, config.row)
      let d = false
      let disableFn = _this.table.config.checkDisable
      if (typeof disableFn == 'function') {
        let isDisable = disableFn({ row: row, table: _this.table })
      }
      return false
    }
    //@ts-ignore
    _props.headerCustomLayout = (args) => {
      const { table, row, col, rect } = args
      const { height, width } = rect ?? table.getCellRect(col, row)
      // console.log(width,'testWidth')//
      const container = createGroup({
        height,
        width,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      })

      const checkboxGroup = createGroup({
        display: 'flex',
        flexDirection: 'column',
        boundsPadding: [0, 0, 0, 0],
        justifyContent: 'center', //
      })
      container.appendChild(checkboxGroup)

      // const checkboxText = createText({
      //   text: 'operate: ',
      //   fontSize: 12,
      //   boundsPadding: [0, 0, 0, 0],
      // })
      // checkboxGroup.appendChild(checkboxText)
      const checkbox1 = new CheckBox({
        text: {
          text: '', //
          // fontSize: 12,
        },
        disabled: false, //
        checked: _this.table.isCheckAll, //
        // spaceBetweenTextAndIcon: 2,
        boundsPadding: [0, 0, 0, 0],
      }) //
      checkbox1.render()
      checkboxGroup.appendChild(checkbox1)
      checkbox1.addEventListener('checkbox_state_change', (e) => {
        const target = e.target ////
        let attributes = target.attribute //
        let checked = attributes.checked
        _this.table.updateCheckboxAll(checked)
        // _this.table.updateCanvas() //
      }) //
      return {
        rootContainer: container,
        renderDefault: false,
      }
    }
    // _props.disableSelect = true //
    return _props //
  }
}
