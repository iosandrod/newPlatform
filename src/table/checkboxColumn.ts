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
  getIsLeftFrozen() {
    return true
  } //
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

  getCustomLayout() {
    return this.getCheckboxCustomLayout()
  }

  getColumnProps(isFooter = false) {
    let _this = this
    let _props: CheckboxColumnDefine = super.getColumnProps()
    _props.showSort = false //
    //@ts-ignore
    _props.cellType = 'text' //
    _props.headerIcon = undefined //
    ;(_props.width = this.table.getCheckColumnWidth()),
      (_props.checked = (config) => {
        //@ts-ignore
        let table: VTable.ListTable = config.table
        let row = table.getRecordByCell(config.col, config.row)
        let checkboxField = row?.checkboxField //
        return checkboxField //
      }) //
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
    // _props.headerCustomLayout = (args) => {
    //   const { table, row, col, rect } = args
    //   const { height, width } = rect ?? table.getCellRect(col, row)
    //   // console.log(width,'testWidth')//
    //   const container = createGroup({
    //     height: height - 2,
    //     width: width - 2,
    //     x: 1,
    //     y: 1, //
    //     display: 'flex',
    //     flexDirection: 'column',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //   })
    //   const checkboxGroup = createGroup({
    //     display: 'flex',
    //     flexDirection: 'column',
    //     boundsPadding: [0, 0, 0, 0],
    //     justifyContent: 'center', //
    //   })

    //   const checkbox1 = new CheckBox({
    //     text: {
    //       text: '', //
    //     },
    //     disabled: false, //
    //     checked: _this.table.isCheckAll, //
    //     boundsPadding: [0, 0, 0, 0],
    //   }) //
    //   checkbox1.render()
    //   checkboxGroup.appendChild(checkbox1)
    //   checkbox1.addEventListener('checkbox_state_change', (e) => {
    //     const target = e.target ////
    //     let attributes = target.attribute //
    //     let checked = attributes.checked
    //     _this.table.updateCheckboxAll(checked)
    //   }) //
    //   container.appendChild(checkboxGroup)
    //   return {
    //     rootContainer: container,
    //     renderDefault: false,
    //   }
    // }
    if (isFooter) {
      _props.headerCustomLayout = null //
    } //
    _props.customLayout = this.getCustomLayout()
    return _props //
  }
  getHeaderCustomLayout() {
    let _this = this
    return (args) => {
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
      if (this.table.config.showCheckAll == true) {
        //
        container.appendChild(checkboxGroup)
      }
      return {
        rootContainer: container,
        renderDefault: false,
      }
    }
  }
}
