import { defineComponent, inject } from 'vue'
import { Table } from './table'
import { generatePersons } from './tableData'
import buttonGroupCom from '@/buttonGroup/buttonGroupCom'
import { nextTick } from 'vue' //
import { createGroup, createText } from '@visactor/vtable/es/vrender'

export default defineComponent({
  name: 'tableButtonCom',
  components: {
    buttonGroupCom,
  },
  setup() {
    const tableIns: Table = inject('tableIns')
    const buttons = [
      {
        label: '新增',
        key: 'add',
        fn: async () => {
          //添加行
          tableIns.addRows(1) //
        },
      },
      {
        label: '删除', //
        key: 'del',
        fn: async () => {
          //添加行
          // console.log('执行到这里')//
          tableIns.delCurRow()
        },
      },
      {
        label: '复制',
        key: 'copy', //
        fn: async () => {
          //添加行
          let arr = [
            {
              // text: '合并单元格',
              range: {
                start: {
                  col: 3,
                  row: 8,
                },
                end: {
                  col: 7,
                  row: 10,
                },
              },
              style: {
                bgColor: '#ccc',
              },
              customLayout: (args) => {
                const { table, row, col, rect, value } = args
                const { height, width } = rect ?? table.getCellRect(col, row)
                let c = createGroup({
                  height,
                  width,
                  display: 'flex',
                  alignItems: 'center',
                })
                let t = createText({
                  text: '测试',
                  fontSize: 16,
                  fill: 'black',
                  fontWeight: 'bold',
                  boundsPadding: [0, 0, 0, 0],
                  lineDashOffset: 0,
                })
                c.add(t) //
                return {
                  rootContainer: c, //
                }
              },
            },
          ]
          let ins = tableIns.getInstance()
          ins.options.customMergeCell = arr //
        },
      },
      {
        label: '导出',
        fn: async () => {
          //添加行
          tableIns.updateCanvas() //
        },
      },
    ] //
    return () => {
      return <div>{<buttonGroupCom items={buttons}></buttonGroupCom>}</div>
    }
  },
})
