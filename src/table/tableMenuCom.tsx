import ContextmenuCom from '@/contextM/components/ContextmenuCom'
import MenuCom from '@/menu/menuCom'
import { defineComponent, inject } from 'vue'
import { Table } from './table'

export default defineComponent({
  //
  name: 'tableMenuCom',
  setup() {
    const tableIns: Table = inject('tableIns')
    let mainPage = inject('mainPageDesign', {}) //
    return () => {
      const items = tableIns.getContextItems()
      let com = (
        <ContextmenuCom
          parent={tableIns}
          ref={(e) => tableIns.registerRef('contextmenu', e)}
          items={items}
        ></ContextmenuCom>
      )
      return com
    }
  },
})
