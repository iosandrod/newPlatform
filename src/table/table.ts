import { Base } from '@ER/base'
import { nextTick, computed, customRef, h, shallowRef, triggerRef } from 'vue'
import { Column } from './column'
import { ListTable, ListTableConstructorOptions } from '@visactor/vtable'
import { VTable } from '@visactor/vue-vtable'
import { method } from 'lodash'
import _ from 'lodash'
export class Table extends Base {
  isDesign = false //
  columns: Column[] = []
  columnsMap: { [key: string]: Column } = {}
  config: any
  scrollConfig = {
    rowStart: 0,
    rowEnd: 0,
    colStart: 0,
    colEnd: 0, //
  }
  instance: ListTable
  tableData = {
    data: [],
    showData: [],
  }
  tableConfig = {}
  templateProps: any = {}
  hooksManager: { [key: string]: Array<any> } = {}
  constructor(config) {
    super()
    this.config = config
    this.init() ////
  }
  init() {
    super.init() //
    let config = this.config
    let columns = config.columns || []
    let data = config.data || []
    this.tableData.data = data
    this.setColumns(columns) //
  }
  getTableName() {}
  render() {
    const rootDiv = this.getRef('root')
    let _instance = this.instance
    if (_instance != null) {
      //
      return
    }
    let table = new ListTable({
      container: rootDiv,
    })
    table.on('scroll', (config) => {
      nextTick(() => {
        let range = table.getBodyVisibleCellRange() //
        const headerheight = table.columnHeaderLevelCount
        range.rowStart = range.rowStart - headerheight
        range.rowEnd = range.rowEnd - headerheight //
        _.merge(this.scrollConfig, range) //
      })
    })
    const instance = shallowRef(table)
    //@ts-ignore
    this.instance = instance //
    this.loadColumns()
    this.loadData()
  }
  getColumns() {
    const columns = this.columns
    let _cols = columns.map((col) => {
      return col.getColumnProps()
    })
    return _cols //
  }
  getOptions() {
    let tempalteProps = this.templateProps
    return {
      ...tempalteProps,
      customConfig: {
        createReactContainer: true,
      },
      clearDOM: true,
    } as ListTableConstructorOptions //
  }
  getShowData() {
    let data = this.getData()
    let _data = data.map((d) => {
      return { ...d }
    })
    let instance = this.getInstance()
    let _columns = this.getShowColumns() //
    if (instance == null) {
      return
    }
    return _data
  }
  getShowColumns() {
    let columns = this.columns
    let _cols = columns.filter((col) => {
      return col.getIsShow()
    })
    return _cols
  }
  getData() {
    let tableData = this.tableData
    let data = tableData.data
    return data //
  }
  getDefaultWidth() {
    return 100
  }
  setColumns(columns) {
    this.columns.splice(0)
    for (const col of columns) {
      this.addColumn(col) //
    }
  }
  addColumn(config) {
    let col = new Column(config, this)
    const field = col.getField()
    this.columnsMap[field] = col
    this.columns.push(col)
  }
  loadColumns() {
    try {
      let columns = this.getColumns()
      let instance = this.getInstance()
      instance.updateColumns(columns)
    } catch (error) {
      console.log('加载列出错了')
    }
  }
  // loadColumns() {
  //   let _cols = this.getColumns()
  //   this.templateProps.columns = _cols
  // }
  loadData(loadConfig?: any) {
    try {
      let data = this.getShowData() //
      let _data1 = data
      this.templateProps.records = _data1 //
      let instance = this.getInstance() //
      if (instance == null) {
        return
      }
      console.log('load data 111') //
      instance.setRecords(_data1) //
    } catch (error) {
      console.log('出错了') //
    }
  }
  async runBefore(config?: any) {}
  async runAfter(config?: any) {}
  registerHooks(hConfig?: any) {}
  getInstance() {
    let instance = this.instance
    if (instance == null) {
      return null
    }
    return instance
  }
  setMergeConfig(config?: any) {}
  addRows(rowsConfig?: { rows?: Array<any> }) {
    let rows = rowsConfig.rows || []
    if (rows == null) {
      return
    }
    let _arr = rows
    if (!Array.isArray(rows)) {
      _arr = [rows]
    } else {
      if (rows.length == 0) {
        return
      }
    }
    for (const row of _arr) {
      this.addRow(row)
    }
  }
  addRow(row: any) {
    let data = this.getData()
    data.push(row) //
  }
}
