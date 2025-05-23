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
    } //
  }
  async importTableRows(): Promise<any> {
    await this.openImportDialog()
  }
  async openImportDialog(): Promise<any> {
    //
    let _ins = await this.getSystem().createPageImportDesign(
      this.getRealTableName(), //
    )//
    let dialogConfig = {
      width: 1,
      height: 1,
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
            com.setCurrentDesign(true) //
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
          },
        }
      },
    }
    this.openDialog(dialogConfig) //
  }
  async selectExcelFile(): Promise<any> {
    let sd = new Promise(async (resolve, reject) => {
      let _data = await this.getSystem().confirmForm({
        title: '导入数据模板',
        itemSpan: 24,
        height: 200,
        width: 300,
        items: [
          {
            label: '是否包含标题',
            type: 'boolean', //
            field: 'includeTitle', //
          },
        ],
        data: {
          includeTitle: 1, //
        },
      })
      VxeUI.readFile({
        multiple: false,
      }).then(async (config) => {
        const file = config.file
        const arrayBuffer = await file.arrayBuffer() //

        const data = new Uint8Array(arrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })

        // 读取第一个 Sheet
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // 使用 header: 1 得到二维数组，再手动映射为对象
        const rawData: any = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
        })
        let _d = null
        if (_data.includeTitle == 0) {
          let [headers, ...rows] = rawData
          let result = rows.map((row) => {
            const obj = {}
            headers.forEach((key, index) => {
              obj[key] = row[index]
            })
            return obj //
          })
          _d = result
        } else {
          if (rawData.length < 2) {
            console.warn('数据不足，至少应有标题和字段行')
            reject('数据不足，至少应有标题和字段行')
            return
          }

          let titleRow = rawData[0]
          let fieldRow = rawData[1]
          let dataRows = rawData.slice(2)

          let data = dataRows.map((row) => {
            let obj = {}
            fieldRow.forEach((field, index) => {
              obj[field] = row[index]
            })
            return obj
          })
          _d = data
        }
        resolve(_d)
      })
    })
    let result = await sd
    let dm = this.getTableRefData()
    dm.data = result //
    return result
  }
} //
