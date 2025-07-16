import { Base } from '@ER/base'
import { Table } from './table'
import { shallowRef, toRaw } from 'vue'
import { XeColumn } from './xecolumn'
import {
  VxeComponentEvent,
  VxeGridInstance,
  VxeTableDefines,
  VxeTableEvents,
} from 'vxe-table'
import { cacheValue, useRunAfter, useTimeout } from '@ER/utils/decoration'
import { XeCheckColumn } from './xeCheckColumn'
import { combineAdjacentEqualElements } from '@ER/utils'
import { nextTick } from 'vue'
import { BMenu } from '@/buttonGroup/bMenu'
import { initXeContextItems } from './xetableFn'

export class XeTable extends Base {
  config: any //
  canClearEditCell = true
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
  seriesNumberColumn: any
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
  initSeriesNumberColumn() {}
  initGlobalSearch() {}
  initCurrentContextItems() {
    initXeContextItems(this) //
  } //
  initTableState() {}
  getEditType() {
    let type = 'cell' //
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
      let o1 = c1.order
      let o2 = c2.order
      return o1 - o2 //
    })
    _col1 = [...lfsCols, ...sCols, ...rfsCols]
    if (_show) {
      let cCol = this.checkboxColumn
      _col1.unshift(cCol.getColumnProps())
    } //
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
    let treeConfig = this.treeConfig
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
      this.templateProps.data = _data3
      nextTick(() => {
        this.updateCanvas() //
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
    console.log(_columns, 'testColumns') //
    instance.loadColumn(_columns) //
  }
  @cacheValue()
  getHeaderCellConfig() {
    return {
      height: 30,
      padding: false, //
    }
  }
  setTableState(state: 'edit' | 'scan') {} //
  getGlobalSearchProps() {
    return {} //
  } //
  showGlobalSearch(bool) {}
  @useRunAfter()
  @useTimeout({ number: 300, key: 'updateTimeout' })
  updateCanvas() {
    let data = this.templateProps.data //
    let instance = this.getInstance() //
    if (instance == null) {
      return
    }
    instance.loadData(data)
  }
  onMounted() {
    this.loadData() //
    this.updateColumns()
    this.updateCanvas() //
    // this.update
  }
  getInstance(): VxeGridInstance {
    let grid = this.getRef('xeGrid') //
    return grid
  }
  jumpToSearchNext(bool) {} //
  expandAllTreeRow() {} //
  getCanClearEditCell(config?: any) {
    let editType = this.getEditType()
    if (editType == 'all') {
      return true //
    }
    if (editType == 'cell') {
      return this.canClearEditCell
    }
    if (editType == 'row') {
      return this.canClearEditCell //
    }
  }
  //开始编辑
  clearEditCell() {
    let editConfig = this.editConfig
    let rowIndex = editConfig.rowIndex //
    let colIndex = editConfig.colIndex
    let canClearEditCell = this.getCanClearEditCell()
    editConfig.currentEditField = null //
    editConfig.currentEditIndex = null //
    rowIndex.clear() //
    colIndex.clear() //
  } //
  startEditCell(config) {
    let record = config.row //
    let _index = record._index //
    let editConfig = this.editConfig
    let rowIndex = editConfig.rowIndex
    let editType = this.getEditType()
    if (rowIndex.has(_index) && editType == 'row') {
      return
    } //
    this.clearEditCell() //
    let colIndex = editConfig.colIndex
    let column: XeColumn = config?.column?.params
    let f = column.getField()
    editConfig.currentEditField = f //
    editConfig.currentEditIndex = _index //
    rowIndex.add(_index) //
    colIndex.add(f) //
  }

  expandTargetRows(data) {}
  copyCurrentCell() {} //
  @cacheValue()
  getCellConfig() {
    return {
      height: 30,
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
    return {
      checkField: 'checkboxField',
      range: true,
    } //
  }
  getIsFilterTable() {
    return false
  } //
  getDefaultWidth() {
    return 150 //
  }
  onCheckboxChange(config) {
    let ins = this.getInstance()
    ins.toggleCheckboxRow(config.row)
  }
  onCheckboxChangeAll(config) {
    let ins = this.getInstance()
    ins.toggleAllCheckboxRow()
  }
  getIsActiveEditCell(row, col) {
    let editType = this.getEditType()
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
    return status //
  }
  onCellClick(config: VxeTableDefines.CellClickEventParams) {
    let row = config.row //
    let _index = row?._index
    this.startEditCell(config)
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
  hiddenColumn(field) {}
  getTableName() {
    let tableName = this.config.tableName
    return tableName //
  }
  onColumnsDesign(config) {}
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
  onBodyClick(event) {
    //
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
}
