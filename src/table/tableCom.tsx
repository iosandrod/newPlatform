import {
  defineComponent,
  onMounted,
  onUnmounted,
  provide,
  watch,
  watchEffect,
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
    const registerRootDiv = (el) => {
      // tableIns.registerRef('root', el) //注册实例//
      tableIns.registerRef('root', el) //注册实例//
    } //
    onMounted(() => {
      tableIns.render() //
    }) //
    onUnmounted(() => {
      tableIns.onUnmounted()
    })
   
    watchEffect(() => {
      tableIns.loadColumns()
    })
    watchEffect(() => {
      tableIns.loadData() //
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
      com = (
        <div
          style={{ width: '100%', height: '100%' }}
          ref={registerRootDiv}
        ></div>
      )
      const menuCom = <TableMenuCom></TableMenuCom>
      let btnCom = <TableButtonCom></TableButtonCom>
      let outCom = (
        <div style={{}}>
          {menuCom}
          {btnCom}
          <div
            style={{
              // transform: 'translate(0,200px)',
              width: '500px',
              height: '500px',
            }}
          >
            {com}
          </div>
        </div>
      )
      return outCom //
    }
  },
})
