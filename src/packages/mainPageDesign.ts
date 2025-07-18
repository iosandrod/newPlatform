import { Dialog } from '@/dialog/dialog'
import { editPageDesign } from './editPageDesign'
import pageCom from './pageCom'
import { PageDesign } from './pageDesign'
import { useHooks } from './utils/decoration'
import { ImportPageDesign } from './importPageDesign'
//
import * as XLSX from 'xlsx'
import { Form } from './form'
import { nextTick } from 'vue'
export class MainPageDesign extends PageDesign {
  //
  @useHooks((config) => {
    let ctx: PageDesign = config.instance
    let args = config.args
    if (args.length == 0) {
      args[0] = {
        tableName: ctx.getTableName(),
        query: {}, //
        queryArr: [],
      }
    }
    if (typeof args[0] == 'string') {
      args[0] = {
        tableName: args[0],
        query: {},
        queryArr: [],
      }
    }
    return config
  }) //
  async getTableData(config?: any) {
    let _d = super.getTableData(config)
    return _d //
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
    } else {
      this.saveTableDesign({ refresh: false }) //
    }
  }

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
    tableIns.addRows({ rows: arr1 })
  }
  @useHooks((config) => {
    let ctx: PageDesign = config.instance //
    let args = config.args
    if (args.length == 0) {
      args[0] = ctx.getAddRowsArgs()
    } //
  }) //
  async addMainTableRow(addConfig) {
    let config = this.config //
    let system = this.getSystem()
    let tableName = this.getTableName()
    let pageEditType = config.pageEditType
    if (pageEditType == 'page') {
      system.routeOpen(
        `${tableName}---edit`,
        async (d: editPageDesign) => {
          await d.addMainTableRow(addConfig) //
        },
      )
    }
    if (pageEditType == 'default') {
      await this.addTableRows(addConfig) //
    }
    if (pageEditType == 'dialog') {
      await this.openEditDialog(addConfig) //
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
  async openEditDialog(_config?: any) {
    if (typeof _config == 'string') {
      _config = {
        editType: _config,
      }
    }
    let editType = _config?.editType || 'add'
    let editEn = await this.getSystem().createPageEditDesign({
      tableName: this.getRealTableName(),
      isDialog: true, //
    })
    let enName = this.getTableName()
    let dialogConfig = {
      width: 0.8,
      dialogName: `${enName}_dialog`, //
      height: 0.8, //
      title: '编辑',
      destroyOnClose: false,
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
        // {
        //   label: '同步老数据',
        //   fn: async (config) => {
        //     let oldTableColumn = await this.getSystem().getOldErpTableColumns(
        //       this.getRealTableName(),
        //     ) //
        //     // console.log(oldTableColumn, 'oldTableColumn') ////
        //     let _columns = oldTableColumn.filter((col) => {
        //       return Boolean(col.editType) == true
        //     })
        //     // let _column1 = _columns.map(c => c.editTitle)
        //     //tab ->form
        //     let _f = _columns.reduce((res, col) => {
        //       //
        //       let tabName = col.tabName
        //       let _arr = res[tabName]
        //       if (!_arr) {
        //         _arr = []
        //         res[tabName] = _arr
        //       } //
        //       _arr.push(col)
        //       return res
        //     }, {})
        //     let obj1 = Object.values(_f).map((items: any[]) => {
        //       let arr = []
        //       for (let item of items) {
        //         //
        //         let field: any = {
        //           options: {},
        //           field: item.field, //
        //         }
        //         let editType = item.editType
        //         //类型
        //         field.type = editType.toLowerCase() //
        //         if (field.type == 'bool') {
        //           field.type = 'boolean' //
        //         }
        //         if (
        //           ![
        //             'image',
        //             'buttongroup',
        //             'string',
        //             'input',
        //             'entity',
        //             'stable',
        //             'number',
        //             'sform',
        //             'radio',
        //             'select',
        //             'divider',
        //             'dform',
        //             'code',
        //             'time',
        //             'date',
        //             'datetime',
        //             'checkbox',
        //             'boolean',
        //             'baseinfo',
        //             'color',
        //             'gantt',
        //           ].includes(field.type)
        //         ) {
        //           field.type = 'string' ////
        //         }
        //         if (['int', 'float', 'number'].includes(field.type)) {
        //           field.type = 'number' //
        //         }

        //         let options = item.options
        //         field.label = item.editTitle //
        //         let optionsField = item.optionsField //
        //         options.optionsField = optionsField //
        //         options.options = options //
        //         options.required = item.required //
        //         arr.push(field)
        //       }
        //       return arr //
        //     })
        //     let f = obj1[0] //
        //     let p: Dialog = config.parent
        //     let com: editPageDesign = p.getRef('innerCom') //
        //     let items = com.items
        //     let allF = items
        //       .filter((item) => {
        //         return item.config.type == 'dform'
        //       })
        //       .map((f) => {
        //         // return f.getRef('fieldCom')
        //         return f
        //       })
        //     allF.forEach((f1, i) => {
        //       //
        //       let f = f1.getRef('fieldCom')
        //       let _f: Form = f
        //       _f.setItems(obj1[i]) //
        //       nextTick(() => {
        //         let layout = _f.getLayoutData() //
        //         let options = f1.getOptions()
        //         options.layoutData = layout //
        //       })
        //     })
        //   },
        // },
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
    this.getSystem().addCommand({
      tableName: `${this.getRealTableName()}---edit`,
      fn: async (config) => {
        let _editType = editType
        let page: editPageDesign = config
        if (_editType == 'edit') {
          let query: any = {}
          let keyColumn = this.getKeyColumn()
          let curRow = _config.row || this.getCurRow() //
          let _id = curRow[keyColumn] //
          query[keyColumn] = _id //
          page.getTableData({
            query: query,
          }) //
        }
        if (_editType == 'add') {
          let allDetailConfig = Object.values(page.tableDataMap).map(
            (t: any) => {
              // let data = t?.data
              t.data = [] //
            },
          )
          page.addMainTableRow(_config) //
        }
      }, //
    })
    this.openDialog(dialogConfig)
  }
  async confirmEditEntity(config: any) {
    await this.getSystem().confirmEditEntity(config, this)
  } //
  @useHooks((config) => {
    let ctx: PageDesign = config.instance //
    let args = config.args
    if ((args.length = 0)) {
      args[0] = ctx.getSaveData()
    } //
  })
  async saveTableData(config = this.getSaveData()) {
    let tName = this.getRealTableName()
    let http = this.getHttp() //
    // await http.runCustomMethod(tName, 'batchUpdate', config) //批量更新
    await http.batchUpdate(tName, config) //
    this.getSystem().confirmMessage('数据保存成功', 'success') //
    this.getTableData() //
    this.setCurrentView() //
  }
  async editTableRows(editConfig?: any): Promise<any> {
    let _config = editConfig || {}
    let pageEditType = this.config.pageEditType //
    if (pageEditType == 'page') {
      let keyColumn = this.getKeyColumn()
      let keyCode = this.getKeyCodeColumn()
      // console.log(keyColumn, keyCode, 'testKey') //
      if (keyColumn == null) {
        this.getSystem().confirmMessage('请先设置主键字段', 'warning')
        return
      }
      let curRow = _config.row || this.getCurRow() //
      let _id = curRow[keyColumn] //
      // let _keyCode = curRow[keyCode] //
      this.getSystem().routeOpen(
        `${this.getRealTableName()}---edit`,
        async (d: editPageDesign) => {
          await d.getTableData({
            query: {
              [keyColumn]: _id,
            },
          })
        },
      ) //
    }
    if (pageEditType == 'default') {
      this.setCurrentEdit() //
    }
    if (pageEditType == 'dialog') {
      this.openEditDialog({
        editType: 'edit',
        row: _config.row,
      }) //
    }
  }
  async getRelateTreeData(tableName: any): Promise<void> {
    if (typeof tableName == 'string') {
      tableName = {
        tableName: tableName,
      }
    }
    let _tableName = tableName.tableName
    let http = this.getHttp()
    let _data = await http.find(_tableName)
    let dataRef = this.getTableRefData(_tableName)
    let tConfig = this.getTableConfig(_tableName) //
    let treeConfig = tConfig?.treeConfig || {}
    let rootValue = treeConfig?.rootId || '0' //
    let _parentId = treeConfig?.parentId
    let id = treeConfig?.id
    let buildTreeData = (data, parentId = rootValue) => {
      let _data = data
        .filter((item) => item[_parentId] == parentId)
        .map((item) => ({
          ...item,
          children: buildTreeData(data, item[id]),
        }))
      return _data
    }
    let data1 = buildTreeData(_data)
    let rootCnValue = treeConfig?.rootCnValue || '客户类别'
    let treeColF = tConfig.columns.find((col) => {
      return col.isTree == true
    })?.field
    let _data2 = [
      {
        [id]: rootValue,
        [treeColF]: rootCnValue,
        children: data1,
      },
    ]
    dataRef['data'] = _data2 //
    // this.getSystem().confirmMessage('加载树数据成功123') //
  }
  async editRelateTreeData(tableName) {
    if (typeof tableName == 'string') {
      tableName = {
        tableName: tableName,
      }
    }
    let _tableName = tableName.tableName
    let tRef = this.getRef(_tableName)
    if (tRef == null) {
      return
    }
    let curRow = tRef.getCurRow()
    let tConfig = this.getTableConfig(_tableName)
    let keyColumn = tConfig.keyColumn
    let treeConfig = tConfig?.treeConfig || {}
    let rootValue = treeConfig?.rootValue
    let id = treeConfig?.id
    let _value = curRow[id]
    if (_value == rootValue && rootValue != null) {
      //
      this.getSystem().confirmMessage('不能编辑根节点')
      return
    }
    if (curRow == null) {
      this.getSystem().confirmMessage('请选择一行进行编辑') //
      return
    }
    await this.confirmEditEntity({
      tableName: _tableName,
      curRow: curRow,
      keyColumn,
      editType: 'edit', //
    })
  }
} //
