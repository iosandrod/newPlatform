import FlowCom from '@/logic/flowCom'
import { System } from '@/system'
import { defineComponent, inject, onMounted, ref } from 'vue'

export default defineComponent({
  props: {},
  setup(props) {
    let sys: System = inject('systemIns')
    let tableData = ref([])
    onMounted(async () => {
      let allTables = await sys.getRealTables()
      tableData.value = allTables
    }) //
    return () => {
      let flow = <FlowCom tables={tableData.value} isERDiagram={true}></FlowCom>
      let com = <div class="h-full w-full">{flow}</div>
      return com
    } //
  },
})
