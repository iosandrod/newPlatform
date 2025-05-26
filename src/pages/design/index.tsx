import { System } from '@/system'
import PageCom from '@ER/pageCom'
import { PageDesign } from '@ER/pageDesign'
import { computed, defineComponent, inject, provide, ref } from 'vue'
import { VxePager } from 'vxe-pc-ui'
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
    let isDefaultPage = true
    if (tableName == null) {
      let currentTable = router.currentRoute
      let p = currentTable.path //
      let pArr = p.split('/')
      let _tableName = pArr.pop()
      if (_tableName === '') {
        _tableName = pArr.pop() //
      }
      tableName = _tableName
    } //

    let show = ref(false)
    let _tableName = tableName.split('---')
    let l = _tableName.length
    let en: { value: PageDesign } = computed(() => {
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
      let tableName1 = _tableName1 //
      system.createPageEditDesign(tableName1).then((res) => {
        show.value = true //
      }) //
    } else {
      system.createPageDesign(tableName).then((res) => {
        show.value = true //
      })
    } //
    let _show = computed(() => {
      let map = null
      let _map = { ...system.tableMap, ...system.tableEditMap }
      map = _map //
      //
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
      let _com = <PageCom isMainPage isDesign={false} formIns={en.value}></PageCom>
      //分页
      let pObj = en.value.getPaginateProps()
      // console.log(pObj, 'testPObj') //
      let pagin = (
        <div class="h-40">
          <VxePager {...pObj}></VxePager>
        </div>
      ) //
      return (
        <div class="h-full w-full flex flex-col">
          {_com}
          {pagin}
        </div>
      )
    }
  },
})
