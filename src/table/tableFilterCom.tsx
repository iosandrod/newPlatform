import { computed, defineComponent, resolveComponent, Teleport } from 'vue'
import TableCom from './tableCom'
import dropdownCom from '@/menu/dropdownCom'
import { Table } from './table'
import { drop } from 'lodash'
import ButtonGroupCom from '@/buttonGroup/buttonGroupCom'
import buttonCom from '@/buttonGroup/buttonCom'

export default defineComponent({
  props: {
    tableIns: {},
    isVxeTable: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    dropdownCom,
    buttonCom,
  },
  setup(props, { slots }) {
    let tableIns: Table = props.tableIns as any
    const registerRef = (ins) => {
      tableIns.registerRef('columnDropdown', ins)
    }
    const dStyle = computed(() => {
      let columnFilterConfig = tableIns.columnFilterConfig
      let x = columnFilterConfig.x
      let y = columnFilterConfig.y
      let obj = {
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        width: '0px',
        height: '0px',
      }
      return obj
    })
    let _dStyle = computed(() => {
      let columnFilterConfig = tableIns.columnFilterConfig
      let width = columnFilterConfig.width
      let obj = {
        width: `${width}px`,
        height: '400px',
        minWidth: '300px',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #ddd',
        overflow: 'hidden',
      }
      return obj
    })
    let _hiddenBefore = async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (tableIns.permission.canCloseColumnFilter) {
            resolve(true)
          }
          resolve(false) //
        }, 100)
      })
    }
    const registerTable = (ins) => {
      tableIns.registerRef('columnFilterTable', ins) //
    }
    return () => {
      let dragCom = ( //
        <dropdownCom
          hiddenBefore={_hiddenBefore}
          destroyOnClose={false} //
          ref={registerRef}
          v-slots={{
            default: () => {
              let com = <div></div>
              return com
            },
            dropdown: () => {
              let comp = resolveComponent('erTable')
              if (props.isVxeTable == true) {
                comp = resolveComponent('erXeTable')
              }
              let com = (
                <div style={_dStyle.value}>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <comp
                      tableState="scan" //
                      isFilterTable={true} //
                      showCheckAll={false}
                      ref={registerTable}
                      showHeaderButton={false}
                      showCalculate={false} //
                      showGlobalSearch={true}
                      showColumnFilterTable={false}
                      showRowSeriesNumber={false} //
                      checkboxChange={(config) => {
                        tableIns.updateFilterConfig(config) ////
                        let _table = config.table
                        setTimeout(() => {
                          console.log(_table, 'testTable') //
                        }, 100)
                      }} //
                    ></comp>
                  </div> 
                  <div class="flex justify-between">
                    <buttonCom
                      fn={() => {
                        tableIns.resetFilterColumn(true)
                        let _table: Table = tableIns.getRef('columnFilterTable')
                        _table.updateCheckboxAll(false) //
                      }}
                      label={'重置所有'}
                    ></buttonCom>
                    <buttonCom
                      fn={() => {
                        tableIns.resetFilterColumn(false) //
                        let _table = tableIns.getRef('columnFilterTable') //
                        _table.updateCheckboxAll(false) //
                      }}
                      label={'重置当前'}
                    ></buttonCom>
                  </div>
                </div>
              )
              return com
            },
          }}
        ></dropdownCom>
      )
      return (
        <Teleport to="body">
          <div style={dStyle.value}>{dragCom}</div>
        </Teleport>
      )
      // <div style={{}}>
      //   <TableCom showColumnFilterTable={false}></TableCom>
      // </div>
    }
  },
})
