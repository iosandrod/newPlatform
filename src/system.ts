import { reactive } from 'vue'
import { Client, client as _client } from './service/client'
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
  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * login
   * @description login
   * @returns {Promise<void>}
   */
  /*******  7f3c90cf-03e0-4ca7-9500-28a98548d915  *******/
  tableMap = {} //
  async login() {}
  @cacheValue() //
  async getMenuData() {
    let client = this.getClient()
    let s = await client.service('navs') //所有表格////
    let d = await s.find()
    this.systemConfig.menuConfig.items = d //
    return d //
  }
  getCurrentShowPage() {} //
  buildMenuTree(rows) {}
  getClient() {
    return _client
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
      },
      {
        query: 1, //
      },
    ) ////
    return _data //
  }
  routeOpen(config: any) {
    if (typeof config == 'string') {
      config = {
        tableName: config,
      } //
    }
    let router = this.getRouter()
    let allRouter = router.getRoutes()
    console.log(allRouter, 'testRouter') ////
  }
  async createPageDesign(config: { tableName: string } | string) {
    if (typeof config == 'string') {
      config = {
        tableName: config,
      }
    }
    let tableName = config.tableName
    let layoutConfig = await this.getDefaultPageLayout(tableName) //
    let _props = getDefaultPageProps()
    let obj = {}
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
}

export const system = reactive(new System()) //
