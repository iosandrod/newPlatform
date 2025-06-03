import _, { cloneDeep } from 'lodash'
import { FormItem } from './formitem'
import { PageDesign } from './pageDesign'
import { Column } from '@/table/column'
import { stringToFunction } from './utils'

export class PageDesignItem extends FormItem {
  //@ts-ignore
  //@ts-ignore
  constructor(config, d) {
    super(config, d) //
  }
  init() {
    super.init()
    let eventArr = this.config.eventMap
    if (this.config.type == 'entity') {
    }
    //注册到事件对象中
    let evManager = this.eventManager
    if (Array.isArray(eventArr)) {
      for (let ev of eventArr) {
        let event = ev.event
        if (event == null || event == '') {
          continue
        }
        let tableName = ev.tableName
        let key = event
        if (tableName != null || tableName != '') {
          key = `${tableName}_${event}` //
        }
        let eArr = evManager[key]
        if (eArr == null) {
          evManager[key] = []
          eArr = evManager[key]
        }
        eArr.push(ev) //
      }
    }
  }
  getTableConfig() {
    //
    let options = this.getOptions()
    return {
      ...options,
      // columns: columns,
    }
  } //
  getTableColumns() {
    let columns = this.config?.options?.columns || [] //
    return columns
  }
  getTableData() {
    return []
  }
  getTableName() {
    //
    let config = this.config
    let tableName = config?.options?.tableName
    return tableName
  }
  getTableType() {
    let config = this.config
    let tableType = config?.options?.tableType
    if (!tableType) {
      tableType = 'main' ////
    }
    return tableType
  }
  async addNewRow() {} //

