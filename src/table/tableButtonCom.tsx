import { defineComponent, inject } from 'vue'
import { Table } from './table'
import { generatePersons } from './tableData'
import buttonGroupCom from '@/buttonGroup/buttonGroupCom'

export default defineComponent({
  name: 'tableButtonCom',
  components: {
    buttonGroupCom,
  },
  setup() {
    const tableIns: Table = inject('tableIns')
    const buttons = [
      {
        label: '改变依赖项',
        fn: async () => {
          //添加列
          let t = tableIns.clickOpt
          if (t == 1) {
            tableIns.clickOpt = 0
            return
          }
          tableIns.clickOpt = 1 //
        },
      },
      {
        label: '添加行',
        fn: async () => {
          //添加行
          // console.log('执行到这里')//
          tableIns.addRows({
            //
            rows: generatePersons(1000), //
          })
        },
      },
      {
        label: '删除操作', //
        fn: async () => {
          //添加行
          // console.log('执行到这里')//
          tableIns.delCurRow()
        },
      },
      {
        label: '改变前值', //
        fn: async () => {
          let data = tableIns.getData() //
          data[0].email1 = data[0].email1 + '2' ////
          data[1].email1 = data[1].email1 + '2' ////
        },
      }, //
    ] //
    return () => {
      return <div>{<buttonGroupCom items={buttons}></buttonGroupCom>}</div>
    }
  },
})
