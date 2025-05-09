export const getDFConfig = (_this, data) => {
  let fConfig = {
    itemSpan: 12,
    data: data,
    items: [
      {
        field: 'title', //
        label: '标题',
        type: 'string',
      },
      {
        field: 'type',
        label: '类型',
        type: 'select',
        options: {
          options: getAllColTypes(),
        },
      },
      {
        field: 'align',
        label: '对齐方式',
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
        type: 'string',
      },
      {
        label: '格式化',
        field: 'fieldFormat',
        type: 'string',
      },
      {
        label: '宽度',
        field: 'width',
        type: 'string',
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
        field: 'itemChange',
        label: '数据变化',
        type: 'code', //
      },
      {
        label: '编辑类型',
        field: 'editType',
        type: 'select',
        options: {
          options: getAllColTypes(),
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
