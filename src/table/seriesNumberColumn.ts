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
  getCustomLayout() {
    //
    let customLayout = (args) => {
      let { table, row, col, rect, value } = args
      let t1: VTable.ListTable = table

      let _value: string = value
      let record = table.getCellOriginRecord(col, row)
      let bg = this.getIndexColor(row, record) //
      if (toRaw(record) == toRaw(this.table.tableData.curRow)) {
        bg = this.getCurrentRowColor()
      }
      const { height, width } = rect ?? table.getCellRect(col, row)
      let _height = height
      let _length1 = t1.records.length
      if (_length1 == row) {
        _height = _height - 1 //
      }
      let _width = width
      let colCount = t1.colCount
      if (colCount == col + 1) {
        _width = _width - 1
      }
      let lf = this.table.leftFrozen
      if (lf && this.getIsLeftFrozen()) {
        let field = this.getField()
        if (lf == field) {
          _width = _width - 1 //
        }
      }
      let container = createGroup({
        height: _height,
        width: _width,
        // display: 'flex',
        // flexDirection: 'row',
        flexWrap: 'nowrap',
        background: bg, //
        overflow: 'hidden',
        lineWidth: 1,
        stroke: this.getBorderColor(), //
        alignItems: 'center',
        boundsPadding: [0, 0, 0, 0], //
      })
      container.on('mouseover', () => {
        let oldColor = container.attribute.background
        container._oldColor = oldColor
        container.setAttribute('background', this.getHoverColor()) ///
      })
      container.on('mouseout', () => {
        let color = container._oldColor
        if (record == this.table.tableData.curRow) {
          color = this.getCurrentRowColor() //
        }
        container.setAttribute('background', color) ////
      })
      if (this.getField() == 'pid') {
        // console.log(value, 'testValue') //
      }
      let locationName = createText({
        text: `${value}`, //
        fontSize: 16,
        x: 0,
        y: 0,
        // fontFamily: 'sans-serif',
        fill: 'black',
        boundsPadding: [0, 0, 0, 30],
        lineDashOffset: 0,
      })
      let _g = createGroup({
        width: width,
        height,
        x: 0,
        y: 0,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden',
        alignItems: 'center', //
      })
      if (this.getIsTree() == true) {
        _g.attribute.x = width - 60
      }
      let globalValue = this.table.globalConfig.value
      if (globalValue.length > 0) {
        let container = _g
        let reg = new RegExp(globalValue, 'gi') //
        _value = `${value}` //
        let vArr = _value.matchAll(reg)
        let _vArr = [...vArr]
        _vArr = _vArr
          .map((v, i) => {
            let arr = []
            let t = createText({
              text: v[0], //
              fontSize: 16,
              boundsPadding: [0, 0, 0, 0],
              lineDashOffset: 0,
            })
            if (i == 0 && v.index > 0) {
              //
              let t1 = createText({
                text: _value.slice(0, v.index), //
                fontSize: 16,
                // fontFamily: 'sans-serif',
                fill: 'black',
                boundsPadding: [0, 0, 0, 0],
                lineDashOffset: 0,
              })
              arr.push(t1)
            }
            arr.push(t)
            if (
              i == _vArr.length - 1 &&
              v.index + v[0].length < _value.length
            ) {
              let t2 = createText({
                text: _value.slice(v.index + v[0].length), //
                fontSize: 14,
                // fontFamily: 'sans-serif',
                fill: 'black',
                boundsPadding: [0, 0, 0, 0],
                lineDashOffset: 0,
              })
              arr.push(t2)
            }
            return arr
          })
          .flat()
        if (_vArr.length > 0) {
          _vArr.forEach((item) => {
            //@ts-ignore
            container.add(item) //
          })
        } else {
          container.add(locationName) //
        }
      } else {
        let container = _g
        container.add(locationName)
      }
      // container.add(_g) //
      container.on('mousedown', (args) => {
        if (this.isMousedownRecord != null) {
          this.table.emit('dblclick_cell', { originalData: record }) ////
        }
        this.isMousedownRecord = record
        setTimeout(() => {
          this.isMousedownRecord = null
        }, 130)
      })
      let _index = record['_index'] ////
      let _table = this.table //
      let scrollConfig = _table.getInstance().getBodyVisibleRowRange() ////
      let rowStart = scrollConfig.rowStart
      let rowEnd = scrollConfig.rowEnd
      let _row = row
      container['currentRowIndex'] = row //
      let _this = this
      let isTree = this.getIsTree()
      let treeIcon = null
      if (isTree == true && record?.['children']?.length > 0) {
        container.removeChild(_g)
        let _g1 = createGroup({
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          height: height,
          width: width,
          overflow: 'hidden',
          cursor: 'pointer',
          alignItems: 'center',
          // justifyContent: 'center',
          boundsPadding: [0, 0, 0, 0],
        })
        //
        let _level = record['_level'] || 0
        // let t = `\u27A4`
        // console.log(record['_expanded'], 'record')
        // t = `\u25BC`
        // if (record['_expanded'] == true) {
        //   t = `\u25B6` //
        // }
        let t = this.getExpandIcon(record['_expanded'])
        let icon = createImage({
          image: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <rect width="24" height="24" rx="4" fill="#007AFF" />
  <path d="M12 16L6 10H18L12 16Z" fill="#FFFFFF" />
</svg>
`,
          cursor: 'pointer', //
          x: 0,
          y: 0, //
          overflow: 'hidden',
          fill: 'black',
          boundsPadding: [0, 0, 0, 3 + _level * 15], //
          lineDashOffset: 0,
        })
        _g1.add(icon)
        // _g1.add(_g) //
        container.add(_g1) //
        _g1.on('click', () => {
          this.table.openTreeRow(col, row) //
          nextTick(() => {
            // _this.table.updateIndexArr.add(_index)
          })
        })
        treeIcon = icon
      }
      container['updateCanvas'] = () => {
        // let record = table.getCellOriginRecord(col, row)
        //基本的样式
        let bg = _this.getIndexColor(row, record)
        if (toRaw(record) == toRaw(_this.table.tableData.curRow)) {
          bg = _this.getCurrentRowColor() //
        } //
        container.setAttribute('background', bg)
        locationName.setAttribute('text', _value)
        if (treeIcon != null) {
          let _expanded = record['_expanded']
          let t = this.getExpandIcon(_expanded)
          // if (_expanded == true) {
          //   // treeIcon.setAttribute('text', '\u25BC')
          //   treeIcon.setAttribute('text', '\u25B6') //
          // } else {
          //   treeIcon.setAttribute('text', '\u27A4')
          // } //
          treeIcon.setAttribute('text', t) //
        }
      } //

      let _length = 200 //
      rowStart = rowStart - _length
      if (rowStart < 0) {
        rowStart = 0 //
      }
      rowEnd = rowEnd + _length
      if (_row >= rowStart && _row <= rowEnd) {
        let currentIndexContain = _table.currentIndexContain
        //显示在视图上
        let _arr = currentIndexContain[_index]
        if (_arr == null) {
          currentIndexContain[_index] = {}
          _arr = currentIndexContain[_index] //
        }
        let field = this.getField()
        _arr[field] = container //
      } else {
        let currentIndexContain = _table.currentIndexContain //
        delete currentIndexContain[_index] //
      }
      // let _isTree = this.getIsTree()
      // if (_isTree == true) {
      //   container = null //
      // }
      return {
        rootContainer: container,
        // renderDefault: _isTree, //
        renderDefault: true, //
      }
    }
    return customLayout
  }
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
    // _props.customLayout = (args) => {
    //   const { table, row, col, rect, value } = args
    //   const { height, width } = rect ?? table.getCellRect(col, row)
    //   let rows = table.getRecordByCell(col, row)
    //   let _table = this.table
    //   let curRow = _table.tableData.curRow
    //   let gb = this.getIndexColor(row)
    //   if (curRow == rows) {
    //     gb = this.getCurrentRowColor() //
    //   }
    //   const container = createGroup({
    //     height: height - 2,
    //     width: width - 2,
    //     x: 1,
    //     y: 1, //
    //     display: 'flex',
    //     flexDirection: 'column',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     background: gb,
    //   })
    //   // let t = createText({
    //   //   text: value, //
    //   //   fontSize: 14,
    //   //   fill: 'black',
    //   //   fontWeight: 'bold',
    //   // })
    //   // container.add(t) //
    //   /*

    //   */
    //   const record = table.getCellOriginRecord(col, row)
    //   let _index = record['_index'] //
    //   let scrollConfig = _table.getInstance().getBodyVisibleRowRange() ////
    //   let rowStart = scrollConfig?.rowStart
    //   let rowEnd = scrollConfig?.rowEnd
    //   if (rowStart == null || rowEnd == null) {
    //     rowStart = 0
    //     rowEnd = 0
    //   }
    //   let _row = row
    //   let currentIndexContain = _table.currentIndexContain
    //   container['currentRowIndex'] = row //
    //   container['updateCanvas'] = () => {
    //     let bg = this.getIndexColor(row)
    //     if (toRaw(record) == toRaw(this.table.tableData.curRow)) {
    //       bg = this.getCurrentRowColor()
    //     } //
    //     container.setAttribute('background', bg) //
    //   }
    //   let length = this.table.templateProps.data.length
    //   let _length = length / 5
    //   rowStart = rowStart - _length
    //   if (rowStart < 0) {
    //     rowStart = 0 //
    //   }
    //   rowEnd = rowEnd + _length //
    //   if (_row >= rowStart && _row <= rowEnd) {
    //     //显示在视图上
    //     let _arr = currentIndexContain[_index]
    //     if (_arr == null) {
    //       currentIndexContain[_index] = {}
    //       _arr = currentIndexContain[_index] //
    //     }
    //     let field = this.getField()
    //     _arr[field] = container //
    //   } else {
    //     currentIndexContain[_index] = null
    //   }
    //   return {
    //     rootContainer: container,
    //     renderDefault: true, //
    //   }
    // }
    // _props
    //@ts-ignore
    let dragOrder = this.table.getDragRow()
    // debugger//
    if (dragOrder) {
      //@ts-ignore
      _props.dragOrder = true //
    }
    // _props.dragOrder = true
    //@ts-ignore
    _props.isLeftFrozen = this.getIsLeftFrozen()
    return _props //
  }
}
