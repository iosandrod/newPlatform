export const globalConfig = {
  isSync: true,
  pc: {
    size: 'default',
    labelPosition: 'left',
    completeButton: {
      text: '提交',
      color: '',
      backgroundColor: '',
    },
  },
  mobile: {
    labelPosition: 'left',
    completeButton: {
      text: '提交',
      color: '',
      backgroundColor: '',
    },
  },
}
export const createGlobalConfig = () => {
  return JSON.parse(JSON.stringify(globalConfig))
}
export const createPageDesignFieldConfig = () => {
  return JSON.parse(JSON.stringify(pageDesignFieldConfig)) //
}
export const pageDesignFieldConfig = [
  {
    name: '基础字段',
    id: 'field',
    children: [
      {
        type: 'entity',
        label: '实体表格', //
        icon: 'input', //
        key: '',
        id: '',
        options: {
          clearable: true,
          isShowWordLimit: false,
          renderType: 1,
          disabled: false,
          showPassword: false,
          defaultValue: '',
          placeholder: '',
          labelWidth: 100,
          isShowLabel: true,
          required: false,
          min: null,
          max: null,
        },
      },
      {
        type: 'gantt',
        label: '甘特图',
        icon: 'input',
        key: '',
        id: '',
        options: {}, //
      },
      {
        type: 'dform', //
        label: '表单',
        icon: 'input',
        id: '',
        options: {
          clearable: true,
          isShowWordLimit: false,
          renderType: 1,
          disabled: false,
          showPassword: false,
          defaultValue: '',
          placeholder: '',
          labelWidth: 100,
          isShowLabel: true,
          required: false,
          min: null,
          max: null,
        },
        style: {
          width: '100%',
          minHeight: '50px',
        },
      },
      {
        type: 'buttongroup', //
        label: '按钮组', //
        icon: 'input',
        id: '',
        options: {
          items: [],
          labelWidth: 100,
          isShowLabel: true,
          required: false,
          min: null,
          max: null,
        },
        style: {
          width: '100%',
          minHeight: '50px',
        },
      },
    ],
  },
  {
    name: '容器',
    id: 'container',
    children: [
      {
        type: 'grid',
        label: 'grid',
        icon: 'grid',
        id: '',
        columns: [
          {
            id: '',
            options: {
              span: 12,
              offset: 0,
              pull: 0,
              push: 0,
            },
            type: 'col',
            list: [],
          },
        ],
        options: {
          gutter: 0,
          justify: 'start',
          align: 'top',
        },
      },
      {
        type: 'table',
        label: '表格布局',
        icon: 'tableStokeP2',
        id: '',
        rows: [
          {
            type: 'tr',
            columns: [
              {
                type: 'td',
                options: {
                  colspan: 1,
                  rowspan: 1,
                  isMerged: false,
                },
                list: [],
                style: {},
              },
            ],
          },
        ],
        options: {
          width: 100,
          widthType: '%',
        },
      },
      {
        type: 'tabs',
        label: '标签页',
        icon: 'label',
        id: '',
        columns: [],
        options: {
          type: '',
          tabPosition: 'top',
          align: 'top',
          hidden: false,
        },
      },
      {
        type: 'collapse',
        label: '折叠面板',
        icon: 'collapse',
        id: '',
        columns: [],
        options: {
          defaultValue: [],
          accordion: false,
        },
      },
      {
        type: 'divider',
        label: '分割线',
        icon: 'divider',
        key: '',
        id: '',
        options: {
          contentPosition: 'center',
          filterable: true,
          defaultValue: 'divider',
          labelWidth: 100,
          labelHidden: true,
          required: false,
        },
      },
      // {
      //   type: 'subform',
      //   label: '子表单',
      //   icon: 'subform',
      //   id: '',
      //   list: [
      //     []
      //   ],
      //   options: {
      //     defaultValue: [],
      //     isShowLabel: true,
      //     required: false,
      //     disabled: false
      //   }
      // }
    ],
  },
]
