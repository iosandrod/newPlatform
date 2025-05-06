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
  createRect,
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
export class ControllerColumn extends Column {
  getEditType() {
    return null
  }
  getType() {
    return 'text'
  }
  getDisableColumnResize() {
    return true //
  }
  getWidth() {
    return 200
  }
  getIsFrozen() {
    return true
  }
  getField() {
    return 'controllerField' //
  }
  getColumnProps(isFooter = false) {
    let _this = this
    let _props: CheckboxColumnDefine = super.getColumnProps()
    _props.showSort = false //
    //@ts-ignore
    _props.cellType = 'text' //
    _props.headerIcon = undefined //

    _props.width = this.table.getControllerColumnWidth() //
    //@ts-ignore
    if (isFooter) {
      _props.headerCustomLayout = null //
    } //
    _props.customLayout = (args) => {
      let { table, row, col, rect } = args
      let { height, width } = rect ?? table.getCellRect(col, row) //
      let container = createGroup({
        height: height - 2,
        width: width - 2,
        x: 1,
        y: 1, //
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
      })
      const createButton = () => {
        let _rect = createGroup({
          height: height - 6,
          width: 50,
          cursor: 'pointer',
          background: this.getButtonColor(), //
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cornerRadius: 5,
          innerBorder: {
            stroke: 'red',
          },
          stroke: 'RGB(30, 40, 60)',
        })
        let test1 = createText({
          text: '按钮', //
          cursor: 'pointer',
          fontSize: 14,
          fill: 'white',
          boundsPadding: [0, 0, 0, 0],
          lineDashOffset: 0,
        })
        _rect.add(test1) //
        return _rect
      }
      let _rect = createButton()
      let _rect1 = createButton()
      container.add(_rect) //
      container.add(_rect1) //
      return {
        rootContainer: container,
        renderDefault: false,
      }
    }
    //@ts-ignore
    _props.isFrozen = true
    _props.title = ''
    _props.headerCustomLayout = null
    return _props //
  }
}
