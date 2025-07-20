import { computed } from 'vue'
import { PageDesign } from './pageDesign'
import { Table } from '@/table/table'
import { Column } from '@/table/column'
import { FormItem } from './formitem'
import { getAllColTypes } from '@/table/colFConfig'
export * from './designNodeOptions' //

//编辑options

//编辑普通层的//
export const selectTypeMap = (_this: PageDesign) => {
  let formitemTypeArr = ['input', 'select']
  let createDSelect = (type) => {
    let rTableName = _this.getRealTableName() //
    let items = [
      {
        field: 'field',
        title: '绑定字段',
        type: 'select', //
        label: '绑定字段',
        options: {
          allowCreate: true, //
          columnSelect: true,
          tableName: rTableName,
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
        field: 'style',
        label: '样式',
        options: {
          items: [
            {
              field: 'width',
              label: '宽度',
              type: 'input', //
            },
            {
              field: 'height',
              label: '高度',
              type: 'input', //
            },
          ],
        },
        type: 'sform',
      },
      {
        field: 'type',
        label: '类型',
        type: 'select',
        options: {
          options: getAllColTypes(),
        }, //
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
              tableName: rTableName, //
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
    boolean: {
      itemSpan: 24,
      items: [...createDSelect('boolean')],
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
    grid: {
      itemSpan: 24,
      items: [...createDSelect('grid')],
      data: computed(() => {
        return _this.state.selected || {} //
      }),
    }, //
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
    baseinfo: {
      itemSpan: 24,
      items: [...createDSelect('baseinfo')], //
      data: computed(() => {
        return _this.state.selected || {} //
      }),
    },
  }
  return obj
}
//
