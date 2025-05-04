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
import pageCom, { getDefaultPageProps } from './pageCom'
import { testBtnData } from './formEditor/testData1'
import { formitemTypeMap } from './designNodeForm'

export class PageDesign extends Form {
  static component = pageCom //
  pageType = 'pageDesign' //
  tableName
  tableType: 'main' | 'edit' | 'search' = 'main'
  tableDataMap = {}
  tableConfigMap = {}
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
    nextTick(() => {
      // debugger//
      // this.setLayoutData(testBtnData) //
    })
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
    // console.log(config, 'test_config')//
    let _item = new PageDesignItem(config, this) //
    //@ts-ignore
    this.items.push(_item)
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
    return tableName //
  }
  async getTableData(
    getDataConfig: any = {
      tableName: this.getTableName(),
    },
  ) {
    if (typeof getDataConfig == 'string') {
      getDataConfig = {
        tableName: getDataConfig,
      }
    }
    let tableName = getDataConfig.tableName //
    let http = this.getHttp()
    let res = await http.get(tableName, 'find')
    console.log(res, 'testRes') //
    return res
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
    let columns = tableIns.getColumns()
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
    // let allType = ['input', 'input', 'entity', 'form']
    let tm = formitemTypeMap(this)
    Object.entries(tm).forEach(([key, value]) => {
      let _f = new Form(value)
      this.dFormMap[key] = _f
    })
    // let inputF = {
    //   itemSpan: 24,
    //   items: [
    //     {
    //       field: 'title',
    //       label: '标题',
    //       type: 'input', //
    //     },
    //     {
    //       field: 'placeholder',
    //       label: '提示',
    //       type: 'input', //
    //     },
    //   ],
    //   data: computed(() => {
    //     return this.state.selected?.options || {} //
    //   }), //
    // }
    // let _f = new Form(inputF) //
    // let entityF = {
    //   itemSpan: 24,
    //   items: [
    //     {
    //       field: 'tableName',
    //       label: '表名',
    //       type: 'input', //
    //       onBlur: async (config) => {
    //         let value = config.value
    //         let oldValue = config.oldValue
    //         if (value == oldValue) {
    //           return
    //         }
    //         let system = this.getSystem()
    //         let tableInfo = await system.getTableConfig(value)
    //         if (tableInfo == null) {
    //           return //
    //         }
    //         let currentBindData = config.form.getData() //
    //         Object.entries(tableInfo).forEach(([key, value]) => {
    //           //@ts-ignore//
    //           currentBindData[key] = value
    //         })
    //       },
    //     },
    //     {
    //       filed: 'eventMap',
    //       label: '事件',
    //       type: 'input',
    //     },
    //     {
    //       field: 'tableType',
    //       label: '表类型',
    //       type: 'select', //
    //       options: [
    //         {
    //           label: '主表',
    //           value: 'main',
    //         },
    //         {
    //           label: '子表',
    //           value: 'detail', //
    //         },
    //         {
    //           label: '关联表',
    //           value: 'relate', //
    //         },
    //       ],
    //     },
    //   ],
    //   data: computed(() => {
    //     return this.state?.selected?.options //
    //   }),
    // }
    // let _f1 = new Form(entityF)
    // this.dFormMap['entity'] = _f1 //
    // this.dFormMap['input'] = _f //
    // this.curDForm = _f1 //
  }
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
    let tableName = this.tableName //
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
  addEditTableRow() {
    let rTableName = this.getRealTableName() //
    let tableName = this.getTableName() //
    let rTableConfig = {}
  }
  async createDefaultRow(tableName = this.getTableName()) {
    let rTableName = this.getRealTableName()
    // let tableConfig=this.getTableConfig()
  }
  getTableConfig(tableName = this.getTableName()) {
    let tableConfigMap = this.tableConfigMap
    let _config = tableConfigMap[tableName]
    return _config
  }
}
