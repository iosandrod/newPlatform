import { nextTick } from 'vue'
import { PageDesign } from './pageDesign'

export class ImportPageDesign extends PageDesign {
  async saveTableDesign(_config?: any): Promise<void> {
    debugger//
    //获取表格的id配置
    let config = this.config
    let id = config.id
    if (id == null) {
      await this.createTableDesign()
    } else {
      //
      await this.updateTableDesign()
    }
    nextTick(() => {
      this.setCurrentDesign(false) //
    })
  }
}
