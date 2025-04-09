import { defineComponent, onMounted, onUnmounted, provide, toRaw, watch, watchEffect } from 'vue'
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
    })
    setTimeout(() => {
      // setInterval(() => {
      //   let data = tableIns.getData()//
      //   data[0].id = data[0].id + 1
      // }, 100)//
    }, 1000) //
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
    return () => {
      let com = null
      com = <div style={{ width: '100%', height: '100%', background: 'red' }} ref={registerRootDiv}></div>
      const menuCom = <TableMenuCom></TableMenuCom>
      let btnCom = <TableButtonCom></TableButtonCom>
      // com = <div style={{ width: '100%', height: '100%', background: 'red' }}></div>
      let outCom = (
        <div style={{ width: '100%', height: '100px', display: 'flex', flexDirection: 'column' }}>
          {menuCom}
          {btnCom}
          <div
            style={{
              flex: 1,
              // transform: 'translate(0,200px)',
              width: '100%', //
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
