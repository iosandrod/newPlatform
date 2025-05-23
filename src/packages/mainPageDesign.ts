import { Dialog } from '@/dialog/dialog'
import { editPageDesign } from './editPageDesign'
import pageCom from './pageCom'
import { PageDesign } from './pageDesign'
import { useHooks } from './utils/decoration'
import { ImportPageDesign } from './importPageDesign'
import { VxeUI } from 'vxe-pc-ui'
//
import * as XLSX from 'xlsx'
export class MainPageDesign extends PageDesign {
  //
  @useHooks((config) => {
    let ctx: PageDesign = config.instance
    let args = config.args
    if (args.length == 0) {
      args[0] = {
        tableName: ctx.getTableName(),
        query: {}, //
      }
    }
    if (typeof args[0] == 'string') {
      args[0] = {
        tableName: args[0],
        query: {},
      }
    }
    return config
  }) //
  async getTableData(config?: any) {
    // console.log('我是主要的东西了') //
    await super.getTableData(config) //
  } //
  onColumnResize(config) {
    let tName = config.tableName
    let curTName = this.getTableName()
    if (tName == curTName) {
      let originColumn = config.originColumn
      console.log('准备更新列', originColumn) //
      let w = originColumn.width
      let id = originColumn.id
      let obj1 = {
        id: id,
        width: w,
      }
      this.updateTableColumn(obj1, false) //
      // this.updateTableColumn()
    }
  }
  onColumnHidden(c: any): void {
    let tName = c.tableName
    let curTName = this.getTableName()
    if (tName == curTName) {
      let originColumn = c.originColumn
      let id = originColumn.id
      let obj1 = {
        id: id, //
        hidden: originColumn.hidden, //
      } //
      this.updateTableColumn(obj1, false) //
    } //Offense is the best defense
  } //
  async onColumnsDesign(cols: any): Promise<any> {
    let tName = cols.tableName
    let curTName = this.getTableName()
    if (tName == curTName) {
      // console.log(cols, 'testCols')///
      let addCols = cols.addCols
      let updateCols = cols.updateCols
      let config = {
        addData: addCols,
        patchData: updateCols, //
      }
      let http = this.getHttp() //
      await http.runCustomMethod('columns', 'batchUpdate', config) //
      this.getSystem().confirmMessage('列数据更新成功', 'success') ////
      this.getSystem().refreshPageDesign() //
    }
  }
  @useHooks((config) => {
    let ctx: PageDesign = config.instance //
    let args = config.args
    if ((args.length = 0)) {
      args[0] = ctx.getAddRowsArgs()
    } //
  }) //
  async addTableRows(config = this.getAddRowsArgs()) {
    //
    let rows = config.rows
    let tableName = config.tableName
    if (typeof rows == 'number') {
      rows = Array(rows).fill(null)
    } //
    let arr1 = []
    for (let i = 0; i < rows.length; i++) {
      let d = await this.addTableRow(rows[i], tableName)
      arr1.push(d)
    }
    let tableIns = this.getTableRef(tableName)
    if (tableIns == null) {
      return
    } //
    tableIns.addRows({ rows: arr1 }) //
  }
  async addMainTableRow(addConfig) {
    let config = this.config //
    let system = this.getSystem()
    let tableName = this.getTableName()
    let pageEditType = config.pageEditType
    if (pageEditType == 'page') {
      system.routeOpen(`${tableName}---edit`, async (d: editPageDesign) => {
        await d.addMainTableRow() //
      })
    }
    if (pageEditType == 'default') {
      await this.addTableRows() //
    }
    if (pageEditType == 'dialog') {
      await this.openEditDialog() //
    }
  }
  async importTableRows(): Promise<any> {
    await this.openImportDialog()
  }
  async openImportDialog(): Promise<any> {
    let _ins = await this.getSystem().createPageImportDesign(
      this.getRealTableName(), //
    ) //
    let dialogConfig = {
      width: 0.8,
      height: 0.8, //
      title: '导入数据',
      buttons: [
        {
          label: '导入数据',
          fn: () => {
            _ins.getTableData() //
          },
        },
        {
          label: '设计布局',
          fn: async (config) => {
            let p: Dialog = config.parent
            let com: ImportPageDesign = p.getRef('innerCom') //
            com.setCurrentDesign(true) ////
          },
        },
        {
          label: '保存布局',
          fn: async (config) => {
            let p: Dialog = config.parent
            let com: ImportPageDesign = p.getRef('innerCom') //
            com.saveTableDesign() //
          },
        },
      ],
      createFn: () => {
        return {
          component: pageCom,
          props: {
            //
            formIns: _ins, //
            isMainPage: true, //
          },
        }
      },
    }
    this.openDialog(dialogConfig) //
  }
  async selectExcelFile(): Promise<any> {
    let _d = await super.selectExcelFile()
    console.log(_d, 'testD') //
  }
  async openEditDialog() {
    let editEn = await this.getSystem().createPageEditDesign({
      tableName: this.getRealTableName(),
      isDialog: true, //
    })
    let dialogConfig = {
      width: 0.8,
      height: 0.8, //
      title: '编辑',
      // showFooter: false,
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
          component: pageCom,
          props: {
            //
            formIns: editEn, //
            isMainPage: true, //
          },
        }
      },
    }
    this.openDialog(dialogConfig)
  }
}
