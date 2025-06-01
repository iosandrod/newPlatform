import { VTable } from '@visactor/vue-vtable'
import { Column } from './column'
import { nextTick, toRaw } from 'vue'
import {
  CheckBox,
  createGroup,
  createImage,
  createText,
} from '@visactor/vtable/es/vrender'
export const containerMap = {}
export const getCheckbox = (column: Column) => {
  let _this = column
  let customLayout = (args) => {
    let { table, row, col, rect, value } = args
    let t1: VTable.ListTable = table

    let _value: string = value
    let record = table.getCellOriginRecord(col, row)
    let bg = _this.getIndexColor(row, record) //
    if (toRaw(record) == toRaw(_this.table.tableData.curRow)) {
      bg = _this.getCurrentRowColor()
      console.log('update') //
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
    let lf = _this.table.leftFrozen
    if (lf && _this.getIsLeftFrozen()) {
      let field = _this.getField()
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
      stroke: _this.getBorderColor(), //
      alignItems: 'center',
      boundsPadding: [0, 0, 0, 0], //
    })

    container.on('mousedown', (args) => {
      if (_this.isMousedownRecord != null) {
        _this.table.emit('dblclick_cell', { originalData: record }) ////
      }
      _this.isMousedownRecord = record
      setTimeout(() => {
        _this.isMousedownRecord = null
      }, 130)
    })
    //处理checkbox
    const checkboxGroup = createGroup({
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center', //
      boundsPadding: [0, 0, 0, 0],
      justifyContent: 'center', //
      height: _height,
      width: _width, //
    })
    let _c = _this.getIsChecked(record)
    container.add(checkboxGroup)
    let disabled = _this.getCheckDisabled() //
    let checkbox1 = new CheckBox({
      text: {
        text: '', //
      },
      disabled: disabled, //
      checked: _c, //
      boundsPadding: [0, 0, 0, 0],
    }) //
    checkbox1.render()
    checkboxGroup.add(checkbox1)

    // let _index = record['_index'] ////
    // let _table = _this.table //
    // let scrollConfig = _table.getInstance().getBodyVisibleRowRange() //
    // let rowStart = scrollConfig.rowStart
    // let rowEnd = scrollConfig.rowEnd
    // let _row = row
    // container['currentRowIndex'] = row //
    // container['updateCanvas'] = () => {
    let updateFn = () => {
      // let record = table.getCellOriginRecord(col, row)
      //基本的样式
      let bg = _this.getIndexColor(row, record)
      if (toRaw(record) == toRaw(_this.table.tableData.curRow)) {
        bg = _this.getCurrentRowColor() //
      } //
      container.setAttribute('background', bg)
      let f = _this.getField()
      let c = record[f] //
      c = _this.getIsChecked(record)
      let num = Number(c)
      if (!isNaN(num)) {
        c = num //
      }
      // console.log(record, c, 'record') ////
      checkbox1.attribute.checked = Boolean(c) //
      checkbox1.render() //
    }
    let count = _this.table.getInstance().visibleRowCount
    _this.table.onCellVisible({
      field: _this.getField(),
      record,
      row,
      updateFn,
      container,
      rowCount: count + 400, //
      fieldFormat: _this.getFormat(),
    })
    // let _length = 200 //
    // rowStart = rowStart - _length
    // if (rowStart < 0) {
    //   rowStart = 0 //
    // }
    // rowEnd = rowEnd + _length
    // if (_row >= rowStart && _row <= rowEnd) {
    //   let currentIndexContain = _table.currentIndexContain
    //   //显示在视图上
    //   let _arr = currentIndexContain[_index]
    //   if (_arr == null) {
    //     currentIndexContain[_index] = {}
    //     _arr = currentIndexContain[_index] //
    //   }
    //   let field = _this.getField()
    //   _arr[field] = container //
    // } else {
    //   let currentIndexContain = _table.currentIndexContain //
    //   delete currentIndexContain[_index] //
    // }

    return {
      rootContainer: container,
      // renderDefault: _isTree, //
      renderDefault: false, //
    }
  }
  return customLayout
}

