import { defineComponent, onMounted, provide, watchEffect } from 'vue'
import { ListTableConstructorOptions } from '@visactor/vtable'
import { ListTable } from '@visactor/vue-vtable'
import { Table } from './table'
import { tableV2Props } from 'element-plus'
import buttonGroupCom from '@/buttonGroup/buttonGroupCom'
import { nextTick } from 'vue'
import { generatePersons } from './tableData'
// new ListTable()
//核心表格组件
export default defineComponent({
  name: 'TableEditor',
  components: {
    buttonGroupCom,
  },
  props: {
    ...tableV2Props,
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
  },
  setup(props, { slots, attrs, emit }) {
    const tableIns = new Table(props)
    provide('tableIns', tableIns)
    onMounted(() => {
      tableIns.onMounted() //
    })
    const registerRootDiv = (el) => {
      // tableIns.registerRef('root', el) //注册实例//
      tableIns.registerRef('root', el) //注册实例//
    } //
    onMounted(() => {
      tableIns.render() //
    }) //
    const buttons = [
      {
        label: '按钮1',
        fn: async () => {
          //添加行
          // console.log('执行到这里')//
          tableIns.addRows({
            rows: generatePersons(100),
          })
        },
      },
      {
        label: '按钮2',
        fn: async () => {
          //添加行
          let data = tableIns.getData()
          data[0].email1 = data[0].email1 + '2' ////
          data[1].email1 = data[1].email1 + '2' //////
        },
        children: [
          {
            label: '按钮2-1', //
          },
        ],
      },
    ]
    watchEffect(() => {
      tableIns.loadColumns()
    })
    watchEffect(() => {
      tableIns.loadData() //
    })
    return () => {
      let com = null
      // com = <ListTable options={tableIns.getOptions()} ref={registerRootDiv}></ListTable>
      com = (
        <div
          style={{ width: '100%', height: '100%' }}
          ref={registerRootDiv}
        ></div>
      )
      let outCom = (
        <div style={{ transform: '', width: '100%', height: '100%' }}>
          <buttonGroupCom items={buttons}></buttonGroupCom>
          <div
            style={{
              transform: 'translate(0,200px)',
              width: '100%',
              height: '100%',
            }}
          >
            {com}
          </div>
        </div>
      )
      return outCom //
    }
  },
})
