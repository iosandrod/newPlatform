import { VTable } from '@visactor/vue-vtable'
import { Column } from './column'
import { toRaw } from 'vue'
import { CheckBox, createGroup } from '@visactor/vtable/es/vrender'

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
    container.on('mouseover', () => {
      // let oldColor = container.attribute.background
      // container._oldColor = oldColor
      // container.setAttribute('background', _this.getHoverColor()) ///
    })
    container.on('mouseout', () => {
      // let color = container._oldColor
      // if (record == _this.table.tableData.curRow) {
      //   color = _this.getCurrentRowColor() //
      // }//
      // container.setAttribute('background', color) ////
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
    let checkbox1 = new CheckBox({
      text: {
        text: '', //
      },
      disabled: false, //
      checked: _c, //
      boundsPadding: [0, 0, 0, 0],
    }) //
    checkbox1.render()
    checkboxGroup.add(checkbox1)

    let _index = record['_index'] ////
    let _table = _this.table //
    let scrollConfig = _table.getInstance().getBodyVisibleRowRange() ////
    let rowStart = scrollConfig.rowStart
    let rowEnd = scrollConfig.rowEnd
    let _row = row
    container['currentRowIndex'] = row //
    container['updateCanvas'] = () => {
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
      // console.log(record, c, 'record') ////
      checkbox1.attribute.checked = Boolean(c) //
      checkbox1.render() //
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
      let field = _this.getField()
      _arr[field] = container //
    } else {
      let currentIndexContain = _table.currentIndexContain //
      delete currentIndexContain[_index] //
    }

    return {
      rootContainer: container,
      // renderDefault: _isTree, //
      renderDefault: false, //
    }
  }
  return customLayout
}
