import { SortState } from '@visactor/vtable/es/ts-types'
import { Table } from './table'
import _ from 'lodash'
import { nextTick, toRaw } from 'vue' //
import * as VTable from '@visactor/vtable'
import { RangeType } from '@visactor/vtable/es/vrender'
import { CellRange } from '@visactor/vtable-export/es/util/type'
import { Column } from './column'
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
      _this.fatherScrollNum = Date.now()
      let childScrollNum = _this.childScrollNum
      let sub = childScrollNum - _this.fatherScrollNum
      if (sub < 0) {
        let scrollLeft = config.scrollLeft
        let ins = _this.getFooterInstance()
        if (ins != null) {
          ins.setScrollLeft(scrollLeft) //
        } //
      }
      let range = table.getBodyVisibleCellRange()
      let _range = table.getBodyVisibleRowRange()
      if (range != null) {
        const headerheight = table.columnHeaderLevelCount
        range.rowStart = range.rowStart - headerheight
        range.rowEnd = range.rowEnd - headerheight
        _.merge(_this.scrollConfig, range)
      }//
      _this.onScroll(config) //
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
    callback: async (config) => {
      table.isContainerClick = true
      // console.log(, 'testBtn') //
      let controBtn = _this.currentClickButton
      if (controBtn) {
        nextTick(() => {
          _this.runControllBtn({ ...config, button: controBtn })
        })
      }
      setTimeout(() => {
        table.isContainerClick = false
      }, 0)
      let isTreeIconClick = table.isTreeIconClick
      if (isTreeIconClick) {
        table.openTreeRow({ col: config.col, row: config.row }) //
      }
      let field = config.field //
      let originData = config.originData //
      let tCol = table.getLastFlatColumns().find((col) => {
        return col.getField() === field
      })

      if (tCol != null && table.tableState == 'edit') {
        //
        table.clearEditCell()
        if (tCol.getIsEditField()) {
          // debugger //
          //是编辑的列数据//
          let curEdit = table.getCurrentCellEdit()
          if (curEdit != null) {
            table.clearEditCell() //
          }
          let p = new Promise((resolve, reject) => {
            setTimeout(() => {
              // debugger//
              if (originData == null) {
                resolve(true) //
                return
              }
              table.currentEditCol = tCol
              let s = _this.checkCanEditCell(
                config.col,
                config.row,
                config.value,
              ) //
              if (s == false) {
                resolve(false)
              }
              resolve(true)
            }, 50) //
          })
          let _p = await p
          if (_p == false) {
            table.setCurRow(originData) ////
          } else {
            if (originData == null) {
              return //
            } //
            table.startEditCell(config.col, config.row, config.value) //
          }
        } else {
          if (originData == null) {
            return //
          } else {
          }
          table.setCurRow(originData)
        }
        return //
      }
      if (field == 'checkboxField') {
      } //
      if (originData == null) {
      } else {
        let curEdit = table.getCurrentCellEdit()
        table.clearEditCell()
        table.setCurRow(originData) ////
        let type = tCol.getCustomType()
        if (type == 'photo') {
          table.showScreenPhoto(originData[field])
        }
      } //
    },
  })
  let ins = table.getInstance()

  table.registerEvent({
    name: 'dblclick_cell',
    keyName: 'dblclick_cell',
    callback: (config) => {
      if (config.originData == null) {
        let row = config.row
        let col = config.col
        let title = config.title
        table.clearEditCell()
        setTimeout(() => {
          table.startEditCell(col, row, title, true)
        }, 10)
      } else {
        table.onCellDblClick(config)
      }
    },
  })
}

export const contextmenu_cell = (table: Table) => {
  const _this = table
  table.registerEvent({
    name: 'contextmenu_cell',
    keyName: 'contextmenu_cell',
    callback: (config) => {
      _this.openContextMenu(config) //
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
      let _select = ins.getSelectedCellInfos() //
      _this.selectCache = config //
      _this.selectCacheCell = _select
      // console.log(config)//
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
          // table.updateCanvas() //
        }
        let targetCol = table.getFlatColumns().find((col) => {
          return col.getField() == field
        })
        if (targetCol == null) {
          return
        }
        let config = targetCol.config
        let enableSelect = config.enableSelect
        if (enableSelect == true) {
          let _start = start.row
          let _end = end.row
          if (_start > _end) {
            _start = end.row
            _end = start.row
          }
          let rArr = []
          for (let i = _start; i <= _end; i++) {
            let check = table.checkCanEditCell(start.col, i, null)
            if (check == false) {
              continue
            }
            let record = ins.getRecordByCell(start.col, i) //
            // record.checkboxField = !record.checkboxField
            rArr.push(record)
          }
          for (let row of rArr) {
            let oldValue = row[targetCol.getField()]
            let bool = Boolean(oldValue)
            let nv = null
            if (bool == true) {
              nv = 0
            } else {
              nv = 1
            }
            targetCol.updateBindValue({
              value: nv,
              field: targetCol.getField(),
              row,
            }) //
          }
        }
      }
    },
  })
}

