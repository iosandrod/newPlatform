import { reactive } from 'vue'
import _ from 'lodash'
import { Client, client as _client, http, myHttp } from './service/client'
import { Base } from '@ER/base'
import { cacheValue, useDelay } from '@ER/utils/decoration'
import { PageDesign } from '@ER/pageDesign'
// import pageCom, { getDefaultPageProps } from '@ER/pageCom'
import { Dialog } from './dialog/dialog'
import { getDialogDefaultProps } from './dialog/dialogCom'
import { Form } from '@ER/form'
import formCom from '@ER/formCom'
import { Table } from './table/table'
import tableCom from './table/tableCom'
import { VxeUI } from 'vxe-pc-ui'
import { getDCConfig, getDFConfig } from './table/colFConfig'
import { editPageDesign } from '@ER/editPageDesign'
import { MainPageDesign } from '@ER/mainPageDesign'
import { editUse, mainUse } from './pageUseFn'
import { ImportPageDesign } from '@ER/importPageDesign'
import msgboxCom from './dialog/_dialogCom/msgboxCom'
import { SearchPageDesign } from '@ER/searchPageDesign'
export class System extends Base {
  allApp: any = [] //
  systemApp: any = []
  mouseConfig = {
    clientX: 0,
    clientY: 0,
  }
  tableImportMap: { [key: string]: PageDesign } = {}
  commandArr = []
  activePage = ''
  systemConfig = {
    menuConfig: {
      items: [],
    },
  } //
  columnSelectOptions: any = {} //
  loginInfo = null
  pageLayout = [] //
  selectOptions = {}
  dialogArr: Dialog[] = []
  tableMap: { [key: string]: PageDesign } = {}
  searchTableMap: { [key: string]: PageDesign } = {} //
  tableEditMap: { [key: string]: PageDesign } = {} //
  tableConfirmMap: { [key: string]: PageDesign } = {}
  async login() {}
  @cacheValue() //
  async getMenuData() {
    let client = this.getClient() //
    let d = await client.find('navs') //
    let filFn = (rows: any[]) => {
      let d = rows.filter((item) => {
        let status = item.status
        if (status == 0) {
          return false
        }
        return true
      })
      d.forEach((c) => {
        let children = c.children
        if (Array.isArray(children)) {
          c.children = filFn(children)
        }
      })
      return d
    } //
    this.systemConfig.menuConfig.items = filFn(d) //
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
  getTabModelValue() {
    let route = this.getRouter()
    let r = route.currentRoute
    let path = r.fullPath
    let _p = path.split('/')
    let p1 = _p.pop()
    if (Boolean(p1) == false) {
      p1 = _p.pop()
    } //
    return p1 //
  }
  getTabItems() {
    let tableMap = this.tableMap
    let allT = Object.values(tableMap)
      .map((row) => {
        return row.getHomeTabLabel() //
      })
      .filter((row) => {
        let hidden = row.hidden
        let isDialog = row.isDialog //
        if (isDialog) {
          return false
        } //
        if (hidden) {
          return false
        }
        return true
      })
    let allEditT = Object.values(this.tableEditMap)
      .map((row) => {
        return row.getHomeTabLabel()
      })
      .filter((row) => {
        let hidden = row.hidden
        let isDialog = row.isDialog //
        if (isDialog) {
          return false
        }
        if (hidden) {
          return false
        }
        return true
      }) //
    let allT2 = [...allT, ...allEditT]
    allT2.sort((a, b) => {
      let oa = a.order || 0
      let ob = b.order || 0
      return oa - ob
    }) //

    return allT2 //
  } //
  openPageDesign(config) {} //

  async getPageLayout(name?: string) {
    let http = this.getHttp()
    let data = await http.get(
      'entity',
      'find', //
      { tableName: name },
    ) //
    let row = data[0]
    if (row == null) {
      return null
    }
    row.tableName = name
    return row //
  }
  async getPageEditLayout(name?: string, type = 'edit') {
    let http = this.getHttp()
    // let reg = /edit$/
    let reg = new RegExp(`${type}$`)
    let name1: any = null
    if (reg.test(name)) {
      name1 = name
    } else {
      name1 = `${name}---${type}`
    }
    let data = await http.find('entity', { tableName: name1 }) //
    let row = data[0] //
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

  async addPageLayout(tableName, config) {
    let http = this.getHttp()
    let data = await http.post(
      'entity',
      'create', //
      { tableName, ...config }, //
    )
    return data //
  }
  async updateCurrentPageDesign(config?: any) {
    let cPage = this.getCurrentPageDesign()
    let layout = config || cPage.getLayoutData() //
    if (layout.id == null) {
      return //
    }
    let http = this.getHttp()
    await http.patch('entity', layout) //
    await this.refreshPageDesign() //
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
    let _tableName = p.split('/').pop() //
    return _tableName //
  } //
  routeOpen(config: any, fn?: any) {
    if (typeof config == 'string') {
      config = {
        tableName: config,
      }
    }
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
  async createPageSearchDesign(
    config?: { tableName: string } | string,
  ): Promise<SearchPageDesign> {
    if (typeof config == 'string') {
      config = {
        tableName: config,
      }
    }
    let tableName = config.tableName //
    let _design: any = this.searchTableMap[tableName]
    let searchTableName = tableName //
    if (!/search$/.test(tableName) || tableName.split('---').length > 1) {
      //
      let _tname = tableName.split('---')[0] //
      searchTableName = `${_tname}---search`
    }
    if (_design) {
      return _design //
    }
    let layoutConfig = await this.getPageLayout(searchTableName)
    let _d = new SearchPageDesign(layoutConfig) //
    _d.tableName = tableName //
    _d.setLayoutData(layoutConfig)
    this.searchTableMap[tableName] = _d //
    return _d //
  }
  async createPageDesign(config: { tableName: string } | string) {
    if (typeof config == 'string') {
      config = {
        tableName: config,
      }
    } //
    let tableName = config.tableName
    let _design = this.tableMap[tableName]
    if (_design) {
      return _design //
    }
    let layoutConfig = await this.getPageLayout(tableName) //
    if (layoutConfig == null) {
      this.confirmErrorMessage('找不到模块') //
      return Promise.reject('找不到模块') //
    }
    let obj = layoutConfig
    //@ts-ignore
    obj.tableName = tableName
    let pageDesign = new MainPageDesign(obj) //
    pageDesign.tableName = tableName //
    pageDesign.setLayoutData(layoutConfig)
    Object.entries(mainUse).forEach(([key, value]) => {
      let _arr = value
      for (const e of _arr) {
        //
        pageDesign.use(key, e)
      }
    })
    let _hookObj = pageDesign.getHooksObj()
    Object.entries(_hookObj).forEach(([key, value]) => {
      let _arr: any = value
      if (Array.isArray(_arr)) {
        for (const e of _arr) {
          //
          pageDesign.use(key, e)
        }
      }
    })
    await pageDesign.getTableData() //
    this.tableMap[tableName] = pageDesign //
    return pageDesign
  }
  async onMainTabChange(config) {
    // console.log(config, 'testConfig')//
    let _config = config.item
    let tableName = _config.tableName
    this.onMenuItemClick({
      //
      tableName,
    }) //
  }
  async createPageEditDesign(
    config:
      | { tableName: string; isDialog?: boolean; isConfirm?: boolean }
      | string,
  ) {
    //
    if (typeof config == 'string') {
      config = {
        tableName: config,
      }
    } //
    let tableName = config.tableName
    let editTableName = tableName
    if (!/edit$/.test(tableName)) {
      editTableName = `${tableName}---edit` //
    } else {
      tableName = editTableName.split('---')[0]
    }
    let _design = this.tableEditMap[editTableName] //
    if (_design) {
      return _design //
    }
    let layoutConfig = await this.getPageEditLayout(editTableName) //
    let _d = new editPageDesign(layoutConfig) //
    if (config.isDialog) {
      _d.isDialog = true //
    }
    _d.tableName = tableName //
    _d.setLayoutData(layoutConfig)
    _d.tableName = editTableName //
    Object.entries(editUse).forEach(([key, value]) => {
      let _arr = value
      for (const e of _arr) {
        //
        _d.use(key, e)
      }
    })
    if (config.isConfirm === true) {
    } else {
      this.tableEditMap[editTableName] = _d //
    }
    return _d //
  }
  async createConfirmEditDesign(
    config:
      | {
          command?: any
          tableName: string
          isDialog?: boolean
          isConfirm?: boolean
        }
      | string,
  ) {
    //
    // debugger //
    if (typeof config == 'string') {
      config = {
        tableName: config,
      }
    } //
    let tableName = config.tableName
    let editTableName = tableName
    if (!/edit$/.test(tableName)) {
      editTableName = `${tableName}---edit` //
    } else {
      tableName = editTableName.split('---')[0]
    }
    let _design = this.tableConfirmMap[editTableName] //
    let _design1 = null
    if (_design) {
      _design1 = _design //
    } else {
      let layoutConfig = await this.getPageEditLayout(editTableName) //
      let _d = new editPageDesign(layoutConfig) //
      if (config.isDialog) {
        _d.isDialog = true //
      }
      _d.isConfirm = true
      _d.tableName = tableName //
      _d.setLayoutData(layoutConfig)
      _d.tableName = editTableName //
      Object.entries(editUse).forEach(([key, value]) => {
        let _arr = value
        for (const e of _arr) {
          //
          _d.use(key, e)
        } //
      })
      this.tableConfirmMap[editTableName] = _d
      if (config.isConfirm === true) {
        //
      } else {
      }
      _design1 = _d //
    }

    let command = config.command
    if (command) {
      this.addCommand({
        name: editTableName,
        id: _design1.id,
        fn: command,
      })
    } //
    return _design1 //
  }
  async createPageImportDesign(config: { tableName: string } | string) {
    //
    if (typeof config == 'string') {
      config = {
        tableName: config,
      }
    }
    let tableName = config.tableName //
    let searchTableName = tableName
    if (!/import$/.test(tableName)) {
      searchTableName = `${tableName}---${'import'}` //
    } else {
      tableName = searchTableName.split('---')[0]
    } //
    let _design = this.tableImportMap[searchTableName] //
    if (_design) {
      return _design //
    }
    let layoutConfig = await this.getPageEditLayout(searchTableName, 'import') //
    let _d = new ImportPageDesign(layoutConfig) //
    _d.tableName = tableName //
    _d.setLayoutData(layoutConfig)
    _d.tableName = searchTableName //
    this.tableImportMap[searchTableName] = _d //
    return _d
  } //
  getShowEntityArr() {
    let entityMap = this.tableMap
    return Object.values(entityMap) //
  }
  async confirm(config: any) {}
  async confirmEntity(entityConfig: any) {} //
  async confirmForm(formConfig: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
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
        confirmFn: (dialog: Dialog) => {
          let _confirmFn = formConfig.confirmFn //
          if (typeof _confirmFn == 'function') {
            _confirmFn(dialog) //
          }
          let _d = dialog.getRef('innerCom').getData()
          resolve(_d) //
        },
        width: formConfig.width || 800,
        height: formConfig.height || 600,
        title: formConfig.title || '数据表单',
      }
      let dialog = await this.openDialog(_config) //
      return dialog
    })
  }
  async openDialog(dialogConfig: any = {}) {
    let _dialog = new Dialog(dialogConfig) //
    this.dialogArr.push(_dialog) //
  } //
  async confirmTable(tableConfig: any): any[] {
    return new Promise(async (resolve, reject) => {
      let _table = new Table(tableConfig)
      let component = tableCom
      let createFn = () => {
        return {
          component: component,
          props: {
            tableIns: _table,
          },
        }
      } //
      let _height = tableConfig.height //
      let _width = tableConfig.width
      let _config = {
        createFn,
        width: _width || 600,
        height: _height || 400, //
        confirmFn: async (dialog: Dialog) => {
          let _data = _table.getData()
          let _confirmFn = tableConfig.confirmFn //
          let requiredValidate = tableConfig.requiredValidate
          //
          if (requiredValidate == true) {
            try {
              await _table.validate()
            } catch (error) {
              reject(error) //
              return false //
            }
          }
          if (typeof _confirmFn == 'function') {
            _confirmFn(dialog) //
          }
          resolve(_data) //
        },
      }
      let dialog = await this.openDialog(_config) //
      return dialog //
    })
  } //
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
  }
  async confirmMessageBox(msg: string | Object, type: any = 'success') {
    let title = ''
    if (type == 'error') {
      title = '错误提示'
    }
    if (type == 'warning') {
      title = '警告提示'
    }
    if (type == 'success') {
      //
      title = '成功提示'
    }
    let dialogConfig = {
      title: title, //
      width: 250, //
      height: 200,
      createFn: () => {
        return {
          component: msgboxCom,
          props: {
            message: msg,
            type: type,
          },
        }
      },
      confirmFn: (dialog: Dialog) => {},
      showFooter: false, //
    } //
    await this.openDialog(dialogConfig) //
  }
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
    _msg.duration = _msg.duration || 3000 //
    VxeUI.modal.message(msg)
  }
  async confirmDialog(mes) {
    if (typeof mes == 'string') {
      mes = {
        message: mes,
      }
    }
    let dConfig = {}
    // this.openDialog()
  }
  async designTargetColumn(config, tType = 0) {
    let fConfig = getDFConfig(this, config) //
    //@ts-ignore
    fConfig.currentTab = tType
    let _data = await this.confirmForm(fConfig)
    return _data //
  }
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
      fConfig.confirmFn = async (dialog) => {
        let t = dialog.getRef('innerCom')
        let d: any = t.getData()
        d = [d]
        let http = this.getHttp()
        let res = await http.patch('columns', d) //
        this.confirmMessage('更新列成功') //
        let tName = this.getCurrentPageName()
        this.refreshPageDesign(tName) ////
      }
      await this.confirmForm(fConfig)
    } else {
      let tableConfig1 = {
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
        // confirmFn: async (dialog: Dialog) => {
        //   let t = dialog.getRef('innerCom')
        //   let d: any[] = t.getData()
        //   let allChangeCol = d.filter((c) => {
        //     return c['_rowState'] == 'change'
        //   })
        //   let http = this.getHttp()
        //   let res = await http.patch('columns', allChangeCol) //
        //   this.confirmMessage('更新列成功') //
        // },
      }
      let tableConfig = getDCConfig(this, {
        tableName: tableName,
        data: tCols,
      })
      let _d = await this.confirmTable(tableConfig)
      let changeData = _d.filter((d) => {
        return d['_rowState'] == 'change' || d['_rowState'] == 'add'
      })
      console.log(changeData) //
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
      // let http = this.getHttp() //
      // let _res = await http.create('users', data) //
      // let row = _res[0] //
      // return row //
      let http = this.getHttp()
      await http.registerUser(data) //
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
    let allApp = this.systemApp
    if (allApp == null || !Array.isArray(allApp)) {
      return []
    }
    return allApp
  }
  async initAllApp() {
    try {
      let http = this.getHttp()
      let _data = await http.post('company', 'getAllApp')
      // console.log(_data, '所有应用') //
      this.systemApp = _data //
    } catch (error) {
      this.confirmErrorMessage('获取应用失败') //
    }
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
  async openApp(name) {
    try {
      //
      //打开app
    } catch (error) {}
  }
  confirmErrorMessage(content) {
    if (typeof content != 'string') {
      //
      return
    }
    this.confirmMessage(content, 'error')
  }
  async getAllApps() {
    if ((await this.getIsLogin()) == false) {
      this.allApp = []
      return //
    }
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
    //
    window.open('localhost:3004') //
  }
  async designCurrentPageConfig() {
    //
    let curPage = this.getCurrentPageDesign()
    // let _config = _.cloneDeep(curPage.config) //
    let tableName = curPage.getTableName() //
    let _config = await this.getPageLayout(tableName)
    let data = _config //
    let tabTitles = ['基本配置', '重载方法', '事件配置'] //
    let fConfig = {
      isTabForm: true,
      itemSpan: 12,
      items: [
        {
          tabTitle: tabTitles[0],
          field: 'tableCnName', //
          label: '表格中文名',
          itemChange: (config) => {},
        },
        {
          label: '显示分页',
          tabTitle: tabTitles[0],
          field: 'showPagination',
          type: 'boolean',
        },
        {
          field: 'pageEditType',
          tabTitle: tabTitles[0],
          label: '页面编辑类型',
          type: 'select', //
          options: {
            options: [
              {
                label: '普通增行', //
                value: 'default', //
              },
              {
                label: '弹出窗口',
                value: 'dialog',
              },
              {
                label: '另开页面',
                value: 'page',
              },
            ],
          },
        }, //
        {
          label: '树配置',
          field: 'treeConfig',
          type: 'sform', //
          tabTitle: tabTitles[0],
          options: {
            itemSpan: 12,
            items: [
              {
                field: 'id',
                label: '树字段',
                type: 'string',
              },
              {
                field: 'parentId',
                label: '父级字段', //
                type: 'string',
              },
              {
                field: 'rootId',
                label: '根节点',
                type: 'string', //
              },
            ],
          },
        },
        {
          label: '分页配置',
          field: 'pagination',
          tabTitle: tabTitles[0],
          type: 'sform',
          options: {
            itemSpan: 12,
            items: [
              {
                field: 'pageSize',
                label: '分页大小',
                type: 'select',
                options: {
                  options: [
                    {
                      label: '10条',
                      value: 10,
                    },
                    {
                      label: '100条',
                      value: 100,
                    },
                    {
                      label: '1000条',
                      value: 1000,
                    },
                    {
                      label: '5000条',
                      value: 5000,
                    },
                    {
                      label: '10000条',
                      value: 10000,
                    },
                    {
                      label: '100000条',
                      value: 100000, //
                    },
                    {
                      label: '无限制',
                      value: 0, //
                    },
                  ],
                },
              },
              {
                field: 'show',
                label: '是否显示',
                type: 'boolean',
              },
            ], //
          },
        },
        {
          field: 'hooks',
          // label: '高级钩子函数编辑',
          type: 'stable',
          tabTitle: tabTitles[0],
          span: 24,
          hiddenTitle: true, //
          options: {
            tableTitle: '高级钩子', //
            tableState: 'edit', //
            columns: [
              {
                field: 'name',
                title: '钩子名称',
                editType: 'select',
                options: [
                  {
                    label: '增行',
                    value: 'addMainTableRow', //
                  },
                  {
                    label: '获取数据',
                    value: 'getTableData', //
                  },
                  {
                    label: '页面加载',
                    value: 'pageInit', //
                  },
                ], //
              },
              {
                field: 'desc',
                title: '钩子描述',
                editType: 'string',
              },
              {
                field: 'code',
                title: '钩子代码',
                editType: 'code', //
                tableName: tableName, //
              }, //
            ],
            showTable: true,
          },
        },
        {
          field: 'methods', //
          type: 'stable',
          tabTitle: tabTitles[1],
          span: 24,
          hiddenTitle: true,
          options: {
            showRowSeriesNumber: true, //
            tableTitle: '方法',
            tableState: 'edit',
            columns: [
              {
                //
                field: 'name',
                title: '方法名称',
                editType: 'string',
              },
              {
                field: 'desc',
                title: '方法描述',
                editType: 'string',
              },
              {
                field: 'code',
                title: '方法代码',
                editType: 'code',
                tableName: tableName, //
              },
            ],
            showTable: true,
          }, //
        },
        {
          tabTitle: tabTitles[2], //
          field: 'events', //
          label: '事件',
          type: 'stable',
          span: 24,
          options: {
            showRowSeriesNumber: true, //
            tableTitle: '事件',
            tableState: 'edit',
            columns: [
              {
                field: 'tableName',
                title: '监听表名',
                editType: 'string',
              },
              {
                field: 'eventName',
                title: '监听方法',
                editType: 'select',
                options: [
                  {
                    label: '新增',
                    value: 'created',
                  },
                  {
                    label: '更新',
                    value: 'patch', //
                  },
                  {
                    label: '删除',
                    value: 'removed',
                  },
                ],
              },
              {
                field: 'name',
                title: '事件名称',
                editType: 'string',
              },
              {
                field: 'desc',
                title: '事件描述',
                editType: 'string',
              },
              {
                field: 'code',
                title: '事件代码',
                editType: 'code',
                tableName: tableName, //
              },
            ],
            showTable: true,
          },
        },
      ],
      data, //
    }
    let _data = await this.confirmForm(fConfig) //
    await this.getHttp().patch('entity', { ..._config }) //
    this.refreshPageDesign(_config.tableName) //
  }
  async refreshPageDesign(tableName?: any) {
    if (tableName == null) {
      tableName = this.getCurrentPageName()
    }
    let pageDesign = this.tableMap[tableName] || this.tableEditMap[tableName] //
    if (pageDesign == null) {
      return
    }
    delete this.tableMap[tableName] //
    delete this.tableEditMap[tableName] //
    let isEdit = this.getIsEditTable(tableName)
    if (isEdit) {
      await this.createPageEditDesign(tableName)
    }
    let isNormal = this.getIsNormalTable(tableName)
    if (isNormal) {
      //
      await this.createPageDesign(tableName)
    }
  }
  getIsNormalTable(tableName: string) {
    let type = this.getTableType(tableName)
    return type == 'normal'
  }
  getIsEditTable(tableName: string) {
    let type = this.getTableType(tableName)
    return type == 'edit'
  }
  getTableType(tableName) {
    let _names = tableName.split('---')
    if (_names.length == 2 && _names[1] == 'edit') {
      return 'edit'
    }
    if (_names.length == 2 && _names[1] == 'search') {
      return 'search'
    }
    if (_names.length == 2 && _names[1] == 'import') {
      return 'import' //
    } //
    return 'normal' //
  }
  async designSystemNavs() {
    let _data = await this.getHttp().find('navs')
    let tableConfig = {
      showHeaderButtons: false, //
      enableDragRow: true,
      treeConfig: {
        id: 'id',
        parentId: 'pid',
        rootId: 0,
      },
      contextItems: [
        {
          label: '添加菜单',
          fn: async (config) => {
            let p = config.parent
            console.log('parent', p) //
          },
        },
        {
          label: '添加子菜单', //
          fn: async () => {},
        },
      ],
      buttons: [],
      columns: [
        {
          field: 'id',
          title: 'id',
          tree: true,
          frozen: 'left',
        },
        {
          field: 'navname', //
          title: '导航名称',
          editType: 'string', //
          width: 200, //
        },
        {
          field: 'tableName',
          editType: 'string', //
          title: '表格或者视图名称',
        },
        {
          field: 'status',
          title: '是否启用', //
          editType: 'boolean', //
        },
      ],
      data: _data,
      height: 600,
      width: 800, //
      dragRowFn: (config) => {
        return true //
      },
      confirmFn: async (dialog) => {
        let data = dialog.getRef('innerCom').getFlatTreeData()
        // console.log(data, 'testData')//
        let _data1 = data.filter((item) => {
          return item['_rowState'] == 'change'
        })
        // console.log(_data1)//
        let http = this.getHttp()
        await http.patch('navs', _data1) //
        this.confirmMessage('更新菜单成功') ////
        this.clearCacheValue('getMenuData') //
        await this.getMenuData() //
      },
      dragRowAfterFn: (config) => {
        let data = config.data
        data.forEach((item, i) => {
          item['_rowState'] = 'change'
          item['sort'] = Number(i) + 1 ////
        })
      },
      showRowSeriesNumber: true,
    }
    await this.confirmTable(tableConfig) //
    return tableConfig
  }

  async enterCurrentPageDesign() {
    let curd = this.getCurrentPageDesign()
    if (curd == null) {
      return
    }
    curd.setCurrentDesign(true) //
  }
  async logout() {
    let http = this.getClient()
    await http.logoutUser() //
  }
  async onMenuItemClick(item) {
    // console.log('左侧菜单点击', item)//
    let tableName = item.tableName
    if (Boolean(tableName) == false) {
      return
    }
    let _d = await this.getHttp().hTable(tableName)
    if (_d == false) {
      return
    } //
    this.routeOpen(tableName) //
  }
  getIsLogin() {
    let loginConfig = this.loginInfo
    if (loginConfig == null) {
      return false
    }
    return true //
  }
  routeTo(path) {
    if (typeof path !== 'string') {
      return
    }
    let r = this.getRouter()
    r.push(path)
  }
  async updateUserInfo() {
    let user = this.loginInfo.user //
    if (user == null) {
      return //
    }
    let http = this.getHttp()
    await http.patch('users', user) //
    this.confirmMessage('更新成功')
  }
  getTabContextItems() {
    let _items = [
      {
        label: '页面配置',
        fn: async () => {
          await this.designCurrentPageConfig()
        },
      }, //
      {
        label: '查询表单设计',
        fn: async () => {
          let pageDesign = this.getCurrentPageDesign()
          await pageDesign.designSearchForm()
        },
      }, //
      {
        label: '同步列',
        fn: async () => {
          let pageDesign = this.getCurrentPageDesign()
          await pageDesign.syncRealColumns()
        },
      },
      {
        label: '重新加载当前页面',
        fn: async () => {
          this.refreshPageDesign() //
        },
      },
    ]
    return _items //
  }
  async confirmDesignForm(config = {}) {
    //
    return new Promise(async (resolve, reject) => {
      let createFn = () => {
        return {
          component: formCom, //
          props: {
            layoutData: config,
            isDesign: true,
            ...config, //
          },
        }
      }
      let dialogConfig = {
        width: '1200px',
        height: '800px',
        createFn,
        confirmFn: (dialog: Dialog) => {
          let _f = dialog.getRef('innerCom')
          let layoutData = _f.getLayoutData()
          resolve(layoutData) //
        },
      }
      this.openDialog(dialogConfig) //
    })
  }
  getSystemController() {
    //
  } //
  @useDelay()
  async createColumnSelect(tableName) {
    //
    if (tableName == null) {
      return
    } //
    if (Array.isArray(tableName)) {
      tableName = tableName.map((t) => t[0])
    } else {
      tableName = [tableName]
    }
    // let _key = `${tableName}_columns`
    tableName = tableName.filter((item) => {
      if (this.columnSelectOptions[item]) {
        return false
      }
      return true
    })
    if (tableName.length == 0) {
      return
    }
    // let _key = `${tableName[0]}_columns`
    let columnSelect = this.columnSelectOptions
    let arr = columnSelect[tableName] //
    let _cols = null
    if (arr == null) {
      let query = null
      if (Array.isArray(tableName)) {
        let _n = new Set(tableName)
        tableName = Array.from(_n) //
        query = {
          tableName: {
            $in: tableName,
          },
        }
      } else {
        query = {
          tableName: tableName,
        }
      }
      _cols = await this.getHttp().find('columns', query) ////
    } //
    let colObj = _cols.reduce((res: any, item: any) => {
      let tableName = item.tableName
      let arr = res[tableName]
      if (arr == null) {
        res[tableName] = []
        arr = res[tableName]
      }
      arr.push(item)
      return res //
    }, {})
    let colObjArr: any = Object.values(colObj)
    for (const obj of colObjArr) {
      let tableName = obj[0].tableName
      let _key = `${tableName}_columns`
      let _cols1 = obj.map((item) => {
        return {
          value: item.field,
          label: item.title || item.field,
        }
      })
      columnSelect[tableName] = _cols1 //
      columnSelect[_key] = true //
    }
    //
  }
  clearSelectColumns() {} //
  getDesignByTableName(tableName) {
    let _obj = this.tableMap //
    let editObj = this.tableEditMap
    let obj = editObj[tableName] || _obj[tableName] //
    return obj
  }
  async confirmEditEntity(config: any, design = null) {
    let tableName = config?.tableName //
    if (tableName == null) {
      return //
    } //
    let _component = this.getSysComponents().pageCom
    let _config = {
      tableName,
      command: async (page: editPageDesign) => {
        let _editType = config.editType || 'add'
        if (_editType == 'edit') {
          let query: any = {}
          let curRow = config.curRow
          if (curRow == null) {
            return
          }
          let keyColumn = page.getKeyColumn() //
          let _id = curRow[keyColumn]
          query[keyColumn] = _id //
          page.getTableData({
            query: query,
          }) //
        }
        if (_editType == 'add') {
          page.addMainTableRow({
            curRow: config?.curRow || {}, //
          }) //
        } //
      }, //
    }
    let _d = await this.getSystem().createConfirmEditDesign(_config) //
    let _dialogConfig = {
      width: 0.8,
      height: 0.8, //
      title: '编辑',
      // showFooter: false,//
      buttons: [
        {
          label: '开启设计',
          fn: async (config) => {
            let p: Dialog = config.parent
            let com: editPageDesign = p.getRef('innerCom') //
            com.setCurrentDesign(true) //
          },
        },
        {
          label: '保存布局',
          fn: async (config) => {
            let p: Dialog = config.parent
            let com: editPageDesign = p.getRef('innerCom') //
            com.saveTableDesign() //
          },
        },
      ],
      createFn: () => {
        return {
          component: _component,
          props: {
            //
            formIns: _d, //
            isMainPage: true, //
          },
        }
      },
    }
    this.openDialog(_dialogConfig) //
  }
  getTargetSearchEntity(tableName) {
    let obj = this.searchTableMap[tableName]
    return obj
  }
}

export const system = reactive(new System()) //
