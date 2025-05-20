import { computed } from 'vue'
import { PageDesign } from './pageDesign'
import { Table } from '@/table/table'
import { Column } from '@/table/column'

export const getButtonGroupTableConfig = (_this?: PageDesign) => {
  let tableName = _this.getRealTableName()
  let obj = {
    showTable: true,
    tableState: 'edit',
    buttons: [
      {
        label: '添加子按钮',
        fn: () => {
          console.log('添加子按钮') //
        },
      },
    ],
    columns: [
      {
        field: 'id',
        title: '按钮ID',
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
            value: 'addTableRows',
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
        ],
      }, //
      {
        field: 'disabledFn',
        title: '禁用脚本',
        type: 'code',
        editType: 'code',
      },
      {
        field: 'disabledDefaultFn',
        title: '通用禁用脚本',
        type: 'code',
        editType: 'code',
      }, //
    ],
    treeConfig: {
      id: 'id',
      parentId: 'pid',
    },
  }
  return obj
}
//处理内部options
export const getButtonGroupFConfig = (_this: PageDesign) => {
  let tableConfig = {
    itemSpan: 24, //
    items: [
      {
        title: '按钮',
        field: 'items',
        label: '',
        type: 'stable', ////
        hiddenTitle: true,
        options: getButtonGroupTableConfig(_this), //
      }, //
    ],
  }
  return tableConfig
}
//编辑options
export const formitemTypeMap = (_this: PageDesign) => {
  let tableOptions = _this.getAllTableName()
  let detailTable = _this
  let allTableOptions = _this.getAllTableNameOptions()
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
                  label: col.title,
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
        // debugger//
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
//编辑普通层的//
export const selectTypeMap = (_this: PageDesign) => {
  let formitemTypeArr = ['input', 'select']
  let createDSelect = (type) => {
    let rTableName = _this.getRealTableName()
    let items = [
      {
        field: 'field',
        title: '绑定字段',
        type: 'string',
        label: '绑定字段',
        options: {
          columnSelect: true, //
          tableName: rTableName, //
        },
      },
      {
        field: 'hiddenTitle',
        label: '隐藏标题', //
        type: 'boolean', //
      },
      {
        field: 'label',
        label: '标题',
        type: 'input', //
      },
      {
        field: 'type',
        label: '类型',
        type: 'select',
        options: {
          options: [
            {
              label: '输入框',
              value: 'input',
            },
            {
              label: '下拉框',
              value: 'select',
            },
            {
              label: '日期',
              value: 'date',
            },
            {
              label: '时间',
              value: 'time',
            },
            {
              label: '日期时间',
              value: 'datetime',
            },
            {
              label: '数字',
              value: 'number',
            },
            {
              label: '密码',
              value: 'stable',
            },
            {
              label: '代码',
              value: 'code',
            },
            {
              label: '开关',
              value: 'switch',
            },
            {
              label: '图片',
              value: 'image',
            },
            {
              label: '子表单', //
              value: 'sform',
            },
          ],
        },
      },
      {
        field: 'eventMap', //
        label: '事件池',
        type: 'stable',
        options: {
          showHeaderButtons: true, //
          columns: [
            {
              field: 'event',
              title: '事件名称',
              editType: 'string',
            },
            {
              field: 'tableName',
              title: '关联表名', //
              editType: 'string',
            },
            {
              field: 'eventDesc',
              title: '事件描述',
              editType: 'string',
            },
            {
              field: 'callback',
              title: '事件代码',
              editType: 'code', //
            },
          ],
        },
      },
      {
        field: 'itemChange',
        label: '值更新事件',
        type: 'code', //
      },
    ]
    if (type == 'entity') {
      items = items.filter((item) => {
        let arr = ['eventMap']
        return arr.includes(item.field)
      })
    } ////
    return items
  } //
  let obj = {
    buttongroup: {
      itemSpan: 24,
      items: [...createDSelect('buttongroup')], //
      data: computed(() => {
        return _this.state.selected || {} //
      }), //
    },
    input: {
      itemSpan: 24,
      items: [...createDSelect('input')],
      data: computed(() => {
        return _this.state.selected || {} //
      }),
    },
    select: {
      itemSpan: 24,
      items: [...createDSelect('select')],
      data: computed(() => {
        return _this.state.selected || {} //
      }),
    },
    entity: {
      itemSpan: 24,
      items: [...createDSelect('entity')],
      data: computed(() => {
        return _this.state.selected || {} //
      }),
    },
    code: {
      itemSpan: 24,
      items: [...createDSelect('code')],
      data: computed(() => {
        return _this.state.selected || {} //
      }),
    },
    stable: {
      itemSpan: 24,
      items: [...createDSelect('stable')],
      data: computed(() => {
        return _this.state.selected || {} //
      }),
    },
    sform: {
      itemSpan: 24,
      items: [...createDSelect('sform')],
      data: computed(() => {
        return _this.state.selected || {} //
      }),
    },
    string: {
      itemSpan: 24,
      items: [...createDSelect('string')],
      data: computed(() => {
        return _this.state.selected || {} //
      }),
    },
  }
  return obj
}
//
