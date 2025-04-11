import { defineComponent, inject } from 'vue'
import { Table } from './table'
import { generatePersons } from './tableData'
import buttonGroupCom from '@/buttonGroup/buttonGroupCom'
import { nextTick } from 'vue' //

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
        label: '显示全局查询',
        fn: async () => {
          tableIns.showGlobalSearch(!tableIns.globalConfig.show) //
        },
      },
      {
        label: '改变前值', //
        fn: async () => {
          let data = tableIns.getData() //、、
          data[0].id = data[0].id + '2' ////
          data[1].id = data[1].id + '2' ////
          // nextTick(() => {
          //   data[0].email1 = data[0].email1 + '2' ////
          //   data[1].email1 = data[1].email1 + '2' ////
          // })
        },
      }, //
    ] //
    return () => {
      return <div>{<buttonGroupCom items={buttons}></buttonGroupCom>}</div>
    }
  },
})
