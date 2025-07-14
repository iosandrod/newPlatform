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
import { createTextArr, getExpandIcon, getLocalStrWidth } from './columnUtil'
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
const measureCanvas = document.createElement('canvas')
const measureCtx = measureCanvas.getContext('2d')

/**
 * 同步测量文字宽高，并保证至少有最小值
 */
function measureTextSize(text, fontSize = 16, fontFamily = 'sans-serif') {
  measureCtx.font = `${fontSize}px ${fontFamily}`
  const m = measureCtx.measureText(text)
  const width = Math.ceil(m.width)
  // 上下 bounding box 不支持时，actualBoundingBoxAscent/Descent 可能为 undefined 或 0
  const ascent = m.actualBoundingBoxAscent || fontSize
  const descent = m.actualBoundingBoxDescent || 0
  let height = Math.ceil(ascent + descent)
  // 最低保证 height 要大于等于 fontSize
  if (height < fontSize) {
    height = Math.ceil(fontSize * 1.2)
  }
  return { width, height }
}

/**
 * 同步版——OffscreenCanvas 渲染文字，保证每次都得到非 0 大小的画布
 */
function createAdaptiveTextImage(
  text,
  fontSize = 16,
  fontFamily = 'sans-serif',
  boundsPadding = 0,
) {
  // 1. 测量
  const { width: measuredW, height: measuredH } = measureTextSize(
    text,
    fontSize,
    fontFamily,
  )
  // 2. 确保至少有 1px 宽和 >= fontSize 高
  const w = Math.max(measuredW, 1)
  const h = Math.max(measuredH, fontSize)

  // 3. OffscreenCanvas (不会进 DOM)
  const off = new OffscreenCanvas(w, h)
  const ctx = off.getContext('2d')
  ctx.clearRect(0, 0, w, h)

  // 4. 绘制文字
  ctx.font = `${fontSize}px ${fontFamily}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'black'
  ctx.fillText(text, w / 2, h / 2)

  // 5. 交给 vrender，Canvas drawImage 时就不会是 0 大小了
  return createImage({
    image: off,
    x: 0,
    y: 0,
    width: w,
    height: h,
    boundsPadding,
  })
}

export const containerMap = {}
export const getCheckbox = (column: Column) => {
  let _this = column.getTable().columnsMap[column.getField()] //
  if (column.getField() == 'checkboxField') {
    //@ts-ignore
    _this = column.getTable().checkboxColumn
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
    let _length1 = table.rowCount - 1 //
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
    let obj = _this.table.getCellVisitConfig({
      ...args,
      column: _this,
      container,
    })
    _this.table.onCellVisible(obj) //
    // _this.table.onCellVisible({
    //   field: _this.getField(),
    //   record,
    //   row,
    //   _col: col,
    //   updateFn, //
    //   container,
    //   rowCount: count + 400, //
    //   fieldFormat: _this.getFormat(),
    // })

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
    const record = table.getCellOriginRecord(col, row)
    if (_this.table.useCache == true) {
      let _index = record._index //
      let f = _this.getField()
      let _con = _this.table.getCacheContainer(_index, f)
      if (_con != null) {
        return {
          rootContainer: _con,
          renderDefault: true, //
        }
      } //
    }
    let obj = _this.table.getCellVisitConfig({
      ...args,
      column: _this,
      container,
    })
    _this.table.onCellVisible(obj) //

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
          const { height, width } = rect ?? table.getCellRect(col, row)
          _con.setAttribute('width', width) //
        } else {
        }
        return {
          rootContainer: _con,
          renderDefault: false, //
        } //
      }
    }
    record = record || {} //
    let bg = _this.getIndexColor(row, record) //
    if (record?._index == _this.table.tableData?.curRow?._index) {
      bg = _this.getCurrentRowColor()
    }
    let { height, width } = rect ?? table.getCellRect(col, row)
    let _height = height
    // let _length1 = t1.records.length
    let _length1 = t1.rowCount - 1 //
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

    let obj123 = _this.table.getCellVisitConfig({
      ...args,
      column: _this,
      container,
    })
    let _v = _table.onCellVisible(obj123)
    _value = _v //
    container.on('mouseenter', () => {
      let oldColor = container.attribute.background
      container._oldColor = oldColor
      container.setAttribute('background', _this.getHoverColor()) ///
    })
    container.on('mouseout', () => {
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

    let _width1 = getLocalStrWidth(_this, _value)
    container.templateTextWidth = _width1 //
    container.templateText = _value //
    /* 
    
    */
    let _g = createGroup({
      width: width,
      height,
      x: 0,
      y: 0,
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      overflow: 'hidden',
      boundsPadding: [0, 0, 0, 0],
      // scaleX: 10,
      scrollX: 10,
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
    let _text = createTextArr(_this, _value, globalValue)
    _g.add(_text)
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
    container['currentRowIndex'] = row //
    let isTree = _this.getIsTree()
    let treeIcon = null
    if (isTree == true) {
      let icon = getExpandIcon(_this, record, height, width) //
      treeIcon = icon
      _g.insertBefore(treeIcon, _text) //
    }
    return {
      rootContainer: container, //
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
      _rect.setAttribute('width', test1.clipedWidth) //
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
      _col: col,
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

export const getImageCustomLayout = (column: Column) => {
  let _this = column.getTable().columnsMap[column.getField()] //
  if (column.getField() == 'controllerField') {
    _this = column.table.controllerColumn //
  } //
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
    const record = table.getCellOriginRecord(col, row)
    if (_this.table.useCache == true) {
      let _index = record._index //
      let f = _this.getField()
      let _con = _this.table.getCacheContainer(_index, f)
      if (_con != null) {
        return {
          rootContainer: _con,
          renderDefault: true, //
        }
      } //
    }
    let obj = _this.table.getCellVisitConfig({
      ...args,
      column: _this,
      container,
    })
    _this.table.onCellVisible(obj) //
    let imageG = createGroup({
      height: height - 2,
      width: width - 2,
      x: 1,
      y: 1,
      display: 'flex',
      flexDirection: 'row', //
      alignItems: 'center',
      justifyContent: 'center',
    })
    imageG.isImage = true
    container.add(imageG)
    _this.table.onImageCellLoad({
      ...args,
      column: _this,
      container: imageG,
    })
    return {
      rootContainer: container,
      renderDefault: false, //
    }
  }
  return customLayout
}
