import { Table } from './table'

export const initContextMenu = (table: Table) => {
  let items = [
    {
      label: '复制',
      key: 'copy',
      visible: true,
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
      label: '设计当前列', //
      key: 'designColumn',
      disabled: false, //
      visible: true,
      fn: async () => {
        let curContextCol = table.curContextCol
        let _config = curContextCol.config
        let sys = table.getSystem()
        let fConfig = {
          itemSpan: 12,
          items: [
            {
              label: '标题', //
              field: 'title',
              editType: 'string', //
            },
            {
              label: '值更新事件',
              filed: 'itemChange',
              editType: 'code', //
            },
            {
              label: '默认值',
              field: 'defaultValue',
              type: 'code', //
            },
            {
              label: '默认值类型',
              field: 'defaultValueType',
              type: 'select',
              options: {
                options: [
                  {
                    label: '函数类型',
                    value: 'function',
                  },
                  {
                    label: '普通类型',
                    value: 'normal',
                  },
                ],
              },
            },
            {
              label: '编辑类型',
              field: 'editType',
              type: 'select',
              options: {
                options: [
                  {
                    label: '输入框',
                    value: 'string',
                  },
                ],
              },
            },
          ],
          data: _config, //
          height: 500,
          width: 900,
        }
        let data1 = await sys.confirmForm(fConfig)
        console.log(data1, 'testData1') //
      },
    },
    {
      label: '设计表格列', //
      key: 'designAllColumns',
      disabled: false, //
      visible: true,
      fn: () => {
        let system = table.getSystem()
        let originColumns = table.getColumns().map((col) => {
          return col.config
        })
        system.confirmTable({
          tableState: 'edit',
          columns: [
            {
              field: 'title',
              title: '标题',
              editType: 'string',
              type: 'string', //
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
              field: 'width',
              title: '宽度',
              editType: 'number', //
              type: 'number', //
            },
          ],
          data: originColumns,
        })
      },
    },
  ]
  table.contextItems = items
}
