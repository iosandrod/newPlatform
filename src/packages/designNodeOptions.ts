import { computed, isProxy, nextTick } from 'vue'
import { PageDesign } from './pageDesign'
import { Table } from '@/table/table'
import { Column } from '@/table/column'
import { FormItem } from './formitem'
import { defaultButtons, defaultRelateButtons } from './defaultButtons'
import { getBaseInfoEditConfig } from '@/table/colFConfig'
export const getButtonGroupTableConfig = (_this?: PageDesign) => {
  let tableName = _this.getRealTableName()
  let obj = {
    showTable: false,
    title: '按钮组设计', //
    tableState: 'edit',
    showControllerButtons: true,
    controllerButtons: [
      {
        label: '添加子按钮',
        fn: (config) => {
          // debugger //
          let data = config.data
          let table: Table = config.table //
          let _index = data._index
          data = table.dataMap[_index] //
          let isTree = table.getIsTree() //
          let children = data._children
          if (!Array.isArray(children)) {
            children = []
            data.children = children
          }
          let obj = {}
          table.addRow(obj, data) //
          table.addAfterMethod({
            methodName: 'updateCanvas',
            fn: () => {
              table.openTreeRow({ data: data, status: true })
            },
          })
        },
      },
    ],
    buttons: [
      {
        label: '添加', //
      },
      // {
      //   label: '添加主页默认按钮', //
      //   fn: (config) => {
      //     let _t: Table = config.parent
      //     let curRow = _t.getCurRow()
      //     let _defaultButtons = JSON.parse(JSON.stringify(defaultButtons))
      //     _t.config.data.splice(0)
      //     _t.config.data.push(..._defaultButtons)
      //   },
      // }, //
      // {
      //   label: '添加编辑页默认按钮',
      //   fn: (config) => {
      //     let _t: Table = config.parent
      //     let curRow = _t.getCurRow()
      //     let _defaultButtons = JSON.parse(JSON.stringify(defaultButtons))
      //     _t.config.data.splice(0)
      //     _t.config.data.push(..._defaultButtons)
      //   },
      // },
      // {
      //   label: '设置默认关联按钮', //
      //   fn: (config) => {
      //     let _t: Table = config.parent //
      //     let _defaultButtons = JSON.parse(JSON.stringify(defaultRelateButtons))
      //     _t.config.data.splice(0)
      //     _t.config.data.push(..._defaultButtons) //
      //   },
      // },
    ],
    treeConfig: {
      id: 'id',
      parentId: 'pid', //
    },
    columns: [
      {
        field: 'id',
        title: '按钮ID',
        tree: true,
        defaultValue: (config) => {
          //
          let item = config.item
          let dValue = item?.uuid()
          return dValue
        },
      },
      {
        field: 'label',
        title: '标题', ////
        type: 'string',
        editType: 'string',
      },
      {
        field: 'fn',
        title: '执行脚本',
        type: 'code',
        tableName: tableName, //
        editType: 'code', //
      },
      {
        field: 'defaultFn',
        title: '通用函数',
        type: 'select',
        editType: 'select', //
        options: [
          {
            label: '新增',
            value: 'addMainTableRow',
          },
          {
            label: '编辑',
            value: 'editTableRows', //
          },
          {
            label: '保存',
            value: 'saveTableData', ////
          },
          {
            label: '删除',
            value: 'deleteTableRows', //
          },
          {
            label: '导出',
            value: 'exportTableRows',
          },
          {
            label: '导入',
            value: 'importTableRows',
          },
          {
            label: '查询',
            value: 'openSearchDialog', //
          }, //
          {
            label: '进入编辑',
            value: 'setCurrentEdit',
          },
          {
            label: '退出编辑',
            value: 'setCurrentView',
          },
          {
            label: '刷新',
            value: 'getTableData',
          },
          {
            label: '选择文件',
            value: 'selectExcelFile', //
          },
          {
            label: '新增类别',
            value: 'addRelateTableRow',
          },
          {
            label: '编辑类别',
            value: 'editRelateTableRow', //
          },
          {
            label: '删除类别',
            value: 'deleteRelateTableRow',
          },
        ],
      }, //
      {
        field: 'disabledFn',
        title: '禁用脚本',
        type: 'code',
        editType: 'code',
      },
      {
        //
        field: 'disabledDefaultFn',
        title: '通用禁用脚本',
        type: 'select',
        editType: 'select',
        options: [
          {
            label: '编辑状态禁用',
            value: 'editDisabled',
          },
          {
            label: '新增状态禁用',
            value: 'addDisabled',
          },
          {
            label: '产看状态禁用',
            value: 'scanDisabled',
          },
          {
            label: '删除',
            value: 'deleteTableRows',
          },
          {
            label: '导出',
            value: 'exportTableRows',
          }, //
        ],
      },
    ],
    showRowSeriesNumber: true,
    enableDragRow: true,
    dragRowFn: (config) => {
      return true
    },
    dargRowAfterFn: (config) => {}, //
  }
  return obj
}
//处理内部options
export const getButtonGroupFConfig = (_this: PageDesign) => {
  //
  let tableSelect = _this.getAllTableNameOptions()
  let tableConfig = {
    itemSpan: 24, //
    items: [
      {
        label: '关联表名',
        field: 'tableName',
        type: 'select',
        options: {
          options: tableSelect,
        },
      }, //
      {
        title: '按钮设置', //
        field: 'items',
        label: '编辑按钮组', //
        type: 'stable', ////
        // hiddenTitle: true,
        options: getButtonGroupTableConfig(_this), //
      },
    ],
  }
  return tableConfig
}
export const formitemTypeMap = (_this: PageDesign) => {
  let tableOptions = _this.getAllTableName()
  let detailTable = _this
  let allTableOptions = _this.getAllTableNameOptions()
  let tableName = _this?.getRealTableName() || ''
  let obj = {
    entity: {
      //
      itemSpan: 24, //
      items: [
        {
          field: 'tableName',
          label: '表名',
          type: 'input', //
          onBlur: async (config) => {
            let value = config.value
            let oldValue = config.oldValue
            if (value == oldValue) {
              return
            }
            let system = _this.getSystem()
            let tableInfo = await system.getTableConfig(value)
            if (tableInfo == null) {
              return //
            }
            let currentBindData = config.form.getData() //
            Object.entries(tableInfo).forEach(([key, value]) => {
              //@ts-ignore//
              currentBindData[key] = value
            })
          },
        },

        {
          field: 'tableType',
          label: '表类型',
          type: 'select', //
          options: {
            options: [
              {
                label: '主表',
                value: 'main',
              },
              {
                label: '子表',
                value: 'detail', //
              },
              {
                label: '关联表',
                value: 'relate', //
              },
            ],
          },
        },
        {
          field: 'relateKey', //
          label: '表关联字段',
          type: 'select',
          options: {
            options: computed(() => {
              let tname = _this.state.selected?.options?.tableName
              let tConfig = _this.getTableConfig(tname)
              let columns = tConfig?.columns || []
              let _cols = columns.map((col) => {
                let f = col.field
                let title = col.title || f
                return { label: title, value: f } //
              })
              return _cols //
            }),
          },
        },
        {
          field: 'mainRelateKey',
          label: '主表关联字段',
          type: 'select',
          options: {
            options: computed(() => {
              let select = _this.getTableColumns(
                _this.state.selected?.options?.tableName,
              )
              let _se = select.map((col) => {
                let obj = {
                  label: col.title || col.field, //
                  value: col.field,
                } //
                return obj
              })
              return _se
            }),
          },
        },
      ],
      data: computed(() => {
        return _this.state?.selected?.options //
      }),
    },
    input: {
      itemSpan: 24,
      items: [
        {
          field: 'placeholder',
          label: '提示',
          type: 'input', //
        },
      ],
      data: computed(() => {
        return _this.state.selected?.options || {} //
      }), //
    },
    string: {
      itemSpan: 24,
      items: [
        {
          field: 'placeholder',
          label: '提示',
          type: 'input', //
        },
      ],
      data: computed(() => {
        return _this.state.selected?.options //
      }),
    },
    date: {
      itemSpan: 24,
      items: [
        {
          field: 'placeholder',
          label: '提示',
          type: 'input', //
        },
      ],
      data: computed(() => {
        return _this.state.selected?.options //
      }),
    },
    datetime: {
      itemSpan: 24,
      items: [
        {
          field: 'placeholder',
          label: '提示',
          type: 'input', //
        },
      ],
      data: computed(() => {
        return _this.state.selected?.options //
      }),
    },
    time: {
      itemSpan: 24,
      items: [
        {
          field: 'placeholder',
          label: '提示',
          type: 'input', //
        },
      ],
      data: computed(() => {
        return _this.state.selected?.options //
      }),
    }, //
    baseinfo: {
      itemSpan: 24,
      items: [
        {
          field: 'placeholder',
          label: '提示',
          type: 'input', //
        },
        {
          field: 'baseinfoConfig',
          type: 'sform',
          label: '参照表配置', //
          // options: {
          //   itemSpan: 12,
          //   items: [
          //     {
          //       field: 'tableName',
          //       label: '表名',
          //       type: 'string', //
          //     },
          //     {
          //       field: 'bindColumns', //
          //       label: '绑定字段',
          //       span: 24, //
          //       type: 'stable',
          //       options: {
          //         openBefore: async (config) => {
          //           let item: FormItem = config?.item //
          //           let data = config.data //
          //           let options = item.config.options
          //           let columns = options.columns
          //           let col1 = columns[1]
          //           let col0 = columns[0]
          //           if (data?.tableName == null) {
          //             return '请先选择表名' //
          //           }
          //           col1.tableName = data.tableName
          //           col0.tableName = tableName
          //           return //
          //         },
          //         showTable: false, //
          //         tableTitle: '绑定参照表',
          //         tableState: 'edit',
          //         columns: [
          //           {
          //             field: 'key',
          //             title: '当前字段',
          //             editType: 'select',
          //             columnSelect: true,
          //             tableName: tableName, //
          //           },
          //           {
          //             field: 'targetKey',
          //             title: '值',
          //             editType: 'select',
          //             columnSelect: true,
          //             tableName: tableName,
          //           },
          //         ],
          //       },
          //     },
          //     {
          //       field: 'showColumns',
          //       label: '显示字段',
          //       type: 'select',
          //       options: {
          //         columnSelect: true,
          //         multiple: true,
          //         tableName: tableName, //
          //       },
          //     },
          //   ],
          // },
          options: getBaseInfoEditConfig(_this, tableName), //
        },
      ],
      data: computed(() => {
        let opt = _this.state.selected?.options
        if (Array.isArray(opt)) {
        }
        return opt
      }),
    },
    buttongroup: {
      ...getButtonGroupFConfig(_this),

      data: computed(() => {
        return _this.state.selected?.options //
      }),
    },
    col: {
      itemSpan: 24,
      items: [
        {
          field: 'span',
          label: '列宽',
          type: 'number', //
        },
      ],
      data: computed(() => {
        //
        return _this.state.selected?.options //
      }),
    },
    dform: {
      itemSpan: 24,
      items: [
        {
          field: 'tableName',
          label: '关联表名',
          type: 'select', //
          options: {
            options: computed(() => {
              // debugger//
              let allTOptions = _this.getAllTableNameOptions()
              return allTOptions //
            }),
          },
        }, //
        {
          filed: 'bindData',
          label: '绑定变量',
          type: 'code', //
        },
      ],
      data: computed(() => {
        return _this.state.selected?.options || {} //
      }),
    },
    tabs: {
      itemSpan: 24,

      items: [
        {
          field: 'items',
          label: '',
          type: 'stable', //
          options: {
            //
            showTable: true,
            showRowSeriesNumber: true, //
            buttons: [
              {
                label: '新增',
                key: 'add',
                fn: () => {
                  let select = _this.state.selected
                  let context = select.context
                  context.appendCol() //
                },
              },
              {
                label: '删除',
                key: 'del',
                fn: (config) => {
                  let select = _this.state.selected
                  let columns = select.columns
                  let table: Table = config.parent
                  let crow = table.getCurRow()
                  let _index = columns.indexOf(crow)
                  if (_index > -1) {
                    columns.splice(_index, 1) //
                  }
                },
              },
            ],
            columns: [
              {
                field: 'label', //
                title: '标题',
                type: 'string',
                editType: 'string',
              },
            ], //
          },
        },
        {
          field: 'placeholder',
          label: '提示',
          type: 'input', //
        },
      ],
      data: computed(() => {
        let _d = _this.state.selected?.options || {} //
        _d['_items_get'] = () => {
          return _this.state.selected.columns
        }
        _d['_items_set'] = (v) => {} //
        return _d //
      }),
    },
  }
  return obj //
}
