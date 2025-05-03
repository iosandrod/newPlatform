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
    let _tableName = tableName.split('---')
    let en = null
    if (_tableName.length == 2) {
      let _tableName1 = _tableName[0]
      tableName = _tableName1 //
      system.createPageEditDesign(tableName).then((res) => {
        en = res
        show.value = true //
      })
    } else {
      // console.log(tableName, 'testTableName') //
      system.createPageDesign(tableName).then((res) => {
        en = res
        show.value = true //
      })
    }
    return () => {
      if (show.value == false) {
        return <div>页面加载当中</div>
      }
      return <PageCom isDesign={false} formIns={en}></PageCom>
    }
  },
})
