import {
  computed,
  defineComponent,
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  provide,
  reactive,
  vShow,
  watch,
  watchEffect,
  withDirectives,
} from 'vue'
import { VxeTableProps, VxeTablePropTypes } from 'vxe-table'
import tProps from 'vxe-table/es/table/src/props'
import { XeTable } from './xetable'
import { useKeyboard } from '@ER/utils'
import TableMenuCom from './tableMenuCom'
import TableButtonCom from './tableButtonCom'
import InputCom from '@/input/inputCom'
import { ClickOutside } from 'element-plus'
import { VxeLoading, VxeTagPropTypes } from 'vxe-pc-ui'
import XeTableSelectCom from './xeTableSelectCom'
import { VxeGrid as myVxeGrid } from '@/vxegrid'
import ContextmenuCom from '@/contextM/components/ContextmenuCom'
import buttonGroupCom from '@/buttonGroup/buttonGroupCom'
import tableMenuCom from './tableMenuCom'
import TableFilterCom from './tableFilterCom'
import { XeColumn } from './xecolumn'
import { overflow } from 'html2canvas/dist/types/css/property-descriptors/overflow'
export default defineComponent({
  name: 'XeTableCom',
  components: {
    myVxeGrid,
    ContextmenuCom,
    buttonGroupCom,
    tableMenuCom, //
    TableButtonCom, //
  },
  props: {
    ...tProps, //
    tableName: {
      type: String,
    },
    onCellCommand: {
      type: Function,
    },
    showControllerButtons: {
      type: Boolean,
      default: false, //
    },
    controllerButtons: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      // default: () => [],
    },
    buttons: {
      type: Array,
    },
    hiddenSelect: {
      type: Boolean,
      default: false, //
      // default: true, //
    },
    isGantt: {
      type: Boolean,
      default: false,
    }, //
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
     refreshDataBefore: {
      type: Function,
    },
    refreshDataAfter: {
      type: Function,
    }, 
    showColumnFilterTable: {
      type: Boolean,
      default: true,
    },
    showGlobalSearch: {
      type: Boolean,
      default: false, //
    }, //
    showRowSeriesNumber: {
      type: Boolean,
      default: true,
    },
    showCheckboxColumn: {
      type: Boolean,
      default: true,
    },
    onDeleteRow: {
      type: Function, //
    },
    tableState: {
      type: String,
    },
    checkboxChange: {
      type: Function,
    },
    onCheckboxChange: {
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
    onRowDragEnd: {
      type: Function, //
    },
    dragRowFn: {
      type: Function, //
    },
    dragRowAfterFn: {
      type: Function, //
    },
    enableDragColumn: {
      type: Boolean,
      default: false,
    },
    dragColumnFn: {
      type: Function,
    },
    dragColumnAfterFn: {
      type: Function, //
    },
    showCheckAll: {
      type: Boolean,
      default: true,
    },
    headerHeight: {
      type: Number, //
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
    onColumnDragClick:{
      type: Function,
    },//
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
    rowHeight: {
      type: Number,
      default: 30, //
    },
    calHeight: {
      type: Boolean,
      default: false,
    },
    showFooterTable: {
      type: Boolean,
      default: true,
    },
  },
  setup(_props, { slots, attrs, emit, expose }) {
    let props: any = _props
    // console.log(JSON.parse(JSON.stringify(props)), 'props123') //
    let tableIns: XeTable = null as any
    if (props.tableIns) {
      tableIns = props.tableIns as any
    } else {
      tableIns = new XeTable(props) //
    } //
    if (props.mainTableName != null) {
      //@ts-ignore
      tableIns.tableName = props.mainTableName
    }
    if (props.showGlobalSearch) {
      tableIns.showGlobalSearch(true) //
    }
    expose({ _instance: tableIns })
    provide('tableIns', tableIns)
    // onKeyStroke(
    //   'ctrl+c',
    //   (e) => {
    //   },
    //   { eventName: 'keyup' },
    // )//
    useKeyboard('enter', (e) => {
      tableIns.clearEditCell() //
    })
    useKeyboard('ctrl+c', (e) => {
      let root = tableIns.getRef('root')
      let focusDiv = document.activeElement
      if (root.contains(focusDiv)) {
        tableIns.copyCurrentCell()
      }
    })
    onMounted(() => {
      //
      tableIns.onMounted() //
    })
    watchEffect(() => {
      tableIns.tableState = props.tableState //
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
    }
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
    watch(
      () => {
        //@ts-ignore
        return tableIns.templateProps.columns
      },
      (e) => {
        tableIns.updateColumns()
      },
    ) //
    let state = true
    watch(
      () => {
        return tableIns.templateProps.data //
      },
      (newValue, oldValue) => {
        tableIns.updateCanvas()
        if (state) {
          state = false //
          let treeConfig = props.treeConfig
          let expand = treeConfig?.expand
          if (tableIns.getIsTree()) {
          }
        }
      }, //
    )
    watch(
      () => {
        return [props.data, props.data?.length]
      },
      (newValue, oldValue) => {
        //
        let [newData, newLen] = newValue as any //
        let [oldData, oldLen] = oldValue as any
        if (newData != oldData) {
          tableIns.setData(newData)
          let treeConfig = props.treeConfig
          let expand = treeConfig?.expand
          if (tableIns.getIsTree()) {
            if (expand == 'all' || props.expandAll == true) {
              tableIns.updateCanvas().then((res) => {
                if (tableIns.tableData.data == newData) {
                  tableIns
                    .getInstance()
                    .loadData(tableIns.templateProps.data)
                    .then(() => {
                      tableIns.expandAllTreeRow() //
                    })
                }
              })
            } else if (expand == 'first') {
              tableIns.updateCanvas().then((res) => {
                if (tableIns.tableData.data == newData) {
                  tableIns
                    .getInstance()
                    .loadData(tableIns.templateProps.data)
                    .then(() => {
                      tableIns.expandTargetRows(newData) //
                    })
                }
              })
            }
          }
        } else {
          newData.forEach((row) => {
            tableIns.initDataRow(row) //
          })
        }
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
    const registerSearchDiv = (el) => {
      tableIns.registerRef('searchDiv', el) //
    }
    let bodyStyle: any = reactive({
      minHeight: '200px', //
    })
    watch(
      () => tableIns.globalConfig.show,
      (e) => {
        nextTick(() => {
          if (props.calHeight == true) {
            let sRef = tableIns.getRef('bodyDiv') //
            if (sRef == null) {
              return
            }//
            let bound = sRef.getBoundingClientRect()
            if (e == true) {
              let _height = Math.round(bound.height)
              let _height1 = _height - 34
              bodyStyle.flex = ''
              bodyStyle.height = `${_height1}px !important`
            } else {
              bodyStyle.flex = 1 //
              bodyStyle.height = '100%' //
            }
          } //
        })
      },
      {
        immediate: true, //
      },
    )
    let registerBodyDiv = (el) => {
      tableIns.registerRef('bodyDiv', el)
    }
    const rowDConfig: VxeTablePropTypes.RowDragConfig = {
      isCrossDrag: true,
      dragEndMethod: async () => {
        //
        return true
      },//
    }
    let showGlobalSearch = computed(() => {
      return tableIns.globalConfig.show
    })
    let _s = showGlobalSearch.value

    const globalValue = computed(() => {
      return tableIns.globalConfig.value
    })
    return () => {
      let com = null //
      let menuCom = <TableMenuCom></TableMenuCom>
      let btnCom = <TableButtonCom></TableButtonCom>
      if (tableIns.config.showHeaderButtons == false) {
        //
        btnCom = null
      }
      let filterTCom = null
      if (props.showColumnFilterTable) {
        filterTCom = (
          <TableFilterCom
            isVxeTable={true}
            tableIns={tableIns}
          ></TableFilterCom>
        )
      }
      // const inputProps = tableIns.getGlobalSearchProps()
      let globalSearchInput = (
        <div
          ref={registerSearchDiv}
          style={{
            width: '100%', //
            overflow: 'hidden', //
            alignItems: 'center',
          }}
        >
          <InputCom
            modelValue={globalValue.value}
            {...inputProps}
            onChange={(v) => {
              tableIns.updateGlobalSearch(v.value) //
            }}
            v-slots={{
              buttons: () => {
                let com = (
                  <div class="flex items-center space-x-2 p-2 bg-gray-100 rounded-t-md border-b">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        tableIns.jumpToSearchNext(true) //
                      }}
                      class="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 transition"
                      title="上一页"
                    >
                      &laquo;
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        tableIns.jumpToSearchNext(false)
                      }}
                      class="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 transition"
                      title="下一页"
                    >
                      &raquo;
                    </button>
                    <button
                      onClick={() => {
                        tableIns.showGlobalSearch(false)
                      }}
                      class="px-3 py-1 text-sm font-medium text-white bg-red-500 border border-red-600 rounded-md shadow-sm hover:bg-red-600 transition"
                      title="关闭"
                    >
                      X
                    </button>
                  </div>
                )
                return com //
              },
            }}
          ></InputCom>
        </div>
      )
      if (showGlobalSearch.value == false) {
        globalSearchInput = null //
      } //
      let cellSelectCom = (
        <XeTableSelectCom tableIns={tableIns}></XeTableSelectCom>
      ) //
      com = withDirectives(
        <div
          style={{
            width: '100%',
            flex:1,//
            minHeight: '200px',
            position: 'relative',
            overflow: 'hidden', //
          }}
          ref={registerRootDiv}
        >
          {cellSelectCom}
          <myVxeGrid
            onRowDragend={(e) => tableIns.onRowDragEnd(e)} // row-dragend
            editRules={tableIns.getEditRules()} //
            onCellDblclick={(e) => {
              tableIns.onCellDblclick(e) //
            }}
            mouseConfig={tableIns.getMouseConfig()}
            onResizableChange={(e) => {
              tableIns.onColumnResize(e)
            }}
            onColumnDragend={(e) => {
              tableIns.onColumnDragEnd(e)
            }}//
            onCheckboxRangeEnd={(e) => tableIns.onCheckboxRangeEnd(e)} // checkbox-ange-end
            columnDragConfig={tableIns.getColumnDragConfig()}
            columnConfig={tableIns.getColumnConfig()} //
            checkboxConfig={tableIns.getCheckboxConfig()}
            virtualXConfig={tableIns.getVirtualXConfig()}
            headerCellConfig={tableIns.getHeaderCellConfig()}
            virtualYConfig={tableIns.getVirtualYConfig()}
            height={tableIns.getTableHeight()}
            rowConfig={tableIns.getRowConfig()}
            rowDragConfig={{ ...rowDConfig }} //
            class="w-full overflow-hidden"
            ref={(el) => {
              tableIns.registerRef('xeGrid', el)
            }} //
            cellConfig={tableIns.getCellConfig()}
            v-slots={{
              columnDragIcon: (config) => {
                let _column: XeColumn = config.column.params
                let showDragIcon = _column.getShowDragIcon()
                let style = {
                  display: showDragIcon ? 'block' : 'none',
                }
                return (
                  <div class="absolute left-0" style={style}>
                    <i class="vxe-table-icon-drag-handle"></i>
                  </div>
                )
              },
            }}
            cellClassName={''}
            onCellClick={(e) => {
              tableIns.onCellClick(e)
            }}
            treeConfig={tableIns.getTreeConfig()}
          ></myVxeGrid>
          {/* <vxe-grid
            checkboxConfig={tableIns.getCheckboxConfig()}
            virtualXConfig={tableIns.getVirtualXConfig()}
            headerCellConfig={tableIns.getHeaderCellConfig()}
            virtualYConfig={tableIns.getVirtualYConfig()}
            height={'auto'}
            class="h-full w-full"
            ref={(el) => {
              tableIns.registerRef('xeGrid', el)
            }} //
            cellConfig={tableIns.getCellConfig()}
            cellClassName={'h-full w-full'}
          ></vxe-grid> */}
        </div>,
        [[{}]],
      ) //
      let tBodyCom = withDirectives(
        <div
          onClick={(e) => {
            let isCClick = tableIns.isContainerClick
            if (isCClick == true) {
              return
            }
            tableIns.onBodyClick({ event: e }) //
          }}
          ref={registerBodyDiv} //
          style={{
            flex: 1, //
            width: '100%', //
            overflow: 'hidden', //
            position: 'relative',
            display: 'flex',
            flexDirection: 'column', //
            border: '1px solid #ccc',
            boxSizing: 'border-box',
            ...bodyStyle,
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
            // minHeight: '200px', //
            width: '100%',
            height: '100%',
            display: 'flex', //
            flexDirection: 'column',
            position: 'relative',
            boxSizing: 'border-box',
            overflow: 'hidden', //
          }}
        >
          {loadingCom}
          {filterTCom}
          {menuCom}
          {btnCom}
          {globalSearchInput}
          {/* {tBodyCom} */}
          {com}
        </div>
      )
      return outCom //
    }
  },
})
//
//
//
