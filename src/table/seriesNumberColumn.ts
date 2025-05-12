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
export class SeriesNumberColumn extends Column {
  getEditType() {
    return 'text'
  }
  getType() {
    return 'text'
  }
  getDisableColumnResize() {
    return true //
  }
  getField() {
    return 'seriesNumber' //
  }
  getIsLeftFrozen() {
    return true
  } //
  getIsFrozen() {
    return true
  } //
  getColumnProps(isFooter = false) {
    let _this = this
    let _props: CheckboxColumnDefine = super.getColumnProps()
    _props.showSort = false //
    //@ts-ignore
    _props.cellType = 'text' //
    _props.headerIcon = undefined //
    _props.width = this.table.getSerialNumberWidth()
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
    _props.title = '' //
    //@ts-ignore

    if (isFooter) {
      _props.title = '汇总' //
      _props.headerCustomLayout = null //
    } //
    _props.headerCustomLayout = null //
    _props.customLayout = (args) => {
      const { table, row, col, rect, value } = args
      const { height, width } = rect ?? table.getCellRect(col, row)
      let rows = table.getRecordByCell(col, row)
      let _table = this.table
      let curRow = _table.tableData.curRow
      let gb = this.getIndexColor(row)
      if (curRow == rows) {
        gb = this.getCurrentRowColor() //
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
      let t = createText({
        text: value, //
        fontSize: 14,
        fill: 'black',
        fontWeight: 'bold',
      })
      container.add(t) //
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
        let bg = this.getIndexColor(row)
        if (toRaw(record) == toRaw(this.table.tableData.curRow)) {
          bg = this.getCurrentRowColor()
        } //
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
        let field = this.getField()
        _arr[field] = container //
      } else {
        currentIndexContain[_index] = null
      }
      return {
        rootContainer: container,
        renderDefault: true, //
      }
    }
    // _props
    //@ts-ignore
    _props.dragOrder = true
    //@ts-ignore
    _props.isLeftFrozen = this.getIsLeftFrozen()
    return _props //
  }
}
