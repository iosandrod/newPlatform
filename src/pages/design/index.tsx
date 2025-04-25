import { System } from '@/system'
import PageCom from '@ER/pageCom'
import { computed, defineComponent, inject, ref } from 'vue'

export default defineComponent({
  name: 'Design',
  props: {
    tableName: {
      type: String,
    },
  },
  setup(props) {
    const system: System = inject('systemIns')
    const router = system.getRouter()
    let tableName = props.tableName //
    if (tableName == null) {
      let currentTable = router.currentRoute
      let p = currentTable.path
      let _tableName = p.split('/').pop()
      tableName = _tableName
    }
    let show = ref(false)
    let en = null
    system.createPageDesign(tableName).then((res) => {
      en = res
      show.value = true //
    })
    return () => {
      if (show.value == false) {
        return null
      }
      return <PageCom isDesign={false} formIns={en}></PageCom>
    }
  },
})