  getShowHeaderButtons() {
    // debugger //
    let options = this.getOptions()
    let tableType = this.getTableType()
    if (tableType == 'detail') {
      return false
    }
    if (tableType == 'main') {
      return false //
    }
    let showHeaderButtons = options?.showHeaderButtons
    return showHeaderButtons
  }
  getTitle() {
    return ''
  }
  isShowTitle() {
    //
    return false
  }
  isEntity() {
    let type = this.getType()
    if (type == 'entity') {
      return true
    }
  }
  getEntityType() {
    let config = this.config
    let entityType = config?.options?.tableType
    return entityType //
  }
  getdBindData() {
    let design: PageDesign = this.form as any //
    let curRow = design.getCurRow()
    return curRow
  }
  getTableCnName() {
    let tConfig = this.getTableConfig()
    return tConfig.tableCnName
  }
  getRelateKey() {
    let options = this.getOptions()
    return options.relateKey
  }
  getMainRelateKey() {
    let options = this.getOptions()
    return options.mainRelateKey
  }
  onColumnResize(_config) {
    let f = this.form
    f.onColumnResize(_config) //
  }
  onColumnHidden(config: any): void {
    // debugger//
    let f = this.form
    f.onColumnHidden(config) //
  }
  onColumnsDesign(config: any): void {
    let f = this.form //
    f.onColumnsDesign(config) //
  }
  onColumnConfigChange(config: any): void {
    let f = this.form
    f.onColumnConfigChange(config)
  }
  onTableConfigChange(config: any): void {
    // debugger//
    let f = this.form
    let options = this.getOptions()
    let _config = { ...config }
    delete _config['tableName'] //
    Object.entries(_config).forEach(([key, value]) => {
      options[key] = value
    }) //
    f.onTableConfigChange(config)
  }
  getShowCheckboxColumn() {
    let options = this.getOptions()
    let bool = options.showCheckboxColumn
    if (bool == null) {
      bool = true
    }
    bool = Boolean(bool) //
    return bool
  }
  getShowRowSeriesNumber() {
    //
    let options = this.getOptions()
    let bool = options.showRowSeriesNumber
    if (bool == null) {
      bool = true
    }
    bool = Boolean(bool) //
    return bool //
  }
  getTreeConfig() {
    let options = this.getOptions()
    let treeConfig = options?.treeConfig
    return treeConfig //
  }
  getContextItems() {
    let options = this.getOptions()
    let _items = options?.contextItems || [] //
    let _items1 = _items.map((item) => {
      return item //
    }) //
    return _items1 //
  }
  getPageCurRow() {
    let tableName = this.getOptions().tableName
    if (tableName == null) {
      return null
    } //
    let design: PageDesign = this.form as any //
    let curRow = design.getCurRow(tableName) //
    return curRow //
  }
  async onCurRowChange(config) {
    let row = config.row //
    let config1: any = this.getOptions() //
    let _conCurRowChange = config1.onCurRowChange
    let design: PageDesign = this.form as any //
    if (typeof _conCurRowChange == 'string') {
      let _fn = stringToFunction(_conCurRowChange)
      if (typeof _fn == 'function') {
        await _fn.call(design, { row, ...config })
      }
    }
    let _config = { ...config, tableName: this.getTableName() } //
    await design.onCurRowChange(_config) //
  }
  async addRows(config) {
    if (typeof config == 'number') {
      config = {
        num: config,
      }
    }
    let design: PageDesign = this.form as any //
    let fCom = this.getRef('fieldCom')
    let tName = this.getTableName()
    let columns = this.getOptions()?.columns || [] //
    let _cols: Column[] = columns.map((col) => {
      return new Column(col) //
    })
    let mainRow = design.getCurRow()
    let _arr = []
    for (let i = 0; i < config.num; i++) {
      let obj = {}
      for (const col of _cols) {
        let _dValue = await col.getDefaultValue({
          design: design,
          curRow: mainRow,
        })
        obj = { ...obj, ..._dValue } //
      }
      Object.defineProperty(obj, '_rowState', { value: 'add' })
      _arr.push(obj)
    } //
    // debugger //
    let tDataMap = design.getTableRefData(tName)
    let _d = tDataMap?.data
    if (_d == null || !Array.isArray(_d)) {
      return
    }
    _d.push(..._arr)
  }
  getFormDisabled(config?: any) {
    let _tableName = config?.tableName
    let _tableName1 = this.getOptions().tableName //
    let status1 = _tableName == _tableName1 && _tableName != null
    let design: PageDesign = this.form as any //
    let tableState = design.tableState //
    let status = false //
    if (tableState == 'scan' && status1) {
      status = true //
    }
    return status //
  }
  async onTableDesign(config: any) {
    let _config = this.getOptions()
    // _config = _.cloneDeep(_config) //
    _config = _.cloneDeep(_config) //
    let titles = ['基本信息', '高级配置']
    let fields = [
      'tableName',
      'treeConfig',
      'showCheckboxColumn',
      'showRowSeriesNumber',
      'contextItems',
      'detailTableConfig',
      'keyColumn',
      'keyCodeColumn', //
      'onCurRowChange', //
    ] //
    let tName = this.getTableName()
    let mainDesign = this.form //
    let mN = mainDesign?.getRealTableName() || null
    let _obj = _.pick(_config, fields)
    let _fConfig = {
      itemSpan: 12, //
      data: _obj, //
      height: 500,
      width: 800, //
      isTabForm: true,
      items: [
        {
          field: 'tableName',
          label: '表名',
          tabTitle: titles[0],
          type: 'string',
          disabled: true, //
        },
        {
          field: 'detailTableConfig',
          label: '详情表配置',
          tabTitle: titles[1],
          type: 'sform',
          options: {
            itemSpan: 12,
            items: [
              {
                field: 'relateKey',
                label: '当前关联字段',
                type: 'string',
                options: {
                  columnSelect: true,
                  tableName: tName,
                },
              },
              {
                field: 'mainRelateKey',
                label: '主单据关联字段',
                type: 'string', //
                options: {
                  columnSelect: true,
                  tableName: mN, //
                }, //
              },
            ],
          },
        },
        {
          field: 'treeConfig',
          label: '树形表格配置',
          type: 'sform',
          tabTitle: titles[0],
          disabled: false,
          options: {
            itemSpan: 12, //
            items: [
              {
                field: 'id',
                label: '树主键',
                type: 'string',
                options: {
                  columnSelect: true,
                  tableName: tName,
                },
              },
              {
                field: 'parentId',
                label: '父主键',
                type: 'string',
                options: {
                  columnSelect: true,
                  tableName: tName, //
                }, //
              },
              {
                field: 'rootId',
                label: '根节点',
                type: 'string', //
              },
              {
                field: 'expand',
                label: '默认展开',
                type: 'select',
                options: {
                  options: [
                    {
                      label: '展开全部',
                      value: 'all',
                    },
                    {
                      label: '展开第一级',
                      value: 'first',
                    },
                    {
                      label: '展开第二级',
                      value: 'second',
                    },
                    {
                      label: '不展开',
                      value: 'none', //
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          field: 'showCheckboxColumn',
          label: '是否显示复选框',
          tabTitle: titles[0],
          type: 'boolean',
        },
        {
          field: 'showRowSeriesNumber',
          tabTitle: titles[0],
          label: '是否显示行号',
          type: 'boolean',
        },
        {
          field: 'rowHeight',
          label: '行高',
          type: 'number',
          options: {
            min: 10, //
          },
          tabTitle: titles[0], //
        },
        {
          field: 'keyColumn',
          tabTitle: titles[0],
          label: '主键字段',
          type: 'string',
          options: {
            columnSelect: true,
            tableName: tName, //
          },
        },
        {
          field: 'keyCodeColumn',
          label: '单据字段',
          tabTitle: titles[0],
          type: 'string',
          options: {
            columnSelect: true,
            tableName: tName, //
          },
        }, //
        {
          field: 'onCurRowChange',
          label: '当前行变化事件',
          type: 'code', //
          tabTitle: titles[1], //
        },
        {
          field: 'contextItems',
          label: '右键菜单配置', //
          type: 'stable',
          tabTitle: titles[1], //
          span: 24, //
          options: {
            showTable: true,
            tableState: 'edit',
            columns: [
              {
                field: 'label',
                title: '菜单名称',
                type: 'string',
                editType: 'string',
              },
              {
                field: 'fn',
                title: '菜单事件',
                type: 'string',
                editType: 'code', //
              },
            ],
          }, //
        },
      ],
    }
    let sys = this.getSystem()
    let _d = await sys.confirmForm(_fConfig) //
    this.onTableConfigChange(_d) //
  }
}
