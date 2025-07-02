import { Column } from './column'
import { nextTick, toRaw, isProxy } from 'vue'
import {
  CheckBox,
  createGroup,
  createImage,
  createText,
} from '@visactor/vtable/es/vrender'
import * as d3 from 'd3'
import { render } from 'bwip-js'
import { VTable } from '@visactor/vtable-gantt'
import { ListTable } from '@visactor/vtable'
function createSvgTextString(text, width, height, fontSize, lineHeight = 1.2) {
  // 1. 创建一个脱离文档的 SVG 容器
  const svg = d3
    .create('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('width', width)
    .attr('height', height)

  // 2. 拆分多行
  const lines = text.split('\n')

  // 3. 在 SVG 里插入 <text>，设置起始坐标 (x, y)
  //    y 设为 fontSize，让第一行基线刚好在这个位置
  const textEl = svg
    .append('text')
    .attr('x', 0)
    .attr('y', fontSize)
    .attr('font-family', 'Arial, sans-serif')
    .attr('font-size', fontSize)
    .attr('fill', 'black')

  // 4. 对每一行都添加一个 <tspan>
  lines.forEach((line, i) => {
    const t = textEl
      .append('tspan')
      .attr('x', 0)
      // 第一行不需额外 dy，后续行按照行高累加
      .attr('dy', i === 0 ? 0 : fontSize * lineHeight)
      .text(line)
  })

  // 5. 序列化并返回
  return new XMLSerializer().serializeToString(svg.node())
}
export const containerMap = {}
export const getCheckbox = (column: Column) => {
  let _this = column.getTable().columnsMap[column.getField()] //
  if (column.getField() == 'checkboxField') {
    //@ts-ignore
    _this = column.getTable().checkboxColumn //
  }
  let customLayout = (args) => {
    let { table, row, col, rect, value } = args

    let t1: ListTable = table as any

    let _value: string = value //
    let record = table.getCellOriginRecord(col, row)
    if (_this.table?.useCache) {
      let _index = record['_index']
      let field = _this.getField() //
      let _con = _this.table.getCacheContainer(_index, field)
      if (_con) {
        return {
          rootContainer: _con,
          renderDefault: false,
        }
      }
    } //
    let bg = _this.getIndexColor(row, record)
    if (record?._index == _this.table.tableData?.curRow?._index) {
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
      if (record?._index == _this.table.tableData?.curRow?._index) {
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

    let updateFn = () => {
      let bg = _this.getIndexColor(row)
      if (record?._index == _this.table.tableData?.curRow?._index) {
        bg = _this.getCurrentRowColor()
      } //
      container.setAttribute('background', bg) //
    }

    const record = table.getCellOriginRecord(col, row)
    if (_this.table.useCache == true) {
      let _index = record._index //
      let f = _this.getField()
      let _con = _this.table.getCacheContainer(_index, f)
      if (_con != null) {
        return {
          rootContainer: _con,
          renderDefault: false, //
        }
      } //
    }
    let count = _table.getInstance()?.visibleRowCount || table?.visibleRowCount //
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
  let _this = column.getTable().columnsMap[column.getField()] //
  // console.log(isProxy(_this), 'isProxy')
  let customLayout = (args) => {
    let { table, row, col, rect, value } = args
    let t1: ListTable = table
    let _value: string = value //
    let record = t1.getRecordByCell(col, row) //
    if (record == null) {
      return {
        rootContainer: null,
        renderDefault: false, //
      }
    }
    if (_this.table.useCache == true) {
      let _index = record._index //
      let f = _this.getField()
      let _con = _this.table.getCacheContainer(_index, f) //
      if (_con) {
        let currentResizeField = _this.table.currentResizeField //
        if (currentResizeField === f) {
        } else {
          return {
            rootContainer: _con,
            renderDefault: false, //
          }
        }
      }
    }
    record = record || {} //
    let bg = _this.getIndexColor(row, record) //
    if (record?._index == _this.table.tableData?.curRow?._index) {
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
    let _table = _this.getTable() //
    let count = _table.getInstance()?.visibleRowCount || table?.visibleRowCount //
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
      // debugger//
      let color = container._oldColor
      if (record['_index'] == _this.table.tableData?.curRow?._index) {
        color = _this.getCurrentRowColor() //
      } else {
        if ((color = _this.getCurrentRowColor())) {
          color = _this.getIndexColor(row, record)
        }
      }
      container.setAttribute('background', color)
    })
    if (_this.getField() == 'pid') {
    }
    let _bounds = [0, 0, 0, 20]
    let fSize = _this.getFontSize()
    let locationName = createText({
      text: `${_value}`, //
      fontSize: fSize, //
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
            fontSize: fSize,
            fill: 'red',
            boundsPadding: [0, 0, 0, 0],
            lineDashOffset: 0,
          })
          if (i == 0 && v.index > 0) {
            //
            let t1 = createText({
              text: _value.slice(0, v.index), //
              fontSize: fSize,
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
              fontSize: fSize,
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
        cursor: 'pointer',
        x: 0,
        y: 0, //
        width: 15, //
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
        if (record?._index == _this.table.tableData?.curRow?._index) {
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

export const getControllButtons = (column: Column) => {
  let _this = column.getTable().columnsMap[column.getField()] //
  if (column.getField() == 'controllerField') {
    _this = column.table.controllerColumn //
  }
  // console.log('获取了防守打法收到', 'getControllButtons')
  let customLayout = (args) => {
    let { table, row, col, rect } = args
    let { height, width } = rect ?? table.getCellRect(col, row) //
    let container = createGroup({
      height: height - 2,
      width: width - 2,
      x: 1,
      y: 1, //
      display: 'flex',
      // background: _this.getBgColor(), //
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    })
    const createButton = (config?: any) => {
      let _rect = createGroup({
        height: height - 6,
        width: 50,
        cursor: 'pointer',
        background: _this.getButtonColor(), //
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cornerRadius: 5,
        innerBorder: {
          stroke: 'red',
        },
        // stroke: 'RGB(30, 40, 60)',
      })
      let test1 = createText({
        text: config?.label, //
        cursor: 'pointer',
        fontSize: 14,
        fill: _this.getButtonTextColor(), //
        boundsPadding: [0, 0, 0, 0],
        lineDashOffset: 0,
      })
      _rect.add(test1) //
      _rect.on('mouseenter', () => {
        let hoverColor = _this.getButtonColor(true)
        _rect.setAttribute('background', hoverColor) //
        _rect?.stage?.render()
      })
      _rect.on('mouseout', () => {
        let hoverColor = _this.getButtonColor()
        _rect.setAttribute('background', hoverColor) //
        // _rect?.stage?.render()//
      })
      _rect.on('click', () => {
        _this.table.onControllerButtonClick(config) //
      })
      return _rect
    }
    let allControllerBtns = _this.table.getControllerButtons()
    for (const btn of allControllerBtns) {
      let _rect = createButton(btn)
      container.add(_rect) //
    }
    let record = table.getCellOriginRecord(col, row)
    let updateFn = () => {
      let bg = _this.getIndexColor(row, record)
      if (record?._index == _this.table.tableData?.curRow?._index) {
        bg = _this.getCurrentRowColor() //
      } //
      container.setAttribute('background', bg)
    }
    let count = _this.table.getInstance().visibleRowCount
    _this.table.onCellVisible({
      field: _this.getField(),
      record,
      row,
      updateFn,
      column: _this, //
      container,
      rowCount: count + 400, //
      fieldFormat: _this.getFormat(),
    })
    return {
      rootContainer: container,
      renderDefault: false,
    }
  }
  return customLayout
}
