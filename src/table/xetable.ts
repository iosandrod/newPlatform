import { Base } from '@ER/base'
import { Table } from './table'
import { reactive, shallowRef, toRaw } from 'vue'
import { XeColumn } from './xecolumn'
import {
  VxeColumnDefines,
  VxeComponentEvent,
  VxeGridInstance,
  VxeTableDefines,
  VxeTableEventProps,
  VxeTableEvents,
  VxeTablePropTypes,
} from 'vxe-table'
import {
  cacheValue,
  useDelay,
  useRunAfter,
  useTimeout,
} from '@ER/utils/decoration'
import { XeCheckColumn } from './xeCheckColumn'
import { combineAdjacentEqualElements } from '@ER/utils'
import { nextTick } from 'vue'
import { BMenu } from '@/buttonGroup/bMenu'
import { initXeContextItems } from './xetableFn'
import { Dropdown } from '@/menu/dropdown'
import _ from 'lodash' //
import { XeSeriesNumberColumn } from './xeSeriesNumberColumn'
import {
  VxeColPropTypes,
  VxeTabsDefines,
  VxeTabsProps,
  VxeTagPropTypes,
} from 'vxe-pc-ui'
import { ColumnInfo } from '@/vxegrid/table/src/columnInfo'
export class XeTable extends Base {
  currentCheckField: string | null = null
  config: any //
  canClearEditCell = true
  oldRangeRows: any[] = [] //
  currentClickButton: any
  currentEditCell: any = {}
  useCache = false
  mergeConfig: any = {} //
  cellSelectConfig = {
    templateColIndex: {},
    startRowIndex: null,
    startColIndex: null,
    endRowIndex: null,
    endColIndex: null,
    start: false,
    threshold: 5, //
    ranges: [],
    currentRange: {}, //
  }
  selectCacheCell: any = []
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
  curContextCol?: any
  frozenColCount = 0
  rightFrozenColCount = 0
  controllerColumn?: any //
  currentEditCol?: any
  isContainerClick = false
  isFilterTable = false
  editConfig = {
    currentEditField: null,
    currentEditIndex: null,
    rowIndex: new Set(),
    colIndex: new Set(), //
  }
  isMergeCell = true
  seriesNumberColumn: XeColumn
  curContextRow: any = null
  isHeaderContext: boolean = false //
  contextItems: any[] = []
  disableColumnResize = true //
  tableState: 'edit' | 'scan' = 'edit' //
  templateEditCell: { col?: number; row?: number; value?: any }
  currentResizeField: string
  fatherScrollNum = 0
  sortCache = []
  childScrollNum = 0
  showFooter = false
  showCustomLayout = true //
  isCheckAll = false
  globalRowSet = new Set()
  currentFilterColumn: any
  updateTimeout?: any
  checkboxColumn: XeCheckColumn //
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
  columns: any[] = []
  columnsMap: { [key: string]: any } = {} //
  scrollConfig = {
    rowStart: 0,
    rowEnd: 0,
    colStart: 0,
    colEnd: 0,
  }
  // currentIndexContain = shallowRef({}) as any
  eventManager: {
    [key: string]: Array<{
      callback?: Function
      timeout?: number //
      _timeout?: any //
    }>
  } = shallowRef({}) as any
  tableData = {
    dbCurRow: null,
    data: [],
    showData: [], //
    curRow: null,
  }
  constructor(config) {
    super()
    this.config = config //
    this.init()
  } //
  init() {
    super.init()
    super.init() //
    let config = this.config
    let columns = config.columns || []
    let data = config.data || [] //
    this.initTreeConfig()
    this.setData(data) //
    this.setColumns(columns) //
    this.initSortState()
    this.initCheckboxColumn()
    this.initControllerColumn()
    this.initSeriesNumberColumn()
    this.initGlobalSearch()
    this.initCurrentContextItems() //
    this.initTableState()
  }
  initTreeConfig() {}
  initSortState() {}
  initCheckboxColumn() {
    let _col = new XeCheckColumn({ field: 'checkboxField' }, this) //
    this.checkboxColumn = _col
  }
  initControllerColumn() {}
  initSeriesNumberColumn() {
    let _col = new XeSeriesNumberColumn({ field: 'seriesNumber' }, this) //
    this.seriesNumberColumn = _col
  }
  initGlobalSearch() {}
  initCurrentContextItems() {
    initXeContextItems(this) //
  } //
  initTableState() {}
  getEditType() {
    let type = 'row' //
    return type //
  }
  getCurRow() {
    return this.tableData.curRow
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
  setData(data: any) {
    if (Array.isArray(data) == false) {
      //
      return
    }
    // this.currentIndexContain = shallowRef({})
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
    let curRowIndex = this.getCurRow()?._index
    let dataMap = this.dataMap
    let _row1 = dataMap[curRowIndex]
    if (_row1 == null) {
      this.tableData.curRow = null
    } //
    if (this.tableData.curRow == null) {
      this.setCurRow(data[0]) //
    }
    //
  } //
  setColumns(columns: any) {
    this.columns.splice(0)
    for (const col of columns) {
      this.addColumn(col)
    }
  }
  @cacheValue()
  getVirtualYConfig() {
    return {
      enabled: true,
      gt: 0,
    } //
  }
  @cacheValue() //
  getVirtualXConfig() {
    return {
      enabled: true,
      gt: 0, //
    }
  }
  addColumn(config: any) {
    let col = new XeColumn(config, this)
    let field = col.getField()
    this.columnsMap[field] = col
    this.columns.push(col) //
  } //
  getColumns(): XeColumn[] {
    return this.columns
  }
  getShowControllerColumn() {
    let config = this.config //
    let showControllerButtons = config.showControllerButtons
    return showControllerButtons
  }
  getShowSeriesNumber() {
    let config = this.config
    let showRowSeriesNumber = config.showRowSeriesNumber
    return showRowSeriesNumber //
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

    let _show = this.config.showCheckboxColumn
    let _show1 = this.getShowControllerColumn()
    let _show2 = this.getShowSeriesNumber()
    let rfsCols = _col1.filter((c) => {
      let isFrozen = ['right'].includes(c.fixed)
      return isFrozen == true //右边的
    })
    let lfsCols = _col1.filter((c) => {
      // let isLeftFrozen = c.isLeftFrozen
      let isLeftFrozen = ['left'].includes(c.fixed)
      return isLeftFrozen == true //左边的
    })
    let sCols = _col1.filter((c) => {
      let s1 = lfsCols.includes(c)
      let s2 = rfsCols.includes(c)
      return !s1 && !s2
    })
    sCols.sort((c1, c2) => {
      const n1 = Number(c1.order)
      const n2 = Number(c2.order)

      const isNum1 = !isNaN(n1)
      const isNum2 = !isNaN(n2)

      if (isNum1 && isNum2) {
        return n1 - n2 // 都是数字或可转为数字，按数值排序
      }
      if (isNum1) return -1 // c1 是有效数字，排前
      if (isNum2) return 1 // c2 是有效数字，排前
      return 0 // 都不是数字，保持原顺序
    })

    _col1 = [...lfsCols, ...sCols, ...rfsCols]
    if (_show) {
      let cCol = this.checkboxColumn
      _col1.unshift(cCol.getColumnProps())
    } //
    if (_show2) {
      let sCol = this.seriesNumberColumn
      _col1.unshift(sCol.getColumnProps()) //
    }
    return _col1 ////
  } //
  loadColumns() {
    try {
      let columns = this.getShowColumns()
      this.templateProps.columns = columns //
    } catch (error) {
      console.error(error) //
      console.log('加载列出错了') //
    }
  } //
  getData() {
    let tableData = this.tableData
    let data = tableData.data || []
    return data ////
  }
  getShowData() {
    let data = this.getData().map((row) => row) //
    return data //
  }
  getIsTree() {
    //
    let treeConfig = this.config.treeConfig
    let id = treeConfig?.id
    let parentId = treeConfig?.parentId
    if (id != null || parentId != null) {
      return true
    } //
    return false
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
    // console.log('加载数据展示', data) //
    let _data = data
    let _data1 = toRaw(_data)
    let sortState = this.sortCache
    let _sortState = toRaw(sortState)
    let globalValue = this.globalConfig.value
    let _filterConfig = toRaw(this.columnFilterConfig.filterConfig)
    let instance = this.getInstance()
    if (instance == null) {
      return
    }
    let isTree = this.getIsTree()
    if (isTree) {
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
      nextTick(() => {
        let _data4 = [...new Set(this.getFlatTreeData(_data3))] //
        this.templateProps.data = _data4 //
      })
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
      this.templateProps.data = _data3
      nextTick(() => {
        // this.updateCanvas() //
      })
    } //
    //@ts-ignore
  }
  @useTimeout({
    number: 100,
    key: 'updateColumns',
  })
  updateColumns() {
    let _columns = this.templateProps.columns || [] //
    let instance = this.getInstance()
    if (instance == null) {
      return //
    }
    instance.loadColumn(_columns) //
  }
  getHeaderHeight() {
    let _config = this.config
    let headerHeight = _config.headerHeight //
    if (isNaN(headerHeight)) {
      headerHeight = 35
    }
    return headerHeight //
  }
  @cacheValue()
  getHeaderCellConfig() {
    let headerHeight = this.getHeaderHeight()
    return {
      height: headerHeight,
      padding: false, //
    }
  }
  setTableState(state: 'edit' | 'scan') {} //
  getGlobalSearchProps() {
    return {} //
  } //
  @useTimeout({ number: 300 })
  updateGlobalSearch(value: any) {
    if (value == this.globalConfig.value) {
      return
    }
    this.globalConfig.value = value
  }
  showGlobalSearch(status) {
    //
    if (status) {
      this.globalConfig.show = true //
    } else {
      this.globalConfig.value = '' //
      this.globalConfig.show = false
    }
  }
  @useRunAfter()
  @useTimeout({ number: 300, key: 'updateTimeout' })
  async updateCanvas(config?: any) {
    return new Promise(async (resolve) => {
      let data = config?.data || this.templateProps.data //
      let instance = this.getInstance() //
      if (instance == null) {
        return
      }
      instance.loadData(data).then(() => {
        resolve(true) //
      })
    }) //
  }
  addAfterMethod(config) {
    config.type = 'after' //
    this.addMethod(config)
  }

  onMounted() {
    this.addAfterMethod({
      methodName: 'updateCanvas',
      fn: async () => {
        // console.log('更新画布', this)
        // let ins = this.getInstance()
        // let d = ins.getData()
        // console.log('更新画布', d) //
      },
    })
    this.loadData() //
    this.updateColumns()
  }
  getInstance(): VxeGridInstance {
    let grid = this.getRef('xeGrid') //
    return grid
  }
  jumpToSearchNext(bool) {} //
  expandAllTreeRow() {
    let instance = this.getInstance()
    instance.setTreeExpand(this.getFlatTreeData(), true)
  } //
  getCanClearEditCell(config?: any) {
    let status = true
    let editType = this.getEditType()
    if (editType == 'all') {
      return true //
    }
    if (editType == 'cell') {
      status = this.canClearEditCell
    }
    if (editType == 'row') {
      status = this.canClearEditCell //
    }
    let currentEditCol = this.currentEditCol
    if (currentEditCol?.disableHideCell == true) {
      status = false //
    }
    return status
  }
  //开始编辑
  clearEditCell() {
    let editConfig = this.editConfig
    let rowIndex = editConfig.rowIndex //
    let colIndex = editConfig.colIndex
    let editType = this.getEditType()
    let canClearEditCell = this.getCanClearEditCell()
    if (canClearEditCell == false) {
      return false
    } //
    editConfig.currentEditField = null //
    editConfig.currentEditIndex = null //
    rowIndex.clear() //
    colIndex.clear() //
  } //
  @useTimeout({ number: 0 }) //
  startEditCell(config) {
    let tableState = this.getTableState()
    if (tableState == 'scan') {
      return //
    }
    let record = config.row //
    let _index = record._index //
    let editConfig = this.editConfig
    let rowIndex = editConfig.rowIndex
    let editType = this.getEditType()
    if (rowIndex.has(_index) && editType == 'row') {
      return
    } //
    let s = this.clearEditCell() //
    if (s == false) {
      return //
    }
    let colIndex = editConfig.colIndex
    let column: XeColumn = config?.column?.params
    let f = column.getField()
    editConfig.currentEditField = f //
    editConfig.currentEditIndex = _index //
    rowIndex.add(_index) //
    colIndex.add(f) //
  }

  expandTargetRows(data) {
    let instance = this.getInstance()
    // let _d = instance.getData()
    instance.setTreeExpand(data, true) //
  }
  copyCurrentCell() {} //
  getCellHeight() {
    let config = this.config
    let rowHeight = config.rowHeight
    console.log(rowHeight, 'dskfsjflsdfsd') //
    if (isNaN(rowHeight)) {
      rowHeight = 30
    }
    return rowHeight
  }
  @cacheValue()
  getCellConfig() {
    let rowHeight = this.getCellHeight()
    return {
      height: rowHeight, //
      padding: false, //
    } //
  }
  initDataRow(row, i = 0) {
    //
    let e = row
    if (e['_index'] == null) {
      let id = this.uuid()
      Object.defineProperty(e, '_index', {
        value: id, //
        enumerable: false,
        writable: true,
      })
      this.dataMap[e._index] = e
      Object.defineProperty(e, 'hierarchyState', {
        writable: true,
        value: '',
        enumerable: false,
      }) //
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
      })
    }
    this.dataMap[e._index] = e //
    let children = e['children']
    if (this.getIsTree()) {
      if (children == null) {
        e.children = []
      }
      if (e['_level'] == null) {
        Object.defineProperty(e, '_level', {
          value: i,
          enumerable: false,
          writable: true, //
        })
      }
    } //
    if (i > 0) {
      Object.defineProperty(e, '_level', {
        value: i,
        enumerable: false,
        writable: true, //
      })
    } //
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
  getContextItems() {
    let contextItems = this.contextItems.map((item) => {
      return item
    })
    return contextItems //
  } //
  startDragArea() {}
  onCellVisible(config) {} //
  onCellHidden(config) {}
  onCellMousedown(config) {
    let e: MouseEvent = config.event
    let startX = e.clientX
    let startY = e.clientY //
    let dragging = false
    let cellSelectConfig = this.cellSelectConfig
    let threshold = cellSelectConfig.threshold
    let start = false
    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (!dragging && distance > threshold) {
        dragging = true
        console.log('🔸开始拖拽')
        // 触发拖拽开始逻辑
      } //
      if (dragging) {
        if (start == false) {
          start = true
          cellSelectConfig.start = true
          this.onCellStartSelect(config) //
        }
        // 拖拽中
        console.log('🚚 正在拖动...')
      }
    } //
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp) //
      if (dragging) {
        console.log('✅ 拖拽结束')
        this.onCellSelectEnd() //
      } else {
        console.log('🖱️ 点击事件')
        // 触发点击逻辑
      }
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }
  onCellStartSelect(config) {
    let cellSelectConfig = this.cellSelectConfig
    let start = cellSelectConfig.start
    if (start == false) {
      return
    }
    let showColumns = this.getShowColumns()
    cellSelectConfig.templateColIndex = showColumns.reduce((res, item, i) => {})
    cellSelectConfig.startRowIndex = config.rowIndex //
    cellSelectConfig.startColIndex = config._index //
    cellSelectConfig.currentRange = {
      startRowIndex: config.rowIndex,
      endRowIndex: config.rowIndex,
    }
  }
  onCellSelectMove(config) {
    //
  }
  onCellMouseEnter(config) {
    let cellSelectConfig = this.cellSelectConfig
    let start = cellSelectConfig.start
    if (start == false) {
      return
    } //
    let currentRange: any = cellSelectConfig.currentRange //
    let row = config.row //进入的行
    // let _index = config._index //进入
    // let column = config.column
    // let field = column.getField() //
    /* 
       startRowIndex: 2,
  startColIndex: 1,
  endRowIndex: 5,
  endColIndex: 3
    */
    console.log('进入了当前cell', config) //
  }
  onCellSelectEnd() {
    let cellSelectConfig = this.cellSelectConfig
    let start = cellSelectConfig.start
    if (start == false) {
      return
    } //
    cellSelectConfig.start = false //
  }
  @cacheValue()
  getCheckboxConfig() {
    let isTree = this.getIsTree()
    let range = true
    if (isTree) {
      range = false
    }
    return {
      checkField: 'checkboxField',
      range: range, //
    } //
  }
  getIsFilterTable() {
    return false
  } //
  getDefaultWidth() {
    return 150 //
  } //
  @useTimeout({ number: 1 }) //
  onCheckboxChange(config) {
    let onCheckboxChange = this.config.onCheckboxChange
    let checkRows = this.getInstance().getCheckboxRecords()
    let record = config.row
    if (typeof onCheckboxChange == 'function') {
      onCheckboxChange({ ...config, records: checkRows, record }) //
    }
  } //
  @useTimeout({ number: 0 })
  toggleAllCheckboxRow(config) {
    let ins = this.getInstance()
    ins.toggleCheckboxRow(config.row)
    this.onCheckboxChange(config)
  }
  onCheckboxChangeAll(config) {
    let ins = this.getInstance()
    ins.toggleAllCheckboxRow()
    this.onCheckboxChange(config)
  }
  getIsActiveEditCell(row, col) {
    let editType = this.getEditType()
    let canEdit = this.getIsEdit()
    if (canEdit == false) {
      return false //
    } //
    let editConfig = this.editConfig //
    let indexSet = editConfig.rowIndex
    let status = false
    if (editType == 'row') {
      let _index = row._index //
      if (indexSet.has(_index)) {
        status = true
      }
    } //
    if (editType == 'cell') {
      let _index = row._index //
      if (indexSet.has(_index)) {
        let colIndexSet = editConfig.colIndex
        let f = col.getField()
        if (colIndexSet.has(f)) {
          status = true
        } //
      }
    }
    if (editType == 'all') {
      status = true //
    }
    let _editType = col.getEditType()
    if (['boolean', 'bool'].includes(_editType)) {
      status = true //
    }
    return status //
  }
  onCellClick(config: VxeTableDefines.CellClickEventParams) {
    let row = config.row //
    let _index = row?._index
    this.startEditCell(config)
    let record = config.row //
    this.setCurRow(record) //
  }
  @useTimeout({ number: 10, key: 'setCurRow' }) //
  setCurRow(row, isProps = false) {
    let oldCurRow = this.tableData.curRow || {}
    if (toRaw(row) == toRaw(this.tableData.curRow)) return //
    this.tableData.curRow = row //
    let oldIndex = oldCurRow._index || '' //
    let newIndex = row._index || ''
    this.timeout['updateRecords__now'] = true
    let tableName = this.getTableName() //
    let onCurRowChange = this.config.onCurRowChange
    if (typeof onCurRowChange == 'function') {
      onCurRowChange({ row: row, oldRow: oldCurRow }) //
    }
  }
  @cacheValue()
  getRowConfig() {
    let drag = this.config.enableDragRow
    let config: any = {} //
    if (drag) {
      config.drag = true
    }
    return config
  }
  onEditCellMounted(config) {
    let instance = config.instance
    // console.log(instance, 'testInstance') //
    let editConfig = this.editConfig //
    let currentEditField = editConfig.currentEditField //
    let column = config.column
    let f = column.getField()
    let editType = this.getEditType()
    let row = config.row
    let _index = row._index
    if (['row', 'cell'].includes(editType)) {
      if (currentEditField == f) {
        if (
          typeof instance.focus == 'function' &&
          _index == editConfig.currentEditIndex
        ) {
          instance.focus() //
        }
      }
    }
  } //
  onHeaderCellContext(config) {
    let event: MouseEvent = config.event
    let column: XeColumn = config.column.params //
    this.curContextCol = column //
    let contextmenu: BMenu = this.getRef('contextmenu')
    if (contextmenu == null) {
      return
    }
    contextmenu.open(event) //
  }
  openContextMenu(config) {}
  hiddenColumn(field) {
    let columns = this.getFlatColumns()
    let _col = columns.find((col) => {
      return col.getField() == field
    })
    if (field == 'checkboxField') {
      return //
    } ////
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
  }
  getTableName() {
    let tableName = this.config.tableName
    return tableName //
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

      allCols: cols,
      tableName: this.getTableName(),
    }
    let ccnfig = this.config
    let onColumnsDesign = ccnfig.onColumnsDesign
    if (typeof onColumnsDesign == 'function') {
      onColumnsDesign(config) //
    }
  } //
  getFlatColumns() {
    let columns = this.getColumns()
      .map((col) => {
        return col.getFlatColumns()
      })
      .flat()
    return columns
  }
  onEditCellOutsizeClick(config) {
    let tCol = config.column.params
    let row = config.row
    let _index = row._index
    let editType = this.getEditType()
    let editConfig = this.editConfig //
    if (editType == 'row') {
      //
    }
    let currentEditF = this.editConfig.currentEditField
    let col = this.getFlatColumns().find((col) => {
      return col.getField() == currentEditF
    })
  }
  outClick(event, isIn = false) {
    this.clearEditCell()
  }
  getAllParentDivs(el: HTMLElement): HTMLElement[] {
    const parents: HTMLElement[] = []
    let current = el.parentElement

    while (current) {
      parents.push(current)
      // if (current.tagName.toLowerCase() === 'div') {
      // }
      current = current.parentElement
    }
    return parents
  }
  getallChildrenDivs(el: HTMLElement): any[] {
    //@ts-ignore
    let children: any[] = el?.children || []
    children = [...children] //
    return [
      el,
      ...children
        .map((el) => {
          return [...this.getallChildrenDivs(el)]
        })
        .flat(),
    ]
  }
  onBodyClick(config) {
    const event = config.event //
    let target: HTMLDivElement = event.target //
    let _targets = this.getAllParentDivs(target)
    _targets = [..._targets] //
    if (_targets.some((el) => el.classList.contains('vxe-body--row'))) {
      return
    }
    this.clearEditCell() //
  }
  async onBodyCellContext(config) {
    let event: MouseEvent = config.event
    let column: XeColumn = config.column.params //
    this.curContextCol = column
    this.curContextRow = config.row //
    this.curContextCol = column //
    let contextmenu: BMenu = this.getRef('contextmenu')
    if (contextmenu == null) {
      return
    }
    contextmenu.open(event) //
  }
  getTreeConfig() {
    let config = this.config //
    let treeConfig = config.treeConfig //
    let id = treeConfig?.id
    let parentId = treeConfig?.parentId
    if (id == null || parentId == null) {
      return null
    }
    let obj = {
      //
      rowField: id,
      parentField: parentId,
      transform: true,
    }
    return obj
  }
  onSortClick(config) {
    console.log(config, 'testSortConfig') //
  }
  onFilterIconClick(config) {
    // console.log(config, 'testConfig') //
    let column = config.column.params
    this.curContextCol = column
    this.openColumnFilter(config)
  }
  openColumnFilter(config) {
    let _this = reactive(this)
    let ins = _this.getInstance()
    let curContextCol = _this.curContextCol
    let field = curContextCol.getField()
    let tColumn = curContextCol
    let width = tColumn.getColumnWidth()
    _this.columnFilterConfig.width = width + 64 //
    if (_this.columnFilterConfig.width < 300) {
      _this.columnFilterConfig.width = 300 //
    }
    // let event = config.event
    let client: MouseEvent = config.event
    let x = client.clientX
    let y = client.clientY //
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
        let _data = this.getInstance().getData()
        if (this.getIsTree()) {
          let _d = _this.getFlatTreeData(_data) //
          _data = _d //
        }
        if (oldColumnFilter != null && oldColumnFilter === tColumn) {
          return //
        }
        let _data1 = [
          //
          ..._data.map((row) => {
            let obj = {
              ...row, //
              //@ts-ignore
              [field]: row[field], //
              //@ts-ignore
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
  getShowFilterTable() {
    let config = this.config
    let showFilterTable = config.showColumnFilterTable
    return showFilterTable
  }
  getTableState() {
    let tableState = this.tableState //
    return tableState //
  }
  getColumnConfig() {
    let config = this.config //
    let disableColumnResize = config.disableColumnResize
    let columnConfig: VxeTablePropTypes.ColumnConfig = {
      ...config.columnConfig,
    }
    if (disableColumnResize) {
      columnConfig.resizable = false
    } else {
      columnConfig.resizable = true
    }
    columnConfig.drag = true //
    // console.log(columnConfig, 'testColumnConfig') //
    return columnConfig //
  }
  onColumnResize(config) {
    // console.log(config, 'testConfig') //
    //
    let column: ColumnInfo = config.column
    let width = column.renderWidth
    let _column: XeColumn = column.params //
    _column.config.width = width
    let onDesignColumn = this.config.onDesignColumn
    if (typeof onDesignColumn == 'function') {
      onDesignColumn(_column, _column, false) //
    }
  }
  onColumnDragEnd(config: any) {
    setTimeout(() => {
      let ins = this.getInstance()
      let columns = ins.getColumns() //
      let orderFieldArr = columns.map((col, i) => {
        return {
          field: col.field,
          order: Number(i) + 1,
        }
      }) //
      this.changeSortOrder(orderFieldArr)
    }, 0)
  } //
  changeSortOrder(
    orderFieldArr: Array<{
      field: string
      order: number
    }>,
  ) {
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
        columns: columns.map((col) => {
          return col.config //
        }), //
        tableName: this.getTableName(),
        field: 'order',
      })
    }
  }
  @cacheValue()
  getColumnDragConfig() {
    let config = this.config //
    let dConfig: VxeTablePropTypes.ColumnDragConfig = {
      ...config.columnDragConfig,
    }
    dConfig.dragEndMethod = async (
      params: VxeTableDefines.ColumnDragendEventParams,
    ) => {
      let colInfos = this.getInstance().getColumns()
      let column = params.dragColumn //
      let allCol = params
      return true
    }
    return dConfig //
  }
  getIsEdit() {
    let tableState = this.getTableState() //
    return tableState == 'edit' //
  }
  @cacheValue()
  getMouseConfig() {
    return {
      selected: true,
    }
  } //
  onCellDblclick(config: VxeTableDefines.CellDblclickEventParams) {
    let row = config.row //
    let column: XeColumn = config.column.params //
    this.tableData.dbCurRow = row //
    let _config = this.config //
    let onDbCurRowChange = _config.onDbCurRowChange //
    if (typeof onDbCurRowChange == 'function') {
      onDbCurRowChange({
        row: row,
        field: column.getField(),
        value: row[column.getField()],
      }) //
    }
  }
  scrollToRow(config) {
    //
  }
  async validate() {
    return new Promise((resolve) => {
      let instance = this.getInstance()
      if (instance == null) {
        resolve(false)
        return
      }
      instance.validate().then((valid) => {
        if (valid) {
          resolve(true) //
        } else {
          resolve(false) //
        }
      })
    }) //
  }
  @cacheValue() //
  getEditRules() {
    let columns = this.getColumns()
    let rules = columns
      .map((col) => {
        let rules = col.getValidator()
        return {
          f: col.getField(),
          rules: rules,
        }
      })
      .reduce((res, item) => {
        res[item.f] = item.rules //
        return res
      }, {})
    // console.log(rules, 'testGetEditRules')
    return rules
  }
  getHeaderButtons() {
    let config = this.config //
    let buttons = config.buttons || []
    return buttons
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
  addRow(row: any, parentRow?: any) {
    let _index = row['_index']
    if (_index == null) {
      let _level = parentRow?.['_level']
      if (isNaN(_level)) {
        _level = 0
      } else {
        _level += 1
      }
      this.initDataRow(row, _level) //
    }
    if (parentRow != null) {
      let children = parentRow._children
      if (!Array.isArray(children)) {
        children = []
        parentRow.children = children
      }
      children.push(row) //
      // this.updateIndexArr.add(parentRow['_index']) //
    } else {
      let data = this.getData()
      data.push(row) //
    }
  }
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
      // this.setCurRow(lastD)
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
  startEditColumnTitle(config) {
    let column: XeColumn = config.column.params //
    column.isEditTitle = true
  }
  delCurRow() {
    let curRow = this.tableData.curRow

    let showData = this.getData()
    // let s = showData == this.config.data
    let _r = null
    let pData = showData
    let nextRow = null
    if (this.getIsTree()) {
      showData = this.getFlatTreeData(showData)
      let pRow = showData.find((row) => {
        let _children = row._children || []
        if (_children.includes(curRow)) {
          return true
        }
      })
      if (pRow == null) {
        showData = pData
        if (showData.includes(curRow)) {
          pRow = {
            _children: showData,
          }
        }
      }
      if (pRow) {
        let _children = pRow._children || []
        let index = _children.indexOf(curRow)
        if (index == -1) {
          return
        }
        _r = _children.splice(_children.indexOf(curRow), 1)
        nextRow = _children[index - 1]
        nextRow = nextRow || _children[0] || pRow
        if (nextRow['_index'] == null) {
          nextRow = null
        } //
      } //
    } else {
      let index = showData.indexOf(curRow)
      if (index == -1) {
        return
      }
      _r = showData.splice(index, 1) //
      nextRow = showData[index - 1]
      nextRow = nextRow || showData[0] //
    }
    if (_r == null) {
      return
    }
    // this.changeRowState(_r[0], 'delete')
    _r[0]['_rowState'] = 'delete' //
    let onDeleteRow = this.config.onDeleteRow
    if (typeof onDeleteRow == 'function') {
      onDeleteRow({ row: _r[0], rows: _r })
    }
    this.deleteArr.push(_r[0]) //
    nextTick(() => {
      if (nextRow != null) {
        this.setCurRow(nextRow)
      } //
    }) //
  }
  getTableHeight() {
    let config = this.config
    let height = config.height
    if (isNaN(height) || typeof height == 'string') {
      height = 'auto'
    } //
    return height
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
    } //
  }
  async clearData() {
    //
  }
  @cacheValue()
  async getRowDragConfig() {
    let config: VxeTablePropTypes.RowDragConfig = {}
    return config //
  }

  onCheckboxRangeEnd(config) {
    this.onCheckboxChange(config) //
  }
  updateFilterConfig(config) {
    //
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
    // let allCheck = config.allRows //
    let allCheck = config.records //
    allCheck.forEach((item) => {
      _config.indexArr.push(item._value) //
    })
    _config.indexArr = _config.indexArr.filter((item, index) => {
      return _config.indexArr.indexOf(item) === index //
    }) //去重
    this.columnFilterConfig.filterConfig = [...oldFilterConfig] //
  }
  onRowDragEnd(config) {
    let onRowDragEnd = this.config.onRowDragEnd //
    if (typeof onRowDragEnd == 'function') {
      onRowDragEnd({ ...config, table: this }) //
    }
  } //
  swapTwoRows(row1: any, row2: any) {
    if (typeof row1 == 'string' && typeof row2 == 'string') {
      row1 = this.dataMap[row1] //
      row2 = this.dataMap[row2] //
      if (row1 == null || row2 == null) {
        return false //
      }
    } //
    let data = this.getData()
    let index1 = data.indexOf(row1)
    let index2 = data.indexOf(row2)
    if (index1 == -1 || index2 == -1) {
      return false //
    }
    data[index1] = row2 //
    data[index2] = row1 //
    return
  }
  onColComDragStart(config: any) {
    let design = this.getMainPageDesign()
    // console.log('开始拖拽',design)//
    let row = config.row //
    let _row = JSON.parse(JSON.stringify(row)) //
    let _config = this.config
    if (design) {
      //
      design.setCurrentDragRow({
        row: _row,
        from: _config,
      })
    } //
  }
  onColComDragEnd(config: any) {}
  onColumnDragClick(config) {
    //
    let onColumnDragClick = this.config.onColumnDragClick
    if (typeof onColumnDragClick == 'function') {
      onColumnDragClick(config) //
    }
  }
}
