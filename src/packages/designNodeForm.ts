import { computed } from 'vue'
import { PageDesign } from './pageDesign'

export const formitemTypeMap = (_this: PageDesign) => {
  let obj = {
    string: {},
    entity: {
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
          field: 'title',
          label: '标题',
          type: 'input', //
        },
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
    buttongroup: {
      itemSpan: 24,
      items: [
        {
          title: '按钮',
          field: 'items',
          label: '按钮',
          type: 'stable', ////
          options: {
            tableConfig: {
              tableState: 'edit',
              columns: [
                {
                  field: 'label',
                  title: '标题', ////
                  type: 'string',
                  editType: 'string',
                },
              ],
            },
          },
        },
      ],
      data: computed(() => {
        return _this.state.selected?.options
      }),
    },
  }
  return obj //
}
