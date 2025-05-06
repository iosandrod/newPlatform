import { computed } from 'vue'
import { PageDesign } from './pageDesign'
import { Table } from '@/table/table'
//处理内部options
export const formitemTypeMap = (_this: PageDesign) => {
  const tableOptions = _this.getRealTableName()
  let detailTable = _this
  let obj = {
    entity: {
      //
      itemSpan: 24,
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
          filed: 'eventMap',
          label: '事件',
          type: 'input',
        },
        {
          field: 'tableType',
          label: '表类型',
          type: 'select', //
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
      itemSpan: 24,

      items: [
        {
          title: '按钮',
          field: 'items',
          label: '',
          type: 'stable', ////
          options: {
            showTable: true,

            tableConfig: {
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
                  field: 'label',
                  title: '标题', ////
                  type: 'string',
                  editType: 'string',
                },
                {
                  field: 'fn',
                  title: '执行脚本',
                  type: 'code',
                  editType: 'code', //
                },
              ],
            },
          },
        }, //
      ],
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
          options: [],
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
            showTable: true,
            tableConfig: {
              showSerialNumber: true, //
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
              ],
            },
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
        _d['_items_get'] = () => _this.state.selected.columns
        _d['_items_set'] = (v) => {} //
        return _d //
      }),
    },
  }
  return obj //
}

export const selectTypeMap = (_this: PageDesign) => {
  let formitemTypeArr = ['input', 'select']
  let createDSelect = (type) => {
    let items = [
      {
        field: 'field',
        title: '绑定字段',
        type: 'input', //
        label: '绑定字段',
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
        field: 'itemChange',
        label: '值更新事件',
        type: 'code', //
      },
      {
        filed:"sss",
        label:''
      },
    ]
    return items
  } //
  let obj = {
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
