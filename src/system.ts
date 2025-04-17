import { reactive } from 'vue'
import { Client, client as _client } from './service/client'
import { Base } from '@ER/base'
import { cacheValue } from '@ER/utils/decoration'
export class System extends Base {
  systemConfig = {
    menuConfig: {
      items: [],
    },
  }
  selectOptions = {}
  async login() {}
  @cacheValue() //
  async getMenuData() {
    let client = this.getClient()
    let s = await client.service('navs') //所有表格////
    let d = await s.find()
    this.systemConfig.menuConfig.items = d //
    return d //
  }
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
        label: '表格',//
      },
    ] //
  }
}

export const system = reactive(new System()) //
