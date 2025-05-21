import { computed, defineComponent, inject } from 'vue'
import tableCom from '@/table/tableCom'
import { PageDesign } from '@ER/pageDesign'
import { PageDesignItem } from '@ER/pageItem'
import _ from 'lodash'
import { tableConfig } from '@/table/tableData'
import { Column } from '@/table/column'
import { system } from '@/system'
export default defineComponent({
  name: 'entityPc', //
  props: ['data', 'params', 'item'], //
  setup(props, attrs) {
    const item: PageDesignItem = props.item //
    let formIns = inject('formIns') //
    let columns = computed(() => {
      let cols = item.getTableColumns()
      let _cols = cols || []
      if (_cols.length == 0) {
        _cols = [] //
      }
      return _cols //
    }) //
    let fitem: PageDesignItem = props.item
    let _design: PageDesign = inject('mainPageDesign', {}) as any
    let tableName = item.getTableName()
    let mainTableName = _design.getTableName()
    let data = computed(() => {
      let _data = _design.getTableRefData(tableName)?.data || []
      return _data //
    })
    const pageDesign: PageDesign = inject('pageDesign')
    let tableType = item.getTableType()
    //只能有个一个pageDesign//
    const registerTable = (ins) => {
      pageDesign.registerRef(tableName, ins) //
      pageDesign.registerRef(`${tableType}__${tableName}`, ins) //
      fitem.registerRef('fieldCom', ins) ////
    } //
    let openDesignHeader = (config) => {
      console.log(config, 'testConfig') //
      if (_design == null) {
        return //
      }
      let column: Column = config.column
      if (column == null) {
        return //
      } //
      let event = config.event
      // console.log(config, 'testEvent') ///
      _design.openContextMenu(event, item) //
    } //
    return () => {
      //
      let com = (
        <div class="h-full w-full" style={{ minHeight: '200px' }}>
          <erTable
            onBeforeEditCell={(config) => {
              //
              let s = _design.onBeforeEditCell({
                ...config,
                tableName,
                item: item,
              })
              return s //
            }}
            showHeaderContext={false}
            tableName={tableName}
            mainTableName={mainTableName}
            showHeaderButtons={item.getShowHeaderButtons()}
            key={item.id}
            ref={registerTable}
            data={data.value}
            onHeaderContextmenu={openDesignHeader}
            columns={columns.value}
            onDesignColumn={(config) => {
              _design.updateTableColumn(config)
            }}
            disableColumnResize={false}
            onColumnResize={(config) => {
              item.onColumnResize(config)
            }}
            enableDragColumn={true} //
            onColumnHidden={(config) => {
              item.onColumnHidden(config)
            }}
            onColumnsDesign={(config) => {
              _design.onColumnsDesign(config)
            }}
          ></erTable>
        </div>
      )
      return com
    } //
  },
})
