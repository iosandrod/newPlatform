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
import { useOnce, useRunAfter } from './utils/decoration'
import { getDefaultPageProps } from './pageCom'
import { testBtnData } from './formEditor/testData1'
import { formitemTypeMap, selectTypeMap } from './designNodeForm'
import { Table } from '@/table/table'
import { BMenu } from '@/buttonGroup/bMenu'
import { getDFConfig } from '@/table/colFConfig'

export class PageDesign extends Form {
  pageType = 'pageDesign' //
  tableType: 'main' | 'edit' | 'search' = 'main' //
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
    }
    nextTick(() => {})
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
    tableName = tableName || ''
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
    },
  ) {
    if (typeof getDataConfig == 'string') {
      getDataConfig = {
        tableName: getDataConfig,
      } //
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
  buildQuery() {}
  openSearchForm() {}
  async createTableData() {}
  async updateTableData() {}
  async getDefaultValue(tableName: string) {
    let columns = this.getTableColumns(tableName)
    let obj1 = {}
    for (const col of columns) {
      let defaultValue = await col.getDefaultValue()
      if (defaultValue) {
        obj1 = { ...obj1, ...defaultValue } //
      }
    } //
    return obj1
  }
  getTableColumns(tableName = this.getTableName()) {
    let tableIns = this.getRef(tableName)
    let columns = []
    if (tableIns != null) {
      columns = tableIns.getColumns()
    } else {
      columns = this.getTableConfig().columns
    } //
    return columns //
  }
  getMainTableConfig() {}
  @useRunAfter()
  async addTableRow(data, tableName = this.getTableName()) {
    if (data == null) {
      data = await this.getDefaultValue(tableName)
    }
    return data
  } //
  @useRunAfter()
  async addTableRows(
    rows: number | Array<any> = 1, //
    tableName = this.getTableName(),
  ) {
    if (typeof rows == 'number') {
      rows = Array(rows).fill(null)
    }
    let arr1 = []
    for (let i = 0; i < rows.length; i++) {
      let d = await this.addTableRow(rows[i], tableName)
      arr1.push(d) //
    }
    let tableIns = this.getTableRef(tableName)
    tableIns.addRows({ rows: arr1 }) ////
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
      await this.updateTableDesign()
    }
    nextTick(() => {
      this.setCurrentDesign(false) //
    })
  }
  async createTableDesign() {
    let _data = this.getLayoutData()
    //@ts-ignore
    _data.tableName = this.getMainTableName()
    let http = this.getHttp()
    let _res = await http.create('entity', _data) // //
    console.log(_res)
  }
  async updateTableDesign() {
    let _data = this.getLayoutData() //
    let http = this.getHttp()
    let _config = this.config
    let _config1 = { ..._config, ..._data, id: _config.id } //
    let _res = await http.patch(`entity/${_config.id}`, _config1.id, _config1) //
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
  async addMainTableRow(addConfig) {
    let system = this.getSystem()
    let tableName = this.getTableName()
    system.routeOpen(`${tableName}---edit`, (d) => {
      // console.log('我执行了一些东西了') ////
      //这里写新增逻辑
    })
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
    // debugger//
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
    }
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
  getTableCnName() {
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
    let tRef: Table = this.getRef(tableName)
    let curRow = null
    let _tableName = this.getTableName()
    if (tRef == null) {
      curRow = this.tableDataMap[_tableName]?.curRow ////
    } else {
      curRow = tRef.getCurRow()
    }
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
          let tName = this.getRealTableName() //
          await system.designTableColumns(tName, currentDesignField)
          // let fConfig=getDFConfig(this,)
        },
        disabled: false,
      }, //
    ]
  }
  openContextMenu(e) {
    let menu: BMenu = this.getRef('mainContextMenu')
    if (menu == null) {
      return //
    }
    menu.open(e) //
  }
}
