import { Base } from '@ER/base'
import {
  nextTick,
  computed,
  customRef,
  h,
  shallowRef,
  triggerRef,
  toRaw,
  watch,
  isReactive,
  reactive,
  isProxy,
  ref,
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
import { createGroup, createText } from '@visactor/vtable/es/vrender'
import { SeriesNumberColumn } from './seriesNumberColumn'
import { initContextMenu } from './tableContext'
import { ControllerColumn } from './controllerColumn'
import { InputEditor } from './editor/string'
import { Row } from 'vant'
import { containerMap } from './columnFn'
export class Table extends Base {
  isTreeIconClick = false
  isDragHeader = false
  runClearSelect = false
  treeConfig: any = null
  scrollRowInteral: any
  scrollRowSpeed: number = 0
  scrollRowSpeed1: number = 0
  scrollColInteral: any
  scrollColSpeed: number = 0
  scrollColSpeed1: number = 0
  expandRowSet = new Set()
  mouseWatch: any
  leftFrozen?: any
  curContextCol?: Column
  frozenColCount = 0
  rightFrozenColCount = 0
  controllerColumn?: ControllerColumn //
  currentEditCol?: Column
  isContainerClick = false
  isFilterTable = false
  isMergeCell = true
  seriesNumberColumn: SeriesNumberColumn
  curContextRow: any = null
  isHeaderContext: boolean = false //
  contextItems: any[] = []
  disableColumnResize = true //
  tableState: 'edit' | 'scan' = 'edit' //
  templateEditCell: { col?: number; row?: number; value?: any }
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
  deleteArr = []
  globalConfig = {
    value: '', ////
    show: false, //
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
  scrollConfig = {
    rowStart: 0,
    rowEnd: 0,
    colStart: 0,
    colEnd: 0,
  }
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
    dbCurRow: null,
    data: [],
    showData: [], //
    curRow: null,
  }
  setTableState(state: 'edit' | 'scan') {
    //
    if (['edit', 'scan'].includes(state)) this.tableState = state //
  }
  @useTimeout({ number: 10, key: 'setCurRow' }) //
  setCurRow(row, isProps = false) {
    let oldCurRow = this.tableData.curRow || {}
    if (toRaw(row) == toRaw(this.tableData.curRow)) return //
    this.tableData.curRow = row //
    let oldIndex = oldCurRow._index || '' //
    let newIndex = row._index || ''
    this.timeout['updateRecords__now'] = true
    let tableName = this.getTableName()

    let onCurRowChange = this.config.onCurRowChange
    if (typeof onCurRowChange == 'function') {
      onCurRowChange({ row: row, oldRow: oldCurRow }) //
    }
    this.updateIndexArr.add(oldIndex)
    this.updateIndexArr.add(newIndex) //
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
    let data = config.data || [] //
    this.initTreeConfig()
    this.setData(data)
    this.setColumns(columns) //
    this.initSortState()
    this.initCheckboxColumn()
    this.initControllerColumn()
    this.initSeriesNumberColumn()
    this.initGlobalSearch()
    this.initCurrentContextItems() //
    this.initTableState()
  }
  initControllerColumn() {
    let _col = new ControllerColumn({}, this) //
    this.controllerColumn = _col
  }
  initTableState() {
    let config = this.config
    let state = config.tableState
    if (state) {
      this.setTableState(state)
    }
  }
  initCheckboxColumn() {
    let _col = new CheckboxColumn({ field: 'checkboxField' }, this) //
    this.checkboxColumn = _col
  }
  initSeriesNumberColumn() {
    let _col = new SeriesNumberColumn({ field: 'seriesNumber' }, this) //
    this.seriesNumberColumn = _col
  }
  initGlobalSearch() {
    let config = this.config
    let show = config.showGlobalSearch
    if (show == true) {
      this.globalConfig.show = true ////
    }
  }
  setData(data) {
    this.currentIndexContain = shallowRef({})
    let oldD = this.tableData.data
    let _d1 = this.getFlatTreeData(oldD)
    let dM = this.dataMap
    _d1.forEach((e) => {
      let _index = e['_index']
      delete dM[_index] //
    })
    data.forEach((e) => {
      this.initDataRow(e)
    })
    this.tableData.data = data
    let _row = this.config.curRow
    if (_row != null) {
      let _index = _row._index
      let _d = this.dataMap[_index]
      if (_d == null) {
        _row = null
      }
    } //
    if (_row == null) {
      _row = data[0]
    }
    if (_row == null) {
      return //
    }
    setTimeout(() => {
      let record = this.getInstance()?.records?.[0]
      if (record) {
        this.setCurRow(record) //
      }
    }, 800)
  }
  getTableName() {
    let tableName = this.config.tableName
    return tableName //
  }
  updateOptions(opt: BaseTableConstructorOptions) {
    let instance = this.getInstance() //
    if (instance != null) {
      const oldOptions = instance.options
      _.merge(oldOptions, opt)
      instance.updateOption(oldOptions)
      // instance.frozenBodyDomContainer
    }
  }
  getListTableOption() {}
  getShowSeriesNumber() {
    let config = this.config
    let showRowSeriesNumber = config.showRowSeriesNumber
    return showRowSeriesNumber
  }
  getDragMode() {
    let dOrder: any = {}
    let config = this.config
    let enableDragRow = config.enableDragRow
    if (enableDragRow) {
      dOrder.dragHeaderMode = 'row'
    }
    let enableDragColumn = config.enableDragColumn
    if (enableDragColumn) {
      dOrder.dragHeaderMode = 'column'
    }
    if (enableDragRow && enableDragColumn) {
      dOrder.dragHeaderMode = 'all' //
    }
    let dragFn = this.getDragFn()
    if (dOrder.dragHeaderMode != null) {
      dOrder.validateDragOrderOnEnd = dragFn
    } else {
      dOrder = null
    }
    return dOrder
  }
  getDragFn() {
    let fn = (start, end) => {
      let col1 = start.col
      let row1 = start.row
      let col2 = end.col
      let row2 = end.row
      if (col1 == col2 && col1 == 0) {
        let status = false
        //行拖动
        let dragRowFn = this.config.dragRowFn
        let ins = this.getInstance()
        let r1 = ins.getRecordByCell(col1, row1)
        let r2 = ins.getRecordByCell(col2, row2)
        if (typeof dragRowFn == 'function') {
          if (r1 != r2) {
            status = dragRowFn({
              startRow: r1,
              endRow: r2,
              table: this,
              treeConfig: this.treeConfig,
            }) ////
          }
        } else {
        }
        // let isTree = this.getIsTree()
        let isTree = true //
        if (isTree && status == true) {
          nextTick(() => {
            //
            let _pid = r1?.[this?.treeConfig?.parentId]
            this.swapTwoRow(r1, r2, _pid) //
          })
        }
        return status //
      }
      let f = this.getInstance().getHeaderField(col1, row1)
      let f1 = this.getInstance().getHeaderField(col2, row2)
      let f1C = this.getColumns().find((c) => c.getField() == f)
      let f2C = this.getColumns().find((c) => c.getField() == f1)
      if (f1C == f2C) {
        return false //
      }
      let isFrozen = f2C.getIsFrozen()
      let isFrozen1 = f1C.getIsFrozen()
      if (isFrozen || isFrozen1) {
        //
        return false
      }
      nextTick(() => {
        let fs = this.getInstance().columns.map((col, i) => {
          let obj = {
            field: col.field,
            order: i + 1,
          }
          return obj
        })
        this.changeSortOrder(fs as any) //
      })
      return true
    }
    return fn
  }
  createInstance(rootDiv) {
    let _this = this
    let showRowSeriesNumber = this.getShowSeriesNumber()
    let _sConfig: ColumnDefine = null
    if (showRowSeriesNumber) {
      _sConfig = this.seriesNumberColumn.getColumnProps() //
    }
    let dragMode = this.getDragMode()
    let table = new ListTable({
      dragOrder: dragMode, //
      frozenColCount: this.frozenColCount,
      padding: {},
      //ts-ignore
      headerEditor: (args) => {
        //
        let table = args.table
        let row = args.row
        let col = args.col
        let f = table.getHeaderField(col, row)
        let _col = this.columns.find((col) => col.getField() == f)
        if (_col == null) {
          return
        }
        return new InputEditor(() => _col) as any
      },
      customMergeCell: (col, row, table) => {
        if (1 == 1) {
          return null
        }
        if (col >= 5 && row >= 5 && col <= 7 && row <= 7) {
          let obj = {
            range: {
              start: {
                col: 5,
                row: 5,
              },
              end: {
                col: 7,
                row: 7,
              },
            },
            style: {
              bgColor: '#ccc',
            },
            customLayout: (args) => {
              const { table, row, col, rect, value } = args
              const { height, width } = rect
              let c = createGroup({
                height,
                width,
                background: 'RGB(236, 241, 245)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                stroke: 'RGB(30, 40, 60)',
              })
              let t = createText({
                text: '测试',
                fontSize: 16,
                fill: 'black',
                fontWeight: 'bold',
                boundsPadding: [0, 0, 0, 0],
                lineDashOffset: 0,
              })
              c.add(t) //
              return {
                rootContainer: c, //
                renderDefault: false, //
              }
            },
          }
          return obj //
        }
        return null
      },
      sortState: [],
      theme: createTheme() as any,
      // defaultRowHeight: this.getDefaultRowHeight(), //
      defaultRowHeight: this.getDefaultRowHeight(), //
      heightMode: 'standard', //
      defaultHeaderRowHeight: this.getDefaultHeaderRowHeight(), //
      container: rootDiv, //
      editCellTrigger: 'api',
      select: {
        highlightMode: 'cell',
        headerSelectMode: 'cell', //
        highlightInRange: true, //
        disableHeaderSelect: true,
        disableSelect: false,
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
    table.on('change_header_position_start', (e) => {
      let record = table.getRecordByCell(e.col, e.row)
      let isDragHeader = false
      if (record == null) {
        isDragHeader = false
      } //
      this.isDragHeader = isDragHeader
      this.startWatchSystemMouseConfig()
      if (isDragHeader) {
      } else {
      }
    })
    table.on('change_header_position', (e) => {
      this.endWatchSystemMouseConfig()
    })
    table.on('change_header_position_fail', () => {
      this.endWatchSystemMouseConfig() //
    }) //
    // table.on('change')
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
      'resize_column_end',
    ]
    // table.on('')
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
    // let _row = this.config.curRow
    // if (_row == null) {
    //   _row = this.templateProps.data[0]
    // }
    // this.setCurRow(_row) //
  }
  initTreeConfig() {
    let treeConfig = this.config.treeConfig || {}
    let id = treeConfig.id
    let parentId = treeConfig.parentId
    if (id == null || parentId == null) {
      return //
    }
    this.treeConfig = treeConfig //
  }
  createFooterInstance(rootDiv) {
    // if (1 == 1) {
    //   return //
    // }
    if (rootDiv == null) {
      return
    }
    let _this = this
    let showRowSeriesNumber = this.config.showRowSeriesNumber
    let _sConfig: ColumnDefine = null
    if (showRowSeriesNumber) {
      _sConfig = this.seriesNumberColumn.getColumnProps(true) //
    }
    let fListTable = ListTable
    let table = new fListTable({
      autoFillHeight: true,
      frozenColCount: this.frozenColCount,
      multipleSort: true, //
      sortState: [],
      defaultRowHeight: 30,
      heightMode: 'standard', //
      defaultHeaderRowHeight: this.getDefaultHeaderRowHeight(), //
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
    return 80
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
      return col.getFooterColumnProps() //
    })
    //显示check
    let _show = this.config.showCheckboxColumn

    let _show1 = this.getShowControllerColumn()
    let rfsCols = _col1.filter((c) => {
      let isFrozen = c.isFrozen
      return isFrozen == true //右边的
    })
    let lfsCols = _col1.filter((c) => {
      let isLeftFrozen = c.isLeftFrozen
      return isLeftFrozen == true //左边的
    })
    let sCols = _col1.filter((c) => {
      let s1 = lfsCols.includes(c)
      let s2 = rfsCols.includes(c)
      return !s1 && !s2
    })
    sCols.sort((c1, c2) => {
      let o1 = c1.order
      let o2 = c2.order
      return o1 - o2 //
    })
    _col1 = [...lfsCols, ...sCols, ...rfsCols]

    if (_show) {
      let cCol = this.checkboxColumn
      _col1.unshift(cCol.getFooterColumnProps())
    } //
    if (_show1 == true) {
      //
      let cCol = this.controllerColumn
      _col1.push(cCol.getFooterColumnProps())
    }
    return _col1
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
    nextTick(() => {
      let tree = this.getIsTree()
      if (tree == true) {
        let expandAll = this.config.expandAll
        if (expandAll == true) {
          this.expandAllTreeRow(true) //
        }
      }
    })
  }
  @useTimeout({
    number: 100, //
    key: 'updateColumns',
  })
  updateColumns() {
    let _columns = this.templateProps.columns || [] //
    let instance = this.getInstance()
    let n = Date.now().toString()
    console.time(n) //
    let fro = instance.options.frozenColCount
    let right = instance.options.rightFrozenColCount //
    let myFro = this.frozenColCount
    let showRowSeriesNumber = this.getShowSeriesNumber()
    if (showRowSeriesNumber) {
      myFro = myFro + 1 //
    }
    let myRight = this.rightFrozenColCount
    let footerInstance = this.getFooterInstance()
    if (myRight > 0 && myRight != right) {
      instance.options.rightFrozenColCount = myRight //
      if (footerInstance != null) {
        footerInstance.options.rightFrozenColCount = myRight
      }
    }
    if (myFro > 0 && myFro != fro) {
      instance.options.frozenColCount = myFro //
      if (footerInstance != null) {
        footerInstance.options.frozenColCount = myFro
      } //
    }
    instance.updateColumns(_columns) //
    let footerIns = this.getFooterInstance()
    console.timeEnd(n) //
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
  getTreeRecords(re?: any[]) {
    let ins = this.getInstance()
    let records = re || ins?.records || [] //
    let _arr = records.map((r) => {
      let children = r?.['children'] || []
      if (children && children.length > 0) {
        let _m = children
          .map((c) => {
            return this.getTreeRecords([c])
          })
          .flat()
        return [r, ..._m]
      }
      return [r] //
    })
    return _arr.flat()
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
    let records = this.getTreeRecords() //
    if (records == null) {
      return //
    }
    let keys = tableIns.updateIndexArr.keys()
    let _iArr1 = []
    for (const k of keys) {
      //
      //@ts-ignore
      let record = tableIns.dataMap[k]

      let index = records.indexOf(record)
      if (index != -1) {
        _arr.push(record)
        _iArr.push(index)
        _iArr1.push(k)
      }
    }
    // console.log(tableIns.dataMap, '更新的index') ////
    tableIns.updateIndexArr.clear() //
    if (_arr.length != 0) {
      console.time(uuid) //
      let currentIndexContain = containerMap[this.id] || {} //
      let updateKeys = Object.keys(currentIndexContain) //
      let _keys = updateKeys.filter((key) => {
        return _iArr1.includes(key)
      })
      let allContain = _keys.map((key) => {
        return currentIndexContain[key] //
      })

      if (this.getIsTree()) {
        // let c = this.instance.records
        // this.instance.setRecords(c) //
        // return
      }
      allContain.forEach((cArr) => {
        if (cArr == null) {
          return //
        }
        let Arr = Object.values(cArr)
        Arr.forEach((c: any) => {
          let updateFn = c.updateFn
          if (typeof updateFn == 'function') {
            updateFn() //
          }
        })
      })
      nextTick(() => {
        this.updateSelectRange()
      }) //
      // ins.changeCellValue(0, 0, '')//
      console.timeEnd(uuid) //
    }
  }
  getDragRow() {
    let config = this.config
    let enableDragRow = config.enableDragRow
    return enableDragRow
  }
  updateSelectRange() {
    let ins = this.getInstance() //
    let _id = this.uuid()
    console.time(_id) //
    let _select = ins.getSelectedCellRanges()
    let t = this.templateEditCell
    let t1 = this.runClearSelect
    console.log('渲染了') //
    ins.render() ////
    nextTick(() => {
      ins.render() //
    })
    if (t || t1) {
      this.runClearSelect = false //
      return
    } //
    // ins.selectCells(_select) //
    console.timeEnd(_id) //
    console.log('消耗时间') //
  }
  updateCheckboxRecords() {
    let ins = this.getInstance()
  }
  setSortState(config) {
    if (!Array.isArray(config)) {
      return
    }
    this.timeout['updateCanvas__now'] = true //
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
    initContextMenu(this) //
  } //
  setCurTableSelect() {}
  openContextMenu(config) {
    let originData = config.originData
    let field = config.field
    let _col = this.getColumns().find((col) => col.getField() == field)
    if (_col) {
      this.curContextCol = _col
    } else {
      this.curContextCol = null //
    }
    if (originData == null) {
      this.isHeaderContext = true
      this.curContextRow = null
    } else {
      this.isHeaderContext = false
      this.curContextRow = originData
    }
    const event: PointerEvent = config.event
    let contextmenu: BMenu = this.getRef('contextmenu')
    if (contextmenu == null) {
    } else {
      let showHeaderContext = this.config.showHeaderContext
      contextmenu.open(event) //
      if (showHeaderContext == false) {
      } else {
      }
    } //
    let onHeaderContextmenu = this.config.onHeaderContextmenu
    // if (
    //   typeof onHeaderContextmenu == 'function' &&
    //   this.isHeaderContext == true
    // ) {
    //   //
    //   onHeaderContextmenu({
    //     table: this,
    //     column: _col, //
    //     event: config.event, //
    //     config: config,
    //   }) //
    // }
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
  //重新渲染//
  getShowData() {
    let data = this.getData().map((row) => row) //
    return data //
  }
  getShowColumns() {
    let columns = this.getColumns()
    //是否显示
    let _cols = columns.filter((col) => {
      return col.getIsShow()
    }) //
    let _col1 = _cols.map((col) => {
      let _col = toRaw(col) //
      return _col.getColumnProps()
    })
    // if (1 == 1) {
    //   return _col1 //
    // }
    //显示check
    let _show = this.config.showCheckboxColumn
    let _show1 = this.getShowControllerColumn()
    let rfsCols = _col1.filter((c) => {
      let isFrozen = c.isFrozen
      return isFrozen == true //右边的
    })
    let lfsCols = _col1.filter((c) => {
      let isLeftFrozen = c.isLeftFrozen
      return isLeftFrozen == true //左边的
    })
    let sCols = _col1.filter((c) => {
      let s1 = lfsCols.includes(c)
      let s2 = rfsCols.includes(c)
      return !s1 && !s2
    })
    sCols.sort((c1, c2) => {
      let o1 = c1.order
      let o2 = c2.order
      return o1 - o2 //
    })
    _col1 = [...lfsCols, ...sCols, ...rfsCols]
    if (_show) {
      let cCol = this.checkboxColumn
      _col1.unshift(cCol.getColumnProps())
    } //
    let countCols = _col1.filter((col) => col.isFrozen) //这个右侧冻结的//
    let _countCols = _col1.filter((col) => col.isLeftFrozen) //这个左侧冻结的//
    let leftEndF = _countCols.slice(-1).pop()?.field
    //@ts-ignore
    this.leftFrozen = leftEndF
    let count = countCols.length
    let _count = _countCols.length
    if (_show1 == true) {
      let cCol = this.controllerColumn
      _col1.push(cCol.getColumnProps())
      count += 1 //
    }
    this.frozenColCount = _count
    this.rightFrozenColCount = count //
    // console.log('frozenColCount', _count, 'rightFrozenColCount', count) //
    return _col1 ////
  }
  //返回bool//
  getShowCalColumns() {
    //
    let config = this.config
    let showCalculate = config.showCalculate
    return showCalculate
  }
  getFlatTreeData(_data?: any, fn?: any): any[] {
    let data = _data || this.getData()
    return data
      .map((row) => {
        let children = row.children
        if (children && children?.length > 0) {
          return [row, ...this.getFlatTreeData(children)]
        }
        return [row]
      })
      .flat()
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
    } //
  }
  addColumn(config) {
    let col = new Column(config, this)
    const field = col.getField()
    this.columnsMap[field] = col
    this.columns.push(col)
  }
  getFrozenColCount() {
    return this.frozenColCount
  }
  getFrozenColCountRight() {
    return this.rightFrozenColCount //
  }
  loadColumns() {
    try {
      // console.log('load columns sdfjsldkfjsdlfsd') //
      let columns = this.getShowColumns()
      // columns = columns.map((col) => {
      //   return { field: col.field }
      // }) //
      this.templateProps.columns = columns //
    } catch (error) {
      console.log('加载列出错了')
    } //
  }

  filterTreeInPlace(nodes, predicate) {
    return nodes.filter((node) => {
      // 先把原始 children 备份到 _children
      if (node._children == null) {
        Object.defineProperty(node, '_children', {
          value: node.children,
          enumerable: false,
          writable: true,
        })
      } //
      // 递归过滤子节点
      if (Array.isArray(node._children)) {
        node.children = this.filterTreeInPlace(node._children, predicate)
      } else {
        node.children = []
      }
      // 如果节点自己匹配，或有匹配的子节点，则保留它
      return predicate(node) || (node.children && node.children.length > 0)
    })
  }
  loadData(loadConfig?: any) {
    let data = this.getShowData() //
    let _data = data
    let _data1 = toRaw(_data)
    let sortState = this.sortCache
    let _sortState = toRaw(sortState)
    let globalValue = this.globalConfig.value
    let _filterConfig = toRaw(this.columnFilterConfig.filterConfig)
    let instance = this.getInstance() //
    if (instance == null) {
      return
    }
    let isTree = this.getIsTree()
    if (isTree) {
      //
      let _data3 = this.filterTreeInPlace(_data1, (node) => {
        let status = true
        let globalValue = this.globalConfig.value
        //处理全局的
        if (globalValue?.length > 0) {
          let _shtml = node['_shtml'] //
          let reg = new RegExp(globalValue, 'gi') ////
          if (reg.test(_shtml)) {
            this.globalRowSet.add(node['_index'])
            status = true
          } else {
            status = false
          }
          this.globalRowSet.delete(node['_index']) ////
        }
        let _filterConfig = this.columnFilterConfig.filterConfig
        if (_filterConfig.length > 0) {
          for (const { field, indexArr } of _filterConfig) {
            if (indexArr?.length > 0) {
              let indexSet = new Set(indexArr) //
              status = false //
              if (indexSet.has(node[field])) {
                //
                status = true //
                break
              }
            }
          }
        }
        return status //
      }) //
      this.templateProps.data = _data3 //
    } else {
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
      } //
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
      } //
      this.templateProps.data = _data3 //
    }
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
    let scrollRange = this.scrollConfig.rowEnd - this.scrollConfig.rowStart
    this.scrollConfig.rowEnd = index //
    this.scrollConfig.rowStart = index - scrollRange
    if (this.scrollConfig.rowStart < 0) {
      this.scrollConfig.rowStart = 0
      this.scrollConfig.rowEnd = scrollRange //
    }
    instance.scrollToRow(index) //
  }
  async runBefore(config?: any) {}
  //@ts-ignore
  getRunMethod(getConfig: any) {
    if (getConfig == null) {
      return null
    }
  }
  registerHooks(hConfig?: any) {}
  getInstance() {
    let instance = this.instance
    if (isReactive(this)) {
      instance = instance
    } else {
      //@ts-ignore
      instance = instance?.value
    }
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
  setMergeConfig(config?: any) {}
  async addRows(rowsConfig?: { rows?: Array<any>; isProps?: any } | number) {
    if (typeof rowsConfig === 'number') {
      let _rows = Array(rowsConfig).fill(null)
      let _row1 = []
      for (const i of _rows) {
        let dValue = await this.getDefaultValue()
        _row1.push(dValue) //
      } //
      rowsConfig = { rows: _row1 }
    }
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
    // _arr = _arr.filter((item) => {
    //   return Boolean(item) != false
    // }) //
    _arr.forEach((item) => {
      if (item?._rowState == null) {
        Object.defineProperties(item, {
          _rowState: { value: 'add', enumerable: false, writable: true },
        })
      } //
      this.initDataRow(item)
    })
    if (rowsConfig?.isProps !== true) {
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
  }
  addBeforeMethod(config) {
    config.type = 'before'
    this.addMethod(config)
  }
  onUnmounted(): void {
    super.onUnmounted()
    this.endWatchSystemMouseConfig()

    let instance = this.getInstance()
    this.clearEditCell() //
    if (instance == null) {
      return
    } else {
      let columns = this.columns
      columns.forEach((item) => {
        item.onUnmounted() //
      })
      instance.release() //
      this.instance = null //
    }
    let footerInstance = this.footerInstance
    if (footerInstance == null) {
      return
    } else {
      footerInstance.release() //
      this.footerInstance = null //
    } //
    this.currentIndexContain = shallowRef({}) //
  }
  @useRunAfter()
  @useTimeout({ number: 300, key: 'updateTimeout' })
  updateCanvas() {
    let data = this.templateProps.data //
    let instance = this.getInstance() //
    if (instance == null) {
      return
    }
    let records = data || instance.records
    let id = this.uuid() //
    console.time(id)
    this.currentIndexContain = shallowRef({}) //
    console.log('更新了数据', records.length, 'dfjldskfjsdlfsdf') //
    instance.setRecords(records)
    console.timeEnd(id)
    console.log('视图更新时间') //
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
      // this.showCustomLayout = false //
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
    let _this = reactive(this)
    //
    let ins = _this.getInstance()
    let _col = ins.getColAt(config.canvas.x)
    let _row = ins.getRowAt(config.canvas.y)
    let col = _col.col
    let row = _row.row //
    let field: string = ins.getBodyField(col, row) as any
    let tColumn = _this.getFlatColumns().find((col) => col.getField() == field)
    let width = tColumn.getColumnWidth()
    _this.columnFilterConfig.width = width + 60 //
    if (_this.columnFilterConfig.width < 300) {
      _this.columnFilterConfig.width = 300 //
    }
    // let event = config.event
    let client = config.client
    let x = client.x
    let y = client.y
    let oldColumnFilter = _this.currentFilterColumn
    _this.currentFilterColumn = tColumn //
    _this.columnFilterConfig.x = x
    _this.columnFilterConfig.y = y //
    const pulldownMenu: Dropdown = _this.getRef('columnDropdown')
    if (pulldownMenu == null) {
      return
    }
    _this.permission.canCloseColumnFilter = false
    if (_this.timeout['closeColumnFilter']) {
      clearTimeout(this.timeout['closeColumnFilter'])
      _this.timeout['closeColumnFilter'] = null
    } //
    _this.timeout['closeColumnFilter'] = setTimeout(() => {
      _this.permission.canCloseColumnFilter = true
    }, 200)
    nextTick(() => {
      pulldownMenu.showDropdown() //
      nextTick(() => {
        const filterTable: Table = _this.getRef('columnFilterTable')
        let _config = [tColumn].map((col) => {
          return col.config
        })
        let _data = _this.getInstance().records
        let _d = _this.getFlatTreeData(_data) //
        _data = _d //
        if (oldColumnFilter != null && oldColumnFilter === tColumn) {
          return //
        }
        let _data1 = [
          //
          ..._data.map((row) => {
            let obj = {
              ...row, //
              [field]: row[field], //
              _value: row[field],
            }
            return obj //
          }),
        ]
        let _data2 = _data1.filter((item, i) => {
          let _value = item._value
          return _data1.findIndex((item1) => item1._value == _value) == i
        })
        _config = _.cloneDeep(_config) //
        let col0 = _config[0]
        if (width < 240) {
          col0.width = 240 //
        }
        if (filterTable == null) {
          return //
        }
        if (!filterTable.setColumns) {
          return //
        }
        filterTable.setColumns(_config) ////
        filterTable.setData(_data2) //
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
    let _r = showData.splice(index, 1) //
    this.changeRowState(_r[0], 'delete')
    this.deleteArr.push(_r[0]) //
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
    _this.isCheckAll = e //
    this.updateCheckboxField(this.getShowRecords(), _this.isCheckAll, true) //
  }
  getShowRecords() {
    let instance = this.getInstance()
    let records = instance.records //
    return records
  }

  updateCheckboxField(rows, status = null, isAllClick = false) {
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
      if (oldStatus != row.checkboxField && isAllClick == false) {
        this.updateIndexArr.add(row._index) //
      }
    }) //
    let resRow = this.getShowRecords()
    if (resRow.length > 0) {
      if (
        resRow.every((item) => {
          return item.checkboxField
        })
      ) {
        this.isCheckAll = true //
      } else {
        this.isCheckAll = false //
      }
    }
    let allCheck = this.getData().filter((item) => item.checkboxField)
    if (isAllClick == true) {
      this.updateCanvas() //
    } //
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
  getTargetColumn(col, row) {
    try {
      let ins = this.getInstance()
      let f = ins.getBodyField(col, row)
      let columns = this.getFlatColumns()
      let _col = columns.find((c) => {
        return c.getField() == f
      })
      return _col
    } catch (error) {
      console.log(row, col, '获取列出错') //
    }
  }
  checkCanEditCell(col, row, value) {
    let config = this.config
    let ins = this.getInstance()
    let beforeEditCell = config.onBeforeEditCell
    let tableState = this.tableState
    if (tableState == 'scan') {
      return false
    }
    if (typeof beforeEditCell == 'function') {
      let re = ins.getRecordByCell(col, row)
      let f: any = ins.getBodyField(col, row)
      value = value || re[f]
      let _status = beforeEditCell({
        row: re,
        field: f,
        value: value,
      })
      if (_status == false) {
        return false
      }
    }
  }
  startEditCell(col, row, value, isTitle = false) {
    // if (1 == 1) {
    //   return //
    // }
    try {
      if (col == null || row == null) {
        return //
      }
      let ins = this.getInstance() //
      let tCol = this.getTargetColumn(col, row)
      if (tCol.getEditType() == 'boolean' && isTitle == false) {
        //
        ins.clearSelected() //
        return
      }

      let _status = this.checkCanEditCell(col, row, value)
      if (_status == false) {
        if (isTitle == true) {
        } else {
          return
        }
      }
      this.templateEditCell = { col: col, row: row, value: value }
      ins.startEditCell(col, row, value) //
      ins.clearSelected() ////
    } catch (error) {
      console.error(error)
      console.log(row, col, '编辑报错') //
    }
  }
  clearEditCell() {
    let currentEditCol = this.currentEditCol
    let disableHideCell = currentEditCol?.disableHideCell
    if (disableHideCell == true) {
      return //
    }
    if (this.templateEditCell == null) {
      return //
    }
    let _templateEditCell = this.templateEditCell
    this.currentEditCol = null
    this.templateEditCell = null ////
    let ins = this.getInstance()
    ins.completeEditCell()
    this.runClearSelect = true
  }
  getCurrentCellEdit() {
    let ins = this.getInstance()
    if (
      this.templateEditCell?.row == null ||
      this.templateEditCell?.col == null
    ) {
      return null
    } //
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
  async validateData(config) {}

  blur() {
    nextTick(() => {
      this.clearValidate()
      // this.clearEditCell() //
    })
  }
  showErrorTopTool(showConfig: { row: number; col: number; content: string }) {}
  getIsEditTable() {
    let editType = this.tableState
    if (editType == 'edit') {
      return true
    }
    return false
  }
  copyCurrentSelectCells() {}
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
  initDataRow(row, i = 0) {
    let e = row
    if (e['_index'] == null) {
      let id = this.uuid()
      Object.defineProperty(e, '_index', {
        value: id, //
        enumerable: false,
        writable: true,
      })
      this.dataMap[e._index] = e
    }
    if (e['_shtml'] == null) {
      let _v = Object.entries(e).reduce((res, [k, v]) => {
        if (k === '_index') return res //
        res += `${v}  ^^^`
        return res
      }, '')
      Object.defineProperties(e, {
        _shtml: { value: _v, enumerable: false, writable: true },
      })
      // e['_shtml'] = _v
    }
    let rowState = e['_rowState'] //
    if (rowState == null) {
      Object.defineProperty(e, '_rowState', {
        value: 'unChange',
        enumerable: false,
        writable: true, //
      }) //
    }
    this.dataMap[e._index] = e //
    let children = e['children']
    if (i > 0) {
      Object.defineProperty(e, '_level', {
        value: i,
        enumerable: false,
        writable: true, //
      })
    }
    if (Array.isArray(children) && children.length > 0) {
      //
      children.forEach((e1) => {
        let i1 = i + 1
        let _index = e['_index']
        Object.defineProperty(e1, '_parentIndex', {
          value: _index,
          enumerable: false,
          writable: true, //
        })
        this.initDataRow(e1, i1)
      })
    } //
  }
  designCurrentColumn() {}
  getCacheContain(row) {}
  setEventMap(map = {}) {
    Object.entries(map).forEach(([key, value]) => {
      let _callback = value['callback']
      if (typeof _callback == 'function') {
        this.registerEvent({
          keyName: key,
          name: key, //
          callback: (...args) => {},
        })
      }
    })
  }
  async getDefaultValue(tableName: string = '') {
    //
    let columns = this.getColumns()
    let obj1 = {}
    for (const col of columns) {
      let defaultValue = await col.getDefaultValue()
      if (defaultValue) {
        obj1 = { ...obj1, ...defaultValue } //
      }
    } //
    return obj1
  }
  getContextItems() {
    let contextItems = this.contextItems.map((item) => {
      return item
    })
    return contextItems
  }
  getDefaultHeaderRowHeight() {
    return 40
  }
  getIsFilterTable() {
    let config = this.config
    let isFilterTable = config.isFilterTable
    return isFilterTable //
  }
  getCheckColumnWidth() {
    return 60
  }
  //外部点击事件
  outClick(event, isIn = false) {
    this.clearEditCell() //
    let ins = this.getInstance()
    if (ins) {
      if (isIn == true) {
        return //
      }
      ins.clearSelected() ////
    }
  } //
  getHeaderButtons() {
    let config = this.config //
    let buttons = config.buttons || []
    return buttons
  }
  getShowControllerColumn() {
    let config = this.config //
    let showControllerButtons = config.showControllerButtons
    return showControllerButtons
  }
  getControllerColumnWidth() {
    return 130
  }
  changeSortOrder(orderFieldArr: { field: string; order: number }[]) {
    // debugger//
    let old1 = orderFieldArr.map((f) => f.field)
    old1.forEach((f, i) => {
      let columns = this.getFlatColumns()
      let _col = columns.find((col) => col.getField() == f) //
      if (_col) {
        _col.setOrder(i) // _col.setOrder(i) //
      }
    }) //
    let config = this.config
    let dragColumnAfterFn = config.dragColumnAfterFn
    let columns = this.getFlatColumns()
    if (typeof dragColumnAfterFn == 'function') {
      dragColumnAfterFn(
        columns.map((col) => {
          return col.config //
        }), //
      ) //
    }
    let onColumnConfigChange = config.onColumnConfigChange
    if (typeof onColumnConfigChange == 'function') {
      onColumnConfigChange({
        //
        columns: columns.map((col) => {
          return col.config //
        }),
        tableName: this.getTableName(),
        field: 'order',
      })
    }
  } //
  startWatchSystemMouseConfig() {
    let system = this.getSystem()
    let mouseConfig = system.mouseConfig
    let outDiv: HTMLDivElement = this.getRef('outDiv')
    let bound = outDiv.getBoundingClientRect()
    let x = bound.x
    let y = bound.y
    let endX = bound.width + x
    let endY = bound.height + y //
    this.mouseWatch = watch(
      () => {
        return {
          x: mouseConfig.clientX,
          y: mouseConfig.clientY,
        }
      },
      (nv) => {
        // debugger//
        if (this.isDragHeader == true) {
          let _x = nv.x
          if (_x < x) {
            let speed = 100 + (_x - x)
            if (speed < 5) {
              speed = 5
            }
            this.scrollInSpeed('col', -speed)
          }
          if (_x > endX) {
            let speed = 100 - (_x - endX)
            if (speed < 5) {
              speed = 5
            }
            this.scrollInSpeed('col', speed) //
          }
          if (_x > x && _x < endX) {
            this.scrollColSpeed = 0
          }
        } else {
          let _y = nv.y
          if (_y < y) {
            let speed = 100 + (_y - y)
            if (speed < 5) {
              speed = 5
            }
            this.scrollInSpeed('row', -speed)
          }
          if (_y > endY) {
            let speed = 100 - (_y - endY)
            if (speed < 5) {
              speed = 5
            }
            this.scrollInSpeed('row', speed) //
          }
          if (_y > y && _y < endY) {
            this.scrollRowSpeed = 0 //
          }
        }
      },
    )
  }
  endWatchSystemMouseConfig() {
    if (this.mouseWatch != null && typeof this.mouseWatch == 'function') {
      this.mouseWatch()
      this.mouseWatch = null
    }
    this.endScrollInteral()
  }
  endScrollInteral(type?: any) {
    if (type == 'col') {
      if (this.scrollColInteral != null) {
        clearInterval(this.scrollColInteral)
        this.scrollColInteral = null
      }
    }
    if (type == 'row') {
      if (this.scrollRowInteral != null) {
        clearInterval(this.scrollRowInteral)
        this.scrollRowInteral = null
      }
    } //
    if (type == null) {
      if (this.scrollColInteral != null) {
        clearInterval(this.scrollColInteral)
        this.scrollColInteral = null
      }
      if (this.scrollRowInteral != null) {
        clearInterval(this.scrollRowInteral)
        this.scrollRowInteral = null //
      }
    }
  }
  setTreeTable(config) {
    //
    let _config = null
    let parentId = config?.parentId
    let id = config?.id //
    if (parentId != null || id != null) {
      _config = config
      return
    }
    this.treeConfig = _config //
  }
  scrollInSpeed(type, number) {
    if (number == null || number == 0) {
      return
    }
    let _inter = null
    if (type == 'col') {
      _inter = this.scrollColInteral
      this.scrollColSpeed = number
      if (_inter == null) {
        this.scrollColInteral = setInterval(() => {
          let speed = this.scrollColSpeed //
          if (speed == 0) {
            return //
          }
          let speed1 = this.scrollColSpeed1
          let _speed = Math.abs(speed)
          speed1++
          this.scrollColSpeed1 = speed1
          if (speed1 >= _speed) {
            this.scrollColSpeed1 = 0
            let sl = this.getInstance().getScrollLeft()
            if (speed > 0) {
              speed = 10
            } else {
              speed = -10
            }
            let s2 = sl + speed
            if (s2 < 0) {
              s2 = 0
            }
            this.getInstance().setScrollLeft(s2)
          }
        }, 2)
      }
    }
    if (type == 'row') {
      _inter = this.scrollRowInteral
      this.scrollRowSpeed = number //
      if (_inter == null) {
        this.scrollRowInteral = setInterval(() => {
          let speed = this.scrollRowSpeed //
          if (speed == 0) {
            return //
          }
          let speed1 = this.scrollRowSpeed1
          let _speed = Math.abs(speed)
          speed1++
          this.scrollRowSpeed1 = speed1
          if (speed1 >= _speed) {
            this.scrollRowSpeed1 = 0
            let sl = this.getInstance().getScrollTop()
            if (speed > 0) {
              speed = 10
            } else {
              speed = -10
            }
            let s2 = sl + speed
            if (s2 < 0) {
              s2 = 0
            }
            this.getInstance().setScrollTop(s2) //
          }
        }, 2) //
      }
    }
  }
  getIsTree() {
    let treeConfig = this.treeConfig
    let id = treeConfig?.id
    let parentId = treeConfig?.parentId
    if (id != null || parentId != null) {
      return true
    } //
    return false
  }
  openTreeRow(col, row) {
    console.log(col, row, 'openTreeRow') //
    let ins = this.getInstance() //
    let record = ins.getRecordByCell(col, row) //
    let f = ins.getBodyField(col, row)
    let _c = this.getColumns().find((c) => c.getField() == f)
    if (_c?.getIsTree() != true) {
      //
      return
    }
    if (record == null) {
      return //
    }
    let _index = record._index
    this.updateIndexArr.add(_index) //
    let _expanded = Boolean(record._expanded)
    let _status = !_expanded
    // let _row=ins
    Object.defineProperty(record, '_expanded', {
      value: _status,
      enumerable: false,
      writable: true,
    }) //
    ins.toggleHierarchyState(col, row) ////
    setTimeout(() => {
      console.log(record, 'testRecords') //
    }, 100)
  }
  setRowDragAble(status) {}
  getTreeDataByPid(pid) {
    //
    let treeConfig = this.treeConfig
    let idKey = treeConfig.id
    let rootId = treeConfig.rootId
    if (pid == rootId) {
      return { isRoot: true, children: this.getData() }
    } //
    let _d = this.getFlatTreeData()
    let _d1 = _d.filter((d) => {
      return d[idKey] == pid
    })
    return _d1.pop() //
  }
  swapTwoRow(r1, r2, pid) {
    let data = this.getData()
    if (pid == null) {
      data = data
    } else {
      let _d = this.getTreeDataByPid(pid)
      data = _d.children
    }
    //顶层的节点
    if (this.templateProps.data.includes(r1)) {
      let index1 = data.indexOf(r1)
      let index2 = data.indexOf(r2)
      data.splice(index1, 1) //
      data.splice(index2, 0, r1) //
    }

    let config = this.config
    let dragRowAfterFn = config.dragRowAfterFn
    if (typeof dragRowAfterFn == 'function') {
      //
      dragRowAfterFn({ startRow: r1, endRow: r2, data })
    }
    nextTick(() => {
      // console.log(data, 'testData') //
      this.updateCanvas() //
      // nextTick(() => {
      //   console.log(this.getInstance().records, 'testRecords')//
      // })
    })
    return //
  }
  onColumnResize(_config) {
    //
    // let config = this.config
    // let onColumnResize = config.onColumnResize
    // if (typeof onColumnResize == 'function') {
    //   onColumnResize(_config) //
    // }
    // console.log(_config, 'onColumnResize') //
    let column = _config.originColumn
    column.width = _config?.width || column.width
    let onDesignColumn = this.config.onDesignColumn
    if (typeof onDesignColumn == 'function') {
      onDesignColumn(column, column, false) //
    }
  }
  hiddenColumn(field) {
    let columns = this.getFlatColumns()
    let _col = columns.find((col) => {
      return col.getField() == field
    })
    if (field == 'checkboxField') {
      return //
    } //
    if (_col == null) {
      //
      return //
    } //
    _col.setHidden(true) //
    let ccnfig = this.config //

    let onColumnConfigChange = ccnfig.onColumnConfigChange
    if (typeof onColumnConfigChange == 'function') {
      onColumnConfigChange({
        column: _col, //
        columns: _col, //
        table: this, //
        originColumn: _col.config, //
        tableName: this.getTableName(),
        field: 'hidden', //
      }) //
    }
  } //
  onTableConfigChange(config) {
    let _config = this.config
    let onTableConfigChange = _config.onTableConfigChange
    if (typeof onTableConfigChange == 'function') {
      onTableConfigChange(config) //
    }
  }
  onColumnsDesign(cols: any[]) {
    let updateCols = cols.filter((col) => {
      //
      let rowState = col['_rowState']
      return rowState == 'change'
    })
    let addCols = cols.filter((col) => {
      let rowState = col['_rowState']
      return rowState == 'add'
    }) //
    let config = {
      addCols: addCols,
      updateCols: updateCols,
      // otherCols: cols.filter((col) => {
      //   return !addCols.includes(col) && !updateCols.includes(col)
      // }), //
      allCols: cols,
      tableName: this.getTableName(),
    }
    let ccnfig = this.config
    let onColumnsDesign = ccnfig.onColumnsDesign
    if (typeof onColumnsDesign == 'function') {
      onColumnsDesign(config) //
    }
  }
  expandTargetRows(rows, hiddenOther = true) {
    // debugger//
    let setExpand = (row: any, status = true) => {
      let _expanded = row['_expanded']
      if (_expanded == null) {
        Object.defineProperty(row, '_expanded', {
          value: true,
          enumerable: false,
          writable: true, //
        }) //
      }
      row['_expanded'] = status //
      let col = 'collapse'
      if (status == true) {
        //scss less vuex
        col = 'expand'
      }
      row['hierarchyState'] = col //
    }
    let allRows = this.getFlatTreeData()
    if (hiddenOther == true) {
      allRows.forEach((row) => {
        setExpand(row, false)
      })
    }

    for (let row of rows) {
      let farr = this.getFlatParent(row) //
      for (let r of farr) {
        setExpand(r, true) //
      }
    }
  }
  getFlatParent(row, arr = []) {
    let pIndex = row['_parentIndex']
    if (pIndex == null) {
      arr.push(row)
    } else {
      let pRow = this.dataMap[pIndex]
      this.getFlatParent(pRow, arr)
    }
    return [...arr, row] //
  }
  expandAllTreeRow(status = true, level: any = 'all') {
    let allRows = this.getFlatTreeData()
    allRows.forEach((row) => {
      let hierarchyState = row.hierarchyState
      if (hierarchyState != 'expand') {
        row.hierarchyState = 'expand'
      }
      if (level === 'all') {
        let _expanded = row['_expanded']
        if (_expanded == null) {
          Object.defineProperty(row, '_expanded', {
            value: status,
            enumerable: false,
            writable: true,
          })
        } else {
          row['_expanded'] = status //
        } //
      }
    })
    this.updateCanvas() //
  }
  getCurrentContextRow() {
    return this.curContextRow //
  }
  async _addChildrenRow() {
    let cRow = this.getCurrentContextRow()
    // console.log(cRow, 'testR') //
    let nRow = await this.getDefaultValue()
    let tConfig = this.treeConfig
    let pKey = tConfig.parentId
    let iKey = tConfig.id
    nRow[pKey] = cRow[iKey] //
    this.addChildrenRow(cRow, nRow) //
  }
  addChildrenRow(parentRow, newRow) {
    let children = parentRow.children
    this.initDataRow(newRow)
    let _index = parentRow['_index'] //
    Object.defineProperty(newRow, '_parentIndex', {
      value: _index,
      enumerable: false,
      writable: true,
    })
    children.push(newRow)
    this.updateCanvas() //
  }
  async validate(config?: any) {
    return new Promise(async (resolve, reject) => {
      let data = config?.data //
      data = data || this.getFlatTreeData() //
      let allData = data
      if (config?.change == true) {
        let changeData = data.filter((d) => {
          let rowState = d['_rowState']
          if (rowState == 'add' || rowState == 'change') {
            return true
          }
          return false
        }) //
        data = changeData //
      }
      let columns = this.getFlatColumns() //
      let _cols = columns.filter((col) => {
        let isEdit = col.getIsEditField()
        if (isEdit == true) {
          return true
        }
        return false
      })
      let err = null
      let _row = null
      let _col = null
      for (let row of data) {
        //
        for (let col of _cols) {
          if (err != null) {
            break //
          }
          let _v = row[col.getField()]
          let status = await col.validateValue({
            row: row, //
            value: _v, //
            table: this,
          })
          if (status == true) {
            continue
          }

          err = status
          _row = row
          _col = col
        }
        if (err != null) {
          break
        }
        let _index = row['_index'] //
        delete this.validateMap[_index] //
      }
      let validateFn = this.config.validateFn
      let tErr = null
      if (typeof validateFn == 'function') {
        //
        let _str = await validateFn({
          table: this,
          data: allData,
          changeData: data, //
        })
        if (typeof _str == 'string') {
          tErr = _str
        }
      }
      if (err == null) {
        if (tErr == null) {
          resolve(true) //
        } else {
          //
          this.getSystem().confirmMessage(tErr, 'error') //
          reject(tErr) //
        } //
      } else {
        let _index = _row['_index']
        this.validateMap[_index] = [err] //
        this.showErrorTopTip() //
        reject(err)
      }
    })
  }
  showErrorTopTip() {
    // debugger//
    let validateMap = this.validateMap
    if (Object.keys(validateMap).length == 0) {
      return
    }
    let _index = Object.keys(validateMap)[0]
    let err = validateMap[_index][0] //
    // console.log(err) ////
    let ins = this.getInstance()
    // ins.autoFillHeight
    let field = err.field
    let row = err.row //
    let _index1 = this.getFlatTreeData().findIndex((r) => r['_index'] == _index)
    let addR = ins.getCellAddress((r) => r['_index'] == _index, field)
    let sumRow = (rows, _index, config = { i: 0, complete: false }) => {
      for (let row of rows) {
        config.i++
        let children = row.children
        let hierarchyState = row.hierarchyState
        if (row['_index'] == _index) {
          config.complete = true
          return config //
        }
        if (config.complete == true) {
          return config
        }
        if (hierarchyState == 'expand' && children.length > 0) {
          //
          return sumRow(children, _index, config) //
        }
      }
      return config //
    }
    if (addR.row == null) {
      //就是树表格
      let tempData = this.templateProps.data
      let _index11 = sumRow(tempData, _index) //
      // console.log(_index11, 'test_index') //
      addR.row = _index11.i //
    }
    // console.log(addR, 'addR') //

    let fMes = err.message || '数据校验失败' //
    // debugger//
    let sCol = addR.col - 2
    let sRow = addR.row - 2
    if (sCol < 0) {
      sCol = 0
    }
    if (sRow < 0) {
      sRow = 0
    }
    this.getInstance().scrollToCell({
      row: sRow,
      col: sCol,
    })
    // this.getInstance().scrollToCell({
    //   row: addR.row,
    //   col: addR.col, //
    // })
    //
    setTimeout(() => {
      let _r2 = ins.getVisibleCellRangeRelativeRect({
        col: addR.col,
        row: addR.row,
      })
      ins.showTooltip(addR.col, addR.row, {
        content: fMes, //
        referencePosition: { rect: _r2, placement: VTable.TYPES.Placement.top }, //TODO
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
      }) //
    }, 100)
  }
  onHeaderTitleChange(config: { column: any }) {
    let column = config.column
    if (column == null) {
      return
    }
    // console.log(column, 'testColumn') //
    let tableName = column.tableName
    let onColumnConfigChange = this.config.onColumnConfigChange
    if (typeof onColumnConfigChange == 'function') {
      onColumnConfigChange({
        columns: [column], //
        tableName: column.tableName,
        field: 'title',
      })
    }
  }
  updateSeriesColumnShow(bool) {
    let ins = this.getInstance()
    let fIns = this.getFooterInstance()
    let sCol = this.seriesNumberColumn
    let _col = null
    if (bool == true) {
      _col = sCol.getColumnProps()
    } else {
      _col = null
    }
    let op = ins?.options
    if (op) {
      op.rowSeriesNumber = _col
      ins.updateOption(op)
    } //
    let fOp = fIns?.options
    if (fOp) {
      fOp.rowSeriesNumber = _col
      fIns.updateOption(fOp) //
    } //
  } //
  onCellDblClick(config) {
    let col = config.col //
    let row = config.row //
    let field = config.field //
    let value = config.value
    let originData = config.originData
    let _config = this.config //
    this.tableData.dbCurRow = originData
    let onDbCurRowChange = _config.onDbCurRowChange //
    if (typeof onDbCurRowChange == 'function') {
      onDbCurRowChange({
        row: originData,
        field: field,
        value: value, //
      })
    }
  }
  delRows(rows: any[]) {
    if (Array.isArray(rows)) {
      for (const r of rows) {
        let _index = r._index
        if (_index != null) {
          this.dataMap[_index] = null
        }
      }
    }
  } //
  onCellVisible(config) {
    let field = config.field //
    let record = config.record
    if (record == null) {
      console.log(config, 'record没有') //
      return //
    }
    let _index = record?._index //
    let _containerMap = containerMap
    let id = this.id //
    let id1 = `${id}_arr`
    let _map = _containerMap[id]
    let _arr: string[] = _containerMap[id1]
    if (_map == null) {
      _containerMap[id] = {}
      _map = _containerMap[id]
    }
    if (_arr == null) {
      _containerMap[id1] = []
      _arr = _containerMap[id1]
    }
    let map1 = _map[_index]
    if (map1 == null) {
      //重新賦值
      _map[_index] = {}
      map1 = _map[_index]
      let _length = _arr.length
      let count = config.rowCount
      if (_arr.includes(_index)) {
      } else {
        _arr.push(_index)
      }
      // console.log(_arr.length,'fsdkfjslfds')//
      // console.log(count, 'sfjsdlfsdf') //
      if (_length > count) {
        console.log('删除了')
        let _length1 = _length - count
        let _indexArr = _arr.splice(0, _length1)
        _indexArr.forEach((item) => {
          let _index1 = item
          this.onCellHidden({
            _index: _index1,
          })
        })
      }
    }
    map1[field] = config
    let fieldFormat = config.fieldFormat
    let _v = null
    let column = this.columnsMap[field] || config.column
    if (column == null) {
      if (field == 'checkboxField') {
        column = this.checkboxColumn
      }
      if (field == 'seriesNumber') {
        column = this.seriesNumberColumn //
      }
    }
    // console.log(
    //   isProxy(this),
    //   isProxy(record),
    //   isProxy(column),
    //   field,
    //   'isProxy',
    // )
    let obj1 = {
      row: record, //
      field: field,
      table: this,
      col: column,
      column: column, //
    }
    if (typeof fieldFormat == 'function') {
      let _value1 = fieldFormat(obj1)
      if (_value1 == null) {
        _value1 = '' //
      }
      let _watch = map1[`watch_arr`]
      if (_watch == null) {
        // _watch = []
        _watch = {} //
        map1[`watch_arr`] = _watch
      }
      // let column=ref(config.column)
      let _w1 = watch(
        () => {
          // console.log(
          //   isProxy(record),
          //   'isProxy(record)',
          //   isProxy(config.column),
          // )
          let _value = fieldFormat(obj1) //
          return _value
        },
        (v) => {
          this.updateIndexArr.add(_index)
          // _value1 = v
        },
        {
          // immediate: true,
        },
      )
      // _watch.push(_w1) //
      if (_watch[field] != null) {
        let fn = _watch[field]
        fn() //
      }
      _watch[field] = _w1
      _v = _value1
    }
    return _v
  }
  hiddenAllCell() {
    let _containerMap = containerMap
    let id = this.id //
    let _arr = _containerMap[`${id}_arr`] //
    _arr.forEach((item) => {
      this.onCellHidden({
        _index: item,
      })
    })
  }
  onCellHidden(config) {
    if (config == null) {
      return
    }
    let _index = config._index //
    let _containerMap = containerMap
    let id = this.id //
    let map = _containerMap[id]
    let obj1 = map[_index]
    if (obj1 == null) {
      return
    }
    delete map[_index]
    let watchArr = obj1[`watch_arr`]
    if (Array.isArray(watchArr)) {
      watchArr.forEach((item) => {
        item() //
      })
      obj1[`watch_arr`] = null
    } else {
      if (typeof watchArr == 'object') {
        Object.values(watchArr).forEach((item: any) => {
          item()
        })
      }
    }
    obj1[`watch_arr`] = null //
  }
  onScroll(config) {}
  clearCache() {
    let id = this.id
    let _containerMap = containerMap
    _containerMap[id] = null //
  }
  getDefaultRowHeight() {
    let height = Number(this.config?.rowHeight)
    if (isNaN(height)) {
      height = 30
    } //
    // console.log('行高度', height)//
    return height
  }
}
