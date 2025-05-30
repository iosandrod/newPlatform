import {
  defineComponent,
  inject,
  onMounted,
  onUnmounted,
  provide,
  ref,
  toRaw,
  vShow,
  watch,
  watchEffect,
  withDirectives,
} from 'vue'
import { ListTableConstructorOptions } from '@visactor/vtable'
import { ListTable } from '@visactor/vue-vtable'
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
import { Table } from './table'
import { VxeLoading } from 'vxe-pc-ui'

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
    tableName: {
      type: String,
    },
    showControllerButtons: {
      type: Boolean,
      default: false, //
    },
    ...tableV2Props,
    columns: {
      type: Array,
      // default: () => [],
    },
    buttons: {
      type: Array,
    },
    isFilterTable: {
      type: Boolean,
      default: false,
    }, //
    validateFn: {
      type: Function,
    }, //
    data: {
      //
      type: Array,
    }, //
    showHeaderButtons: {
      type: Boolean,
      default: false, //
    },
    showHeaderDefaultButtons: {
      type: Boolean,
      default: true, //
    },
    showCalculate: {
      type: Boolean,
      default: true,
    },
    curRow: {
      type: Object,
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
    },
    checkboxChange: {
      type: Function,
    },
    eventMap: {
      type: Object,
      default: () => {},
    },
    tableIns: {
      type: Object,
    },
    mainTableName: {
      type: String,
    },
    treeConfig: {
      //
      type: Object, //
    },
    enableDragRow: {
      type: Boolean,
      default: false,
    },
    enableDragColumn: {
      type: Boolean,
      default: false,
    },
    dragRowFn: {
      type: Function, //
    },
    dragRowAfterFn: {
      type: Function, //
    },
    dragColumnFn: {
      type: Function,
    },
    dragColumnAfterFn: {
      type: Function, //
    },
    showHeaderContext: {
      type: Boolean,
      default: true,
    },
    disableColumnResize: {
      type: Boolean,
      default: false,
    },
    onColumnResize: {
      type: Function,
    },
    onTableConfigChange: {
      type: Function,
    },
    onHeaderContextmenu: {
      type: Function,
    },
    onTableDesign: {
      type: Function,
    },
    onDesignColumn: {
      type: Function,
    }, //
    onBeforeEditCell: {
      type: Function,
    },
    onAfterEditCell: {
      type: Function,
    },
    onColumnHidden: {
      type: Function,
    },
    onColumnConfigChange: {
      type: Function,
    }, //
    onColumnsDesign: {
      type: Function,
    },
    expandAll: {
      type: Boolean,
      default: false,
    },
    contextItems: {
      type: Array,
    },
    onDbCurRowChange: {
      type: Function, //
    },
    onCurRowChange: {
      type: Function || String, //
    },
    keyColumn: {
      type: String,
    },
    keyCodeColumn: {
      type: String,
    },
    detailTableConfig: {
      type: Object,
    },
  },
  setup(props, { slots, attrs, emit, expose }) {
    let tableIns: Table = null as any
    if (props.tableIns) {
      tableIns = props.tableIns as any
    } else {
      tableIns = new Table(props) //
    }
    if (props.mainTableName != null) {
      //@ts-ignore
      tableIns.tableName = props.mainTableName
    }
    expose({ _instance: tableIns })
    provide('tableIns', tableIns)
    onMounted(() => {
      tableIns.onMounted() //
    })
    watch(
      () => props.columns,
      (newV) => {
        if (!Array.isArray(newV)) {
          newV = []
        }
        tableIns.setColumns(newV) //
      },
    )
    const registerRootDiv = (el) => {
      tableIns.registerRef('root', el) //注册实例//
    } //
    onMounted(() => {
      nextTick(() => {
        tableIns.render()
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
    })
    let pageDesign = inject('pageDesign', {}) //
    tableIns._getPageDesign = () => pageDesign as any
    onUnmounted(() => {
      //
      tableIns._getPageDesign = null
    })
    watchEffect(() => {
      if (tableIns.getShowCalColumns() == false) {
        //
        return //
      }
      tableIns.loadFooterColumn() //
    })
    watch(
      () => {
        return props.showRowSeriesNumber
      },
      (nv) => {
        tableIns.updateSeriesColumnShow(nv) //
      },
    )
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
      },
    ) //
    watch(
      () => {
        return tableIns.templateProps.footerColumns
      },
      (e) => {
        //
        tableIns.updateFooterColumns()
      },
    ) //
    watch(
      () => {
        let rowStart = tableIns.scrollConfig.rowStart
        let rowEnd = tableIns.scrollConfig.rowEnd
        return [rowStart, rowEnd]
      },
      ([rowStart, rowEnd], [oldRowStart, oldRowEnd]) => {
        //向上滚动
        let _start = rowStart - 200
        let _end = rowEnd + 200
        if (_start < 0) {
          _start = 0
        }
        let data = tableIns.templateProps.data
        if (_end > data.length) {
          _end = data.length
        }
        let _oldStart = oldRowStart - 200
        if (_oldStart < 0) {
          _oldStart = 0
        }
        let _oldEnd = oldRowEnd + 200
        if (_oldEnd > data.length) {
          _oldEnd = data.length
        }
        let records = tableIns.getInstance().records
        //向下滚动
        let contain = tableIns.currentIndexContain
        if (_start > _oldStart) {
          let _records = records.slice(_oldStart, _start)
          _records.forEach((item) => {
            let _index = item._index
            delete contain[_index] //
          })
        }
        //向上滚动
        if (_end < _oldEnd) {
          let _records = records.slice(_end, _oldEnd)
          _records.forEach((item) => {
            let _index = item._index
            delete contain[_index] //
          })
        } //
      },
    )
    // watch(
    //   () => {
    //     return tableIns.tableConfig
    //   },
    //   (e) => {
    //     tableIns.updateOptions(e)
    //   },
    //   {
    //     deep: true,
    //   },
    // )
    watch(
      () => {
        return [props.data, props.data?.length]
      },
      (newValue, oldValue) => {
        let [newData, newLen] = newValue as any //
        let [oldData, oldLen] = oldValue as any
        if (newValue != oldValue) {
          tableIns.setData(newData)
          let treeConfig = props.treeConfig
          let expand = treeConfig?.expand
          if (expand == 'all') {
            nextTick(() => {
              tableIns.expandAllTreeRow()
            })
          }
          if (expand == 'first') {
            tableIns.expandTargetRows(newValue) //
          }
        } else {
          //添加行的
          let addRows = newData.map((row) => {
            return !oldData.includes(row)
          })
          //@ts-ignore
          tableIns.addRows({ rows: addRows, isProps: true })
          let removeRows = oldData.map((row) => {
            return !newData.includes(row) //
          })
          tableIns.delRows(removeRows)
        }
        // if (!Array.isArray(e)) {
        //   e = [] //
        // }
        // tableIns.setData(e)
      },
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
      com = withDirectives(
        <div
          style={{ width: '100%', height: '100%', minHeight: '200px' }}
          ref={registerRootDiv}
        ></div>,
        [],
      ) //
      let menuCom = <TableMenuCom></TableMenuCom>
      // if (props.showHeaderContext === false) {
      //   menuCom = null //
      // }
      let btnCom = <TableButtonCom></TableButtonCom>
      if (tableIns.config.showHeaderButtons == false) {
        //
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
        [[vShow, tableIns.globalConfig.show]],
      )

      let calCom = withDirectives(
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            height: `${tableIns.getDefaultHeaderRowHeight()}px`, //
            // borderLeft: '1px solid RGBA(30, 40, 60,0)',
            // borderRight: '1px solid RGBA(30, 40, 60,0)',
            // border: '1px solid RGBA(30, 40, 60,1)',
            boxSizing: 'border-box',
            width: '100%',
          }}
          ref={registerFooterDiv}
        ></div>,
        [[vShow, tableIns.getShowCalColumns()]],
      )
      let calDiv = withDirectives(
        <div
          style={{
            height: `${tableIns.getDefaultHeaderRowHeight()}px`,
            // border: '1px solid RGBA(30, 40, 60,1)', //
          }}
        ></div>,
        [[vShow, tableIns.getShowCalColumns()]],
      )
      let tBodyCom = withDirectives(
        <div
          onClick={(e) => {
            let isCClick = tableIns.isContainerClick
            if (isCClick == true) {
              return
            }
            tableIns.outClick(e, true) //
          }}
          style={{
            flex: 1,
            width: '100%', //
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column', //
            border: '1px solid RGBA(30, 40, 60)',
            boxSizing: 'border-box',
          }} //
        >
          <div
            ref={registerOutDiv}
            style={{
              flex: 1,
              width: '100%',
              overflow: 'hidden', //
              boxSizing: 'border-box',
            }}
          >
            {com}
          </div>
          {calDiv}
          {calCom}
        </div>,
        [
          [
            ClickOutside,
            (e) => {
              tableIns.outClick(e) //
            },
          ],
        ],
      )
      let loadingCom = (
        <VxeLoading modelValue={tableIns.pageLoading}></VxeLoading>
      )
      let outCom = (
        <div
          style={{
            minHeight: '200px', //
            width: '100%',
            height: '100%',
            display: 'flex', //
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {loadingCom}
          {filterTCom}
          {menuCom}
          {btnCom}
          {globalSearchInput}
          {tBodyCom}
        </div>
      )
      return outCom //
    }
  },
})
