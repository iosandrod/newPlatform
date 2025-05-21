import { Base } from '@/base/base'
import { Form } from './form'
import { createPageDesignFieldConfig } from './pageDesignConfig'
import { FormItem } from './formitem'
import { Field } from './layoutType'
import { PageDesignItem } from './pageItem'
import { computed, isReadonly, nextTick } from 'vue'
import {
  _editLayout,
  _tData,
  _tData123,
  _testData,
  entityData,
} from './formEditor/testData'
import { useHooks, useOnce, useRunAfter } from './utils/decoration'
import { getDefaultPageProps } from './pageCom'
import { testBtnData } from './formEditor/testData1'
import {
  formitemTypeMap,
  getButtonGroupTableConfig,
  selectTypeMap,
} from './designNodeForm'
import { Table } from '@/table/table'
import { BMenu } from '@/buttonGroup/bMenu'
import { getDFConfig } from '@/table/colFConfig'
import _ from 'lodash'
import searchDialog from '@/dialog/_dialogCom/searchDialog'
interface Filter {
  /** 字段名 */
  field: string
  /** 操作符，默认 '$eq'（等于） */
  operator?:
  | '$eq'
  | '$ne'
  | '$gt'
  | '$gte'
  | '$lt'
  | '$lte'
  | '$in'
  | '$nin'
  | '$like'
  /** 值 */
  value: any
}
export class PageDesign extends Form {//
  tabHidden = false//
  hooksMetaData: Record<string, any[]> = {} //
  currentContextItem: PageDesignItem = null
  tabOrder: number = 0
  pageType = 'pageDesign' //
  tableType: 'main' | 'edit' | 'search' = 'main' //
  pageData: any = {
    searchBindData: {},
  }
  constructor(config) {
    super(config)
  }
  init(): void {
    let _props = getDefaultPageProps() //
    let config = this.config
    if (!isReadonly(config)) {
      let obj = {} //
      Object.entries(_props).forEach(([key, value]) => {
        //@ts-ignore
        let _default = value.default
        if (typeof _default == 'function' && value.type != Function) {
          //@ts-ignore
          _default = _default() //
        }
        obj[key] = _default //
      })
      Object.entries(obj).forEach(([key, value]) => {
        if (config[key] == null && value != null) {
          //
          config[key] = value
        }
      })
    }
    super.init()
    let tableName = this.getTableName()
    this.tableDataMap[tableName] = {
      data: [],
      curRow: {},
    } //
  }
  initSearchForm() {
    let _config = this.config //
    let searchDialog = _config.searchDialog
    if (searchDialog == null) {
      _config.searchDialog = searchDialog //
      searchDialog = _config.searchDialog
    } //
    // let _f=new Form(searchDialog)
  }
  getTabTitle() {
    let config = this.config //
  }
  setItems(items: any, setLayout?: boolean): void {
    if (!Array.isArray(items)) {
      return
    }
    this.items.splice(0) //
    for (const item of items) {
      this.addFormItem(item)
    }
    if (setLayout == true) {
      //
      let pcLayout = this.getPcLayout()
      let mobileLayout = this.getMobileLayout()
      let layout = {
        pc: pcLayout,
        mobile: mobileLayout,
      }
      let fields = this.getFields()
      let obj = {
        fields,
        layout, //
        list: [], //
      }
      this.setLayoutData(obj)
    }
  }
  addFormItem(config): any {
    let type = config.type
    if (type == 'buttonGroup') {
      config.type = 'buttongroup' //
    }
    let _item = new PageDesignItem(config, this) //
    if (config.type == 'entity') {
      let options = config.options
      let tableName = options?.tableName
      if (tableName != null) {
        let tableConfigMap = this.tableConfigMap
        if (tableConfigMap[tableName] == null) {
          tableConfigMap[tableName] = options
        }
      }
    }
    //@ts-ignore
    this.items.push(_item) //
    return _item //
  }
  getDesignFieldConfig() {
    return createPageDesignFieldConfig() //
  }
  //设置默认模板
  initDefaultTemplatePage() { }
  getValidateRules() {
    return []
  }
  getTableName() {
    let tableName = this.tableName
    if (tableName == null) {
      let config = this.config
      tableName = config.tableName
      this.tableName = tableName
    } //
    tableName = tableName || '' //
    return tableName //
  }
  async getDetailTableData(dTableName: any) {
    if (typeof dTableName == 'string') {
      dTableName = {
        tableName: dTableName,
      }
    }
    let curRow = dTableName['curRow']
    if (curRow == null) {
      //主表当前行
      curRow = this.getCurRow()
    }
    let targetItem = this.items.find(
      (item) => item.getTableName() == dTableName.tableName,
    )
    if (targetItem == null) {
      return
    }
    let relateKey = targetItem.getRelateKey()
    let mainRelateKey = targetItem.getMainRelateKey()
    if (relateKey == null || mainRelateKey == null) {
      //
      this.getSystem().confirmMessage('未设置关联字段', 'error') //
      return
    }
    let query = {
      [relateKey]: curRow[mainRelateKey],
    }
    let tableName = dTableName.tableName ////
    let res = await this.getTableData({
      tableName,
      query,
    }) //
    return res
  }

