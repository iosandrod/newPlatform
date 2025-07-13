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
  createImage,
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
import { getSerialLayout } from './columnFn'
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
    // _props.customLayout = getSerialLayout(this) //
    //@ts-ignore
    let dragOrder = this.table.getDragRow()
    // debugger//
    if (dragOrder) {
      //
      //@ts-ignore
      _props.dragOrder = true //
    }
    // _props.dragOrder = true
    //@ts-ignore
    _props.isLeftFrozen = this.getIsLeftFrozen()
    return _props //
  }
}
