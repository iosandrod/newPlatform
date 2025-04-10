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
import { ListTable, ListTableConstructorOptions, } from '@visactor/vtable'
import { VTable } from '@visactor/vue-vtable'
import { method } from 'lodash'
import { exportVTableToExcel } from '@visactor/vtable-export'
import _ from 'lodash'
import * as equal from '@/packages/utils/equal'
import { BaseTableConstructorOptions } from '@visactor/vtable/es/ts-types/base-table'
import { BMenu } from '@/buttonGroup/bMenu'
import {
  click_cell,
  contextmenu_cell,
  icon_click,
  scroll,
  selected_cell,
  sort_click,
} from './tableEvent'
import { SortState } from 'element-plus'
import { combineAdjacentEqualElements } from '@ER/utils'
import { VxeInputEvents, VxeInputProps } from 'vxe-table'
import { VxeInputEventProps } from 'vxe-pc-ui'
import { Dropdown } from '@/menu/dropdown'
export class Table extends Base {
  globalConfig = {
    value: '',//
    show: false//
  }
  columnFilterConfig: any = {}//
  dataMap = {}
  updateIndexArr = new Set() //
  effectPool = shallowRef({})
  clickOpt = 1
  permission: { [key: string]: boolean } = {
    loadData: true,
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
  selectCache: any = {}
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
    this.setData(data)
    this.setColumns(columns) //
    this.initSortState()
    this.initGlobalSearch()
  }
  initGlobalSearch() {
    let config = this.config
    let show = config.showGlobalSearch
    if (show == true) {
      this.globalConfig.show = true//
    }
  }
  setData(data) {
    this.tableData.data = data
    data.forEach((e) => {
      if (e['_index'] == null) {
        e._index = this.uuid()
        this.dataMap[e._index] = e
      }
      if (e['_shtml'] == null) {
        let _v = Object.entries(e).reduce((res, [k, v]) => {
          res += `${v}  ^^^`
          return res
        }, '')
        e['_shtml'] = _v
      }
    }) //
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
      rowSeriesNumber: {
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
      },
      editCellTrigger: 'click',
      customConfig: {
        createReactContainer: true, //
      },
      //头部的
    }) //
    const emitEventArr = [
      'icon_click',//
      'contextmenu_cell',
      'sort_click',
      'selected_cell',
      'scroll',
      'click_cell'
    ]
    emitEventArr.forEach(item => {
      //@ts-ignore//
      table.on(item, (config) => {
        this.emit(item, config)
      })
    })
    // table.on('contextmenu_cell', (config) => {
    //   this.emit('contextmenu_cell', config)
    // })
    // table.on('sort_click', (config) => {
    //   this.emit('sort_click', config)
    //   return true //
    // })
    // table.on('selected_cell', (config) => {
    //   this.emit('selected_cell', config)
    // }) //
    // table.on('scroll', (config) => {
    //   this.emit('scroll', config) ////
    // })
    // table.on('click_cell', (config) => {
    //   this.emit('click_cell', config) ////
    // })
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
  setSortState(config) {
    console.log(config, 'setState123132') //
    if (!Array.isArray(config)) {
      return
    }
    // let sortCache = this.sortCache
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
              console.error(error)
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
    icon_click(this)//
  }
  setCurTableSelect() { }
  openContextMenu(config) {//
    console.log(config, 'test_config')//
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
  getFlatColumns() {
    const columns = this.columns
      .map((col) => {
        return col.getSubColumns()
      })
      .flat() //
    return columns
  }
  getOptions() {
    let tempalteProps = this.templateProps
    return {
      ...tempalteProps,
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
    return _col1 //
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
    if (this.permission.loadData == false) {
      return //
    }
    let data = this.getShowData() //
    let _data = data
    let instance = this.getInstance() //
    if (instance == null) {
      return
    }
    let sortState = this.sortCache
    let _data1 = toRaw(_data)
    let _sortState = toRaw(sortState)
    let globalValue = this.globalConfig.value
    if (globalValue.length > 0) {//
      _data1 = _data1.filter(v => {
        let _shtml = v['_shtml']//
        let reg = new RegExp(globalValue, 'g')//
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
          i,
          // colType,
          // type,
          type,
          order,
        )
        return _data4
      }, _data1)
      .flat(sortconfig?.length)
    // console.log(_data3, 'testData3') ///
    nextTick(() => {
      instance.setRecords(_data3) ////
      this.runAfter({
        methodName: 'loadData',
        config: loadConfig,
        data: data,
      }) //
    })
    try {
    } catch (error) {
      console.error(error) //
    }
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
  async runBefore(config?: any) { }
  runAfter(config?: any) {
    //
    if (config == null) {
      return
    }
    let methodName = config.methodName //
    let cacheMethod = this.cacheMethod
    let method = cacheMethod[methodName] || {}
    let after = method.after || []
    for (const fn of after) {
      fn(config)
    }
    // cacheMethod[methodName].after = []
    if (cacheMethod?.[methodName]?.after != null) {
      cacheMethod[methodName].after = [] //
    }
    let staticCacheMethod = this.staticCacheMethod
    let staticMethod = staticCacheMethod[methodName] || {}
    let staticAfter = staticMethod.after || []
    for (const fn of staticAfter) {
      fn(config)
    } //
  }
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
        item['_shtml'] = _v//
      }
    })
    for (const row of _arr) {
      this.addRow(row)
    }
    let data = this.getData()
    let lastD = data[data.length - 1]
    this.addAfterMethod({
      methodName: 'loadData',
      fn: () => {
        nextTick(() => {
          this.setCurRow(lastD)
          this.scrollToRow({
            row: lastD,
          })
          this.updateCanvas() //
        })
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
    columns.forEach((item) => { })
    instance.release()
    this.instance = null //
  }
  updateCanvas() {
    let instance = this.getInstance()
    let records = instance.records
    instance.setRecords(records) //
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
    }, 200)//
    let obj: VxeInputEventProps & VxeInputProps = {
      onChange: changeFn,
    }
    return obj//
  }
  updateGlobalSerach(value: any) {
    console.log(value, 'isChageValue')//
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
    let event = config.event
    let client = event.client
    let x = client.x
    let y = client.y
    this.columnFilterConfig.x = x
    this.columnFilterConfig.y = y//
    const pulldownMenu: Dropdown = this.getRef('columnDropdown')
    if (pulldownMenu == null) {
      return
    }
    this.permission.canCloseColumnFilter = false
    setTimeout(() => {
      this.permission.canCloseColumnFilter = true
    }, 400);
    nextTick(() => {
      pulldownMenu.showDropdown()//
    })
  }//
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
}
//
