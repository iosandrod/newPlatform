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
import { useHooks, useOnce, useRunAfter, useTimeout } from './utils/decoration'
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
import { columnToEdit, stringToFunction } from './utils'
import { VxeUI } from 'vxe-pc-ui'
import * as XLSX from 'xlsx' //
import { Column } from '@/table/column'
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
export class PageDesign extends Form {
  isEdit = false
  timeout: any = {}
  isConfirm = false //
  isDialog = false
  tabHidden = false //
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
    let methods = config?.methods
    let msg = [] ///
    if (Array.isArray(methods) && methods.length > 0) {
      for (let method of methods) {
        let name = method.name //
        let code = method.code
        let oldFn = this[name]
        if (oldFn != null) {
          msg.push(`${name}已存在`) //
          continue
        }
        try {
          let _fn = stringToFunction(code)
          if (typeof _fn == 'function') {
            this[name] = _fn.bind(this) //
          }
        } catch (error) {}
      }
    }
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
    } //
    super.init()
    let tableName = this.getTableName()
    this.tableDataMap[tableName] = {
      data: [],
      curRow: null, //
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
    let id = config?.id
    let hasItem = this.items.find((item) => item.id == id)
    if (hasItem) {
      return //
    }
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
  initDefaultTemplatePage() {}
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
      this.getSystem().confirmMessage(
        `${dTableName.tableName}未设置关联字段`,
        'warning',
      ) //
      return
    }
    if (curRow == null) {
      let refData = this.getTableRefData(dTableName.tableName)
      if (refData) {
        refData['data'] = [] //
      }
      return
    }
    let _value = curRow[mainRelateKey]
    if (_value === '' || _value == null) {
      this.getSystem().confirmMessage(`主单据没有关联值`, 'warning') //
      return //
    }
    let query = {
      [relateKey]: curRow[mainRelateKey],
    }
    let tableName = dTableName.tableName ////
    let res = await this.getTableData({
      tableName,
      query,
      detail: true,
    })
    return res
  }
  // @useTimeout({ number: 500 })
  async getTableData(
    getDataConfig: any = {
      tableName: this.getTableName(),
      query: {}, //
      queryArr: [],
    },
  ) {
    if (typeof getDataConfig == 'string') {
      getDataConfig = {
        tableName: getDataConfig,
      }
    }
    let tableName = getDataConfig.tableName //
    let http = this.getHttp()
    let query = getDataConfig.query
    let queryArr = getDataConfig?.queryArr || []
    let _arr = queryArr
      .map((row) => {
        let field = row.field
        let value = row.value
        let operator = row.operator
        if (field == null || value == null || operator == null) {
          if (typeof row == 'object') {
            //
            let _arr = Object.entries(row).map(([key, value]) => {
              let operator = '$eq'
              let field = key
              if (Array.isArray(value)) {
                operator = '$in'
              }
              let obj = {
                field,
                operator,
                value,
              }
              return obj
            }) //
            return _arr
          }
        } else {
          return row
        }
      })
      .flat()
      .filter((d) => d != null)

    let _query = this.buildQuery(_arr)
    query = { ...query, ..._query }
    // let viewTable = this.config.viewTableName
    let tableConfig = this.getTableConfig(tableName)
    let viewTable = tableConfig.viewTableName //
    let _t = tableName
    let config: any = {}
    if (typeof viewTable == 'string' && viewTable.length > 0) {
      config.viewTable = viewTable
    }
    // console.log(config, 'testConfig')
    let res = await http.find(_t, query, config) //
    let dataMap = this.getTableRefData(tableName)
    dataMap['data'] = res
    if (res.length == 0 && tableName == this.getTableName()) {
      this.setCurRow(null) //
    }
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
    }
    let tableConfig = this.getTableConfig(tableName) //
    let tableType = tableConfig?.tableType
    if (tableType == 'relate') {
      let relateConfig = tableConfig?.relateConfig
      let curRowChange = relateConfig?.curRowChange
      if (Boolean(curRowChange)) {
        this.getTableData() //
      }
    }
    await this.publishEvent(_config)
    let allDetailTable: string[] = this.getAllDetailTable().map((item) => {
      let tName = item.getTableName()
      return tName
    })
    if (tableName == this.getTableName()) {
      for (let dTable of allDetailTable) {
        this.getDetailTableData(dTable) //
      } //
    }
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
  async createTableData() {}
  async updateTableData() {}
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
  getMainTableConfig() {}
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
      row: {}, //
      tableName: this.getTableName(),
    } as any
  } //
  @useHooks((config) => {
    let ctx: PageDesign = config.instance //
    let args = config.args
    if ((args.length = 0)) {
      args[0] = ctx.getAddRowsArgs()
    } //
  })
  async addTableRows(config = this.getAddRowsArgs()) {
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
    } //
    tableIns.addRows({ rows: arr1 }) //
  }
  getTableRef(tableName = this.getTableName()) {
    let tableIns = this.getRef(tableName)
    return tableIns //
  }
  async saveTableDesign(_config?: any) {
    //获取表格的id配置
    let config = { ...this.config, ..._config } //
    let id = config.id
    if (id == null) {
      await this.createTableDesign()
    } else {
      //
      await this.updateTableDesign()
    }
    nextTick(() => {
      this.setCurrentDesign(false)
      if (_config?.refresh == false) {
        return
      }
      if (this.isConfirm == true) {
        return //
      }
      this.getSystem().refreshPageDesign() //
    })
  }
  async createTableDesign() {} //
  async updateTableDesign(lastConfig?: any) {
    let _data = this.getLayoutData() //
    let http = this.getHttp()
    let _config = this.config //
    let _config1 = {
      ..._config,
      ..._data,
      ...lastConfig,
      id: _config.id,
      platform: this.config?.platform || 'pc', //
    }
    await http.patch(`entity`, _config1)
    this.getSystem().confirmMessage('保存成功', 'success') //
  }
  getMainTableName() {
    let config = this.config //
    let tableName = config.tableName
    if (!tableName) {
      tableName = this.tableName
    }
    return tableName //
  }
  getAllFormMap() {}
  @useOnce()
  initDefaultDForm() {
    super.initDefaultDForm() //
  } //
  initDefaultSForm() {}
  //打开编辑页面
  async openEditEntity() {
    let tableName = this.tableName
  }
  //打开添加页面
  async openAddEntity() {}
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
  getAllDetailTable(ref = false) {
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
  async editTableRows() {
    console.log('编辑当前行') //
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
    //
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
      let tableName = en.tableName || en.options?.tableName //
      if (tableName != null) {
        let tableConfigMap = this.tableConfigMap
        if (tableConfigMap[tableName] == null) {
          tableConfigMap[tableName] = en.options
        } //
        let tableDataMap = this.tableDataMap
        tableDataMap[tableName] = {
          curRow: null,
          data: [],
        }
      }
    }
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
  //添加类别
  async addRelateTableRow(tableName?: any, row?: any) {
    let _config = tableName
    if (typeof tableName == 'string') {
      _config = {
        tableName,
      }
    }
    tableName = _config.tableName
    let dataRef = this.getTableRefData(tableName) //
    let tConfig = this.getTableConfig(tableName)
    let treeConfig = tConfig.treeConfig
    if (treeConfig == null) {
      return
    }
    let id = treeConfig.id
    let parentId = treeConfig.parentId
    let rootId = treeConfig.rootId //
    let curRow = this.getCurRow(tableName)
    let parentValue = curRow?.[id] //
    if (curRow == null) {
      parentValue = rootId
    }
    await this.getSystem().confirmEditEntity({
      tableName,
      curRow: {
        //
        [parentId]: parentValue, //
      },
      editType: 'add', //
    })
  } //
  async editRelateTableRow(tableName?: any, row?: any) {
    //
    let _config = tableName
    if (typeof tableName == 'string') {
      _config = {
        tableName,
      }
    }
    tableName = _config.tableName //

    tableName = _config.tableName
    let dataRef = this.getTableRefData(tableName) //
    let tConfig = this.getTableConfig(tableName)
    let treeConfig = tConfig.treeConfig
    if (treeConfig == null) {
      return
    } //
    let curRow = this.getCurRow(tableName)
    let keyColumn = tConfig.keyColumn
    if (keyColumn == null) {
      this.getSystem().confirmMessage('未设置主键', 'warning') //
      return
    }
    if (curRow == null || curRow[keyColumn] == null) {
      this.getSystem().confirmMessage('请选择一行数据', 'warning') //
      return
    }
    await this.confirmEditEntity({
      tableName,
      curRow: curRow,
      editType: 'edit',
    })
  }
  async deleteRelateTableRow(tableName?: any, row?: any) {
    //
    let _config = tableName
    if (typeof tableName == 'string') {
      _config = {
        tableName,
      }
    }
    tableName = _config.tableName //

    tableName = _config.tableName
    let dataRef = this.getTableRefData(tableName) //
    let tConfig = this.getTableConfig(tableName)
    let treeConfig = tConfig.treeConfig
    if (treeConfig == null) {
      return
    } //
    let curRow = this.getCurRow(tableName)
    let keyColumn = tConfig.keyColumn
    if (keyColumn == null) {
      this.getSystem().confirmMessage('未设置主键', 'warning') //
      return
    }
    if (curRow == null || curRow[keyColumn] == null) {
      this.getSystem().confirmMessage('请选择一行数据', 'warning') //
      return
    }
    let http = this.getHttp()
    let children = curRow.children
    if (children?.length > 0) {
      this.getSystem().confirmMessage('当前数据有子节点，无法删除')
      return
    } //
    let sys = this.getSystem()
    let state = await sys.confirmMessageBox('是否删除当前行数据') //
    let mainName = this.getRealTableName() //
    let mainData = this.getTableRefData(mainName)
    let data = mainData.data
    if (data?.length > 0) {
      this.getSystem().confirmMessage('当前主表数据有类别关联，无法删除') //
      return
    }
    if (state) {
      await http.delete(tableName, curRow) //
      this.getSystem().confirmMessage('删除数据成功') //
    }
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
  getTableCnName() {
    //
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
    let tableName = this.getTableName() //
    let tCnName = this.getTableCnName()
    let dTableOptions = this.getAllDetailTable().map((t) => {
      let tName = t.getTableName()
      let tCnName = t.getTableCnName()
      return {
        label: tCnName,
        value: tName,
      }
    }) //
    let rTableOptions = this.getAllRelateTable().map((t) => {
      let tName = t.getTableName()
      let tCnName = t.getTableCnName()
      return {
        label: tCnName,
        value: tName,
      }
    })
    let arr = [
      { label: tCnName, value: tableName },
      ...dTableOptions,
      ...rTableOptions,
    ] //
    return arr //
  }
  getAllRelateTable() {
    let allTable = this.getAllTable()
    let rTables = allTable.filter((t) => {
      let isRelate = t.getEntityType()
      return isRelate == 'relate'
    })
    return rTables
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
    let http = this.getHttp() //
    let _data = await http.find(tableName, query) //
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
        label: '设计当前列',
        fn: async () => {
          let cf = this.currentDField
          if (cf == null) {
            return
          }
          let column = this.getTableColumns().find((col) => {
            return col.field == cf
          })
          // console.log(column, 'testColumn') //
          if (column == null) {
            return
          } //
          let _d: any = await this.getSystem().designTargetColumn(column, 1) //
          let _obj = columnToEdit(_d) //
          let currentFItemConfig = this.currentFItemConfig
          if (_d.id != null) {
            //两个都要保存
            await this.getHttp().patch('columns', _d)
          }
          let _options = currentFItemConfig?.options || {}
          if (Array.isArray(_options)) {
            _options = {}
            if (currentFItemConfig?.['options']) {
              currentFItemConfig['options'] = _options
            }
          }
          Object.entries(_obj).forEach(([key, value]) => {
            _options[key] = value //
          })
          let type = _obj?.type
          currentFItemConfig['type'] = type || currentFItemConfig['type']
          await this.saveTableDesign() //
        },
        visible: computed(() => {
          let currentItem = this.currentContextItem
          let _type = currentItem?.config?.type
          if (_type == 'dform') {
            ///
            return true
          }
          return false //
        }),
      },
      // {
      //   label: '设计其他',
      //   fn: async () => {
      //     console.log('设计其他') //
      //   },
      // },
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
    // await this.getSystem().updateCurrentPageDesign()
    await this.saveTableDesign({
      refresh: false, //
    }) //
  }
  openContextMenu(e, _item?: any) {
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
    let rTableName = this.getRealTableName() //
    return {
      isDialog: this.isDialog,
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
  async selectExcelFile() {
    let sd = new Promise(async (resolve, reject) => {
      let _data = await this.getSystem().confirmForm({
        title: '导入数据模板',
        itemSpan: 24,
        height: 200,
        width: 300,
        items: [
          {
            label: '是否包含标题',
            type: 'boolean', //
            field: 'includeTitle', //
          },
        ],
        data: {
          includeTitle: 1, //
        },
      })
      VxeUI.readFile({
        multiple: false,
      }).then(async (config) => {
        const file = config.file
        const arrayBuffer = await file.arrayBuffer() //

        const data = new Uint8Array(arrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })

        // 读取第一个 Sheet
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // 使用 header: 1 得到二维数组，再手动映射为对象
        const rawData: any = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
        })
        let _d = null
        if (_data.includeTitle == 0) {
          let [headers, ...rows] = rawData
          let result = rows.map((row) => {
            const obj = {}
            headers.forEach((key, index) => {
              obj[key] = row[index]
            })
            return obj //
          })
          _d = result
        } else {
          if (rawData.length < 2) {
            console.warn('数据不足，至少应有标题和字段行')
            reject('数据不足，至少应有标题和字段行')
            return
          }

          let titleRow = rawData[0]
          let fieldRow = rawData[1]
          let dataRows = rawData.slice(2)

          let data = dataRows.map((row) => {
            let obj = {}
            fieldRow.forEach((field, index) => {
              obj[field] = row[index]
            })
            return obj
          })
          _d = data
        }
        resolve(_d)
      })
    })
    let result = await sd
    // let dm = this.getTableRefData()
    // dm.data = result //
    return result
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
        row.tableName = this.getRealTableName() //
        return row
      }) //
    let _res = await this.getHttp().create('columns', addCols)
    this.getSystem().confirmMessage('同步成功', 'success') //
    this.getSystem().refreshPageDesign() //
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

      let obj1 = {
        field: searchF,
        operator: searchOperator,
        value: data[searchF],
      }
      if (obj1.value != null && obj1.value != '') {
        //
        _arr.push(obj1)
      }
    }
    // let q = this.buildQuery(_arr)
    // return q //
    return _arr
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
    //
    if (['scan', 'edit', 'add'].indexOf(state) == -1) {
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
  getFlatTreeData(_data: any) {
    let data = _data
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
  getSaveData() {
    let tableName = this.getTableName() //
    let tRef: Table = this.getRef(tableName)
    let d = tRef.getFlatTreeData() //
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

  async updateTableColumn(config, refresh = true) {
    let tableName = this.getRealTableName()
    if (Array.isArray(config)) {
    } else {
      config = [config]
    }
    config = config.filter((c) => {
      return c.id != null
    })
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
    let allTableConfig = this.tableConfigMap
    let allCols = Object.values(allTableConfig).map((t: any) => {
      let columns = t.columns
      let _cols = _.cloneDeep(columns)
      //
      let _obj = {
        title: t.tableName,
        children: _cols, //
      } //
      return _obj
    })
    return allCols //
  }
  getMergeMethodsSelect() {
    let config = this.config //
    let methods = config.methods //
    let _arr = []
    if (Array.isArray(methods) && methods.length > 0) {
      let _methods = methods //
      // return _methods //
      _arr.push(..._methods) //
    }
    return _arr //
  }
  getBindPageProps() {
    //
  }
  async openImportDialog() {}
  async importTableRows() {} //
  onColumnConfigChange(config) {
    //
    let tableName = config.tableName //
    let _tableName = this.getRealTableName() //
    let columns = config.columns //
    if (tableName == _tableName) {
      if (Array.isArray(columns)) {
      } else {
        columns = [columns]
      }
      let field = config.field
      if (field == null) {
        return
      }
      columns = columns.map((col) => {
        if (col instanceof Column) {
          return col.config
        }
        return col
      }) //
      columns = columns
        .filter((c) => {
          return c != null
        }) //
        .map((col) => {
          let id = col.id
          let fV = col[field]
          return { id: id, [field]: fV }
        })
        .filter((c) => {
          return c.id != null
        }) //
      this.updateTableColumn(columns, false) //
    } else {
      this.updateTableDesign() //
    }
  } //
  getHooksObj() {
    let config = this.config
    let hooks = config.hooks
    let _obj: any = {}
    if (Array.isArray(hooks)) {
      for (const h of hooks) {
        //
        let name = h.name
        let _arr = _obj[name]
        if (_arr == null) {
          _arr = []
          _obj[name] = _arr
        }
        let fn = h.code //
        let enable = h.enable
        if (enable == 0) {
          continue
        } //
        if (typeof fn == 'string') {
          let _fn = stringToFunction(fn) //
          if (typeof _fn == 'function') {
            _arr.push(_fn) //
          }
        }
      } //
    } //
    return _obj //
  }
  getTreeConfig() {
    let config = this.config
    let treeConfig = config.treeConfig
    return treeConfig
  }
  getTreeRootId() {}
  getTreeId() {}
  getTreeParentId() {}
  onTableConfigChange(config) {
    let tableName = config.tableName //
    if (tableName == null) {
      return //
    }
    let _tableName = this.getRealTableName() //
    if (_tableName == tableName) {
      //
      Object.entries(config).forEach(([key, value]) => {
        //
        this.config[key] = value
      })
    }
    this.updateTableDesign()
  }
  async onCurRowChange(config) {
    let tableName = config.tableName //
    if (tableName == null) {
      return //
    }
    this.setCurRow(config.row, tableName) //
  }
  async saveTableData(config?: any) {}
  getKeyColumn() {
    let tConfig = this.getTableConfig()
    let columns = tConfig.columns //
    let key = null
    let _col = columns.filter((c) => {
      return c.primary == 1 //
    })
    let keyColumn = tConfig.keyColumn
    if (Boolean(keyColumn)) {
      return keyColumn
    }
    if (_col.length == 0) {
      throw new Error('没有设置主键字段') //
    }
    return _col[0].field //
  }
  @useHooks()
  async pageInit() {
    //
  }
  getKeyCodeColumn() {
    let tConfig = this.getTableConfig()
    let columns = tConfig.columns //
    let key = null
    let _col = columns.filter((c) => {
      return c.keyCode == 1 //
    }) //单据字段
    let keyCodeColumn = tConfig.keyCodeColumn
    if (Boolean(keyCodeColumn)) {
      return keyCodeColumn
    }
    return _col?.[0]?.field //
  }
  initEntityEvent() {
    //
    let config = this.config
    let events = config.events //
    if (Array.isArray(events) && events.length > 0) {
      for (let ev of events) {
        //
        let event = ev.eventName //
        let tableName = ev.tableName //
        if (event == null || event == '') {
          //
          continue //
        }
        let key = event //
        if (tableName != null || tableName != '') {
          key = `${tableName} ${event}` //
        }
        let eArr = this.entityEventManager[key]
        if (eArr == null) {
          this.entityEventManager[key] = []
          eArr = this.entityEventManager[key]
        }
        let fn = ev.code //
        let _fn = null //
        if (typeof fn == 'function') {
          _fn = fn
        }
        if (typeof fn == 'string') {
          let _fn1 = stringToFunction(fn)
          if (typeof _fn1 == 'function') {
            _fn = _fn1
          }
        }
        if (typeof _fn !== 'function') {
          continue
        }
        ev._fn = _fn
        eArr.push(ev)
      }
    }
    //
    let entityEvent = this.entityEventManager
    Object.entries(entityEvent).forEach(([key, value]) => {
      let _fn = (data) => {
        for (const fn of value) {
          let _fn1 = fn._fn
          _fn1.call(this, data) //(data)
        }
      }
      this.entityEventManagerArr.push({
        key: key,
        fn: _fn,
      })
      this.getHttp().registerEvent(key, _fn) //
    })
    let allTable = this.getAllRelateTable() //
    let allConfigs = allTable.map((t) => {
      return t.config
    }) //
    for (const table of allConfigs) {
      let options = table.options
      let tableName = options.tableName //
      let relateConfig = options?.relateConfig || {}
      let listenChanged = relateConfig.listenChanged //
      if (Boolean(listenChanged) == false) {
        continue
      }
      let _key = 'changed'
      let key = `${tableName} ${_key}`
      let fn = () => {
        this.getRelateTreeData(tableName)
      }
      this.entityEventManagerArr.push({
        key: key,
        fn: fn,
      })
      this.getHttp().registerEvent(key, fn) //
    }
  }
  clearEntityEvent() {
    let entityEvent = this.entityEventManagerArr
    for (const config of entityEvent) {
      let key = config.key
      let fn = config.fn //
      this.getHttp().unRegisterEvent(key, fn) //
    }
  } //
  getPaginateProps() {
    let pageConfig = this.pageData
    let curPage = pageConfig.curPage || 1
    let obj = {
      curPage: curPage,
    } //
    let _p = this.config.pagination || {} //
    let _size = _p.pageSize
    let pagination = _p || {} //
    let options = [
      {
        label: '10条每页',
        value: 10,
      },
      {
        label: '100条每页',
        value: 100,
      },
      {
        label: '500条每页',
        value: 500,
      },
      {
        label: '1000条每页',
        value: 1000,
      },
      {
        label: '5000条每页',
        value: 5000,
      },
      {
        label: '10000条每页',
        value: 10000,
      },
      {
        label: '全部',
        value: 0,
      }, //
    ]
    obj = {
      ...obj,
      ...pagination,
      pageSizes: options, //
      pageSize: pageConfig.pageSize || _size, //
      currentPage: pageConfig.currentPage || 1, //
      onPageChange: (config: any) => {
        let currentPage = config.currentPage
        let pageSize = config.pageSize
        let obj = {
          currentPage,
          pageSize,
        }
        Object.entries(obj).forEach(([key, value]) => {
          this.pageData[key] = value //
        })
      }, //
    }
    return obj //
  } //
  getShowPaginate() {
    let isEdit = this.isEdit
    if (isEdit == true) {
      return false
    } //
    let pagination = this.config.pagination
    let show = pagination?.show
    if (show != false) {
      return true
    }
  }
  async getRelateTreeData(tableName) {
    console.log(tableName, 'testTableName') //
  }
  async editRelateTreeData(tableName: any) {
    //
  }
  setKeyColumn(key: string) {
    this.config.keyColumn = key
  }
  setKeyCodeColumn(key: string) {
    this.config.keyCodeColumn = key
  } //
  //进入打印
  async getRelateSearchWheres() {
    /* 
      async function fn(context, next) {
    let row = this.getCustomerClssCurRow()
    let _fn = (data) => {
        let _data = data.map(row => {
            let children = row.children
            let d1 = [row]
            if (Array.isArray(children) && children.length > 0) {
                return [row, ..._fn(children)]
            }
            return [row]
        })
        return _data.flat()
    }
    if (row == null) {
        //没有客户类别就是跳出
        return
    }
    let rows = _fn([row])
    let rowsArg = rows.map(row => {
        return row['cClsNo']
    })
    console.log(rows, 'testRows')
    let query = context.queryArr
    // let cClsNo = row['cClsNo']
    let obj = {
        cClsNo: rowsArg
    }
    query.push(obj)
    await next()
}
    */
    let allTable = this.getAllTable()
      .filter((item) => {
        let type = item.config?.options?.tableType //
        if (type == 'relate') {
          return true
        }
      })
      .map((item) => item.getTableName()) //
    let _fn = (data) => {
      let _data = data.map((row) => {
        let children = row.children
        if (Array.isArray(children) && children.length > 0) {
          return [row, ..._fn(children)]
        }
        return [row]
      })
      return _data.flat()
    }
    let _arr = []
    for (let name of allTable) {
      let tableData = this.getTableRefData(name)
      let tableConfig = this.getTableConfig(name)
      let curRow = tableData.curRow //
      let relateKey = tableConfig?.relateKey
      let mainRelateKey = tableConfig?.mainRelateKey
      if (relateKey == null || mainRelateKey == null) {
        this.getSystem().confirmMessage(`${name}未设置关联字段`, 'warning') //
        continue
      }
      if (curRow == null) {
        continue
      }
      let rows = _fn([curRow])
      let rowsArg = rows.map((row) => {
        return row[relateKey]
      })
      let _queryArr = _arr
      _queryArr.push({
        [mainRelateKey]: rowsArg,
      }) //
    }
    return _arr //
  }
  async printTemplate() {}
  //简易删除
  async deleteTableRows(_tableName?: any) {
    //
    //删除模式
    let curRow = this.getCurRow()
    let sys = this.getSystem()
    let _state = curRow['_rowState']
    if (_state == 'add') {
      let dRef = this.getTableRefData(_tableName)
      let _data = dRef.data
      let _index = _data.indexOf(curRow)
      if (_index > -1) {
        _data.splice(_index, 1)
      } //
      return
    }
    let status = await sys.confirmMessageBox('确定删除吗', 'warning')
    if (!status) {
      return
    } //
    let http = this.getHttp()
    let tableName = this.getRealTableName()
    await http.batchDelete(tableName, curRow) //
    sys.confirmMessage('删除成功', 'success') //
    this.getTableData() //
  }

  async syncErpTableColumns() {
    //
    let realTableName = this.getRealTableName()
    let columns = await this.getOldErpTableColumns(realTableName)
    let _columns = this.getTableConfig().columns
    _columns = JSON.parse(JSON.stringify(_columns))
    for (let col of columns) {
      let f = col.field
      let c = _columns.find((c) => {
        return c.field == f
      })
      let keys = [
        {
          key: 'title',
          myKey: 'title',
        },
        {
          key: 'width',
          myKey: 'width',
        },
      ]
      if (c) {
        for (let key of keys) {
          if (col[key.key] != null) {
            c[key.myKey] = col[key.key]
          }
        } //
      }
    }
    _columns.forEach((e) => {
      e['_rowState'] = 'change'
    }) //
    this.getHttp().patch('columns', _columns) //
    this.getSystem().confirmMessage('同步成功', 'success') //
  }
  async getOldErpTableColumns(tableName) {
    let erpTable = await this.getHttp().find('sys_ErpTable', {
      tableName: tableName,
    })
    let row = erpTable[0]
    let _obj: any = {}
    Object.entries(row).forEach(([key, value]) => {
      try {
        let _v = JSON.parse(value as any)
        if (typeof _v == 'object' || Array.isArray(_v)) {
          //
          value = _v //
        }
      } catch (error) {}
      _obj[key] = value //
    })
    
    let _columns = _obj.columns || []
    return _columns
  }
  //最近距离
  getTheCloseEntity(_id: string) {
    let state = this.state
    let store = state.store //
    let fn = (data) => {
      let _data = data.map((row) => {
        // if (row.id == null) {
        //   debugger //
        // }
        let _row = { ...row }
        let children = row.columns || []
        let list = row.list || []
        let rows = row.rows || [] //
        children = [...children, ...list, ...rows]
        if (Array.isArray(children) && children.length > 0) {
          let _c = fn(children)
          _row.children = _c
        }
        return _row
      })
      return _data
    }
    let fData = fn(store)
    let _this = this
    function findEntityInSubtree(node: any): any | null {
      if (node.type === 'entity') return node
      for (const child of node.children || []) {
        const found = findEntityInSubtree(child)
        if (found) return found
      }
      return null
    }

    function findNearestEntity(root: any, targetId: string): any | null {
      const idToNode = new Map<string, any>()
      const childToParent = new Map<any, any>()

      // 建立 id 和 parent 映射
      function buildMaps(node: any, parent: any | null = null) {
        idToNode.set(node.id, node)
        if (parent) childToParent.set(node, parent)
        for (const child of node.children || []) {
          buildMaps(child, node)
        }
      }

      buildMaps(root)

      const targetNode = idToNode.get(targetId)
      if (!targetNode) return null

      let currentNode: any | undefined = targetNode
      while (currentNode) {
        const parent = childToParent.get(currentNode)

        if (parent) {
          // 查找当前节点的兄弟节点（包括它们的子孙）
          for (const sibling of parent.children || []) {
            if (sibling === currentNode) continue
            const found = findEntityInSubtree(sibling)
            if (found) return found
          }
        }

        // 如果 parent 本身是 entity，也可以返回
        if (parent && parent.type === 'entity') {
          return parent
        }

        // 向上继续找
        currentNode = parent
      }

      return null
    }
    let root = {
      id: this.uuid(),
      type: 'root',
      children: fData,
    }
    let nextNode = findNearestEntity(root, _id)
    return nextNode
  }
  async confirmEditEntity(config: any) {
    await this.getSystem().confirmEditEntity(config, this)
  }
}
