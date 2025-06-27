import { computed, defineComponent, inject } from 'vue'
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
    const buttons = computed(() => {
      // debugger//
      let dbuttons = [
        {
          label: '新增',
          key: 'add', //
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
          },
        },

        {
          label: '更换ID',
          fn: async () => {
            // let data = tableIns.getData()
            // let d0 = data[0]
            // d0['id'] = d0['id'] + 1 //
            tableIns.updateCanvas() //
          },
        },
      ] //
      let config = tableIns.config
      let showHeaderDefaultButtons = config.showHeaderDefaultButtons
      if (showHeaderDefaultButtons == false) {
        dbuttons = [] //
      }
      let newButtons = tableIns.getHeaderButtons()
      let mergeButtons = [...newButtons, ...dbuttons] //
      let buttons = mergeButtons.filter((item, i) => {
        let key = item.key
        if (key != null) {
          let index = mergeButtons.findIndex((item1) => {
            return item1.key == key
          })
          if (index != i) {
            return false
          }
        }
        return true
      })
      return buttons //
    })
    return () => {
      return (
        <div>
          {
            <buttonGroupCom
              parent={tableIns}
              items={buttons.value}
            ></buttonGroupCom>
          }
        </div>
      )
    }
  },
})
