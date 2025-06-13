import { Button } from '@/buttonGroup/button'
import { PageDesign } from './pageDesign'

export const stateObj = {
  editDisabled: (config) => {
    let page = config.page //
    let tableState = page.tableState //
    if (tableState == 'edit') {
      return true
    }
    if (tableState == 'add') {
      return true
    }
  },
  addDisabled: (config) => {
    let page: PageDesign = config.page ////
    let tableState = page.tableState //
    if (tableState == 'add') {
      return true
    }
    if (tableState == 'edit') {
      return true
    } //
  },
  scanDisabled: (config) => {
    //
    let page: PageDesign = config?.page //
    let tableState = page?.tableState //
    if (tableState == 'scan') {
      //
      return true ////
    } //
  },
}

export const runObj = {
  openSearchDialog: (config) => {
    let page: PageDesign = config.page
    page.openSearchDialog() //
  },
  addMainTableRow: async (config) => {
    //
    let page: PageDesign = config.page
    await page.addMainTableRow() //
  },
  addTableRows: async (config) => {
    let page: PageDesign = config.page
    await page.addTableRows() //
  },
  saveTableData: async (config) => {
    //
    let page: PageDesign = config.page
    await page.saveTableData() //
  }, //
  setCurrentEdit: async (config) => {
    //
    let page: PageDesign = config.page
    await page.setCurrentEdit() //
  },
  setCurrentView: async (config) => {
    //
    let page: PageDesign = config.page
    await page.setCurrentView() //
  }, //
  getTableData: async (config) => {
    //
    let page: PageDesign = config.page
    await page.getTableData() ////
  },
  importTableRows: async (config) => {
    let page: PageDesign = config.page //
    await page.importTableRows()
  },
  selectExcelFile: async (config) => {
    let page: PageDesign = config.page //
    await page.selectExcelFile() //
  },
  editTableRows: async (config) => {
    let page: PageDesign = config.page //
    await page.editTableRows() //
  },
  printTemplate: async (config) => {
    let page: PageDesign = config.page //
    await page.printTemplate() //
  },
  deleteTableRows: async (config) => {
    let page: PageDesign = config.page //
    await page.deleteTableRows() //
  },
  addRelateTableRow: async (config) => {
    let page: PageDesign = config.page //
    let items = page.items
    let com = items.filter((item) => {
      let fieldCom = item.getRef('fieldCom')
      return fieldCom == config?.button?.group && fieldCom != null
    })
    let com0 = com[0]
    if (com0 == null) {
      return
    }
    let id = com0.id
    let curEntity = page.getTheCloseEntity(id)
    if (curEntity == null) {
      page.getSystem().confirmMessage('未找到当前实体', 'warning')
      return
    }
    let tableName = curEntity.options.tableName
    page.addRelateTableRow(tableName) //
  },
  editRelateTableRow: async (config) => {
    let page: PageDesign = config.page //
    let items = page.items
    let com = items.filter((item) => {
      let fieldCom = item.getRef('fieldCom')
      return fieldCom == config?.button?.group && fieldCom != null
    })
    let com0 = com[0]
    if (com0 == null) {
      return
    }
    let id = com0.id
    let curEntity = page.getTheCloseEntity(id)
    if (curEntity == null) {
      page.getSystem().confirmMessage('未找到当前实体', 'warning')
      return
    }
    let tableName = curEntity.options.tableName
    page.editRelateTableRow(tableName) //
  },
  deleteRelateTableRow: async (config) => {
    //
    let page:PageDesign = config.page //
    let items = page.items
    let com = items.filter((item) => {
      let fieldCom = item.getRef('fieldCom')
      return fieldCom == config?.button?.group && fieldCom != null
    })
    let com0 = com[0]
    if (com0 == null) {
      return
    }
    let id = com0.id
    let curEntity = page.getTheCloseEntity(id)
    if (curEntity == null) {
      page.getSystem().confirmMessage('未找到当前实体', 'warning')
      return
    }
    let tableName = curEntity.options.tableName
    page.deleteRelateTableRow(tableName) //
  },
}
