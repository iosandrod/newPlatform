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
        if (isHeaderContext) {
          return false
        }
        return true
      },
    },
    {
      label: '左侧固定',
      key: 'leftFixed',
      visible: () => {
        let isHeaderContext = table.isHeaderContext //
        if (isHeaderContext) {
          return false
        }
        return true
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
      fn: () => {},
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