export const getSerialLayout = (column: Column) => {
  let _this = column
  let customLayout = (args) => {
    const { table, row, col, rect, value } = args
    const { height, width } = rect ?? table.getCellRect(col, row)
    let rows = table.getRecordByCell(col, row)
    let _table = _this.table
    let curRow = _table.tableData.curRow
    let gb = _this.getIndexColor(row)
    if (curRow == rows) {
      gb = _this.getCurrentRowColor() //
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
    // let t = createText({
    //   text: value, //
    //   fontSize: 14,
    //   fill: 'black',
    //   fontWeight: 'bold',
    // })
    // container.add(t) //
    /*

      */

    // let _index = record['_index'] //
    // let scrollConfig = _table.getInstance().getBodyVisibleRowRange() ////
    // let rowStart = scrollConfig?.rowStart
    // let rowEnd = scrollConfig?.rowEnd
    // if (rowStart == null || rowEnd == null) {
    //   rowStart = 0
    //   rowEnd = 0
    // }
    // let _row = row
    // let currentIndexContain = _table.currentIndexContain
    // container['currentRowIndex'] = row //
    // container['updateCanvas'] = () => {
    let updateFn = () => {
      let bg = _this.getIndexColor(row)
      if (toRaw(record) == toRaw(_this.table.tableData.curRow)) {
        bg = _this.getCurrentRowColor()
      } //
      container.setAttribute('background', bg) //
    }

    const record = table.getCellOriginRecord(col, row)
    let count = _table.getInstance().visibleRowCount
    _this.table.onCellVisible({
      field: _this.getField(),
      record,
      row,
      container,
      rowCount: count + 400, //
      updateFn: updateFn,
    }) //
    return {
      rootContainer: container,
      renderDefault: true, //
    }
  }
  return customLayout
}

export const getDefault = (column: Column) => {
  let _this = column
  let customLayout = (args) => {
    let { table, row, col, rect, value } = args
    let t1: VTable.ListTable = table
    let _value: string = value //
    let record = t1.getRecordByCell(col, row) //
    if (record == null) {
      return {
        rootContainer: null,
        renderDefault: false, //
      }
    }
    record = record || {} //
    let bg = _this.getIndexColor(row, record) //
    if (toRaw(record) == toRaw(_this.table.tableData.curRow)) {
      bg = _this.getCurrentRowColor()
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
    let lf = _this.table.leftFrozen
    if (lf && _this.getIsLeftFrozen()) {
      let field = _this.getField()
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
      stroke: _this.getBorderColor(), //
      alignItems: 'center',
      boundsPadding: [0, 0, 0, 0], //
    })
    let _table = _this.table
    let count = _table.getInstance().visibleRowCount //
    let obj123 = {
      container: container,
      record: record,
      field: _this.getField(),
      row: row,
      rowCount: count + 400,
      fieldFormat: _this.getFormat(),
    }
    // if (_row >= rowStart && _row <= rowEnd) {
    let _v = _table.onCellVisible(obj123)
    _value = _v //
    container.on('mouseenter', () => {
      let oldColor = container.attribute.background
      container._oldColor = oldColor
      container.setAttribute('background', _this.getHoverColor()) ///
    })
    container.on('mouseout', () => {
      let color = container._oldColor
      if (record == _this.table.tableData.curRow) {
        color = _this.getCurrentRowColor() //
      } else {
        if ((color = _this.getCurrentRowColor())) {
          color = _this.getIndexColor(row, record)
        }
      } //
      container.setAttribute('background', color)
    })
    if (_this.getField() == 'pid') {
      // console.log(value, 'testValue') //
    }
    let _bounds = [0, 0, 0, 20]
    let locationName = createText({
      text: `${_value}`, //
      fontSize: 16,
      x: 0,
      y: 0,
      // fontFamily: 'sans-serif',
      fill: 'black',
      boundsPadding: _bounds, //
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
    if (_this.getIsTree() == true) {
      // _g.attribute.x = width - 60
      let level = record?._level
      if (level > 0) {
        let num = level * 20 //
        _g.attribute.x = num //
      }
    } //
    let globalValue = _this.table.globalConfig.value
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
            fill: 'red',
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
          if (i == _vArr.length - 1 && v.index + v[0].length < _value.length) {
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
    container.add(_g) //
    container.on('mousedown', (args) => {
      if (_this.isMousedownRecord != null) {
        _this.table.emit('dblclick_cell', { originalData: record }) ////
      }
      _this.isMousedownRecord = record
      setTimeout(() => {
        _this.isMousedownRecord = null
      }, 130)
    })
    let _index = record['_index'] ////

    container['currentRowIndex'] = row //
    let isTree = _this.getIsTree()
    let treeIcon = null
    if (isTree == true && record?.['children']?.length > 0) {
      container.removeChild(_g)
      let _g1 = createGroup({
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        height: height,
        width: width,
        overflow: 'hidden',
        cursor: 'pointer',
        alignItems: 'center',
        boundsPadding: [0, 0, 0, 0],
      })
      //
      let _level = record['_level'] || 0
      // let t = `\u27A4`
      let t = null
      // console.log(record['_expanded'], 'record')
      t = _this.getExpandIcon(record['_expanded'])

      let _g2 = createGroup({
        width: 10,
        height: height / 2,
        x: 0,
        y: 0,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden',
        alignItems: 'center',
      })
      let icon = createImage({
        image: t,
        cursor: 'pointer', //
        height: height / 2,
        overflow: 'hidden',
        fill: 'black',
        boundsPadding: [0, 0, 0, 3 + _level * 16], //
        lineDashOffset: 0,
      })
      icon.on('click', (args) => {
        column.table.isTreeIconClick = true //
        nextTick(() => {
          column.table.isTreeIconClick = false //
        })
      })
      _bounds[3] = 0 //
      _g2.add(icon)
      _g1.add(_g2) //
      _g1.add(locationName) //
      container.add(_g1) //

      treeIcon = icon
    }
    // let scrollConfig = _table.getInstance().getBodyVisibleRowRange() //
    let scrollConfig = 1
    if (scrollConfig != null) {
      // let rowStart = scrollConfig.rowStart
      // let rowEnd = scrollConfig.rowEnd
      // let _row = row
      // container['updateCanvas'] = () => {
      let updateFn = () => {
        // let record = table.getCellOriginRecord(col, row)
        //基本的样式
        let bg = _this.getIndexColor(row, record)
        if (toRaw(record) == toRaw(_this.table.tableData.curRow)) {
          bg = _this.getCurrentRowColor() //
        } //
        container.setAttribute('background', bg)
        let formatFn = _this.getFormat()
        let _value = formatFn({
          row: record,
          col: _this,
          table: _this.table,
          field: _this.getField(), //
        })
        locationName.setAttribute('text', _value)
        if (treeIcon != null) {
          let _expanded = record['_expanded']
          let t = _this.getExpandIcon(_expanded)
          treeIcon.setAttribute('image', t) //
        }
      } //
      obj123['updateFn'] = updateFn //
    }

    return {
      rootContainer: container,
      // renderDefault: _isTree, //
      renderDefault: false, //
    }
  }
  return customLayout
}
