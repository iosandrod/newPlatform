import { reactive } from 'vue'
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
export class System extends Base {
  activePage = ''
  systemConfig = {
    menuConfig: {
      items: [],
    },
  } //
  pageLayout = [] //
  selectOptions = {}
  dialogArr: Dialog[] = []
  tableMap: { [key: string]: PageDesign } = {}
  async login() {}
  @cacheValue() //
  async getMenuData() {
    let client = this.getClient()
    let d = await client.get('navs', 'find') ////
    this.systemConfig.menuConfig.items = d //
    return d //
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
    console.log(allT, 'testAllT') //
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
    let data = await http.find('entity', { tableName: name, tableType: 'edit' })
    let row = data[0] //
    if (row == null) {
      let _data = await http.post('entity', 'createEditPageLayout', {
        tableName: name,
      })
      console.log(_data || {})
    }
    return row //
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
    let design = this.tableMap[tableName]
    return design //
  }
  getCurrentPageName() {
    let router = this.getRouter()
    let currentRoute = router.currentRoute
    let p = currentRoute.path
    let _tableName = p.split('/').pop()
    return _tableName //
  }
  routeOpen(config: any) {
    if (typeof config == 'string') {
      config = {
        tableName: config,
      }
    } //
    let router = this.getRouter()
    let tableName: string = config.tableName
    let _tableName = tableName.split('---')
    if (_tableName.length == 2) {
      let _tableName1 = _tableName[0]
      let type = _tableName[1]
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
    let _props = getDefaultPageProps()
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
    obj = {
      ...obj,
      ...layoutConfig,
    } //
    //@ts-ignore
    obj.tableName = tableName
    let pageDesign = new PageDesign(obj)
    pageDesign.tableName = tableName //
    pageDesign.setLayoutData(layoutConfig)
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
    let _design = this.tableMap[tableName]
    if (_design) {
      return _design //
    }
    let layoutConfig = await this.getPageEditLayout(tableName) //
    let _props = getDefaultPageProps()
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
    obj = {
      ...obj,
      ...layoutConfig,
    } //
    //@ts-ignore
    obj.tableName = tableName
    let pageDesign = new PageDesign(obj)
    pageDesign.tableName = tableName //
    pageDesign.setLayoutData(layoutConfig)
    //这是编辑的页面//
    return pageDesign
  }
  getShowEntityArr() {
    let entityMap = this.tableMap
    return Object.values(entityMap) //
  }
  async confirm(config: any) {}
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
    let _dialog = new Dialog(dialogConfig)
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
}

export const system = reactive(new System()) //
