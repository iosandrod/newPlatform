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
      tableIns.registerRef('tableIns', el) //注册实例//
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
          nextTick(() => {
            tableIns.loadData() //
          })
        },
      },
    ]
    watchEffect(() => {
      tableIns.loadColumns()
    })
    watchEffect(() => {
      tableIns.loadData() //
      console.log('加载了数据')
    })
    return () => {
      let com = null
      com = <ListTable options={tableIns.getOptions()} ref={registerRootDiv}></ListTable>
      // com = <div style={{ width: '100%', height: '100%' }} ref={registerRootDiv}></div>
      let outCom = (
        <div style={{ width: '100%', height: '500px' }} class="h-full w-full">
          <buttonGroupCom items={buttons}></buttonGroupCom>
          {com}
        </div>
      )
      return outCom //
    }
  },
})
