import { Base } from '@/base/base'
import { Table } from './table'
import { ColumnDefine, ListTableConstructorOptions } from '@visactor/vtable'
import * as VTable from '@visactor/vtable'
import {
  h,
  isProxy,
  isReactive,
  reactive,
  shallowRef,
  toRaw,
  watch,
  watchEffect,
} from 'vue'
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
import { Column } from './column'
let cellType = ['text', 'link', 'image', 'video', 'checkbox']
export class CheckboxColumn extends Column {
  getEditType() {
    return 'checkbox'
  }
  getType() {
    return 'checkbox'
  }
  getDisableColumnResize() {
    return true //
  }
  getField() {
    return 'checkboxField' //
  }
  getColumnProps(isFooter = false) {
    let _this = this
    let _props: CheckboxColumnDefine = super.getColumnProps()
    _props.showSort = false //
    //@ts-ignore
    _props.cellType = 'text' //
    _props.headerIcon = undefined //
    _props.width = this.table.getCheckColumnWidth(),
    _props.checked = (config) => {
      //@ts-ignore
      let table: VTable.ListTable = config.table
      let row = table.getRecordByCell(config.col, config.row)
      let checkboxField = row?.checkboxField //
      return checkboxField //
    } //
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
        height: height - 2,
        width: width - 2,
        x: 1,
        y: 1, //
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
      const checkbox1 = new CheckBox({
        text: {
          text: '', //
        },
        disabled: false, //
        checked: _this.table.isCheckAll, //
        boundsPadding: [0, 0, 0, 0],
      }) //
      checkbox1.render()
      checkboxGroup.appendChild(checkbox1)
      checkbox1.addEventListener('checkbox_state_change', (e) => {
        const target = e.target ////
        let attributes = target.attribute //
        let checked = attributes.checked
        _this.table.updateCheckboxAll(checked)
      }) //
      return {
        rootContainer: container,
        renderDefault: false,
      }
    }
    if (isFooter) {
      _props.headerCustomLayout = null //
    } //
    _props.customLayout = (args) => {
      const { table, row, col, rect } = args
      const { height, width } = rect ?? table.getCellRect(col, row)
      let rows = table.getRecordByCell(col, row)
      let _table = this.table
      let curRow = _table.tableData.curRow
      let gb = this.getIndexColor(row)
      if (curRow == rows) {
        gb = 'RGB(200, 190, 230)' //
      }
      const container = createGroup({
        height: height - 2,
        width: width - 2,
        x: 1,
        y: 1, //
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: gb,
      })
      const checkboxGroup = createGroup({
        display: 'flex',
        flexDirection: 'column',
        boundsPadding: [0, 0, 0, 0],
        justifyContent: 'center', //
      })
      container.appendChild(checkboxGroup)
      const checkbox1 = new CheckBox({
        text: {
          text: '', //
        },
        disabled: false, //
        checked: Boolean(rows.checkboxField), //
        boundsPadding: [0, 0, 0, 0],
      }) //
      checkbox1.render()
      checkboxGroup.appendChild(checkbox1)
      checkbox1.addEventListener('checkbox_state_change', (e) => {}) //
      /* 
      
      */
      const record = table.getCellOriginRecord(col, row)
      let _index = record['_index'] //
      let scrollConfig = _table.getInstance().getBodyVisibleRowRange() ////
      let rowStart = scrollConfig.rowStart
      let rowEnd = scrollConfig.rowEnd
      let _row = row
      let currentIndexContain = _table.currentIndexContain
      container['currentRowIndex'] = row //
      container['updateCanvas'] = () => {
        let bg = this.getIndexColor(row) //
        if (toRaw(record) == toRaw(this.table.tableData.curRow)) {
          bg = 'RGB(200, 190, 230)'
        }
        let checkboxField = Boolean(record.checkboxField)
        checkbox1.setAttribute('checked', checkboxField) //
        container.setAttribute('background', bg) //
      }
      let length = this.table.templateProps.data.length
      let _length = length / 5
      rowStart = rowStart - _length
      if (rowStart < 0) {
        rowStart = 0 //
      }
      rowEnd = rowEnd + _length //
      if (_row >= rowStart && _row <= rowEnd) {
        //显示在视图上
        let _arr = currentIndexContain[_index]
        if (_arr == null) {
          currentIndexContain[_index] = {}
          _arr = currentIndexContain[_index] //
        }
        // _arr.push(container)
        let field = this.getField()
        _arr[field] = container //
      } else {
        currentIndexContain[_index] = null
      }
      return {
        rootContainer: container,
        renderDefault: false, //
      }
    }
    return _props //
  }
}
