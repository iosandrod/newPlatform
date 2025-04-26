import { reactive } from 'vue'
import { Client, client as _client, http, myHttp } from './service/client'
import { Base } from '@ER/base'
import { cacheValue } from '@ER/utils/decoration'
import { PageDesign } from '@ER/pageDesign'
import { getDefaultPageProps } from '@ER/pageCom'
export class System extends Base {
  activePage = ''
  systemConfig = {
    menuConfig: {
      items: [],
    },
  } //
  pageLayout = [] //
  selectOptions = {}
  tableMap: { [key: string]: PageDesign } = {} //
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
    return [
      {
        label: '首页',
      },
      {
        label: '表格', //
      },
    ] //
  }
  openPageDesign(config) {}
  async getDefaultPageLayout(name?: string) {
    let http = this.getHttp()
    let _data = await http.post(
      'entity',
      'getDefaultPageLayout',
      {
        tableName: name,
      }, //
    ) //
    return _data //
  }
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
    //
    let http = this.getHttp() //
    let _res = await http.patch('entity', { tableName, ...config }) //
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
      } //
    }
    let router = this.getRouter()
    let tableName = config.tableName
    router.push(`/${tableName}`) //
  }
  async createPageDesign(config: { tableName: string } | string) {
    if (typeof config == 'string') {
      config = {
        tableName: config,
      }
    }
    let tableName = config.tableName
    let layoutConfig = await this.getPageLayout(tableName) //
    let _props = getDefaultPageProps()
    let obj = {}
    let _design = this.tableMap[tableName]
    if (_design) {
      return _design //
    }
    Object.entries(_props).forEach(([key, value]) => {
      //@ts-ignore
      let _default = value.default
      if (typeof _default == 'function' && value.type != Function) {
        //@ts-ignore
        _default = _default()
      }
      obj[key] = _default //
    })
    let pageDesign = new PageDesign(obj)
    pageDesign.setLayoutData(layoutConfig)
    this.tableMap[tableName] = pageDesign //
    return pageDesign
  }
  getShowEntityArr() {
    let entityMap = this.tableMap
    return Object.values(entityMap) //
  }
  async confirmForm(formConfig: any) {}
  async openDialog(dialogConfig: any) {}
  async confirmTable(tableConfig: any) {}
}

export const system = reactive(new System()) //
