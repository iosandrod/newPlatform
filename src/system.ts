import { nextTick, reactive } from 'vue'
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
import codeEditorCom from './codeEditor/codeEditorCom'
import CodeEditor from './codeEditor/codeEditor'
import wangCom from './wangEditor/wangCom'
import { createColumnSelect } from './systemFn'
import { generateRoutes } from '@/router/register'
import { Menu } from './menu/menu'
import { BMenu } from './buttonGroup/bMenu'
export class System extends Base {
  hasInitRoutes = false
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
  fieldSelectOptions: any = {} //
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
    //
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
  async refreshMenuData() {
    this.clearCacheValue('getMenuData')
    await this.getMenuData()
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
  openPageDesign(config) {}
  async openCodeDialog(config) {
    return new Promise((resolve, reject) => {
      let createFn = () => {
        return {
          component: codeEditorCom,
          props: { ...config },
        }
      }
      this.openDialog({
        ...config,
        height: 600,
        width: 1200,
        createFn,
        confirmFn: (dialog) => {
          let _confirmFn = config.confirmFn
          if (typeof _confirmFn == 'function') {
            _confirmFn(dialog) //
          }
          let _d = dialog.getRef('innerCom').getModelValue()
          resolve(_d)
        },
        closeFn: (dialog) => {
          let _closeFn = config.closeFn
          if (typeof _closeFn == 'function') {
            _closeFn() //
          }
          let _d = dialog?.getRef('innerCom')?.getModelValue()
          resolve(_d) //
        },
      })
    })
  }
  openWangEditorDialog(config) {
    let createFn = () => {
      return {
        component: wangCom,
        props: { ...config },
      }
    }
    this.openDialog({
      ...config,
      height: 600,
      width: 1200,
      createFn,
      confirmFn: (dialog) => {
        let _confirmFn = config.confirmFn
        if (typeof _confirmFn == 'function') {
          _confirmFn(dialog) //
        }
      },
      closeFn: () => {
        let _closeFn = config.closeFn
        if (typeof _closeFn == 'function') {
          _closeFn() //
        }
      },
    }) //
  }
  async getPageLayout(name?: string) {
    let http = this.getHttp()
    let data = await http.find('entity', { tableName: name }) //
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
    let en = this.getTargetDesign(tableName)
    if (en != null) {
      en.tabHidden = false
    } //
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
    if (config == null) {
      return //
    }
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
    // let f = layoutConfig.fields
    // debugger//
    // f = f.filter((e) => e.type != null) //
    // layoutConfig.layout.pc=[layoutConfig.layout.pc[0]]
    // layoutConfig.layout.mobile=[layoutConfig.layout.mobile[0]]//
    // layoutConfig.fields = f //
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
    // await pageDesign.getTableData() //
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
    // debugger//
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
    let tableInfo = await http.runCustomMethod('entity', 'getTableConfig', {
      tableName,
    })
    // let row = tableInfo[0]
    return tableInfo //
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
    return new Promise(async (resolve, reject) => {
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
        width: 500, //
        height: 300,
        createFn: () => {
          return {
            component: msgboxCom,
            props: {
              message: msg,
              type: type,
            },
          }
        },
        buttons: [
          {
            label: '复制',
            fn: () => {
              this.copyValue(msg) //
            },
          },
        ],
        confirmFn: (dialog: Dialog) => {
          resolve(true)
        },
        closeFn: (dialog: Dialog) => {
          resolve(false)
        },
        showFooter: true, //
      } //
      await this.openDialog(dialogConfig)
    })
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
    let confirm = this.tableConfirmMap
    let obj = editObj[tableName] || _obj[tableName] || confirm[tableName] //
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
    let code = await http.create('captcha', { api: k }) //
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
    h.changeClient(data) //
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
    //
    try {
      let http = this.getHttp() //
      await http.create('company', { appName: name }) //
    } catch (error) {
      this.confirmErrorMessage('安装失败') //
    }
  }
  async openApp(name) {
    let canOpen = true //
    try {
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
  }
  async designCurrentPageConfig() {
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
          tabTitle: tabTitles[0], //
          field: 'tableName',
          label: '表名',
          type: 'input', //
          disabled: true, //
          itemChange: (config) => {},
        },
        {
          tabTitle: tabTitles[0], //
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
          label: '关联视图',
          field: 'viewTableName', //
          type: 'string', //
          tabTitle: tabTitles[0],
          options: {},
        },
        {
          label: '真实表名', //
          field: 'realTableName',
          type: 'string',
          tabTitle: tabTitles[0],
          options: {},
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
              {
                field: 'type',
                title: '钩子类型',
                editType: 'select',
                options: [
                  {
                    label: '前端',
                    value: 'front',
                  },
                  {
                    label: '后端',
                    value: 'back',
                  },
                ],
              },
              {
                field: 'enable',
                title: '是否启用',
                editType: 'boolean', //
              },
            ],
            showTable: true, //
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
                  {
                    label: '改变',
                    value: 'changed',
                  }, //
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
    this.routeOpen('navs') //
  }

