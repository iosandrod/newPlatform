import { Base } from '@ER/base'
import {
  nextTick,
  computed,
  customRef,
  h,
  shallowRef,
  triggerRef,
  toRaw,
} from 'vue'
import { Column } from './column'
import { CheckboxColumn } from './checkboxColumn' //
import {
  ColumnDefine,
  ListTable,
  ListTableConstructorOptions,
} from '@visactor/vtable'
import { VTable } from '@visactor/vue-vtable'
import { method } from 'lodash'
import { exportVTableToExcel } from '@visactor/vtable-export'
import _ from 'lodash'
import * as equal from '@/packages/utils/equal'
import { BaseTableConstructorOptions } from '@visactor/vtable/es/ts-types/base-table'
import { BMenu } from '@/buttonGroup/bMenu'
import {
  //
  checkbox_state_change,
  checkboxChange,
  click_cell,
  contextmenu_cell,
  icon_click,
  scroll,
  selected_cell,
  sort_click,
} from './tableEvent'
import workerpool from 'workerpool'
import { SortState } from 'element-plus'
import { combineAdjacentEqualElements } from '@ER/utils'
import { VxeInputEvents, VxeInputProps } from 'vxe-table'
import { VxeInputEventProps } from 'vxe-pc-ui'
import { Dropdown } from '@/menu/dropdown'
import { useRunAfter, useTimeout } from '@ER/utils/decoration'
import { calculate } from './calculate'
//@ts-ignore
// import WorkerURL from './calculate?url&worker'
// const pool = workerpool.pool(WorkerURL, {
//   maxWorkers: 10,
//   workerOpts: {
//     // type: 'module', //
//     type: import.meta.env.PROD ? undefined : 'module',
//     // By default, Vite uses a module worker in dev mode, which can cause your application to fail. Therefore, we need to use a module worker in dev mode and a classic worker in prod mode.
//   },
// }) //
// const tablePool = pool.pool()
export class Table extends Base {
  isCheckAll = false
  currentFilterColumn: Column
  updateTimeout?: any
  checkboxColumn: Column //
  globalConfig = {
    value: '', //
    show: false, //
  }
  templateProps = {
    columns: [],
    data: [],
  }
  timeout: {
    [key: string]: any
  } = {}
  columnFilterConfig: {
    x: number
    y: number
    width: number
    filterConfig: Array<{
      field: string
      indexArr: Array<any> //
    }>
  } = {
    x: 0,
    y: 0,
    width: 0,
    filterConfig: [],
  }
  dataMap = {}
  updateIndexArr = new Set() //
  effectPool = shallowRef({})
  clickOpt = 1
  permission: { [key: string]: boolean } = {
    loadData: true,
    canChangecheckbox: true, //
  }
  isDesign = false //
  columns: Column[] = []
  columnsMap: { [key: string]: Column } = {}
  config: any
  scrollConfig = shallowRef({
    rowStart: 0,
    rowEnd: 0,
    colStart: 0,
    colEnd: 0,
  })
  eventManager: {
    [key: string]: Array<{
      callback?: Function
      timeout?: number //
      _timeout?: any //
    }>
  } = shallowRef({}) as any
  instance: ListTable
  tableData = {
    data: [],
    showData: [], //
    curRow: null,
  }
  setCurRow(row) {
    this.tableData.curRow = row //
    this.updateCanvas() //
  }
  getCurRow() {
    return this.tableData.curRow //
  }
  getCurrentSelectRow() {
    let select = this.getInstance().getSelectedCellInfos()
    let data = select
      .map((item) => {
        return item[0].originData
      })
      .filter((item) => item != null)
    return data
  }

