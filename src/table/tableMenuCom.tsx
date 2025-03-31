import ContextmenuCom from '@/contextM/components/ContextmenuCom'
import MenuCom from '@/menu/menuCom'
import { defineComponent, inject } from 'vue'
import { Table } from './table'

export default defineComponent({
  //
  name: 'tableMenuCom',
  setup() {
    const tableIns: Table = inject('tableIns')
    const items = [
      {
        label: '复制', //
        fn: async () => {
          tableIns.copyCurrentCell() //
        },
      },
    ]
    return () => {
      let com = <ContextmenuCom ref={(e) => tableIns.registerRef('contextmenu', e)} items={items}></ContextmenuCom>
      return com
    }
  },
})