export const sort_click = (table: Table) => {
  //
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
        _this.setSortState(_sortState) //
      })
    },
  })
}
//
export const checkbox_state_change = (table: Table) => {
  const _this = table
  table.registerEvent({
    name: 'checkbox_state_change',
    keyName: 'checkbox_state_change',
    callback: (config) => {
      nextTick(async () => {
        let originData = config.originData //
        if (originData == null) {
          //点击了上面的全选按钮
          return //
        } //
        if (table.permission.canChangecheckbox == false) {
          return //
        }

        if (config.field == 'checkboxField') {
          table.updateCheckboxField([originData]) ////
        } else {
          let _col = table.columns.find((col) => {
            let f = col.getField() //
            return config.field == f
          })
          let checked = config.checked //
          if (_col != null) {
            if (checked == true) {
              checked = 1
            } else {
              checked = 0 //
            }
            let _index = originData._index
            let row = config.row
            let col1 = config.col
            let canEdit = _this.checkCanEditCell(col1, row, checked)
            if (canEdit == false) {
              _this.timeout['updateRecords__now'] = true
              _this.updateIndexArr.add(_index)
              return
            }
            let s = await _col.updateBindValue({
              value: checked,
              row: originData,
              field: config.field, //
            })
            if (s == true) {
              originData['_rowState'] = 'change' //
            } //
          }
        }
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

export const resize_column = (table: Table) => {
  const _this = table
  table.registerEvent({
    name: 'resize_column',
    keyName: 'resize_column',
    callback: (config) => {
      _this.setUseCache(true) //
      let col = config.col //
      let _col: Column = table.getCurrentResizeCol(col)
      if (_col == null) {
        return //
      }
      let field = _col.getField() //
      table.currentResizeField = field //
      let fIns = table.getFooterInstance()
      if (fIns == null) {
        return
      }
      let fCol = fIns.getTableIndexByField(field) //
      let colWidth = config.colWidth
      fIns.setColWidth(fCol, colWidth) //
      let rowCols: Column = toRaw(_col)
      rowCols.config.width = colWidth //
    },
  })
  table.registerEvent({
    name: 'resize_column_end',
    keyName: 'resize_column_end',
    callback: (config) => {
      _this.setUseCache(false) //
      let _col = table.currentResizeField
      let _col1 = table.getFlatColumns().find((col) => {
        return col.getField() == _col
      })
      if (_col1 == null) {
        return
      } //
      let w = _col1.getColumnWidth()
      table.currentResizeField = null //
      table.onColumnResize({
        column: _col,
        width: w,
        originColumn: _col1.config, //
        tableName: table.getTableName(), //
      }) //
    },
  })
} //
export const mousedown_cell = (table: Table) => {
  const _this = table
  table.registerEvent({
    name: 'mousedown_cell',
    keyName: 'mousedown_cell',
    callback: (config) => {},
  })
}

export const mouseenter_cell = (table: Table) => {
  const _this = table
  table.registerEvent({
    name: 'mouseenter_cell',
    keyName: 'mouseenter_cell',
    callback: (config) => {
      let tableInstance = _this.getInstance()
      let args = config
      const { col, row, targetIcon } = args
      const rect = tableInstance.getVisibleCellRangeRelativeRect({ col, row })
      if (col == 0 && row == 0) {
        return //
      }
      let field = tableInstance.getBodyField(col, row)
      let record = tableInstance.getRecordByCell(col, row)
      let column = table.getFlatColumns().find((c) => c.getField() == field)
      let _index = record?._index
      if (_index == null) {
        return
      }
      let isShow = false
      if (table.getIsEditTable()) {
        let errMap = table.validateMap
        let errStr = errMap[_index]
        let _err = errStr?.find((row) => row.field == field)
        if (_err) {
          let fMes = _err.message || '数据校验失败' //
          tableInstance.showTooltip(col, row, {
            content: fMes,
            referencePosition: { rect, placement: VTable.TYPES.Placement.top }, //TODO
            className: 'defineTooltip',
            disappearDelay: 100,
            style: {
              bgColor: 'red',
              //@ts-ignore
              borderColor: 'red',
              color: 'white', //
              //@ts-ignore
              font: 'normal bold normal 14px/1 STKaiti',
              arrowMark: true,
            },
          })
          isShow = true
        }
      }
      if (isShow == true) {
        return
      }
      let container = _this.getCacheContainer(_index, field)
      if (container == null) {
        return
      }
      let templateTextWidth = container.templateTextWidth
      console.log(templateTextWidth, 'sdfsfs') //
      if (rect.width < templateTextWidth) {
        let templateText = container.templateText
        tableInstance.showTooltip(col, row, {
          content: templateText, //
          referencePosition: { rect, placement: VTable.TYPES.Placement.top }, //TODO
          style: {
            bgColor: 'black',
            //@ts-ignore
            borderColor: 'white', //
            color: 'white', //
            //@ts-ignore
            font: 'normal bold normal 14px/1 STKaiti',
            arrowMark: true,
          },
        })
      }
    },
  })
}

export const mouseleave_cell = (table: Table) => {
  const _this = table
  table.registerEvent({
    name: 'mouseleave_cell',
    keyName: 'mouseleave_cell',
    callback: (config) => {
      let layout = _this.getInstance().getCellInfo(config.col, config.row)
    },
  })
}