  cacheMethod: {
    [key: string]: { before?: Array<any>; after?: Array<any> }
  } = {}
  staticCacheMethod: {
    [key: string]: { before?: Array<any>; after?: Array<any> }
  } = {}
  tableConfig: ListTableConstructorOptions = {
    select: {
      highlightMode: 'row',
      disableDragSelect: true,
    },
  }
  sortCache: SortState[] = []
  selectCache: any = {} //
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
    this.setData(data)
    this.setColumns(columns) //
    this.initSortState()
    this.initCheckboxColumn()
    this.initGlobalSearch()
  }
  initCheckboxColumn() {
    let _col = new CheckboxColumn({ field: 'checkboxField' }, this) //
    this.checkboxColumn = _col
  }
  initGlobalSearch() {
    let config = this.config
    let show = config.showGlobalSearch
    if (show == true) {
      this.globalConfig.show = true ////
    }
  }
  setData(data) {
    data.forEach((e) => {
      if (e['_index'] == null) {
        e._index = this.uuid()
        this.dataMap[e._index] = e
      }
      if (e['_shtml'] == null) {
        let _v = Object.entries(e).reduce((res, [k, v]) => {
          if (k === '_index') return res //
          res += `${v}  ^^^`
          return res
        }, '')
        e['_shtml'] = _v
      }
    }) ////
    this.tableData.data = data
  }
  getTableName() {}
  updateOptions(opt: BaseTableConstructorOptions) {
    let instance = this.getInstance() //
    if (instance != null) {
      const oldOptions = instance.options
      _.merge(oldOptions, opt) //
      instance.updateOption(oldOptions) //
    }
  }
  getListTableOption() {}
  render() {
    const rootDiv = this.getRef('root')
    const rect = rootDiv.getBoundingClientRect()
    const { width, height } = rect
    let _instance = this.instance
    if (_instance != null) {
      //
      return
    }
    let _this = this
    let showRowSeriesNumber = this.config.showRowSeriesNumber
    let _sConfig: ColumnDefine = null
    if (showRowSeriesNumber) {
      _sConfig = {
        style: (config) => {
          const table = config.table
          let record = table.getRecordByCell(config.col, config.row)
          let obj = {}
          if (record == _this.tableData.curRow) {
            //@ts-ignore
            obj.bgColor = 'RGB(200, 190, 230)'
          }
          return obj
        },
        disableColumnResize: true, //
        width: 120, ////
      } as ColumnDefine
    }
    let table = new ListTable({
      multipleSort: true,
      sortState: [],
      defaultRowHeight: 30,
      defaultHeaderRowHeight: 30, //
      container: rootDiv,
      select: {
        highlightMode: 'row',
        headerSelectMode: 'cell', //
        highlightInRange: true, //
        disableHeaderSelect: true,
        outsideClickDeselect: false, //
        blankAreaClickDeselect: false, //
      },
      rowSeriesNumber: _sConfig as any, //
      editCellTrigger: 'click',
      customConfig: {
        createReactContainer: true, //
      },
      //头部的
    }) //
    table.on('drag_select_end', (config) => {})
    const emitEventArr = [
      'icon_click', //
      'contextmenu_cell',
      'sort_click',
      'selected_cell',
      'scroll',
      'click_cell',
      'checkbox_state_change',
    ]
    emitEventArr.forEach((item) => {
      //@ts-ignore//
      table.on(item, (config) => {
        this.emit(item, config)
      })
    })
    const instance = shallowRef(table)
    //@ts-ignore
    this.instance = instance ////
    // const serchCom=new SearchComponent({

    // })
    this.initEventListener() //
    this.loadColumns()
    this.loadData()
    nextTick(() => {
      let record = this.instance.records[0]
      if (record == null) {
        return
      } //
      this.setCurRow(record) //
      this.scrollToRow({ row: record })
      this.updateCanvas() //
    })
  }
  @useTimeout({
    number: 100, //
    key: 'updateColumns',
  })
  updateColumns() {
    let _columns = this.templateProps.columns || []
    let instance = this.getInstance()
    instance.updateColumns(_columns) //
  }
  @useTimeout({
    number: 100, //
    key: 'updateRecords',
  }) //
  updateRecords() {
    let tableIns = this
    let _arr = []
    let _iArr = []
    let records = tableIns.getInstance().records
    for (const k of tableIns.updateIndexArr.keys()) {
      //@ts-ignore
      let record = tableIns.dataMap[k]
      let index = records.indexOf(record)
      if (index != -1) {
        _arr.push(record)
        _iArr.push(index)
      }
    }
    tableIns.updateIndexArr.clear() //
    if (_arr.length != 0) {
      tableIns.getInstance().updateRecords(_arr, _iArr) //
    }
  }
  setSortState(config) {
    if (!Array.isArray(config)) {
      return
    }
    this.sortCache = config //
  }
  initSortState() {
    let columns = this.getColumns().map((col) => {
      return col.createSort()
    })
    // this.sortCache = columns
  }
  emit(name, ...args) {
    let eventManager = this.eventManager
    let callbacks = eventManager[name]
    if (callbacks == null) {
      return
    }
    for (const cConfig of callbacks) {
      let callback = cConfig.callback
      let timeout = cConfig.timeout
      if (timeout != null && typeof timeout === 'number') {
        // @ts-ignore
        cConfig._args = [...args]
        if (cConfig._timeout == null) {
          cConfig._timeout = setTimeout(() => {
            //@ts-ignore
            let _args = cConfig._args || [] //
            try {
              callback(..._args)
              cConfig._timeout = null ////
              //@ts-ignore
              cConfig._args = null
            } catch (error) {
              cConfig._timeout = null
              //@ts-ignore
              cConfig._args = null //
              console.error(error, `error,错误事件:${name}`)
            }
          }, timeout) //
        } else {
          //
          //@ts-ignore
        } //
      } else {
        //
        callback(...args)
      }
    }
    const config = this.config
    let event = config[name]
    if (typeof event == 'function') {
      event(...args) //
    }
  }
  copyCurrentCell() {
    const instance = this.getInstance()
    let select = instance.getSelectedCellInfos()
    let data = select.map((item) => {
      return item[0].originData
    })
    let realColumns = this.columns //
    let columns = select
      .map((item) => {
        let allField = item.map((item) => item.field)
        return allField
      })
      .flat()
      .filter((item, index, arr) => {
        return arr.indexOf(item) === index
      })
      .map((item) => {
        return realColumns.find((column) => column.getField() === item)
      })
    console.log(data, columns, 'testColumns') //
  }
  getArrBySelect() {
    let records = this.getInstance().records
  }
  registerEvent(
    config: {
      keyName?: string
      name: string //
      callback: Function
      timeout?: number
    } = {} as any,
  ) {
    let eventManager = this.eventManager
    let name = config.name
    let eventName = name
    let callback = config.callback //
    if (
      callback == null ||
      eventName == null ||
      typeof callback !== 'function'
    ) {
      return
    }
    let callbacks = eventManager[eventName]
    if (callbacks == null) {
      callbacks = []
      eventManager[eventName] = callbacks
    }
    if (config.keyName != null) {
      //@ts-ignore
      let configIndex = callbacks.findIndex(
        //@ts-ignore
        (item) => item.keyName == config.keyName,
      )
      if (config != null) {
        callbacks.splice(configIndex, 1, config) //
      }
    } else {
      callbacks.push(config) //
    }
  }
  initEventListener() {
    scroll(this) //
    click_cell(this) //
    selected_cell(this)
    contextmenu_cell(this) //
    sort_click(this) //
    icon_click(this) //
    checkbox_state_change(this)
    checkboxChange(this) //
  }

  setCurTableSelect() {}
  openContextMenu(config) {
    //
    console.log(config, 'test_config') //
    const event: PointerEvent = config.event
    let x = event.x
    let y = event.y
    let contextmenu: BMenu = this.getRef('contextmenu')
    contextmenu.open(event) //
  }
  getColumns() {
    const columns = this.columns //
    let _cols = columns.map((col) => {
      return col //
    })
    return _cols //
  }
  getFlatColumns(): Column[] {
    const columns = this.columns
      .map((col) => {
        return col.getSubColumns()
      })
      .flat() //
    return columns
  }
  getOptions() {
    let templateProps = this.templateProps
    return {
      ...templateProps,
      select: {
        highlightMode: 'row',
        disableDragSelect: true,
      },
    } as ListTableConstructorOptions //
  }
  getShowData() {
    let data = this.getData().map((row) => row) ////
    return data //
  }
  getShowColumns() {
    let columns = this.getColumns()
    let _cols = columns.filter((col) => {
      return col.getIsShow()
    })
    let _col1 = _cols.map((col) => {
      return col.getColumnProps()
    })
    let _show = this.config.showCheckboxColumn
    if (_show) {
      let cCol = this.checkboxColumn
      _col1.unshift(cCol.getColumnProps())
    }
    return _col1 ////
  }
  getData() {
    let tableData = this.tableData
    let data = tableData.data || []
    return data ////
  }
  getDefaultWidth() {
    return 100
  }
  setColumns(columns) {
    this.columns.splice(0) //
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
      let columns = this.getShowColumns()
      this.templateProps.columns = columns //
    } catch (error) {
      //
      console.log('加载列出错了')
    }
  }
  loadData(loadConfig?: any) {
    //
    let data = this.getShowData() //
    let sortState = this.sortCache
    let _data = data
    let _data1 = toRaw(_data)
    let _sortState = toRaw(sortState)
    let globalValue = this.globalConfig.value
    let _filterConfig = toRaw(this.columnFilterConfig.filterConfig)
    let instance = this.getInstance() //
    if (instance == null) {
      return
    }
    if (globalValue.length > 0) {
      _data1 = _data1.filter((v) => {
        let _shtml = v['_shtml'] //
        let reg = new RegExp(globalValue, 'g') //
        if (reg.test(_shtml)) {
          return true
        }
        return false
      })
    }
    const sortconfig = _sortState //自定义的排序配置
    //@ts-ignore
    const _sortConfig = sortconfig?.sort((s1, s2) => {
      //@ts-ignore
      return 0 //
    })
    let _data3 = _sortConfig
      ?.reduce((res, item, i) => {
        const field = item.field
        const type = item.type
        let order = item.order
        // debugger//
        const colType: string = 'number' //类型//
        const _data4 = combineAdjacentEqualElements(
          res, //
          field,
          i, //
          // colType,
          // type,
          type,
          order,
        )
        return _data4
      }, _data1)
      .flat(sortconfig?.length)

    if (_filterConfig.length > 0) {
      for (const { field, indexArr } of _filterConfig) {
        if (indexArr?.length > 0) {
          const indexSet = new Set(indexArr)
          _data3 = _data3.filter((item) => indexSet.has(item[field]))
        }
      }
    }
    this.templateProps.data = _data3
    //@ts-ignore
    nextTick(() => {
      //
      this.updateCanvas() ////
    })
  }
  scrollToRow(sConfig) {
    if (sConfig == null) {
      return
    }
    let row = sConfig.row
    let instance = this.getInstance()
    if (instance == null) {
      return
    }
    let records = instance.records
    let index = records.findIndex((item) => {
      return item == row
    })
    if (index == -1) {
      return
    }
    instance.scrollToRow(index) //
  }
  async runBefore(config?: any) {}
  //@ts-ignore
  getAfterMethod(name: string, _static = false) {
    if (_static) {
      let staticCacheMethod = this.staticCacheMethod
      let method = staticCacheMethod[name] || {}
      let after = method.after || []
      return after
    }
    let cacheMethod = this.cacheMethod
    let method = cacheMethod[name] || {}
    let after = method.after || []
    return after
  }
  clearAfter(name: string) {
    let cacheMethod = this.cacheMethod
    let method = cacheMethod[name] || {}
    method.after = []
  }
  runAfter(config?: any) {
    if (config == null) {
      return
    }
    let methodName = config.methodName //
    let after = this.getAfterMethod(methodName)
    for (const fn of after) {
      fn(config) //
    }
    this.clearAfter(methodName) //
    let staticAfter = this.getAfterMethod(methodName, true)
    for (const fn of staticAfter) {
      fn(config)
    } //
  }
  getRunMethod(getConfig: any) {
    if (getConfig == null) {
      return null
    }
  }
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
    _arr.forEach((item) => {
      let _index = item._index
      if (_index == null) {
        item._index = this.uuid()
        this.dataMap[item._index] = item //
      } //
      if (item['_shtml'] == null) {
        let _v = Object.entries(item).reduce((res, [k, v]) => {
          res += `${v}  ^^^`
          return res
        }, '')
        item['_shtml'] = _v //
      }
    })
    for (const row of _arr) {
      this.addRow(row)
    }
    let data = this.getData()
    let lastD = data[data.length - 1]
    this.setCurRow(lastD)
    this.addAfterMethod({
      methodName: 'updateCanvas', //
      fn: async () => {
        this.scrollToRow({
          row: lastD,
        }) ////
      },
    })
  }
  addBeforeMethod(config) {
    config.type = 'before'
    this.addMethod(config)
  }
  onUnmounted(): void {
    super.onUnmounted()
    let instance = this.getInstance()
    if (instance == null) {
      return
    }
    let columns = this.columns
    columns.forEach((item) => {})
    instance.release()
    this.instance = null //
  }
  @useRunAfter()
  @useTimeout({ number: 50, key: 'updateTimeout' }) //
  updateCanvas() {
    let data = this.templateProps.data //
    let instance = this.getInstance() //
    if (instance == null) {
      return
    }
    let records = data || instance.records //
    let d = Date.now().toString()
    console.time(d)
    instance.setRecords(records) //////
    console.timeEnd(d) //
  }
  addAfterMethod(config) {
    config.type = 'after'
    this.addMethod(config)
  }
  addMethod(config) {
    if (config == null) {
      return //
    }
    let cacheMethod = this.cacheMethod
    let methodName = config.methodName
    let type = config.type
    let obj = cacheMethod[methodName]
    let fn = config.fn
    if (['before', 'after'].indexOf(type) == -1) {
      return
    }
    if (obj == null) {
      obj = {
        before: [],
        after: [],
      }
      let arr = obj[type] //
      cacheMethod[methodName] = obj
      arr.push(fn) //
      return
    }
    let arr = obj[type]
    arr.push(fn) //
  }
  getGlobalSearchProps(): any {
    let _this = this
    let changeFn = _.debounce((config: any) => {
      let value = config.value
      _this.updateGlobalSerach(value)
    }, 200) //
    let obj: VxeInputEventProps & VxeInputProps = {
      onChange: changeFn,
    }
    return obj //
  }
  updateGlobalSerach(value: any) {
    console.log(value, 'isChageValue') //
    if (value == this.globalConfig.value) {
      return
    }
    this.globalConfig.value = value
  }
  showGlobalSearch(status = true) {
    if (status) {
      this.globalConfig.show = true //
    } else {
      this.globalConfig.show = false
    }
  }
  openColumnFilter(config) {
    let col = config.col
    let row = config.row
    let ins = this.getInstance()
    let field: string = ins.getBodyField(col, row) as any
    let tColumn = this.getFlatColumns().find((col) => col.getField() == field)
    let width = tColumn.getColumnWidth()
    this.columnFilterConfig.width = width + 60 //
    let event = config.event
    let client = event.client
    let x = client.x
    let y = client.y
    let oldColumnFilter = this.currentFilterColumn
    this.currentFilterColumn = tColumn //
    this.columnFilterConfig.x = x
    this.columnFilterConfig.y = y //
    const pulldownMenu: Dropdown = this.getRef('columnDropdown')
    if (pulldownMenu == null) {
      return
    }
    this.permission.canCloseColumnFilter = false
    if (this.timeout['closeColumnFilter']) {
      clearTimeout(this.timeout['closeColumnFilter'])
      this.timeout['closeColumnFilter'] = null
    } //
    this.timeout['closeColumnFilter'] = setTimeout(() => {
      this.permission.canCloseColumnFilter = true
    }, 200)
    nextTick(() => {
      pulldownMenu.showDropdown() //
      nextTick(() => {
        const filterTable: Table = this.getRef('columnFilterTable')
        let _config = [tColumn].map((col) => {
          return col.config
        })
        let _data = this.getInstance().records //
        if (oldColumnFilter != null && oldColumnFilter === tColumn) {
          return //
        }
        let _data1 = [
          ..._data.map((row) => {
            let obj = {
              [field]: row[field], //
              _value: row[field],
            }
            return obj //
          }),
        ]
        console.log(_data1, '_data1') //
        _config = _.cloneDeep(_config) //
        filterTable.setColumns(_config) ////
        filterTable.setData(_data1) //
      })
    })
  } //
  addRow(row: any) {
    let data = this.getData()
    data.push(row) //
  }
  delCurRow() {
    let curRow = this.tableData.curRow
    let showData = this.getData() //
    let index = showData.indexOf(curRow) //
    if (index == -1) {
      return
    }
    showData.splice(index, 1) //
    nextTick(() => {
      let _row = showData[index]
      if (_row == null) {
        _row = showData[index - 1]
        if (_row == null) {
          return
        }
      }
      this.setCurRow(_row) //
    })
  }
  updateCheckboxAll(e) {
    let _this = this ////
    _this.isCheckAll = e
    this.updateCheckboxField(this.getShowRecords(), _this.isCheckAll) //
  }
  getShowRecords() {
    //
    let instance = this.getInstance()
    let records = instance.records //
    return records
  }
  updateCheckboxField(rows, status = null) {
    if (!Array.isArray(rows)) {
      return
    } //
    rows.forEach((row) => {
      if (row == null) {
        return //
      }
      if (status != null) {
        row.checkboxField = status
      } else {
        row.checkboxField = !row.checkboxField //
      }
    }) //
    let resRow = this.getShowRecords()
    if (
      resRow.every((item) => {
        return item.checkboxField
      })
    ) {
      this.isCheckAll = true
    } else {
      this.isCheckAll = false //
    }
    let allCheck = this.getData().filter((item) => item.checkboxField)
    this.emit('checkboxChange', {
      allRows: allCheck,
      table: this,
      rows: rows, //
    })
  }
  updateFilterConfig(config) {
    let oldFilterConfig = this.columnFilterConfig.filterConfig
    let currentFilterColumn = this.currentFilterColumn
    if (currentFilterColumn == null) {
      return
    }
    let field = currentFilterColumn.getField()
    let _config = oldFilterConfig.find((item) => item.field == field)
    if (_config == null) {
      let _obj = {
        field: field,
        indexArr: [],
      }
      oldFilterConfig.push(_obj)
      _config = _obj
    }
    _config.indexArr = [] //
    let allCheck = config.allRows //
    allCheck.forEach((item) => {
      _config.indexArr.push(item._value) //
    })
    _config.indexArr = _config.indexArr.filter((item, index) => {
      return _config.indexArr.indexOf(item) === index //
    }) //去重
    this.columnFilterConfig.filterConfig = [...oldFilterConfig] //
  }
  resetFilterColumn(all = false) {
    let currentFilterColumn = this.currentFilterColumn
    if (currentFilterColumn == null) {
      return
    }
    let field = currentFilterColumn.getField()
    let oldFilterConfig = this.columnFilterConfig.filterConfig
    let _config = oldFilterConfig.find((item) => item.field == field)
    if (_config == null) {
      return
    }
    _config.indexArr = [] //
    this.columnFilterConfig.filterConfig = [...oldFilterConfig] ////
    console.log(_config, 'test_config') //
    if (all == true) {
      this.columnFilterConfig.filterConfig = [] //
    }
  }
}
//
