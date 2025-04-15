import { defineComponent, inject } from 'vue'
import tableCom from '@/table/tableCom'
import { PageDesign } from '@ER/pageDesign'
import { PageDesignItem } from '@ER/pageItem'
import _ from 'lodash'
import { tableConfig } from '@/table/tableData'
export default defineComponent({
  name: 'entityPc', //
  props: ['data', 'params'], //
  setup(props, attrs) {
    const formIns: PageDesign = inject('formIns') //
    const formitem: PageDesignItem = props.params.formitem
    const config = formitem.config //
    const _tableConfig = _.cloneDeep(tableConfig)
    _
    const pageDesign: PageDesign = inject('pageDesign')
    
    const registerTable = (ins) => {
      pageDesign.registerRef('table', ins)
    } //
    return () => {
      let com = <erTable ref={registerTable} {..._tableConfig}></erTable>
      return com
    } //
  },
})
