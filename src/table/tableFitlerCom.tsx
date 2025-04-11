import { computed, defineComponent, Teleport } from 'vue'
import TableCom from './tableCom'
import dropdownCom from '@/menu/dropdownCom'
import { Table } from './table'
import { drop } from 'lodash'

export default defineComponent({
  props: {
    tableIns: {},
  },
  components: {
    dropdownCom,
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
    let _hiddenBefore = async () => {
      //
      return new Promise((resolve) => {
        setTimeout(() => {
          if (tableIns.permission.canCloseColumnFilter) {
            resolve(true)
          }
          resolve(false) //
        }, 200)
      })
    }
    return () => {
      let dragCom = //
        (
          <dropdownCom
            hiddenBefore={_hiddenBefore}
            distroyOnClose={false} //
            ref={registerRef}
            v-slots={{
              default: () => {
                let com = <div></div>
                return com
              },
              dropdown: () => {
                let com = (
                  <div style={{ width: '200px', height: '400px' }}>
                    <erTable showHeaderButton={false} columns={[]} data={[]} showColumnFilterTable={false}></erTable>
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
