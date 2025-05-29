import _ from 'lodash'
import { Table } from './table'
import { getDFConfig } from './colFConfig' //
import { VxeText, VxeUI } from 'vxe-pc-ui'
export const initContextMenu = (table: Table) => {
  let items = [
    {
      label: '复制',
      key: 'copy',
      visible: true,
      fn: () => {
        //
        let col = table.curContextCol
        let row = table.curContextRow
        let f = col?.getField()
        let v1 = null
        if (row == null) {
          v1 = f //
        } else {
          let _v = row?.[f]
          v1 = _v
        } //
        //
        let v2 = VxeUI.clipboard.copy(v1)
        // console.log(v2) //
      },
    },
    {
      label: '删除',
      key: 'delete',
      visible: () => {
        let isHeaderContext = table.isHeaderContext //
        if (isHeaderContext) {
          return false
        }
        return true
      },
    },
    {
      label: '固定设置',
      visible: () => {
        let isHeaderContext = table.isHeaderContext //
        if (!isHeaderContext) {
          return false
        }
        return true //
      },
      items: [
        {
          label: '右侧固定',
          key: 'rightFixed',
          visible: () => {
            let isHeaderContext = table.isHeaderContext //
            if (!isHeaderContext) {
              return false
            }
            return true
          },
          fn: () => {
            let curContext = table.curContextCol
            if (curContext) {
              let frozen = curContext.getIsFrozen()
              if (frozen == true) {
                curContext.setNoFrozen()
              } else {
                curContext.setFrozen('right')
              }
            }
          },
        },
        {
          label: '取消固定',
          key: 'noFixed',
          visible: () => {
            let isHeaderContext = table.isHeaderContext //
            if (!isHeaderContext) {
              return false
            }
            return true
          },
          fn: () => {
            let curContext = table.curContextCol
            if (curContext) {
              curContext.setNoFrozen()
            }
          },
        },
        {
          label: '左侧固定',
          key: 'leftFixed',
          visible: () => {
            let isHeaderContext = table.isHeaderContext //
            if (!isHeaderContext) {
              return false
            }
            return true
          },
          fn: () => {
            let curContext = table.curContextCol
            if (curContext) {
              let frozen = curContext.getIsFrozen()
              if (frozen == true) {
                curContext.setNoFrozen()
              } else {
                curContext.setFrozen('left') //
              }
            }
          },
        },
      ],
    },
    {
      label: '编辑',
      key: 'edit',
      disabled: () => {
        return true
      },
      visible: () => {
        let isHeaderContext = table.isHeaderContext //
        if (isHeaderContext) {
          return false
        }
        return true //
      },
    },
    {
      label: '全局查询',
      key: 'globalQuery',
      disabled: false, //
      visible: true,
      fn: () => {
        //
        table.showGlobalSearch(true) //
      },
    },
    {
      label: '隐藏当前列',
      key: 'hideColumn',
      disabled: false, //
      visible: true,
      fn: () => {
        let curContextCol = table.curContextCol
        if (!curContextCol) {
          return //
        }
        let f = curContextCol.getField()
        // console.log(f, 'testF') //
        table.hiddenColumn(f) //
        //
      },
    },
    {
      label: '设计当前列', //
      key: 'designColumn',
      disabled: false, //
      visible: true,
      fn: async () => {
        let curContextCol = table.curContextCol
        let _config = curContextCol.config
        _config = _.cloneDeep(_config) //
        let sys = table.getSystem()
        let mainD = table.getMainPageDesign()
        let fConfig = getDFConfig(mainD, _config)
        let data1 = await sys.confirmForm(fConfig) //
        let _dFn = table.config.onDesignColumn
        if (typeof _dFn == 'function') {
          _dFn(data1, curContextCol.config)
        } //
      },
    },
    {
      label: '设计表格列', //
      key: 'designAllColumns',
      disabled: false, //
      visible: true,
      fn: async () => {
        let system = table.getSystem()
        let originColumns = table.getColumns().map((col) => {
          return col.config
        }) //
        let tableName = table.getTableName()
        originColumns = _.cloneDeep(originColumns) //

        let _d: any = await system.confirmTable({
          enableDragRow: true,
          dragRowFn: (config) => {
            return true //
          },
          requiredValidate: true,
          showRowSeriesNumber: true, //
          validateFn: async (config) => {
            let table = config.table
            let data = config.data //
            let fields = data.map((item) => item.field)
            let f1 = fields.filter((item, i) => {
              return fields.indexOf(item) == i
            })
            if (f1.length != fields.length) {
              return '绑定字段重复'
            } //
            return true
          },
          tableState: 'edit',
          columns: [
            {
              field: 'title', //
              title: '标题', //
              editType: 'string', //
              type: 'string', //
            },
            {
              field: 'tableName',
              title: '表名',
              defaultValue: table.getTableName(), //
              type: 'string',
              disabled: true,
            },
            {
              field: 'field', //
              title: '绑定字段',
              editType: 'string',
              type: 'string',
              disabled: true, //
            },
            {
              field: 'align',
              editType: 'select',
              title: '对齐方式', //
              type: 'string',
              options: [
                {
                  label: '居左',
                  value: 'left',
                },
                {
                  label: '居中',
                  value: 'center',
                },
                {
                  label: '居右',
                  value: 'right',
                },
              ],
            }, //
            {
              field: 'hidden',
              title: '是否隐藏',
              type: 'boolean',
              editType: 'boolean', //
            },
            {
              field: 'primary',
              title: '是否主键',
              editType: 'boolean', //
              type: 'boolean', //
            },
          ],
          data: originColumns,
        }) //
        table.onColumnsDesign(_d)
      },
    },
    {
      label: '表格信息配置',
      key: 'refresh',
      disabled: false, //
      visible: true,
      fn: async (config) => {
        let _config = table.config
        let onTableDesign = _config.onTableDesign
        if (typeof onTableDesign == 'function') {
          await onTableDesign(config)
        }
      },
    },
  ]
  let contextItems = table.config.contextItems
  if (Array.isArray(contextItems) && contextItems.length > 0) {
    items = [...items, ...contextItems] //
  }
  table.contextItems = items
}
