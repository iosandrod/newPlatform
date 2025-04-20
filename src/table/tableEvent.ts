import { SortState } from '@visactor/vtable/es/ts-types'
import { Table } from './table'
import _ from 'lodash'
import { nextTick } from 'vue' //
import { RangeType } from '@visactor/vtable/es/vrender'
import { CellRange } from '@visactor/vtable-export/es/util/type'
export const scroll = (table: Table) => {
  let _this = table
  table.registerEvent({
    name: 'scroll',
    keyName: 'scroll',
    // timeout: 100, //设置了timeout//
    callback: (config) => {
      let table = _this.getInstance() //
      if (table == null) {
        return //
      }
      // console.log(Date.now(), '父级的')
      _this.fatherScrollNum = Date.now()
      let childScrollNum = _this.childScrollNum
      let sub = childScrollNum - _this.fatherScrollNum
      if (sub < 0) {
        let scrollLeft = config.scrollLeft
        _this.getFooterInstance().setScrollLeft(scrollLeft) //
      }
      let range = table.getBodyVisibleCellRange()
      if (range == null) return //
      const headerheight = table.columnHeaderLevelCount
      range.rowStart = range.rowStart - headerheight
      range.rowEnd = range.rowEnd - headerheight
      _.merge(_this.scrollConfig, range)
    },
  })
}
export const icon_click = (table: Table) => {
  let _this = table
  table.registerEvent({
    name: 'icon_click',
    keyName: 'icon_click',
    callback: (config) => {
      // console.log(config, 'is click icon')///
      let name = config.name
      if (name == 'filter') {
        //
        _this.openColumnFilter(config) //
      }
    },
  })
}
export const click_cell = (table: Table) => {
  let _this = table
  table.registerEvent({
    name: 'click_cell',
    keyName: 'click_cell',
    callback: (config) => {
      let field = config.field
      let originData = config.originData //
      if (field == 'checkboxField') {
      } //
      if (originData == null) {
      } else {
        table.setCurRow(originData) ////
      } //
    },
  })
  table.registerEvent({
    name: 'dblclick_cell',
    keyName: 'dblclick_cell',
    callback: (config) => {
      let field = config.field
      let originData = config.originData //
      if (field == 'checkboxField') {
      } //
      if (originData == null) {
      } else {
        table.setCurRow(originData, true) ////
      } //
    },
  })
}

export const contextmenu_cell = (table: Table) => {
  const _this = table
  table.registerEvent({
    name: 'contextmenu_cell',
    keyName: 'contextmenu_cell',
    callback: (config) => {
      _this.openContextMenu(config)
    },
  })
}

export const selected_cell = (table: Table) => {
  const _this = table
  table.registerEvent({
    name: 'selected_cell',
    keyName: 'selected_cell',
    callback: (config) => {
      let ranges: CellRange[] = config.ranges
      let ins = table.getInstance()
      let lastR = ranges.slice(-1)[0]
      let start = lastR.start //
      let end = lastR.end
      _this.selectCache = config //
      if (start.col == end.col) {
        let field = ins.getBodyField(start.col, start.row)
        let rArr = []
        if (field == 'checkboxField') {
          let _start = start.row
          let _end = end.row
          if (_start > _end) {
            _start = end.row
            _end = start.row
          }
          for (let i = _start; i <= _end; i++) {
            //
            let record = ins.getRecordByCell(start.col, i) //
            // record.checkboxField = !record.checkboxField
            rArr.push(record)
          }
          table.updateCheckboxField(rArr)
          //@ts-ignore
          table.permission.canChangecheckbox = false
          setTimeout(() => {
            //@ts-ignore
            table.permission.canChangecheckbox = true
          }, 0)
          table.updateCanvas() //
        }
      }
    },
  })
}

export const sort_click = (table: Table) => {
  const _this = table
  table.registerEvent({
    name: 'sort_click',
    keyName: 'sort_click',
    callback: (config) => {
      nextTick(() => {
        let instance = _this.getInstance()
        let sortState: SortState[] = instance.sortState as any //
        if (!Array.isArray(sortState)) {
          sortState = [] //
        }
        let columns = _this.getFlatColumns() //
        let _sortState = sortState.map((row) => {
          let obj = { field: row.field, order: row.order, type: null }
          let field = obj.field
          let tColType = columns
            .find((col) => {
              return col.getField() == field
            })
            ?.getColType()
          if (tColType == null) {
            return null
          }
          obj.type = tColType //
          return obj
        })
        // console.log(
        //   _sortState.map((row) => row.field),
        //   '_sortState',
        // ) ////
        _this.setSortState(_sortState) //
      })
    },
  })
}

export const checkbox_state_change = (table: Table) => {
  const _this = table
  table.registerEvent({
    name: 'checkbox_state_change',
    keyName: 'checkbox_state_change',
    callback: (config) => {
      nextTick(() => {
        let originData = config.originData //
        if (originData == null) {
          //点击了上面的全选按钮
          return //
        } //
        if (table.permission.canChangecheckbox == false) {
          return //
        }
        table.updateCheckboxField([originData]) ////
      })
    },
  })
}

export const checkboxChange = (table: Table) => {
  const _this = table
  table.registerEvent({
    name: 'checkboxChange',
    keyName: 'checkboxChange',
    callback: (config) => {},
  })
}
