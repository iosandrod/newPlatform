import { reactive } from 'vue'
import _ from 'lodash'
import { Client, client as _client, http, myHttp } from './service/client'
import { Base } from '@ER/base'
import { cacheValue } from '@ER/utils/decoration'
import { PageDesign } from '@ER/pageDesign'
import { getDefaultPageProps } from '@ER/pageCom'
import { Dialog } from './dialog/dialog'
import { getDialogDefaultProps } from './dialog/dialogCom'
import { Form } from '@ER/form'
import formCom from '@ER/formCom'
import { Table } from './table/table'
import tableCom from './table/tableCom'
import { VxeUI } from 'vxe-pc-ui'
import { getDFConfig } from './table/colFConfig'
export class System extends Base {
  allApp: any = [] //
  mouseConfig = {
    clientX: 0,
    clientY: 0,
  }
  commandArr = []
  activePage = ''
  systemConfig = {
    menuConfig: {
      items: [],
    },
  } //
  loginInfo = null
  pageLayout = [] //
  selectOptions = {}
  dialogArr: Dialog[] = []
  tableMap: { [key: string]: PageDesign } = {}
  tableEditMap: { [key: string]: PageDesign } = {}
  async login() {}
  @cacheValue() //
  async getMenuData() {
    let client = this.getClient() //
    let d = await client.find('navs') //
    this.systemConfig.menuConfig.items = d //
    return d //
  }
  init() {
    super.init() //
  }
  getCurrentShowPage() {}
  buildMenuTree(rows) {}
  getClient(): myHttp {
    return http
  }
  getMenuProps() {}
  getMenuItems() {
    let _items = this.systemConfig.menuConfig.items || []
    return _items
  }
  _getCacheValue(key) {}
  getTabItems() {
    let tableMap = this.tableMap
    let allT = Object.values(tableMap) //
    return [
      {
        label: '首页',
      },
      {
        label: '表格', //
      },
    ] //
  }
  openPageDesign(config) {} //
  // async getDefaultPageLayout(name?: string) {
  //   let http = this.getHttp()
  //   let _data = await http.post(
  //     'entity',
  //     'getDefaultPageLayout',
  //     {
  //       tableName: name,
  //     }, //
  //   ) //
  //   return _data //
  // }
  async getPageLayout(name?: string) {
    let http = this.getHttp()
    let data = await http.get(
      'entity',
      'find', //
      { tableName: name },
    ) //
    let row = data[0]
    return row //
  }
  async getPageEditLayout(name?: string) {
    let http = this.getHttp()
    let _name1 = `${name}---edit`
    let data = await http.find('entity', { tableName: _name1 }) //
    let row = data[0] //
    if (row == null) {
      let _data1 = await http.find('entity', { tableName: name })
      let _row = _data1[0]
      let row2 = this.generateEditPageLayout(_row)
      return row2 //
      //转换
    }
    return row //
  }
  createNodeIdKey(type) {
    let id = this.uuid()
    let key = `${type}_${id}`
    let obj = {
      id,
      key,
      type,
    }
    return obj
  }
  generateEditPageLayout(row) {
    let oldFields = row.fields //
    let dEnF = oldFields
      .filter((row) => {
        //
        return row.type == 'entity' && row?.options?.tableType == 'detail'
      }) //
      .map((row) => {
        let _row = _.cloneDeep(row)
        return _row
      })
    let dEnF2 = dEnF.map((row) => {
      let fIns = row.id
      if (fIns == null) {
        row.id = this.uuid()
        fIns = row.id //
      }
      let obj = {
        ...this.createNodeIdKey('tabsCol'),
        label: 'Tab 1',
        list: [
          {
            ...this.createNodeIdKey('inline'),
            style: {},
            columns: [fIns],
          },
        ],
        style: {},
        options: {},
        innerId: fIns,
      }
      return obj
    })
    let fId = this.uuid()
    let fField = {
      id: fId,
      key: `dform_${fId}`,
      type: 'dform',
      options: {},
    }
    let detailLayout = {
      id: 'f6qNjbhckRKxcgbyzimpA',
      key: 'inline_f6qNjbhckRKxcgbyzimpA',
      type: 'inline',
      columns: [
        {
          id: 'NFcD7gLoRJ0UQJcRGAP1I',
          key: 'grid_NFcD7gLoRJ0UQJcRGAP1I',
          type: 'grid',
          options: {
            gutter: 0,
            justify: 'start',
            align: 'top',
          },
          style: {
            width: '100%',
          },
          columns: [
            {
              id: '0Ifq8JGCuqIYsIEJEcOE4',
              key: 'col_0Ifq8JGCuqIYsIEJEcOE4',
              type: 'col',
              list: [
                {
                  type: 'inline',
                  columns: [
                    {
                      id: 'mJp7crngSZBQiiMhqIJ1N',
                      key: 'tabs_mJp7crngSZBQiiMhqIJ1N',
                      icon: 'label',
                      type: 'tabs',
                      label: '标签页',
                      style: {
                        width: '100%',
                      },
                      columns: [...dEnF2],
                      options: {
                        type: '',
                        align: 'top',
                        hidden: false,
                        tabPosition: 'top',
                        defaultValue: dEnF2[0]?.id, //
                      },
                    },
                  ],
                },
              ],
              options: {
                span: 24, //
                offset: 0,
                push: 0,
                pull: 0,
                style: {},
              },
            },
          ],
        },
      ],
    }
    if (dEnF2.length == 0) {
      detailLayout = null
    }
    const editLayout = {
      layout: {
        pc: [
          {
            id: 'yWTdNJ14jZVhBpu1kiSHB',
            key: 'inline_yWTdNJ14jZVhBpu1kiSHB',
            type: 'inline',
            columns: [
              {
                id: 'LFhDBVgwITtxF-8qbD1Sk',
                key: 'grid_LFhDBVgwITtxF-8qbD1Sk',
                type: 'grid',
                options: {
                  gutter: 0,
                  justify: 'start',
                  align: 'top',
                },
                style: {
                  width: '100%',
                },
                columns: [
                  {
                    id: 'S9B-oByUkfc2LoAISnY3H',
                    key: 'col_S9B-oByUkfc2LoAISnY3H',
                    type: 'col',
                    list: [
                      {
                        type: 'inline',
                        columns: [
                          {
                            type: 'tabs',
                            label: '标签页',
                            icon: 'label',
                            id: 'nWcXBEOYl2M980Eg8OyJj',
                            columns: [
                              {
                                id: '_yNuSux3VBlbqnoWdXvYb',
                                type: 'tabsCol',
                                label: 'Tab 1',
                                list: [
                                  {
                                    type: 'inline',
                                    columns: [fId],
                                    style: {},
                                    id: 'n5BkoBMEBOeokN55IDx-M',
                                    key: 'inline_n5BkoBMEBOeokN55IDx-M',
                                  },
                                ],
                                style: {},
                                options: {},
                                key: 'tabsCol__yNuSux3VBlbqnoWdXvYb',
                              },
                            ],
                            options: {
                              type: '',
                              tabPosition: 'top',
                              align: 'top',
                              hidden: false,
                              defaultValue: '_yNuSux3VBlbqnoWdXvYb',
                            },
                            style: {
                              width: '100%',
                            },
                            key: 'tabs_nWcXBEOYl2M980Eg8OyJj',
                          },
                        ],
                      },
                    ],
                    options: {
                      span: 24,
                      offset: 0,
                      push: 0,
                      pull: 0,
                      style: {},
                    },
                  },
                ],
              },
            ],
          },
        ],
        mobile: [
          // {
          //   type: 'inline',
          //   columns: ['61fuq2KoXI-LXZ-d_ep95'],
          // },
          // {
          //   type: 'inline',
          //   columns: ['KRg51faFSk3H2piRFbrQg'],
          // },
        ],
      },
      data: {},
      config: {
        isSync: true,
        pc: {
          size: 'default',
          labelPosition: 'left',
          completeButton: {
            text: '提交',
            color: '',
            backgroundColor: '',
          },
        },
        mobile: {
          labelPosition: 'left',
          completeButton: {
            text: '提交',
            color: '',
            backgroundColor: '',
          },
        },
        id: '3H1haKaSUMIocpYwWqD4z',
        type: 'root',
      },
      fields: [fField, ...dEnF],
      logic: {},
    }
    if (detailLayout != null) {
      editLayout.layout.pc.push(detailLayout) //
    }
    return editLayout //
  }
  async addPageLayout(tableName, config) {
    let http = this.getHttp()
    let data = await http.post(
      'entity',
      'create', //
      { tableName, ...config }, //
    )
    return data //
  }
  async updatePageLayout(tableName, config) {
    // let http = this.getHttp() //
    // let _res = await http.patch('entity', { tableName, ...config })
  }
  deletePageLayout(tableName, config) {}
  getCurrentPageDesign() {
    let tableName = this.getCurrentPageName()
    let design = this.tableMap[tableName] //
    if (design == null) {
      design = this.tableEditMap[tableName]
    }
    return design //
  }
  getCurrentPageName() {
    let router = this.getRouter()
    let currentRoute = router.currentRoute
    let p = currentRoute.path
    let _tableName = p.split('/').pop()
    return _tableName //
  } //
  routeOpen(config: any, fn?: any) {
    if (typeof config == 'string') {
      config = {
        tableName: config,
      }
    } //
    let router = this.getRouter()
    let tableName: string = config.tableName
    if (typeof fn == 'function') {
      this.addCommand({
        name: tableName,
        fn, //
      })
    }
    router.push(`/${tableName}`) //
  }
  async createPageDesign(config: { tableName: string } | string) {
    if (typeof config == 'string') {
      config = {
        tableName: config,
      }
    }
    let tableName = config.tableName
    let _design = this.tableMap[tableName]
    if (_design) {
      return _design //
    }
    let layoutConfig = await this.getPageLayout(tableName) //
    let obj = layoutConfig
    //@ts-ignore
    obj.tableName = tableName
    let pageDesign = new PageDesign(obj)
    pageDesign.tableName = tableName //
    pageDesign.setLayoutData(layoutConfig)
    await pageDesign.getTableData() //
    this.tableMap[tableName] = pageDesign //
    return pageDesign
  }
  async createPageEditDesign(config: { tableName: string } | string) {
    if (typeof config == 'string') {
      config = {
        tableName: config,
      }
    }
    let tableName = config.tableName
    let editTableName = `${tableName}---edit` //
    let _design = this.tableEditMap[editTableName] //
    if (_design) {
      return _design //
    } //
    let layoutConfig = await this.getPageEditLayout(tableName) //
    let _d = new PageDesign(layoutConfig) //
    _d.tableName = tableName //
    _d.setLayoutData(layoutConfig)
    _d.tableName = editTableName //
    this.tableEditMap[editTableName] = _d //
    return _d //
  }
  getShowEntityArr() {
    let entityMap = this.tableMap
    return Object.values(entityMap) //
  }
  async confirm(config: any) {}
  async confirmEntity(entityConfig: any) {} //
  async confirmForm(formConfig: any) {
    let _form = new Form(formConfig) //
    let component = formCom
    let createFn = () => {
      return {
        component: component, //
        props: {
          formIns: _form,
        },
      }
    }
    let _config = {
      createFn,
      width: 600,
      height: 400,
    }
    let dialog = await this.openDialog(_config) //
    return dialog
  }
  async openDialog(dialogConfig: any = {}) {
    let _dialog = new Dialog(dialogConfig) //
    this.dialogArr.push(_dialog) //
  }
  async confirmTable(tableConfig: any) {
    let _table = new Table(tableConfig)
    let component = tableCom
    let createFn = () => {
      return {
        component: component, //
        props: {
          tableIns: _table,
        },
      }
    }
    let _config = {
      createFn,
      width: 600,
      height: 400,
      confirmFn: (dialog: Dialog) => {
        let _confirmFn = tableConfig.confirmFn //
        if (typeof _confirmFn == 'function') {
          _confirmFn(dialog) //
        }
      },
    }
    let dialog = await this.openDialog(_config) //
    return dialog //
  }
  getAllDialog() {
    let _this = this
    let dialogArr = this.dialogArr
    let _dialogArr = dialogArr.sort((d1, d2) => {
      return 0
    })
    return _dialogArr
  }
  async getSelectData() {
    //
  }
  async getTableConfig(tableName) {
    if (tableName == null) {
      return
    }
    let http = this.getHttp()
    let tableInfo = await http.find('tables', { tableName })
    let row = tableInfo[0]
    return row //
  }
  async createColLayout(filedStr) {
    let lastArr = []
    if (typeof lastArr == 'string') {
      lastArr = [filedStr]
    }
    let obj = {
      ...this.createNodeIdKey('tabsCol'),
      list: [
        {
          ...this.createNodeIdKey('inline'),
          //some Form
          columns: lastArr,
        },
      ],
    }
    return obj
  }
  addCommand(config) {
    let _arr = this.commandArr //
    _arr.push(config)
  } //
  confirmMessage(msg: string | Object, type: any = 'success') {
    if (typeof msg == 'string') {
      msg = {
        content: msg, //
        status: type,
      }
    }
    let _msg: any = msg
    if (!_msg.type) {
      _msg.status = type //
    }
    _msg.type = 'message' //
    _msg.duration = _msg.duration || 1000 //
    VxeUI.modal.message(msg)
  }
  // async designTableColumn(tableName, columnName) {
  //   let tCols = await this.getHttp().find('columns', {
  //     tableName,
  //     field: columnName,
  //   })
  //   if (tCols != null && tCols.length > 0) {
  //   }
  // }
  async designTableColumns(tableName, columnName?: any) {
    let qObj = {
      tableName: tableName,
    }
    if (columnName) {
      //@ts-ignore
      qObj.field = columnName
    }
    let tCols = await this.getHttp().find('columns', qObj) //
    if (tCols?.length == 1) {
      let fConfig = getDFConfig(this, tCols[0])
      //@ts-ignore
      fConfig.confirmFn = (dialog) => {
        console.log('我可能需要校验一下') //
      }
      await this.confirmForm(fConfig)
    } else {
      let tableConfig = {
        tableState: 'edit',
        columns: [
          {
            field: 'primary',
            title: '是否主键',
            editType: 'boolean',
          }, //
          {
            field: 'title',
            title: '标题',
            editType: 'input', //
          },
          {
            field: 'field',
            title: '字段', //
          },
          {
            field: 'formatFn',
            title: '格式化函数',
            editType: 'code',
          },
          {
            field: 'itemChange',
            title: '值更新事件',
            editType: 'code',
          },
          {
            field: 'editType',
            title: '编辑类型',
            editType: 'select',
            options: [
              {
                label: '文本',
                value: 'input',
              },
              {
                label: '下拉框',
                value: 'select',
              },
              {
                label: '日期',
                value: 'date',
              }, //
            ],
          },
        ],
        data: tCols,
        confirmFn: async (dialog: Dialog) => {
          let t = dialog.getRef('innerCom')
          let d: any[] = t.getData()
          let allChangeCol = d.filter((c) => {
            return c['_rowState'] == 'change'
          })
          let http = this.getHttp()
          let res = await http.patch('columns', allChangeCol) //
          this.confirmMessage('更新列成功') //
        },
      }
      await this.confirmTable(tableConfig) //
    }
  }
  getTargetDesign(tableName) {
    let _obj = this.tableMap //
    let editObj = this.tableEditMap
    let obj = editObj[tableName] || _obj[tableName]
    return obj
  }
  async updateTargetColumn(col) {
    if (col.id == null) {
      return
    }
    let http = this.getHttp()
    await http.patch('columns', col) //
  }
  async createCaptcha(k: string) {
    if (k == null) {
      return
    } //
    let http = await this.getHttp()
    let code = http.create('captcha', k) //
    let _system = this
    _system.confirmMessage('获取验证码成功', 'success') //
    return code //
  }
  async registerUser(data) {
    try {
      let http = this.getHttp() //
      let _res = await http.create('users', data) //
      let row = _res[0] //
      return row //
    } catch (error) {
      const message = error.message || ''
      this.confirmMessage(`注册失败,${message}`, 'error') //
    }
  }
  async loginUser(data) {
    let h = this.getHttp()
    let _res = await h.loginUser(data) //
    return _res
  }
  getAllApp() {
    //使用mock数据//
    let data = [
      {
        name: 'erp',
        image: '', //
      },
    ]
    return data //
  }
  //安装app
  async installApp(name) {
    try {
      let http = this.getHttp() //
      await http.create('company', { appName: name }) //
    } catch (error) {
      this.confirmErrorMessage('安装失败') //
    }
  }
  confirmErrorMessage(content) {
    if (typeof content != 'string') {
      //
      return
    }
    this.confirmMessage(content, 'error')
  }
  async getAllApps() {
    let userInfo = this.getUserInfo()
    let user = userInfo.user
    let id = user.id
    let allCompany = await this.getHttp().find('company', {
      userid: id,
    })
    this.allApp = allCompany //
  }
  getUserInfo() {
    let loginInfo = this.loginInfo //
    return loginInfo
  }
  enterApp(name) {
    ////
    window.open('localhost:3004') //
  }
}

export const system = reactive(new System()) //
