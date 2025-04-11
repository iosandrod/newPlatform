import { defineComponent, onMounted, onUnmounted, provide, ref, toRaw, vShow, watch, watchEffect, withDirectives } from 'vue'
import { ListTableConstructorOptions } from '@visactor/vtable'
import { ListTable } from '@visactor/vue-vtable'
import { Table } from './table'
import { tableV2Props } from 'element-plus'
import buttonGroupCom from '@/buttonGroup/buttonGroupCom'
import { nextTick } from 'vue'
import { generatePersons } from './tableData'
import ContextmenuCom from '@/contextM/components/ContextmenuCom'
import TableButtonCom from './tableButtonCom'
import TableMenuCom from './tableMenuCom'
import { useResizeObserver } from '@vueuse/core'
import TableFitlerCom from './tableFitlerCom'
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
  },
  setup(props, { slots, attrs, emit }) {
    const tableIns = new Table(props)
    provide('tableIns', tableIns)
    onMounted(() => {
      tableIns.onMounted() //
    })
    // let _refDiv = ref(null)
    // useResizeObserver(_refDiv, (entries) => {
    //   const entry = entries[0]
    //   const { width: w, height: h } = entry.contentRect
    // })
    const registerRootDiv = (el) => {
      // _refDiv.value = el
      // tableIns.registerRef('root', el) //注册实例//
      tableIns.registerRef('root', el) //注册实例//
    } //
    onMounted(() => {
      nextTick(() => {
        tableIns.render() //、、
      })
    }) //
    onUnmounted(() => {
      tableIns.onUnmounted()
    })

    watchEffect(() => {
      tableIns.loadColumns()
    })
    watchEffect(() => {
      tableIns.loadData() //
    }) //
    let obj1 = {}
    let timeout = null
    watchEffect(() => {
      let s = tableIns.updateIndexArr.size
      if (timeout == null) {
        let _s = tableIns.updateIndexArr.size
        if (_s == 0) {
          return //
        }
        timeout = setTimeout(() => {
          let _arr = []
          let _iArr = []
          let records = tableIns.getInstance().records
          for (const k of tableIns.updateIndexArr.keys()) {
            //@ts-ignore
            let record = tableIns.dataMap[k]
            let index = records.indexOf(record)
            if (index != -1) {
              _arr.push(record)
              _iArr.push(index)
            }
          }
          timeout = null
          tableIns.updateIndexArr.clear() //
          if (_arr.length != 0) {
            tableIns.getInstance().updateRecords(_arr, _iArr) //
          }
        }, 10)
      }
    })
    watch(
      () => {
        return tableIns.templateProps.columns
      },
      (e) => {
        let ins = tableIns.getInstance()
        if (ins == null) {
          return
        }
        ins.updateColumns(e)
      }
    )
    watch(
      () => {
        let tableData = { ...tableIns.tableData }
        return tableData //
      },
      (e) => {
        tableIns.updateCanvas() //
      }
    )
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
    return () => {
      let com = null
      com = withDirectives(<div style={{ width: '100%', height: '100%' }} ref={registerRootDiv}></div>, [
        [
          {
            mounted(el) {},
            unmounted(el) {},
          },
        ],
      ])
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
            zIndex: 100,
            width: '100%',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            //  position: 'absolute',
            left: '0px',
            top: '0px',
          }}
        >
          <vxe-input modelValue={tableIns.globalConfig.value} {...inputProps}></vxe-input>
        </div>,
        [[vShow, tableIns.globalConfig.show]]
      )
      let outCom = (
        <div
          style={{
            width: '100%',
            height: '100%',
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
            }} //
          >
            {globalSearchInput}
            {com}
          </div>
        </div>
      )
      return outCom //
    }
  },
})
