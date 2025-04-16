import { reactive } from 'vue'
import { Client } from './service/client'
import { Base } from '@ER/base'
export class System extends Base {
  systemConfig = {}
  selectOptions = {}
  async login() {}
  async getMenuData() {}
  getMenuProps() {
    
  }
}

export const system = reactive(new System()) //
