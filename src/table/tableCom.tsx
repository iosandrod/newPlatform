import { defineComponent, onMounted, onUnmounted, provide, ref, toRaw, vShow, watch, watchEffect, withDirectives } from 'vue'
import { ListTableConstructorOptions } from '@visactor/vtable'
import { ListTable } from '@visactor/vue-vtable'
import { Table } from './table'
import { tableV2Props, ClickOutside } from 'element-plus'
import buttonGroupCom from '@/buttonGroup/buttonGroupCom'
import { nextTick } from 'vue'
import { generatePersons } from './tableData'
import ContextmenuCom from '@/contextM/components/ContextmenuCom'
import TableButtonCom from './tableButtonCom'
import TableMenuCom from './tableMenuCom'
import { useResizeObserver } from '@vueuse/core'
import TableFitlerCom from './tableFilterCom'
import InputCom from '@/input/inputCom'
// new ListTable()
//核心表格组件
export default defineComponent({
  name: 'TableEditor',
  components: {
    buttonGroupCom,
    ContextmenuCom,
    TableFitlerCom,
  },
  props: {
    ...tableV2Props,
    showHeaderButton: {
      type: Boolean,
      default: true,
    },
    showCalculate: {
      type: Boolean,
      default: true, ////
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    showColumnFilterTable: {
      type: Boolean,
      default: true,
    },
    showGlobalSearch: {
      type: Boolean,
      default: false, //
    },
    showCheckBoxColumn: {
      type: Boolean,
      default: false, //
    },
    showRowSeriesNumber: {
      type: Boolean,
      default: true,
    },
    showCheckboxColumn: {
      type: Boolean,
      default: true,
    },
    tableState: {
      type: String,
      default: 'scan',
    },
    checkboxChange: {
      type: Function,
    },
  },
  setup(props, { slots, attrs, emit, expose }) {
    const tableIns = new Table(props)
    expose(tableIns) //
    provide('tableIns', tableIns)
    onMounted(() => {
      tableIns.onMounted() //
    })
    const registerRootDiv = (el) => {
      tableIns.registerRef('root', el) //注册实例//
    } //
    onMounted(() => {
      nextTick(() => {
        tableIns.render() //
      })
    }) //
    onUnmounted(() => {
      tableIns.onUnmounted()
    })
    watchEffect(() => {
      tableIns.loadColumns()
    })
    watchEffect(() => {
      let tableState = props.tableState //
      if (['scan', 'edit'].includes(tableState)) {
        tableIns.setTableState(tableState as any) ////
      }
    })
    watchEffect(() => {
      tableIns.loadData() //
    }) //
    watchEffect(() => {
      if (tableIns.getShowCalColumns() == false) {
        //
        return //
      }
      tableIns.loadFooterColumn() //
    })
    watchEffect(() => {
      let s = tableIns.updateIndexArr.size
      if (s == 0) {
        return
      }
      nextTick(() => {
        tableIns.updateRecords()
      })
    })
    watch(
      () => {
        //@ts-ignore
        return tableIns.templateProps.columns
      },
      (e) => {
        tableIns.updateColumns()
      }
    ) //
    watch(
      () => {
        return tableIns.templateProps.footerColumns
      },
      (e) => {
        //
        tableIns.updateFooterColumns()
      }
    )
    // watch(
    //   () => {
    //     let tableData = { ...tableIns.tableData }
    //     return tableData //
    //   },
    //   (e) => {
    //     tableIns.updateCanvas() //
    //   },
    // )
    watch(
      () => {
        return tableIns.tableConfig
      },
      (e) => {
        tableIns.updateOptions(e)
      },
      {
        deep: true,
      }
    )
    provide('tableIns', tableIns)
    const inputProps = tableIns.getGlobalSearchProps()
    const registerOutDiv = (el) => {
      tableIns.registerRef('outDiv', el) //
    }
    const registerFooterDiv = (el) => {
      tableIns.registerRef('footerDiv', el) //
    }
    return () => {
      let com = null
      com = withDirectives(<div style={{ width: '100%', height: '100%' }} ref={registerRootDiv}></div>, []) //
      const menuCom = <TableMenuCom></TableMenuCom>
      let btnCom = <TableButtonCom></TableButtonCom>
      if (props.showHeaderButton == false) {
        btnCom = null
      }
      let filterTCom = null
      if (props.showColumnFilterTable) {
        filterTCom = <TableFitlerCom tableIns={tableIns}></TableFitlerCom>
      }
      // const inputProps = tableIns.getGlobalSearchProps()
      const globalSearchInput = withDirectives(
        <div
          style={{
            width: '100%',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <InputCom
            modelValue={tableIns.globalConfig.value}
            {...inputProps}
            v-slots={{
              buttons: () => {
                let com = (
                  <buttonGroupCom
                    buttonWidth={40}
                    items={[
                      {
                        label: '<<',
                        fn: () => {
                          tableIns.jumpToSearchNext(true) //
                        }, //
                      },
                      {
                        label: '>>',
                        fn: () => {
                          tableIns.jumpToSearchNext() //
                        },
                      },
                      {
                        label: 'X',
                        fn: () => {
                          tableIns.showGlobalSearch(false) //
                        },
                      },
                    ]}
                  ></buttonGroupCom>
                )
                return com //
              },
            }}
          ></InputCom>
        </div>,
        [[vShow, tableIns.globalConfig.show]]
      )
      let calCom = withDirectives(
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            height: '50px',
            boxSizing: 'border-box',
            width: '100%',
          }}
          ref={registerFooterDiv}
        ></div>,
        [[vShow, tableIns.getShowCalColumns()]]
      )
      let calDiv = withDirectives(
        <div
          style={{
            height: '50px',
          }}
        ></div>,
        [[vShow, tableIns.getShowCalColumns()]]
      )
      let outCom = (
        <div
          style={{
            width: '100%',
            height: '100%',
            // minHeight: '200px', //
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {filterTCom}
          {menuCom}
          {btnCom}
          <div
            style={{
              flex: 1,
              width: '100%', //
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column', //
            }} //
          >
            {globalSearchInput}
            <div
              ref={registerOutDiv}
              style={{
                flex: 1,
                width: '100%',
                overflow: 'hidden', //
                borderLeft: '1px solid RGB(225, 228, 232)',
                borderRight: '1px solid RGB(225, 228, 232)',
                borderTop: '1px solid RGB(225, 228, 232)',
                boxSizing: 'border-box',
              }}
            >
              {com}
            </div>
            {calDiv}
            {calCom}
          </div>
        </div>
      )
      return outCom //
    }
  },
})
