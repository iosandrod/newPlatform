import { System } from '@/system'
import PageCom from '@ER/pageCom'
import { computed, defineComponent, inject, provide, ref } from 'vue'

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
    let l = _tableName.length
    let en = computed(() => {
      let map = null
      if (l == 2) {
        map = system.tableEditMap
      } else {
        map = system.tableMap
      }
      return map[tableName]
    })
    if (_tableName.length == 2) {
      let _tableName1 = _tableName[0]
      tableName = _tableName1 //
      system.createPageEditDesign(tableName).then((res) => {
        show.value = true //
      }) //
    } else {
      system.createPageDesign(tableName).then((res) => {
        show.value = true //
      })
    } //
    let _show = computed(() => {
      let map = null
      if (l == 2) {
        map = system.tableEditMap
      } else {
        map = system.tableMap
      }
      let obj = map[tableName]
      if (obj == null) {
        return false
      }
      return true
    })
    return () => {
      if (show.value == false) {
        return <div>页面加载当中</div>
      }
      if (_show.value == false) {
        return <div></div> //
      }
      return <PageCom isMainPage isDesign={false} formIns={en.value}></PageCom>
    }
  },
})
