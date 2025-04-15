import { PageDesign } from './pageDesign'
import { PageDesignItem } from './pageItem'

const createId = (type, design) => {
  let id = design.uuid()
  let key = `${type}_${id}`
  return { id, key }
}
const createTable = (config) => {}
export const createDefaultTemplate = (design: PageDesign, config) => {
  let mainTable = config.mainTable //
  let obj = {
    layout: {
      pc: [
        {
          type: 'inline',
          columns: ['2Hz_88s0BVOVr9HoOoI3a'],
          style: {},
          ...createId('inline', design),
        },
        {
          type: 'inline',
          ...createId('inline', design), //
          columns: [
            {
              type: 'tabs',
              label: '标签页',
              icon: 'label',
              ...createId('tabs', design),
              columns: [
                {
                  ...createId('tabsCol', design), //
                  type: 'tabsCol',
                  label: 'Tab 1',
                  list: [
                    {
                      type: 'inline',
                      columns: ['qOOKKQf7tIQHpmEsDVZQm'],
                      style: {},
                      ...createId('inline', design),
                    },
                  ],
                  style: {},
                  options: {},
                },
              ],
              options: {
                type: '',
                tabPosition: 'top',
                align: 'top',
                hidden: false,
                defaultValue: '8--mKpheTje2pZiy9wxlA',
              },
              style: {
                width: '100%',
                height: '376px',
              },
              key: 'tas_ClTBS39cRJcNKeqYDLi84',
            },
          ],
          style: {},
        },
      ],
      mobile: [
        {
          type: 'inline',
          columns: ['2Hz_88s0BVOVr9HoOoI3a'],
        },
        {
          type: 'inline',
          columns: ['qOOKKQf7tIQHpmEsDVZQm'],
        },
        {
          type: 'inline',
          columns: ['ajK_arECmlSyIvbDObxC6'],
        },
        {
          type: 'inline',
          columns: ['vxz7_UfuMb3f3uIqy36vg'],
        },
      ],
    },
    data: {},
    config: {
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
    },
    fields: [
      {
        type: 'entity',
        label: '',
        icon: 'input',
        key: 'entity_2Hz_88s0BVOVr9HoOoI3a',
        id: '2Hz_88s0BVOVr9HoOoI3a',
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
          width: {
            pc: '100%',
            mobile: '100%',
          },
          height: '320px',
        },
      },
      {
        type: 'entity',
        label: '',
        icon: 'input',
        key: 'entity_qOOKKQf7tIQHpmEsDVZQm',
        id: 'qOOKKQf7tIQHpmEsDVZQm',
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
          width: {
            pc: '100%',
            mobile: '100%',
          },
        },
      },
      {
        type: 'entity',
        label: '',
        icon: 'input',
        key: 'entity_ajK_arECmlSyIvbDObxC6',
        id: 'ajK_arECmlSyIvbDObxC6',
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
          width: {
            pc: '100%',
            mobile: '100%',
          },
        },
      },
      {
        type: 'entity',
        label: '',
        icon: 'input',
        key: 'entity_vxz7_UfuMb3f3uIqy36vg',
        id: 'vxz7_UfuMb3f3uIqy36vg',
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
          width: {
            pc: '100%',
            mobile: '100%',
          },
        },
      },
    ],
    logic: {},
  }
  return obj
}
