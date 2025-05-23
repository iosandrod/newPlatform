import _ from 'lodash'
import { Table } from './table'
import { getDFConfig } from './colFConfig'

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
          _dFn(data1) //
        } //
      },
    },
    {
      label: '设计表格列', //
      key: 'designAllColumns',
      disabled: false, //
      visible: true,
      fn: async () => {
        //
        let system = table.getSystem()
        let originColumns = table.getColumns().map((col) => {
          return col.config
        }) //
        let tableName = table.getTableName()
        originColumns = _.cloneDeep(originColumns) //

        let _d: any = await system.confirmTable({
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
            // {
            //   field: 'width',
            //   title: '宽度',
            //   editType: 'number', //
            //   type: 'number', //
            // },
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
      fn: async () => {
        //
        let _config = table.config //
        _config = _.cloneDeep(_config) //
        let fields = [
          'tableName',
          'treeConfig',
          'showCheckboxColumn',
          'showRowSeriesNumber',
          'contextItems',//
        ]
        let _obj = _.pick(_config, fields)
        let _fConfig = {
          itemSpan: 12, //
          data: _obj, //
          height: 500,
          width: 800, //
          items: [
            {
              field: 'treeConfig',
              label: '树形表格配置',
              type: 'sform',
              disabled: false,
              options: {
                itemSpan: 12, //
                items: [
                  {
                    field: 'id',
                    label: '树主键',
                    type: 'string',
                  },
                  {
                    field: 'parentId',
                    label: '父主键',
                    type: 'string',
                  },
                  {
                    field: 'rootId',
                    label: '根节点',
                    type: 'string', //
                  },
                ],
              },
            },
            {
              field: 'showCheckboxColumn',
              label: '是否显示复选框',
              type: 'boolean',
            },
            {
              //
              field: 'showRowSeriesNumber',
              label: '是否显示行号',
              type: 'boolean',
            },
            {
              field: 'contextItems',
              label: '右键菜单配置', //
              type: 'stable',
              span: 24,
              options: {
                showTable: true,
                tableState: 'edit',
                columns: [
                  {
                    field: 'label',
                    title: '菜单名称',
                    type: 'string',
                    editType: 'string',
                  },
                  {
                    field: 'fn',
                    title: '菜单事件',
                    type: 'string',
                    editType: 'code', //
                  },
                ],
              }, //
            },
          ],
        }
        let sys = table.getSystem()
        let _d = await sys.confirmForm(_fConfig)
        table.onTableConfigChange(_d) //
      },
    },
  ]
  let contextItems = table.config.contextItems
  if (Array.isArray(contextItems) && contextItems.length > 0) {
    items = [...items, ...contextItems] //
  }
  table.contextItems = items
}
