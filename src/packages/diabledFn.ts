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
}