  async getTableData(
    getDataConfig: any = {
      tableName: this.getTableName(),
      query: {}, //
    },
  ) {
    if (typeof getDataConfig == 'string') {
      getDataConfig = {
        tableName: getDataConfig,
      }
    }
    let tableName = getDataConfig.tableName //
    let http = this.getHttp()
    let query = getDataConfig.query || {}
    let res = await http.get(tableName, 'find', query) //
    let dataMap = this.getTableRefData(tableName)
    dataMap['data'] = res //
    let evName = `${tableName}_getTableData` //
    let _config = {
      event: evName,
      data: res,
    }
    await this.publishEvent(_config) //
    return res
  }
  //
  async setCurRow(row, tableName = this.getTableName()) {
    let dataMap = this.getTableRefData(tableName)
    dataMap['curRow'] = row
    let evName = `${tableName}_setCurRow`
    let _config = {
      data: row,
      event: evName,
    } //
    await this.publishEvent(_config)
    return row
  }
  buildQuery(filters: Filter[]): Record<string, any> {
    // 没有条件，返回空对象
    if (!filters || filters.length === 0) {
      return {}
    }

    // 辅助：把单条 Filter 转成 { field: { $op: value } } 或 { field: value }
    const buildCond = (f: Filter) => {
      const op = f.operator || '$eq'
      // 如果是等于，用直接赋值；其它操作符用 {$op: value}
      if (op === '$eq') {
        return { [f.field]: f.value }
      }
      return { [f.field]: { [op]: f.value } }
    }
    // 只有一条条件，直接返回
    if (filters.length === 1) {
      return buildCond(filters[0])
    }
    // 多条条件，默认用 AND 连接
    return {
      //
      $and: filters.map(buildCond),
    }
  } //
  async createTableData() { }
  async updateTableData() { }
  async getDefaultValue(tableName: string) {
    let columns = this.getTableColumns(tableName, true) //
    let obj1 = {}
    for (const col of columns) {
      let defaultValue = await col.getDefaultValue()
      if (defaultValue) {
        obj1 = { ...obj1, ...defaultValue } //
      }
    } //
    return obj1
  }
  getTableColumns(tableName = this.getTableName(), isClass = false) {
    let tableIns = this.getRef(tableName)
    let columns = []
    if (tableIns != null) {
      columns = tableIns.getColumns().map((col) => {
        if (isClass) {
          return col //
        }
        let config = col.config
        return config //
      })
    } else {
      columns = this.getTableConfig().columns
    }
    if (Array.isArray(columns)) {
      return columns
    } //
    return []
  }
  getMainTableConfig() { }
  // @useRunAfter()
  async addTableRow(data, tableName = this.getTableName()) {
    if (data == null) {
      data = await this.getDefaultValue(tableName)
    }
    return data
  } //
  getAddRowsArgs() {
    return {
      rows: 1,
      tableName: this.getTableName()
    } as any
  }//
  @useHooks((config) => {
    let ctx: PageDesign = config.instance //
    let args = config.args
    if ((args.length = 0)) {
      args[0] = ctx.getAddRowsArgs()
    } //
  })
  async addTableRows(
    //
    config = this.getAddRowsArgs()
  ) {
    let rows = config.rows
    let tableName = config.tableName
    if (typeof rows == 'number') {
      rows = Array(rows).fill(null)
    }
    let arr1 = []
    for (let i = 0; i < rows.length; i++) {
      let d = await this.addTableRow(rows[i], tableName)
      arr1.push(d) //
    }
    let tableIns = this.getTableRef(tableName)
    if (tableIns == null) {
      return
    }//
    tableIns.addRows({ rows: arr1 })//
  }
  getTableRef(tableName = this.getTableName()) {
    let tableIns = this.getRef(tableName)
    return tableIns //
  }
  async saveTableDesign() {
    //获取表格的id配置
    let config = this.config
    let id = config.id
    if (id == null) {
      await this.createTableDesign()
    } else {
      //
      await this.updateTableDesign()
    }
    nextTick(() => {
      this.setCurrentDesign(false) //
      this.getSystem().refreshPageDesign()//
    })
  }
  async createTableDesign() {
    let _data = this.getLayoutData()
    //@ts-ignore
    _data.tableName = this.getMainTableName()
    let http = this.getHttp()
    let _res = await http.create('entity', _data) // //
    // console.log(_res)
  }
  async updateTableDesign() {//
    let _data = this.getLayoutData() //
    let http = this.getHttp()
    let _config = this.config
    let _config1 = { ..._config, ..._data, id: _config.id } //
    await http.patch(`entity`, _config1) //
    this.getSystem().confirmMessage('保存成功', 'success')//
    console.log('保存成功') //
  }
  getMainTableName() {
    let config = this.config
    let tableName = config.tableName
    if (!tableName) {
      tableName = this.tableName
    }
    return tableName //
  }
  getAllFormMap() { }
  @useOnce()
  initDefaultDForm() {
    super.initDefaultDForm() //
  } //
  initDefaultSForm() { }
  //打开编辑页面
  async openEditEntity() {
    let tableName = this.tableName
  }
  //打开添加页面
  async openAddEntity() { }
  async addMainTableRow(addConfig?: any) {
    //
    //
  }
  getRealTableName() {
    let tableName = this.getTableName() //
    let nameArr = tableName.split('---')
    if (nameArr.length == 2) {
      tableName = nameArr[0]
    }
    return tableName //
  }
  getAllDetailTable() {
    let allTable = this.getAllTable()
    let dTables = allTable.filter((t) => {
      return t.getEntityType() == 'detail'
    })
    return dTables //
  }
  getAllTable() {
    let items = this.items
    let _items = items.filter((item) => {
      let isEn = item.isEntity()
      return isEn //
    })
    return _items
  }
  async addEditTableRow() {
    let nRow = await this.createDefaultRow()
    let tData = this.getTableRefData()
    tData.curRow = nRow
    let detailTables = this.getAllDetailTable()
    let allTableNames = detailTables.map((t) => {
      let tableName = t.getTableName()
      return tableName
    })
    for (const name of allTableNames) {
      await this.addDetailTableRow(name, 10) //
    }
  }
  setLayoutData(d) {
    super.setLayoutData(d) //
    let allFields = this.state.fields
    let allEnFields = allFields.filter((f) => {
      let type = f.type
      if (type == 'entity') {
        return true
      }
      return false
    })
    for (const en of allEnFields) {
      let tableName = en.tableName
      if (tableName != null) {
        let tableConfigMap = this.tableConfigMap
        tableConfigMap[tableName] = en
        let tableDataMap = this.tableDataMap
        tableDataMap[tableName] = {
          curRow: null,
          data: [],
        }
      }
    } //
    let tableName = this.getTableName() //
    if (this.tableConfigMap[tableName] == null) {
      this.tableConfigMap[tableName] = this.config //
      // this.config.columns=this.getTableColumns(tableName)
    }
  }
  public use(method: string, fn: any) {
    if (!this.hooksMetaData[method]) {
      this.hooksMetaData[method] = []
    }
    this.hooksMetaData[method].push(fn)
  }
  async createDefaultRow(tableName = this.getTableName()) {
    let tableConfig = this.getTableConfig(tableName) //
    let columns = tableConfig.columns
    let obj = {}
    for (const col of columns) {
      let defaultValue = col['defaultValue'] //
      if (defaultValue != null) {
        let field = col.field
        let _obj = {
          [field]: defaultValue, //
        }
        obj = { ...obj, ..._obj }
      }
    }
    return obj //
  }
  getTableConfig(tableName = this.getTableName()) {
    let tableConfigMap = this.tableConfigMap
    let _config = tableConfigMap[tableName]
    if (_config == null) {
      let _config = this.config
      let _tableName = _config.tableName
      if (_tableName == tableName) {
        let _config1 = _config.tableConfig
        tableConfigMap[tableName] = _config1
        _config = _config1
      }
    } //
    return _config //
  }
  async addDetailTableRow(tableName?: string, row?: any) {
    //
    let tTable: Table = this.getRef(tableName)
    if (row == null) {
      row = 1
    } //
    if (tTable == null) {
      return
    }
    if (typeof row == 'number') {
      await tTable.addRows(row)
    } else if (Array.isArray(row)) {
      await tTable.addRows({
        rows: row,
      })
    } else {
      await tTable.addRows({
        rows: [row], //
      })
    }
  }
  getTableCnName() {//
    // debugger////
    let config = this.getTableConfig()
    let tableCnName = config.tableCnName || this.getTableName() //
    return tableCnName //
  }
  getAllTableName() {
    let tableName = this.getRealTableName()
    let dTableName = this.getAllDetailTable().map((d) => d.getTableName())
    return [tableName, ...dTableName]
  }
  getAllTableNameOptions() {
    let tableName = this.getRealTableName()
    let tCnName = this.getTableCnName()
    let dTableOptions = this.getAllDetailTable().map((t) => {
      let tName = t.getTableName()
      let tCnName = t.getTableCnName()
      return {
        label: tCnName,
        value: tName,
      }
    })
    let arr = [{ label: tableName, value: tCnName }, ...dTableOptions]
    return arr //
  }
  async saveEditPageData() {
    let realTableName = this.getRealTableName() //
    let curRow = this.getCurRow() //
    let detailTable = this.getAllDetailTable()
    let dRefs = detailTable.map((d) => {
      let fCom = { table: d.getRef('fieldCom'), item: d }
      return fCom //
    })
    let _data = dRefs
      .map((t1) => {
        let t: Table = t1.table
        let item: PageDesignItem = t1.item
        let tableName = t.getTableName()
        let d = t.getData()
        let obj = {
          [tableName]: {
            tableName,
            data: d,
            relateKey: item.getRelateKey(),
            mainRelateKey: item.getMainRelateKey(),
          },
        }
        return obj
      })
      .reduce((a, b) => {
        let obj = { ...a, ...b } //
        return obj //
      }, {})
    curRow['_relateData'] = _data
    let http = this.getHttp()
    try {
      let _res = await http.create(realTableName, curRow)
    } catch (error) {
      console.log(error, '报错了') //
      let system = this.getSystem()
      system.confirmMessage('保存失败', 'error')
    }
  }
  getCurRow(tableName = this.getRealTableName()) {
    //
    // let tRef: Table = this.getRef(tableName)
    // let curRow = null
    // let _tableName = this.getTableName()
    // if (tRef == null) {
    //   curRow = this.tableDataMap[_tableName]?.curRow ////
    // } else {
    //   curRow = tRef.getCurRow()
    // }
    // return curRow //
    let curRow = this.tableDataMap[tableName]?.curRow
    return curRow //
  }
  getTableRefData(tableName = this.getTableName()) {
    let tableDataMap = this.tableDataMap
    let _data = tableDataMap[tableName]
    if (_data == null) {
      tableDataMap[tableName] = {}
      _data = tableDataMap[tableName] //
    }
    return _data
  }
  getTableMainKey(tableName = this.getTableName()) {
    let tableConfig = this.getTableConfig(tableName) //
    console.log(tableConfig, 'testTableConfig') //
    let columns = tableConfig.columns || []
    let mainCol = columns.find((col) => {
      return col.primary != null //
    })
    return mainCol //
  }
  //获取编辑表格的数据
  async getEditTableData(query) {
    let mcol = this.getTableMainKey() //
    let _query = query || {}
    if (query == null) {
      // this.getSystem().confirmMessage('未设置查询条件', 'error') //
      return null
    }
    let tableName = this.getRealTableName()
    let http = this.getHttp()
    let _data = await http.find(tableName, query) //
    console.log(_data, 'testData') //
    return _data
  }
  getMainContextItems() {
    return [
      {
        label: '设计当前列',
        fn: async () => {
          let currentDesignField = this.currentDField
          let system = this.getSystem()
          let currentContextItem = this.currentContextItem
          let config = currentContextItem.config
          let id = config.id
          if (id == null) {
            return
          } //
          let fCom: Table = currentContextItem.getRef('fieldCom')
          // console.log(fCom, 'fCom') ////
          let currentContextCol = fCom.curContextCol
          let f = currentContextCol.getField()
          let tName = currentContextCol.getTableName()
          if (tName == this.getTableName()) {
            await system.designTableColumns(tName, f) //批量修改//
          } else {
            let _config = _.cloneDeep(config) //
            await system.designTargetColumn(_config) //
          }
        },
        visible: computed(() => {
          let currentItem = this.currentContextItem
          let _type = currentItem?.config?.type
          if (_type == 'entity') {
            return true
          }
          return false //
        }),
        disabled: false,
      },
      {
        label: '设计其他',
        fn: async () => {
          console.log('设计其他') //
        },
      },
      {
        label: '设计按钮',
        fn: async () => {
          this.designMainButtons(this.currentContextItem) //
        },
        visible: computed(() => {
          let currentItem = this.currentContextItem
          let _type = currentItem?.config?.type
          if (_type == 'buttongroup') {
            //
            return true
          }
          return false //
        }),
      },
    ]
  }
  async designMainButtons(item) {
    //
    let _item: PageDesignItem = item
    if (item == null) {
      return
    }
    let options = _item.getOptions()
    let items = options?.items
    if (!Array.isArray(items)) {
      options.items = [] //
      items = options.items
    }
    items = _.cloneDeep(items)
    let tableConfig: any = getButtonGroupTableConfig(this) //
    tableConfig.data = items
    tableConfig.height = 500
    tableConfig.width = 800
    let sys = this.getSystem()
    let _data = await sys.confirmTable(tableConfig) //
    options.items = _data
    await this.getSystem().updateCurrentPageDesign()
  }
  openContextMenu(e, _item?: any) {
    // debugger//
    this.currentContextItem = _item //
    let menu: BMenu = this.getRef('mainContextMenu')
    if (menu == null) {
      return
    } //
    menu.open(e) //
  }
  getHomeTabLabel() {
    let tName = this.getTableName() //
    let cnName = this.getTableCnName() //
    let rTableName = this.getRealTableName()
    return {
      label: cnName,
      realTableName: rTableName,
      hidden: this.tabHidden,
      value: tName,
      tableName: tName, //
      name: tName,
      order: this.tabOrder,
    }
  }
  async designPageDialog() {
    let config = this.config //
    let dialog = config.dialog // is Array
    if (!Array.isArray(dialog)) {
      dialog = []
      config.dialog = dialog
    }
  } //
  async openSearchDialog() {
    let _searchDialog = this.config.searchDialog
    if (_searchDialog == null) {
      _searchDialog = {} //
    }
    let dialogConfig = {
      width: '800px',
      height: '600px',
      title: '查询弹框',
      buttons: [
        {
          label: '重置条件',
          fn: () => {
            console.log('重置条件')
          },
        },
      ],
      createFn: () => {
        return {
          component: searchDialog,
          props: {
            pageDesign: this,
          },
        }
      },
      confirmFn: (dialog) => {
        this.getTableData() //
      }, //
    }
    //打开查询弹框//
    this.openDialog(dialogConfig)
    // let sys = this.getSystem()
    // let _data = await sys.openDialog(dialogConfig)
    // console.log(_data, 'testData') //
  }
  async designSearchForm() {
    let searchDialog = this.config.searchDialog
    if (searchDialog == null) {
      searchDialog = {} //
    }
    searchDialog.tableName = this.getRealTableName()
    let sys = this.getSystem()
    let _data: any = await sys.confirmDesignForm(searchDialog) //
    _data = _data || {}
    _data = { ...searchDialog, ..._data } ////
    let _data1 = this.getLayoutData()
    _data1.searchDialog = _data //
    await this.getSystem().updateCurrentPageDesign(_data1) //
  }
  getSearchBindData() {
    let _d = this.pageData
    let sbd = _d.searchBindData
    if (sbd == null) {
      _d.searchBindData = {}
      sbd = _d.searchBindData
    }
    return sbd
  }
  async syncRealColumns() {
    let tRef = this.getRef(this.getTableName())
    if (tRef == null) {
      return
    }
    let tableName = this.getTableName()
    // let tConfig = this.getTableConfig(tableName)
    // console.log(tConfig, 'test_config')//
    let cols = this.getTableColumns(tableName)
    let columns = cols.map((col) => {
      return col?.config || col //
    })
    // let columns = tConfig.columns
    let tCols = await this.getHttp().find('columns', { tableName })
    let addCols = columns
      .filter((c) => {
        return (
          tCols.findIndex((tc) => {
            return tc.field == c.field
          }) == -1
        )
      })
      .map((row) => {
        row.id = null
        return row
      }) //
    await this.getHttp().create('columns', addCols)
    this.getSystem().confirmMessage('同步成功', 'success') //
  }
  getSearchWhere(data) {
    let columns = this.getTableColumns()
    let _arr = []
    for (const col of columns) {
      let obj = {}
      let searchF = col.searchField || col.field //
      let searchOperator = col.searchOperator //查询操作符
      let eArr = [
        '$eq',
        '$neq',
        '$gt',
        '$gte',
        '$lt',
        '$lte',
        '$in',
        '$nin',
        '$like',
      ]
      if (eArr.indexOf(searchOperator) == -1) {
        searchOperator = '$eq'
      }
      //查询条件
      // if (searchOperator == null) {
      //   searchOperator='$eq'
      //   let _v = data[searchF]
      //   if (_v != null) {
      //     obj[searchF] = _v //
      //     _arr.push(obj) //
      //   }
      // } else {
      // let _value = data[searchF]
      // if (_value != null) {
      //   let _obj = this.buildWhereInOperator({
      //     value: _value,
      //     field: searchF,
      //     operator: searchOperator,
      //   })
      //   _arr.push(_obj)
      // }
      // }
      let obj1 = {
        field: searchF,
        operator: searchOperator,
        value: data[searchF],
      }
      if (obj1.value != null) {
        _arr.push(obj1)
      }
    }
    let q = this.buildQuery(_arr)
    return q //
  } //
  buildWhereInOperator(config: any) {
    return {}
  }
  setCurrentEdit() {
    this.setCurrentDesignState('edit')
  }
  setCurrentView() {
    this.setCurrentDesignState('scan')
  }
  setCurrentDesignState(state) {
    if (['scan', 'edit'].indexOf(state) == -1) {
      return
    }
    this.tableState = state
    let allTableName = this.getAllTableName()
    allTableName.forEach((tableName) => {
      let table = this.getRef(tableName)
      if (table == null) {
        return
      } //
      table.setTableState(state) //
    })
  }
  confirmFieldSelect() {
    //
  }
  getSaveData() {
    let tableName = this.getTableName() //
    let tRef: Table = this.getRef(tableName)
    let d = tRef.getData()
    let addData = d.filter((row) => {
      let rowState = row['_rowState']
      return rowState == 'add'
    })
    let updateData = d.filter((row) => {
      let rowState = row['_rowState']
      return rowState == 'change' //
    })
    let delData = tRef.deleteArr
    return {
      addData: addData,
      patchData: updateData,
      delData: delData, //
    }
  }
  @useHooks((config) => {
    let ctx: PageDesign = config.instance //
    let args = config.args
    if ((args.length = 0)) {
      args[0] = ctx.getSaveData()
    } //
  })
  async saveTableData(config = this.getSaveData()) {
    let tName = this.getRealTableName()
    let http = this.getHttp()
    await http.runCustomMethod(tName, 'batchUpdate', config) //批量更新//
    this.getSystem().confirmMessage('数据保存成功', 'success') //
    this.getTableData() //
    this.setCurrentView() //
  }
  async updateTableColumn(config, refresh = true) {
    if (Array.isArray(config)) {

    } else {
      config = [config]
    }
    config = config.filter(c => { return c.id != null })
    if (config.length == 0) {
      return
    }
    let http = this.getHttp()
    await http.patch('columns', config) //
    if (refresh == true) {
      this.getSystem().confirmMessage('列数据更新成功', 'success') ////
      this.getSystem().refreshPageDesign() //
    }
  }
  onBeforeEditCell(config) {
    let tableState = this.tableState
    // console.log('编辑之前我做了这些处理') //
    if (tableState == 'scan') {
      return false //
    }
  }
  onColumnResize(config) {
    //
  }
  printCurrentPage() {
    console.log('开始打印') //
  }
  getColumnSelectTreeData() {
    //
    let allTableConfig = this.tableConfigMap
    let allCols = Object.values(allTableConfig).map((t: any) => {
      let columns = t.columns
      let _cols = _.cloneDeep(columns)
      //
      let _obj = {
        title: t.tableName,
        children: _cols, //
      } //
      // let obj = {
      //   tableName: t.tableName,
      //   columns: columns
      // }
      return _obj
    })
    return allCols //
  }
  getBindPageProps() {
    //
  }
  onColumnConfigChange(config) {
    // debugger//
    let tableName = config.tableName//
    let _tableName = this.getTableName()
    let columns = config.columns//
    if (tableName == _tableName) {
      if (Array.isArray(columns)) {

      } else {
        columns = [columns]
      }//
      let field = config.field
      if (field == null) {
        return
      }
      columns = columns.map(col => {
        let id = col.id
        let fV = col[field]
        return { id: id, [field]: fV }
      }).filter(c => { return c.id != null })//
      this.updateTableColumn(columns, false)//
    }
  }
}