  async enterCurrentPageDesign() {
    let curd = this.getCurrentPageDesign()
    if (curd == null) {
      return
    }
    curd.setCurrentDesign(true) //
  }
  async logout() {
    debugger //
    let http = this.getClient()
    await http.logoutUser()
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
  }
  @useDelay()
  async createOptionsFieldSelect(optionsField: string) {
    let allKeys = Object.keys(this.fieldSelectOptions)
    let allArgs = [...optionsField].flat().filter((item) => {
      return !allKeys.includes(item)
    }) //
    let options = await this.getHttp().runCustomMethod(
      'columns',
      'getOptionsFieldSelect',
      allArgs,
    )
    Object.entries(options).forEach(([key, value]) => {
      this.fieldSelectOptions[key] = value
    })
  }
  @useDelay()
  async createColumnSelect(tableName) {
    await createColumnSelect(this, tableName) //
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
          if (config?.keyColumn != null) {
            page.setKeyColumn(config.keyColumn) //
          }
          let keyColumn = config?.keyColumn || page.getKeyColumn()
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

  changeHttpClient(config) {
    let userid = config.userid
    let appName = config.appName
    if (appName == null || userid == null) {
      return
    }
    let http = this.getHttp()
    http.changeClient(config) //
  }
  async getAllRegisterCompany() {
    let http = this.getHttp()
    let res = await http.runCustomMethod('company', 'getAllRegisterCompany', {}) //
    // console.log(res, 'testRes') ////
    let _res = res
      .map((re) => {
        let user = re.user
        return { ...user, ...re }
      })
      .map((row) => {
        let appName = row.appName
        let userid = row.userid
        let companyCnName = row.companyCnName
        let appCnName = row.appCnName
        return {
          appName,
          appCnName,
          userid,
          companyCnName,
        } //
      }) //
    //加入平台
    _res.push({
      appName: 'platform',
      appCnName: '平台',
      userid: 0,
      companyCnName: '平台', //
    })
    return _res
  } //
  async createSystemRoutes() {
    let app = await this.getCurrentApp()
    let globalRou = this.getGlobRoute()
    let router = this.getRouter()
    let targetRoutes = globalRou[app]
    let curRou = router.currentRoute
    let url = window.location.href
    let host = window.location.host
    let _path = url.split(host)[1]
    // console.log(curRou, 'curRou') //
    if (Array.isArray(targetRoutes) && targetRoutes.length > 0) {
      for (const r of targetRoutes) {
        router.addRoute('pageIndex', r)
      }
      this.hasInitRoutes = true //
      nextTick(() => {
        router.push({
          path: _path,
        }) //
      }) //
    } //
  }
  async getCurrentApp() {
    let host = window.location.host
    let port = window.location.port
    if (port == '3004') {
      return 'erp'
    }
    return 'platform' //
  }
  getGlobRoute() {
    let vueF = generateRoutes()
    // console.log(vueF, 'testRoutes') //
    return vueF //
  }
  copyValue(v) {
    let v2 = VxeUI.clipboard.copy(v)
  }
  getSysContextItems() {
    let _items = [
      {
        label: '设计当前菜单',
        fn: () => {
          let menu: Menu = this.getRef('leftMenu')
          let curItem = menu.curContextMenu
          this.designMenuItem(curItem) //
        },
      },
    ]
    return _items
  }
  async designMenuItem(item) {
    if (item == null) {
      return
    }
    await this.confirmEditEntity({
      tableName: 'navs',
      editType: 'edit',
      curRow: item,
    })
  }
  async openContextMenu(e) {
    let menu: BMenu = this.getRef('contextmenu')
    if (menu == null) {
      return
    }
    menu.open(e)
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
}
export const system = reactive(new System()) //
