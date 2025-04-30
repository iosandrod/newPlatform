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
  mousedown_cell,
  mouseenter_cell,
  mouseleave_cell,
  resize_column,
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
import { createFooterTheme, createTheme } from './tableTheme' //
import tableCom from './tableCom'
import { createGroup } from '@visactor/vtable/es/vrender'
export class Table extends Base {
  curContextRow: any = null
  isHeaderContext: boolean = false
  contextItems: any[] = []
  disableColumnResize = true //
  tableState: 'edit' | 'scan' = 'edit'
  templateEditCell: { col?: number; row?: number; value?: any } = {}
  currentResizeField: string
  fatherScrollNum = 0
  childScrollNum = 0
  footerInstance: ListTable
  showFooter = false
  showCustomLayout = true //
  isCheckAll = false
  globalRowSet = new Set()
  currentFilterColumn: Column
  updateTimeout?: any
  checkboxColumn: Column //
  globalConfig = {
    value: '', ////
    show: true, //
  }
  validateMap: { [key: string]: any[] } = {}
  templateProps = {
    footerColumns: [],
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
  scrollConfig = ({
    rowStart: 0,
    rowEnd: 0,
    colStart: 0,
    colEnd: 0,
  })
  currentIndexContain = shallowRef({}) as any
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
  setTableState(state: 'edit' | 'scan') {
    if (['edit', 'scan'].includes(state)) this.tableState = state //
  }
  @useRunAfter()
  @useTimeout({ number: 30, key: 'setCurRow' }) ////
  setCurRow(row, isDb = false) {
    let oldCurRow = this.tableData.curRow || {}
    if (toRaw(row) == toRaw(this.tableData.curRow)) return //
    this.tableData.curRow = row //
    let oldIndex = oldCurRow._index || '' //
    let newIndex = row._index || ''
    this.timeout['updateRecords__now'] = true
    this.updateIndexArr.add(oldIndex) //
    this.updateIndexArr.add(newIndex) //
    // let instance = this.getInstance()
    // let _index1 = instance.records.findIndex(
    //   (r) => r['_index'] == row['_index'],
    // )
    // let _index2 = instance.records.findIndex(
    //   (r) => r['_index'] == oldCurRow['_index'],
    // )
    // let id = this.uuid()
    // console.time(id)
    // let bodyIndex = instance.getTableIndexByRecordIndex(_index1)
    // let bodyIndex1 = instance.getTableIndexByRecordIndex(_index2)
    // // console.log(bodyIndex, bodyIndex1) //
    // // let _cell=instance.getCellInfo(null,bodyIndex)
    // // let cells = instance.getAllCells(null, bodyIndex)
    // // let cell1 = instance.getAllCells(null, bodyIndex1)
    // // console.log(cells) //
    // console.timeEnd(id) //
  } //
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
    //@ts-ignore
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
    this.initCurrentContextItems() //
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
      this.initDataRow(e)
    })
    this.tableData.data = data
  }
  getTableName() { }
  updateOptions(opt: BaseTableConstructorOptions) {
    let instance = this.getInstance() //
    if (instance != null) {
      const oldOptions = instance.options
      _.merge(oldOptions, opt) //
      instance.updateOption(oldOptions) //
    }
  }
  getListTableOption() { }
  createInstance(rootDiv) {
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
        width: this.getSerialNumberWidth(), //
      } as ColumnDefine
    }
    let table = new ListTable({
      padding: {},
      // multipleSort: true,
      sortState: [],
      theme: createTheme() as any,
      defaultRowHeight: 30,
      heightMode: 'standard', //
      defaultHeaderRowHeight: 40, //
      container: rootDiv, //
      editCellTrigger: 'api',
      select: {
        highlightMode: 'cell',
        headerSelectMode: 'cell', //
        highlightInRange: true, //
        disableHeaderSelect: true,
        outsideClickDeselect: false, //
        blankAreaClickDeselect: false, //
      },
      tooltip: {
        isShowOverflowTextTooltip: true, //
      },
      rowSeriesNumber: _sConfig as any, //
      // editCellTrigger: 'click',
      customConfig: {
        createReactContainer: true, //
      },
      //头部的
    }) //
    // table.on('le', (config) => {})
    const emitEventArr = [
      'mouseleave_cell',
      'mouseenter_cell',
      'mousedown_cell',
      'resize_column',
      'icon_click', //
      'contextmenu_cell',
      'sort_click',
      'selected_cell',
      'scroll',
      'click_cell',
      'checkbox_state_change',
      'dblclick_cell',
      'resize_column',
    ]
    emitEventArr.forEach((item) => {
      //@ts-ignore//
      table.on(item, (config) => {
        this.emit(item, config)
      })
    })
    const instance = shallowRef(table)
    //@ts-ignore
    this.instance = instance
    this.initEventListener() //
    this.loadColumns()
    this.loadData()
    this.setCurRow(this.templateProps.data[0])
  }
  createFooterInstance(rootDiv) {
    if (rootDiv == null) {
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
        width: this.getSerialNumberWidth(),
        customLayout: (args) => {
          let g = createGroup({})
          return {
            rootContainer: g,
            renderDefault: false,
          }
        },
      } as ColumnDefine
    }
    let table = new ListTable({
      autoFillHeight: true,
      multipleSort: true,
      sortState: [],
      defaultRowHeight: 30,
      heightMode: 'standard', //
      defaultHeaderRowHeight: 50, //
      container: rootDiv,
      select: {
        highlightMode: 'cell', //
        headerSelectMode: 'cell', //
        highlightInRange: true, //
        disableHeaderSelect: true,
        outsideClickDeselect: false, //
        blankAreaClickDeselect: false, //
      },
      theme: createFooterTheme() as any, ////
      rowSeriesNumber: _sConfig as any, //
      editCellTrigger: 'click',
      customConfig: {
        createReactContainer: true, //
      },
      //头部的
    }) //
    const instance = shallowRef(table)
    table.on('scroll', (config) => {
      _this.childScrollNum = Date.now() ////
      let sub = _this.childScrollNum - _this.fatherScrollNum
      if (sub > 0) {
        let scrollLeft = config.scrollLeft
        _this.getInstance().setScrollLeft(scrollLeft) //
      }
    })
    //@ts-ignore
    this.footerInstance = instance ////
    this.loadFooterColumn()
  }
  getSerialNumberWidth() {
    return 140
  }
  getLastFlatColumns(cols: any[] = this.columns): Column[] {
    return cols
      .map((col) => {
        let columns = col.columns || []
        if (columns.length > 0) {
          return this.getLastFlatColumns(columns).flat()
        }
        return [col]
      })
      .flat()
  }
  getFooterShowColumns() {
    let columns = this.getColumns()
    let _cols = columns.filter((col) => {
      return col.getIsShow()
    })
    let _col1 = _cols.map((col) => {
      return col.getFooterColumnProps()
    })
    let _show = this.config.showCheckboxColumn
    if (_show) {
      let cCol = this.checkboxColumn
      _col1.unshift(cCol.getFooterColumnProps()) ////
    }
    return _col1 ////
  }
  loadFooterColumn() {
    try {
      let columns = this.getFooterShowColumns()
      columns = this.getLastFlatColumns(columns) //
      this.templateProps.footerColumns = columns
    } catch (error) {
      console.error(error) //
    }
  }
  render() {
    console.log('我渲染了') //
    const rootDiv = this.getRef('root')
    let footDiv = this.getRef('footerDiv')
    let _instance = this.instance
    if (_instance != null) {
    } else {
      this.createInstance(rootDiv)
    }
    let footerInstance = this.footerInstance
    if (footerInstance != null) {
    } else {
      this.createFooterInstance(footDiv) //
    }
  }
  @useTimeout({
    number: 100, //
    key: 'updateColumns',
  })
  updateColumns() {
    let _columns = this.templateProps.columns || [] //
    let instance = this.getInstance()
    instance.updateColumns(_columns) //
  }
  @useTimeout({
    number: 100, //
    key: 'updateFooterColumns',
  })
  updateFooterColumns() {
    let _columns = this.templateProps.footerColumns || []
    let instance = this.getFooterInstance()
    if (instance == null) {
      return //
    }
    instance.updateColumns(_columns) ////
  }
  @useTimeout({
    number: 200, ////
    key: 'updateRecords',
  }) //
  updateRecords() {
    let uuid = this.uuid()
    let tableIns = this
    let _arr = []
    let _iArr = []
    let records = tableIns.getInstance().records
    let keys = tableIns.updateIndexArr.keys()
    let _iArr1 = []
    for (const k of keys) {
      //@ts-ignore
      let record = tableIns.dataMap[k]
      let index = records.indexOf(record)
      if (index != -1) {
        _arr.push(record)
        _iArr.push(index)
        _iArr1.push(k)
      }
    }
    tableIns.updateIndexArr.clear() //
    if (_arr.length != 0) {
      console.time(uuid)//
      let ins = toRaw(tableIns.getInstance())
      let currentIndexContain = this.currentIndexContain
      let updateKeys = Object.keys(currentIndexContain)//
      // console.log(_iArr1)//
      let _keys = updateKeys.filter(key => {//
        return _iArr1.includes(key)
      })
      let allContain = _keys.map(key => {
        return currentIndexContain[key]
      })
      let allRowIndex = Object.entries(currentIndexContain).map(([keys, value]) => {
        let _value = Object.values(value).map(row => row['currentRowIndex'])
        return _value.filter((v, i) => _value.indexOf(v) == i)//
      })
      if (allContain.length == 0) {
        console.log('点击不生效')//
        console.log(this)//
      }
      allContain.forEach(cArr => {
        let Arr = Object.values(cArr)
        Arr.forEach((c: any) => {
          c.updateCanvas()//
        })
      })
      nextTick(() => {
        let _select = ins.getSelectedCellRanges()
        ins.selectCells(_select)//
      })
      // ins.changeCellValue(0, 0, '')//
      console.timeEnd(uuid) //
    }
  }
  updateCheckboxRecords() {
    let ins = this.getInstance()
    // ins.setCellCheckboxState('')
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
    mousedown_cell(this) //
    scroll(this) //
    click_cell(this) //
    selected_cell(this)
    contextmenu_cell(this) //
    sort_click(this) //
    icon_click(this) //
    checkbox_state_change(this)
    checkboxChange(this) //
    resize_column(this)
    mouseenter_cell(this)
    mouseleave_cell(this)
  }
  initCurrentContextItems() {
    let items = [
      {
        label: '复制',
        key: 'copy',
        visible: true,
      },
      {
        label: '删除',
        key: 'delete',
        visible: () => {
          let isHeaderContext = this.isHeaderContext //
          if (isHeaderContext) {
            return false
          }
          return true
        },
      },
      {
        label: '编辑',
        key: 'edit',
        disabled: () => {
          return true
        },
        visible: () => {
          let isHeaderContext = this.isHeaderContext //
          if (isHeaderContext) {
            return false
          }
          return true //
        },
      },
      {
        label: '全局查询',
        key: 'globalQuery',
        disabled: false, //
        visible: true,
        fn: () => {
          //
          this.showGlobalSearch(true) //
        },
      },
      {
        label: '设计当前列', //
        key: 'designColumn',
        disabled: false, //
        visible: true,
        fn: () => { },
      },
    ]
    this.contextItems = items
  }
  setCurTableSelect() { }
  openContextMenu(config) {
    let originData = config.originData
    if (originData == null) {
      this.isHeaderContext = true
      this.curContextRow = null
    } else {
      this.isHeaderContext = false
      this.curContextRow = originData
    }
    nextTick(() => {
      //
      const event: PointerEvent = config.event
      let contextmenu: BMenu = this.getRef('contextmenu')
      contextmenu.open(event) //
    })
  }
  getColumns() {
    const columns = this.columns //
    let _cols = columns.map((col) => {
      return col //
    }) //
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
      _col1.unshift(cCol.getColumnProps()) //
    }
    return _col1 ////
  }
  //返回bool//
  getShowCalColumns() {
    //
    let config = this.config
    let showCalculate = config.showCalculate
    return showCalculate
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
  } //
  loadData(loadConfig?: any) {
    console.log('数据发生了更新') //
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
        let reg = new RegExp(globalValue, 'gi') ////
        if (reg.test(_shtml)) {
          this.globalRowSet.add(v['_index'])
          return true
        }
        this.globalRowSet.delete(v['_index']) ////
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
      .flat(sortconfig?.length) //
    if (_filterConfig.length > 0) {
      for (const { field, indexArr } of _filterConfig) {
        if (indexArr?.length > 0) {
          const indexSet = new Set(indexArr)
          _data3 = _data3.filter((item) => indexSet.has(item[field]))
        }
      }
    }
    this.templateProps.data = _data3 //
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
    // debugger//
    let index = records.findIndex((item) => {
      return item == row
    })
    if (index == -1) {
      return
    }
    let scrollRange = this.scrollConfig.rowEnd - this.scrollConfig.rowStart
    this.scrollConfig.rowEnd = index//
    this.scrollConfig.rowStart = index - scrollRange
    if (this.scrollConfig.rowStart < 0) {
      this.scrollConfig.rowStart = 0
      this.scrollConfig.rowEnd = scrollRange//
    }
    console.log(this.scrollConfig)//
    instance.scrollToRow(index) //
  }
  async runBefore(config?: any) { }
  //@ts-ignore
  getRunMethod(getConfig: any) {
    if (getConfig == null) {
      return null
    }
  }
  registerHooks(hConfig?: any) { }
  getInstance() {
    let instance = this.instance
    if (instance == null) {
      return null
    }
    return instance
  }
  getFooterInstance() {
    let instance = this.footerInstance
    if (instance == null) {
      return null
    }
    return instance //
  }
  setMergeConfig(config?: any) { }
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
      item['_rowState'] = 'add' //
      this.initDataRow(item)
    })
    for (const row of _arr) {
      this.addRow(row)
    } //
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
    } else {
      let columns = this.columns
      columns.forEach((item) => { })
      instance.release()
      this.instance = null //
    }
    let footerInstance = this.footerInstance
    if (footerInstance == null) {
      return
    } else {
      footerInstance.release()
      this.footerInstance = null //
    } //
  }
  @useRunAfter()
  @useTimeout({ number: 50, key: 'updateTimeout' })
  updateCanvas() {
    let data = this.templateProps.data //
    let instance = this.getInstance() //
    if (instance == null) {
      return
    }
    let records = data || instance.records //
    let id = this.uuid()
    // console.log('视图用时') //
    console.time(id)
    instance.setRecords(records)
    console.timeEnd(id)
  }
  addAfterMethod(config) {
    config.type = 'after' //
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
      _this.updateGlobalSearch(value)
    }, 200) //
    let obj: VxeInputEventProps & VxeInputProps = {
      onChange: changeFn,
    }
    return obj //
  }
  updateGlobalSearch(value: any) {
    if (value == this.globalConfig.value) {
      return
    }
    this.globalConfig.value = value
    if (this.globalConfig.value.length > 0) {
      this.showCustomLayout = true
    } else {
      this.showCustomLayout = false //
    }
  }
  showGlobalSearch(status = true) {
    if (status) {
      this.globalConfig.show = true //
    } else {
      this.globalConfig.value = '' //
      this.globalConfig.show = false
    }
  }
  openColumnFilter(config) {
    // debugger//
    let ins = this.getInstance()
    let _col = ins.getColAt(config.canvas.x)
    let _row = ins.getRowAt(config.canvas.y)
    let col = _col.col
    let row = _row.row //
    let field: string = ins.getBodyField(col, row) as any
    let tColumn = this.getFlatColumns().find((col) => col.getField() == field)
    let width = tColumn.getColumnWidth()
    this.columnFilterConfig.width = width + 60 //
    // let event = config.event
    let client = config.client
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
  getDisableColumnResize() {
    let config = this.config
    let disableColumnResize = config.disableColumnResize
    if (disableColumnResize == null) {
      return this.disableColumnResize
    }
    return disableColumnResize
  }
  updateCheckboxAll(e) {
    let _this = this ////
    _this.isCheckAll = e
    this.updateCheckboxField(this.getShowRecords(), _this.isCheckAll) //
  }
  getShowRecords() {
    let instance = this.getInstance()
    let records = instance.records //
    return records
  }
  updateCheckboxField(rows, status = null) {
    if (!Array.isArray(rows)) {
      return
    } //
    rows.forEach((row) => {
      let oldStatus = row.checkboxField
      if (row == null) {
        return //
      }
      if (status != null) {
        row.checkboxField = status
      } else {
        row.checkboxField = !row.checkboxField //
      }
      if (oldStatus != row.checkboxField) {
        this.updateIndexArr.add(row._index) //
      }
    }) //
    let resRow = this.getShowRecords()
    if (
      resRow.every((item) => {
        return item.checkboxField
      })
    ) {
      this.isCheckAll = true //
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
  jumpToSearchNext(pre = false) {
    //
    let ins = this.getInstance() //
    let select = ins.getSelectedCellInfos()
    let globalValue = this.globalConfig.value
    if (globalValue.length == 0) {
      return //
    }
    let records = this.getShowRecords()
    let field = null
    let rowIndex = null
    if (select.length == 0) {
      if (pre == true) {
        for (let i = records.length - 1; i >= 0; i--) {
          let row = records[i]
          let _value = Object.entries(row).find(([key, value]) => {
            if (
              key != '_index' &&
              key != '_shtml' &&
              typeof value != 'boolean' &&
              typeof value != 'object'
            ) {
              let reg = new RegExp(globalValue, 'gi')
              let _value1 = `${value}` //
              return reg.test(_value1) //
            }
          })
          if (_value != null) {
            field = _value[0]
            rowIndex = i
            break
          }
        }
      } else {
        for (let i = 0; i < records.length; i++) {
          let row = records[i]
          let _value = Object.entries(row).find(([key, value]) => {
            if (
              key != '_index' &&
              key != '_shtml' &&
              typeof value != 'boolean' &&
              typeof value != 'object'
            ) {
              let reg = new RegExp(globalValue, 'gi')
              let _value1 = `${value}` //
              return reg.test(_value1) //
            }
          })
          if (_value != null) {
            field = _value[0]
            rowIndex = i
            break
          }
        }
      }
    } else {
      let _d = select[0][0]
      let _field = _d.field //
      let originData = select[0][0].originData
      let index = records.findIndex((item) => item == originData)
      if (pre == true) {
        for (let i = index; i >= 0; i--) {
          let row = records[i]
          let _value = Object.entries(row).find((item) => {
            let [key, value] = item
            if (
              key != '_index' &&
              key != '_shtml' &&
              typeof value != 'boolean' &&
              typeof value != 'object'
            ) {
              let reg = new RegExp(globalValue, 'gi')
              let _value1 = `${value}` //
              let status = reg.test(_value1) //
              if (i == index) {
                let allCols = this.templateProps.columns
                let lastAllField = allCols.findIndex(
                  (item) => item.field == _field, //
                )
                let lastFields = allCols //
                  .slice(lastAllField + 1) //
                  .map((item) => item.field)
                if (!lastFields.includes(key)) {
                  status = false //
                }
              }
              return status
            }
          }) //
          if (_value != null) {
            field = _value[0]
            rowIndex = i
            break
          }
        }
      } else {
        for (let i = index; i < records.length; i++) {
          let row = records[i]
          let _value = Object.entries(row).find((item) => {
            let [key, value] = item
            if (
              key != '_index' &&
              key != '_shtml' &&
              typeof value != 'boolean' &&
              typeof value != 'object'
            ) {
              let reg = new RegExp(globalValue, 'gi')
              let _value1 = `${value}` //
              let status = reg.test(_value1) //
              if (i == index) {
                let allCols = this.templateProps.columns
                let lastAllField = allCols.findIndex(
                  (item) => item.field == _field, //
                )
                let lastFields = allCols //
                  .slice(lastAllField + 1) //
                  .map((item) => item.field)
                if (!lastFields.includes(key)) {
                  status = false //
                }
              }
              return status
            }
          }) //
          if (_value != null) {
            field = _value[0]
            rowIndex = i
            break
          }
        }
      }
    }
    if (field == null || rowIndex == null) {
      return
    }
    let addr = ins.getCellAddrByFieldRecord(field, rowIndex) //
    ins.selectCell(addr.col, addr.row) //
  }
  getCurrentVisibleRecords() {
    let ins = this.getInstance() //
    let currentScrollRecords = ins.getBodyVisibleRowRange()
    let records = ins.records
    let startIndex = records.findIndex((item) => item == records[0])
    let subIndex = currentScrollRecords.rowEnd - currentScrollRecords.rowStart
    let showArr = records.slice(startIndex, startIndex + subIndex)
    return showArr //
  }
  resetHeight() {
    let ins = this.getInstance() //
    let outDiv = this.getRef('outDiv')
    let rect = outDiv.getBoundingClientRect()
    let height = rect.height //
    ins.canvasHeight = height //
  }
  getFooterDivStyle() {
    let showFooter = this.showFooter
    let columnHeight = this.getInstance()
  }
  getCurrentResizeCol(col: number, tCol = null, i = 0) {
    // debugger //
    let ins = this.getInstance()
    let field = ins.getHeaderField(col, i)
    let tf = null
    if (tCol == null) {
      let _c = this.getFlatColumns().find((col) => {
        let f = col.getField()
        if (f == field) {
          return true
        }
      })
      tf = _c
      if (tf?.columns?.length > 0) {
        return this.getCurrentResizeCol(col, tf, i + 1)
      } //
    } else {
      let _columns = tCol.columns || []
      if (_columns.length == 0) {
        tf = tCol
      } else {
        tf = _columns.find((col) => {
          let f = col.getField()
          if (f == field) {
            return true
          }
        })
        if (tf == null) {
          return null
        }
        return this.getCurrentResizeCol(col, tf, i + 1)
      }
    }
    return tf //
  }
  startEditCell(col, row, value) {
    this.templateEditCell = { col: col, row: row, value: value }
    let ins = this.getInstance()
    ins.startEditCell(col, row, value) //
  }
  clearEditCell() {
    //
    this.templateEditCell = null //
    let ins = this.getInstance()
    ins.completeEditCell() ////
  }
  getCurrentCellEdit() {
    let ins = this.getInstance()
    if (
      this.templateEditCell?.row == null ||
      this.templateEditCell?.col == null
    ) {
      return null
    }
    let edit = ins.getEditor(
      this.templateEditCell.col,
      this.templateEditCell.row,
    ) //
    return edit
  }
  exportToExcel() {
    //
  }
  showTableTopTool(showConfig: { row: number; col: number; content: string }) {
    let ins = this.getInstance()
    let rect = ins.getVisibleCellRangeRelativeRect(showConfig)
    ins.showTooltip(showConfig.col, showConfig.row, {
      content: showConfig.content,
      referencePosition: { rect, placement: VTable.TYPES.Placement.top }, //TODO
      className: 'defineTooltip',
      disappearDelay: 100,
      style: {
        bgColor: 'black', //
        color: 'white',
        //@ts-ignore
        font: 'normal bold normal 14px/1 STKaiti',
        arrowMark: true,
      },
    })
  }
  clearValidate() {
    if (Object.keys(this.validateMap).length == 0) {
      return //
    }
    this.validateMap = {} //
    this.updateCanvas() //
  }
  async validateData(config) { }
  blur() {
    nextTick(() => {
      this.clearValidate()
      this.clearEditCell() //
    })
  }
  showErrorTopTool(showConfig: { row: number; col: number; content: string }) { }
  getIsEditTable() {
    let editType = this.tableState
    if (editType == 'edit') {
      return true
    }
    return false
  }
  copyCurrentSelectCells() { }
  headerSortClick(config: any) {
    let sortState = this.sortCache
    let hasSort = sortState.findIndex((s) => s.field == config.field) //
    if (hasSort != -1) {
      sortState.splice(hasSort, 1)
      let newState = [...sortState]
      this.setSortState(newState) //
      return
    }
    sortState.push(config) //
    let newState = [...sortState]
    this.setSortState(newState)
  }
  initDataRow(row) {
    let e = row
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
    let rowState = e['_rowState'] //
    if (rowState == null) {
      e['_rowState'] = 'unChange'
    } //
  }
  designCurrentColumn() { }
  getCacheContain(row) { }
  setEventMap(map = {}) {
    Object.entries(map).forEach(([key, value]) => {
      let _callback = value['callback']
      if (typeof _callback == 'function') {
        this.registerEvent({
          keyName: key,
          name: key,
          callback: (...args) => { },
        })
      }
    })
  }
}

