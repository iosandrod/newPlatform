import { PageDesign } from '@ER/pageDesign'
import _ from 'lodash' //
export const mainUse = {
  getTableData: [
    //处理查询控件的表单
    async (context, next) => {
      let fArg = context.args[0]
      let instance: PageDesign = context.instance
      let query = fArg.query
      let tableName = fArg.tableName
      let _tName = instance.getTableName()
      let _d1 = {}
      if (tableName == _tName) {
        let _d = instance.getSearchBindData() //
        let _dn = Object.entries(_d)
        if (_dn.length > 0 && _dn.map((d) => d[1]).some((d) => d != null)) {
          _d1 = _d
        }
      } //
      let searchWhere = instance.getSearchWhere(_d1) //
      let result = _.merge({}, query, searchWhere)
      fArg.query = result //
      instance.setCurrentLoading(true)
      //获取全局的查询条件
      await next().finally(() => {
        setTimeout(() => {
          instance.setCurrentLoading(false) //
        }, 200)
      }) //
      instance.setCurrentView() //
    },
  ], //
  addTableRows: [
    async (context, next) => {
      await next()
      let instance: PageDesign = context.instance
      instance.setCurrentEdit()
    },
  ],
}

export const editUse = {
  saveTableData: [
    async (context, next) => {
      let instance: PageDesign = context.instance
      instance.setCurrentLoading(true) //
      await next().finally(async () => {
        setTimeout(() => {
          instance.setCurrentLoading(false)
        }, 200)
      }) //
      instance.setCurrentView() //
    },
  ],
}
