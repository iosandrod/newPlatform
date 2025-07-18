import { computed, defineComponent, inject, onMounted, ref } from 'vue'
import tableCom from '@/table/tableCom'
import { PageDesign } from '@ER/pageDesign'
import { PageDesignItem } from '@ER/pageItem'
import _ from 'lodash'
import { tableConfig } from '@/table/tableData'
import { Column } from '@/table/column'
import { system } from '@/system'
import design from '@/pages/erp/design'
import { stringToFunction } from '@ER/utils'
import { Table } from '@/table/table'
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
    let _design: PageDesign = inject('mainPageDesign', null) as any
    let tableName = item.getTableName()
    let mainTableName = null
    if (_design) {
      mainTableName = _design?.getTableName()
    }
    let data = computed(() => {
      if (_design == null) {
        return [] //
      }
      let _data = _design?.getTableRefData(tableName)?.data || []
      return _data //
    })
    const pageDesign: PageDesign = inject('pageDesign')
    let tableType = item?.getTableType()
    onMounted(() => {})
    //只能有个一个pageDesign//
    const registerTable = (ins) => {
      pageDesign.registerRef(tableName, ins) //
      pageDesign.registerRef(`${tableType}__${tableName}`, ins) //
      fitem.registerRef('fieldCom', ins) ////
      if (ins != null) {
        //
        if (tableType == 'relate') {
          let treeConfig = item.config?.options?.treeConfig
          let autoColumnSize = treeConfig?.autoColumnSize
          if (Boolean(autoColumnSize)) {
            let fieldOutCom: HTMLDivElement = item.getRef('fieldOutCom') //
            if (fieldOutCom) {
              let bound = fieldOutCom.getBoundingClientRect()
              let width = bound.width
              let columns = item
                .getRef('fieldCom')
                ?.getShowColumns()
                ?.map((col) => {
                  return col?.config || col
                }) //
              let col0 = columns[0]
              // console.log(col0, 'testCol0') ////
              if (col0) {
                let field = col0.field ///
                let tCol = item
                  .getTableColumns()
                  .find((col) => col.field == field)
                if (tCol) {
                  tCol.width = width
                  col0.width = width //
                } //
                let _com: Table = item.getRef('fieldCom')
                _com.loadColumns() //
              }
            }
          }
        }
      }
    } //
    let openDesignHeader = (config) => {
      // console.log(config, 'testConfig') //
      if (_design == null) {
        return //
      }
      let column: Column = config.column
      if (column == null) {
        return //
      } //
      let event = config.event //
      _design.openContextMenu(event, item)
    } //
    let dragConfig = item.config?.options?.dragConfig //
    let enableDragRow = dragConfig?.enableDragRow
    let enableDragColumn = dragConfig?.enableDragCol
    enableDragRow = Boolean(enableDragRow)
    enableDragColumn = Boolean(enableDragColumn)
    let dragRowFn = dragConfig?.dragRowFn
    if (typeof dragRowFn == 'string') {
      dragRowFn = stringToFunction(dragRowFn)
    }
    // console.log(dragConfig, 'testDConfig') //
    let dragRowAfterFn = dragConfig?.dragRowAfterFn
    if (typeof dragRowAfterFn == 'string') {
      dragRowAfterFn = stringToFunction(dragRowAfterFn)
    }
    let tableState = computed(() => {
      let _tableState = _design.tableState
      if (['edit', 'add'].includes(_tableState)) {
        return 'edit'
      }
      return 'scan' //
    })
    let _show = ref(false)
    let height = ref(0)
    onMounted(() => {
      let fOutCom = item.getRef('fieldOutCom')
      let bound = fOutCom.getBoundingClientRect()
      // console.log(bound, 'testBound') //
      height.value = bound.height
      _show.value = true
    }) //
    return () => {
      let tCom = (
        <erXeTable
          tableState={tableState.value} //
          disableColumnResize={item.getDisabledColumnResize()} //
          onDbCurRowChange={(config) => {
            //
            let tableName = item.getTableName()
            let dTableName = _design.getRealTableName()
            if (tableName == dTableName) {
              let row = config.row
              _design.editTableRows({
                row,
              }) //
            }
          }}
          height={height.value} //
          onCellCommand={(config) => {
            // debugger //
            let _config1 = item?.config?.options || {}
            let tableName = item.getTableName()
            let _config = {
              ...config,
              tableConfig: _config1,
              tableName, //
            }
            pageDesign.onTableCellCommand(_config)
          }}
          onTableConfigChange={(config) => {
            item.onTableConfigChange(config)
          }}
          enableDragRow={enableDragRow}
          dragRowFn={dragRowFn} //
          dragRowAfterFn={dragRowAfterFn} //
          calHeight={true}
          enableDragColumn={enableDragColumn} //
          onBeforeEditCell={(config) => {
            //
            let s = _design.onBeforeEditCell({
              ...config,
              tableName,
              item: item,
            }) //
            return s //
          }}
          onTableDesign={(config) => {
            //
            item.onTableDesign({
              //
              ...config,
              tableName,
              item: item,
            }) //
          }}
          curRow={item.getPageCurRow()}
          contextItems={item.getContextItems()}
          treeConfig={item.getTreeConfig()}
          onCurRowChange={(config) => {
            //
            item.onCurRowChange(config)
          }}
          showHeaderContext={false}
          tableName={tableName}
          mainTableName={mainTableName}
          // showCheckBoxColumn={item.getShowCheckboxColumn()}
          // showRowNumberColumn={item.getShowRowSeriesNumber()} //
          showCheckboxColumn={item.getShowCheckboxColumn()}
          showRowSeriesNumber={item.getShowRowSeriesNumber()} //
          showHeaderButtons={item.getShowHeaderButtons()}
          key={item.id}
          ref={registerTable}
          keyCodeColumn={item.getOptions()?.keyCodeColumn}
          keyColumn={item.getOptions()?.keyColumn}
          detailTableConfig={item.getOptions().detailTableConfig}
          data={data.value}
          onHeaderContextmenu={openDesignHeader}
          columns={columns.value}
          onDesignColumn={(config, col, refresh) => {
            let itemName = item.getTableName()
            let mainTableName = _design.getRealTableName()
            if (itemName == mainTableName) {
              _design.updateTableColumn(config, refresh) //
            } else {
              Object.entries(config).forEach(([key, value]) => {
                col[key] = value //
              }) //
              _design.updateTableDesign() //
            }
          }}
          onColumnResize={(config) => {
            item.onColumnResize(config)
          }}
          onColumnHidden={(config) => {
            item.onColumnHidden(config)
          }}
          onColumnsDesign={(config) => {
            // debugger //
            let tableName = item.getTableName()
            let dTableName = _design.getRealTableName()
            if (tableName != dTableName) {
              let allCols = config.allCols //
              item.config.options.columns = allCols
            }
            if (_design) {
              _design.onColumnsDesign(config)
            }
          }}
          onColumnConfigChange={(config) => {
            item.onColumnConfigChange(config)
          }} //
          rowHeight={item.getTableRowHeight()} //
        ></erXeTable>
      )
      if (_show.value == false) {
        tCom = null
      }
      let com = (
        <div
          class="  w-full box-border "
          style={{
            minHeight: '200px',
            // padding: '4px'
          }}
          ref={(ins) => {
            item.registerRef('fieldOutCom', ins)
          }}
        >
          {tCom}
        </div>
      )
      return com
    }
  },
})
