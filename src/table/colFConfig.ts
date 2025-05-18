import { Form } from '@ER/form'
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
  if (dType == 'code') {
    fType = 'code'
  }
  let editType = data['editType']
  if (enableTypes.includes(editType)) {
    fType = editType //
  }
  let titles = ['基本信息', '编辑信息']
  let fConfig = {
    itemSpan: 12,
    data: data,
    isTabForm: true, //
    height: 800,
    width: 1200,
    items: [
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
        field: 'fieldFormat',
        label: '编辑类型',
        tabTitle: titles[1],
        type: 'code', //
        options: {},
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
        label: '默认值',
        field: 'defaultValue',
        tabTitle: titles[1],
        type: fType, //
      },
      {
        label: '格式化',
        field: 'fieldFormat',
        tabTitle: titles[0],
        type: 'code', //
      },
      {
        label: '宽度',
        field: 'width',
        type: 'string',
        tabTitle: titles[0],
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
  ]
}
