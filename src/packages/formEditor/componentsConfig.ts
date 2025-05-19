import { Form } from '@ER/form'
import { PageDesign } from '@ER/pageDesign'

export const globalConfig = {
  isSync: true,
  pc: {
    size: 'default',
    labelPosition: 'left', //
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
export const createFieldConfig = (f: Form) => {
  let d: PageDesign = f.getCurrentPageDesign()
  let allFields = []
  if (d != null) {
    let columns = d.config.columns || [] //
    for (let col of columns) {
      let type = col.type
      type = 'string' //
      allFields.push({
        type: type,
        label: col.title || col.field,
        icon: 'input',
        key: '',
        field: col.field, //
        fieldTitle: col.title || col.field, ///
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
      })
    }
  } //
  const fieldsConfig = [
    // {
    //   name: '预设字段',
    //   id: 'defaultField',
    //   children: [...allFields], //
    // },
    {
      name: '基础字段',
      id: 'field',
      children: [
        {
          type: 'input',
          label: '单行文本',
          icon: 'input',
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
          type: 'number',
          label: '数字',
          icon: 'numbers',
          key: '',
          id: '',
          options: {
            min: 0,
            max: null,
            step: 1,
            precision: 0,
            disabled: false,
            controls: true,
            controlsPosition: true,
            defaultValue: null,
            labelWidth: 100,
            isShowLabel: true,
            required: false,
            minlength: null,
            maxlength: null,
          },
        },
        {
          type: 'radio',
          label: '单选框',
          icon: 'radio',
          key: '',
          id: '',
          options: {
            dataKey: '',
            displayStyle: 'block',
            defaultValue: '',
            labelWidth: 100,
            isShowLabel: true,
            disabled: false,
            required: false,
          },
        },
        {
          type: 'checkbox',
          label: '复选框',
          icon: 'checkbox',
          key: '',
          id: '',
          options: {
            dataKey: '',
            displayStyle: 'block',
            defaultValue: [],
            labelWidth: 100,
            isShowLabel: true,
            required: false,
            disabled: false,
          },
        },
        {
          type: 'select',
          label: '下拉框',
          icon: 'dropdown0',
          key: '',
          id: '',
          options: {
            dataKey: '',
            filterable: true,
            multiple: false,
            defaultValue: '',
            placeholder: '',
            labelWidth: 100,
            isShowLabel: true,
            disabled: false,
            clearable: true,
            required: false,
          },
        },
        {
          type: 'time',
          label: '时间',
          icon: 'time',
          key: '',
          id: '',
          options: {
            clearable: true,
            format: 'HH:mm:ss',
            valueFormat: 'HH:mm:ss',
            defaultValue: null,
            placeholder: '',
            labelWidth: 100,
            isShowLabel: true,
            required: false,
            disabled: false,
          },
        },
        {
          type: 'date',
          label: '日期',
          icon: 'calendar',
          key: '',
          id: '',
          options: {
            isShowWordLimit: false,
            clearable: true,
            format: 'YYYY-MM-DD',
            defaultValue: null,
            startTime: null,
            endTime: null,
            placeholder: '',
            labelWidth: 100,
            isShowLabel: true,
            type: 'date',
            required: false,
            disabled: false,
          },
        },

        {
          type: 'cascader',
          label: '级联框',
          icon: 'cascader',
          key: '',
          id: '',
          options: {
            filterable: true,
            multiple: false,
            checkStrictly: false,
            defaultValue: '',
            placeholder: '',
            labelWidth: 100,
            isShowLabel: true,
            required: false,
            disabled: false,
            clearable: true,
          },
        },
        {
          type: 'uploadfile',
          label: '上传文件',
          icon: 'upload',
          key: '',
          id: '',
          options: {
            isShowLabel: true,
            labelWidth: 100,
            defaultValue: [],
            multiple: false,
            action: '',
            limit: 1,
            size: 5,
            accept: '.png,.jpg',
            disabled: false,
            required: false,
          },
        },
        // {
        //   type: 'signature',
        //   label: '签名',
        //   icon: 'signature',
        //   key: '',
        //   id: '',
        //   options: {
        //     required: false,
        //     isShowLabel: true,
        //     labelWidth: 100,
        //     defaultValue: '',
        //     penColor: 'rgb(0, 0, 0)',
        //     action: '',
        //     disabled: false,
        //   },
        // },
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
              id: '', //
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
                // {
                //   type: 'td',
                //   options: {
                //     colspan: 1,
                //     rowspan: 1,
                //     isMerged: false
                //   },
                //   list: [],
                //   style: {}
                // }
              ],
            },
            // {
            //   type: 'tr',
            //   columns: [
            //     {
            //       type: 'td',
            //       options: {
            //         colspan: 1,
            //         rowspan: 1,
            //         isMerged: false
            //       },
            //       list: [],
            //       style: {}
            //     },
            //     {
            //       type: 'td',
            //       options: {
            //         colspan: 1,
            //         rowspan: 1,
            //         isMerged: false
            //       },
            //       list: [],
            //       style: {}
            //     }
            //   ]
            // }
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
    // {
    //   name: '主表字段',
    //   isSub: true,
    //   id: 'defaultField',
    //   children: [...allFields], //
    // },
    {
      name: '其他',
      id: 'other',

      children: [
        {
          type: 'buttongroup', //
          label: '按钮组',
          icon: 'input',
          key: '',
          id: '',
          style: {
            width: '100%',
            minHeight: '50px',
          },
          options: {
            items: [],
            labelWidth: 100,
            isShowLabel: true,
            required: false,
            min: null,
            max: null,
          },
        },
      ],
    },
  ]
  return fieldsConfig
}
