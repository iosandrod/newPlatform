import {
  defineComponent,
  onMounted,
  onUnmounted,
  provide,
  ref,
  toRaw,
  watch,
  watchEffect,
  withDirectives,
} from 'vue'
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
import {useResizeObserver} from '@vueuse/core'
// new ListTable()
//核心表格组件
export default defineComponent({
  name: 'TableEditor',
  components: {
    buttonGroupCom,
    ContextmenuCom,
  },
  props: {
    ...tableV2Props,
    width: {
      type: Number,
    },
    height: {
      type: Number,
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
      },
    )
    // watch(
    //   () => {
    //     return tableIns.templateProps.data
    //   },
    //   (e) => {
    //     let ins = tableIns.getInstance()
    //     if (ins == null) {
    //       return
    //     }
    //     ins.setRecords(e) //
    //   },
    // )
    watch(
      () => {
        let tableData = { ...tableIns.tableData }
        return tableData //
      },
      (e) => {
        tableIns.updateCanvas() //
      },
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
      },
    )
    provide('tableIns', tableIns)
    return () => {
      let com = null
      com = withDirectives(
        <div
          style={{ width: '100%', height: '100%' }}
          ref={registerRootDiv}
        ></div>,
        [
          [
            {
              mounted(el) {},
              unmounted(el) {},
            },
          ],
        ],
      )
      const menuCom = <TableMenuCom></TableMenuCom>
      let btnCom = <TableButtonCom></TableButtonCom>
      let outCom = (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {menuCom}
          {btnCom}
          <div
            style={{
              flex: 1,
              width: '100%', //
              overflow: 'hidden',
            }} //
          >
            {com}
          </div>
        </div>
      )
      return outCom //
    }
  },
})
