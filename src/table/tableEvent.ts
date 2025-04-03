import { SortState } from '@visactor/vtable/es/ts-types'
import { Table } from './table'
import _ from 'lodash'
export const scroll = (table: Table) => {
  let _this = table
  table.registerEvent({
    name: 'scroll',
    keyName: 'scroll',
    timeout: 100,
    callback: (config) => {
      let table = _this.getInstance() //
      let range = table.getBodyVisibleCellRange()
      const headerheight = table.columnHeaderLevelCount
      range.rowStart = range.rowStart - headerheight
      range.rowEnd = range.rowEnd - headerheight
      _.merge(_this.scrollConfig, range)
    },
  })
}

export const click_cell = (table: Table) => {
  let _this = table
  table.registerEvent({
    name: 'click_cell',
    keyName: 'click_cell',
    callback: (config) => {
      let originData = config.originData //
      if (originData == null) {
      } else {
        _this.tableData.curRow = originData //
      }//
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
    /*************  ✨ Codeium Command ⭐  *************/
    /**
     * @description callback function for selected_cell event
     * @param {Object} config selected cell info
     * @property {number} config.rowIndex row index of the selected cell
     * @property {number} config.colIndex column index of the selected cell
     * @property {Object} config.originData data of the selected cell
     */
    /******  c7bab0cf-2004-46d1-b998-305d6ee7ad02  *******/
    callback: (config) => {
      _this.selectCache = config
    },
  })
}

export const sort_click = (table: Table) => {
  const _this = table
  table.registerEvent({
    name: 'sort_click',
    keyName: 'sort_click',
    callback: (config) => {
      //   console.log(config, 'testConfig') //
      let { field, order } = config //
      let obj: SortState = {
        field,
        // order: 'desc', //
        orderFn: () => {
          return -1
        },
      }
      //@ts-ignore
      _this.getInstance().updateSortState(obj) //
    },
  })
}
