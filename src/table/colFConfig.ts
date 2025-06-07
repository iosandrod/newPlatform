import { Form } from '@ER/form'
import { FormItem } from '@ER/formitem'
const enableTypes = [
  'string',
  'number',
  'date',
  'datetime',
  'time',
  'boolean',
  'code',
  'select',
  'cascader',
  'region',
]
export const getDFConfig = (_this, data) => {
  let dType = data['defaultValueType']
  let fType = 'string'

  let editType = data['editType']
  if (enableTypes.includes(editType)) {
    fType = editType //
  }
  if (dType == 'function') {
    //
    fType = 'code'
  }
  let tableName = null //
  if (_this && _this.getRealTableName) {
    // tableName = _this.getRealTableName()
    tableName = _this.getTableName() //
  }
  let realTableName = data['tableName']
  if (realTableName) {
    tableName = realTableName //
  }
  let titles = ['基本信息', '编辑信息', '查询信息'] //
  let fConfig = {
    itemSpan: 12,
    data: data,
    isTabForm: true, //
    height: 800,
    width: 1200,
    tableName: tableName, //
    items: [
      {
        field: 'id',
        label: 'ID',
        type: 'string',
        tabTitle: titles[0],
        disabled: true, //
      },
      {
        field: 'field',
        label: '字段',
        type: 'string',
        tabTitle: titles[0],
        disabled: true,
      },
      {
        field: 'title', //
        label: '标题',
        tabTitle: titles[0],
        type: 'string',
      },
      {
        field: 'type',
        label: '类型',
        tabTitle: titles[0],
        type: 'select',
        options: {
          options: getAllColTypes(),
        },
      },

      {
        field: 'align',
        label: '对齐方式',
        tabTitle: titles[0],
        type: 'select',
        options: {
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
        },
      },
      {
        field: 'calculate', ////
        label: '合计方式',
        tabTitle: titles[0],
        type: 'select',
        options: {
          options: [
            {
              label: '求和',
              value: 'sum',
            },
            {
              label: '平均值',
              value: 'avg',
            },
            {
              label: '最大值',
              value: 'max',
            },
            {
              label: '最小值',
              value: 'min',
            },
          ], //计算
        },
      },
      {
        field: 'tree',
        label: '是否树形',
        tabTitle: titles[0],
        type: 'boolean', //
      },
      {
        label: '默认值',
        field: 'defaultValue',
        tabTitle: titles[1],
        type: fType, ////
        options: {
          tableName: tableName,
          ...data,
        }, //
      }, //
      {
        label: '格式化',
        field: 'fieldFormat',
        tabTitle: titles[0],
        type: 'code', //
        options: {
          tableName: tableName, //
        },
      },
      {
        label: '背景色',
        field: 'bgColor',
        type: 'code', //
        tabTitle: titles[0],
        options: {
          tableName: tableName, //
        },
      },
      {
        label: '默认值类型',
        tabTitle: titles[1],
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
        itemChange: (config) => {
          let form: Form = config.form
          let items = form.items
          let data = config.data
          let t = items.find((t1) => t1.getField() == 'defaultValue')
          if (t == null) {
            return
          }
          let value = config.value
          if (value == 'function') {
            t.config.type = 'code'
          }
          if (value == 'normal') {
            let type = data.editType || data.type
            if (['select', 'date', 'string', 'input'].includes(type)) {
              t.config.type = type
            } else {
              t.config.type = 'string' //
            }
          }
        },
      },
      {
        field: 'addDisabled',
        label: '新增禁用',
        tabTitle: titles[1],
        type: 'boolean', //
      },
      {
        field: 'editDisabled',
        label: '编辑禁用',
        tabTitle: titles[1],
        type: 'boolean',
      },
      {
        field: 'required',
        label: '必填',
        tabTitle: titles[1], //
        type: 'boolean',
      },
      {
        field: 'itemChange',
        label: '数据变化',
        tabTitle: titles[1],
        type: 'code', //
      },
      {
        label: '编辑类型',
        tabTitle: titles[1],
        field: 'editType', //
        type: 'select',
        options: {
          options: getAllColTypes(),
        },
        itemChange: (config) => {
          let form: Form = config.form
          let items = form.items
          let data = config.data
          let t = items.find((t1) => t1.getField() == 'defaultValue')
          if (t == null) {
            return
          }
          let value = config.value
          if (value == 'code') {
            t.config.type = 'code'
          } else {
            t.config.type = value //
          }
        },
      },
      {
        field: 'baseinfoConfig',
        type: 'sform',
        tabTitle: titles[1], //
        label: '参照表配置',
        options: {
          itemSpan: 12,
          items: [
            {
              field: 'tableName',
              label: '表名',
              type: 'string', //
            },
            {
              field: 'bindColumns', //
              label: '绑定字段',
              span: 24, //
              tabTitle: titles[1],
              type: 'stable',
              options: {
                openBefore: async (config) => {
                  let item: FormItem = config?.item //
                  let data = config.data //
                  let options = item.config.options
                  let columns = options.columns
                  let col1 = columns[1]
                  let col0 = columns[0]
                  if (data?.tableName == null) {
                    return '请先选择表名' //
                  }
                  col1.tableName = data.tableName
                  col0.tableName = tableName
                  return //
                },
                showTable: false, //
                tableTitle: '绑定参照表',
                tableState: 'edit',
                columns: [
                  {
                    field: 'key',
                    title: '当前字段',
                    editType: 'select',
                    columnSelect: true,
                    tableName: tableName, //
                  },
                  {
                    field: 'targetKey',
                    title: '值',
                    editType: 'select',
                    columnSelect: true,
                    tableName: tableName,
                  },
                ],
              },
            },
            {
              field: 'showColumns',
              label: '显示字段',
              type: 'select',
              options: {
                columnSelect: true,
                multiple: true,
                tableName: tableName, //
              },
            },
          ],
        },
      },
      {
        field: 'optionsField',
        label: '下拉字段配置', //
        tabTitle: titles[1],
        type: 'baseinfo', //
        options: {
          baseinfoConfig: {
            tableName: 'DataDictionary',
            bindColumns: [
              {
                key: 'optionsField',
                targetKey: 'DictionaryName', //
              },
            ], //
            searchColumns: ['DictionaryName', 'Remark'], //
          },
        },
      },
      {
        label: '选择项',
        field: 'options',
        tabTitle: titles[1],
        type: 'stable',
        span: 24, //
        options: {
          showTable: true,
          tableTitle: '选择项',
          tableState: 'edit',
          columns: [
            {
              field: 'label',
              title: '名称',
              editType: 'string',
            },
            {
              field: 'value',
              title: '值',
              editType: 'string',
            },
          ],
        },
      },
      {
        field: 'searchField',
        label: '查询字段',
        tabTitle: titles[2],
        type: 'string', //
        options: {},
      },
    ],
  }
  return fConfig
}
export const getAllColTypes = () => {
  return [
    {
      label: '字符串',
      value: 'string',
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
      label: '日期时间',
      value: 'datetime',
    },
    {
      label: '时间',
      value: 'time',
    },
    {
      label: '数字',
      value: 'number',
    },
    {
      label: '布尔型',
      value: 'boolean', //
    },
    {
      label: '参照表',
      value: 'baseinfo', //
    },
    {
      label: '代码',
      value: 'code', //
    },
  ]
} //
//

export const getDCConfig = (_this: any, config) => {
  let data = config.data
  let tableName = config.tableName
  let dConfig = {
    title: '设计表格列',
    height: 600,
    width: 1000, //
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
        defaultValue: tableName, //
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
        type: 'boolean', //
        enableSelect: true, //允许批量修改//
        editType: 'boolean', //
      },
      {
        field: 'editType',
        title: '编辑类型',
        type: 'string',
        editType: 'select',//
        options: getAllColTypes(), //
      },
      {
        field: 'primary',
        title: '是否主键',
        editType: 'boolean', //
        type: 'boolean', //
      },
    ],
    data: data,
    dragRowAfterFn: (config) => {
      // debugger //
      let data = config.data
      data.forEach((item, i) => {
        item['_rowState'] = 'change'
        item['order'] = Number(i) + 1
      })
    },
  }
  return dConfig
}
