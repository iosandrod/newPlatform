import { computed, defineComponent, withDirectives } from 'vue'
import { ref, onMounted, getCurrentInstance, inject, provide } from 'vue'
import { erFormEditor } from '@ER/formEditor'
import { globalConfig } from '@ER/formEditor/componentsConfig'
import { RouterView } from 'vue-router'
import { system } from './system'
import dialogCom from './dialog/dialogCom'
import { comText } from './comTest'
import {
  getGanttColumns,
  getGanttRecords,
  getOptions,
} from './table/ganttTableFn'
import ERNodeVue from './ERNode'
import flowCom from './logic/flowCom'
//@ts-ignore
window.CONTAINER_ID = 'main_app'
export default defineComponent({
  components: {
    dialogCom, //
    flowCom,
    ERNodeVue, //
  },
  setup() {
    provide('globalConfig', globalConfig)
    provide('systemIns', system) //
    let diaArr = computed(() => {
      let arr = system.getAllDialog()
      return arr
    })
    onMounted(() => {
      system.createSystemRoutes() //
    })
    document.addEventListener('mousemove', (e) => {
      let clientX = e.clientX
      let clientY = e.clientY
      system.mouseConfig.clientX = clientX
      system.mouseConfig.clientY = clientY //
    })
    return () => {
      // if (system.hasInitRoutes === false) {
      //   return
      // } //
      let dArr = diaArr.value.map((d) => {
        return <dialogCom dialogIns={d}></dialogCom>
      })
      let com = <RouterView></RouterView>//
      com = (
        <flowCom
          {...comText()}
          isERDiagram={true} //
          getRemoteTables={true}
        ></flowCom>
      )
      return withDirectives(
        <div
          id="main_app" //
          style={{
            height: '100vh',
            width: '100vw',
            overflow: 'hidden', //
          }}
        >
          {com}
          {dArr}
          {/* <div style={{ height: '500px', width: '100%' }} class="">
            <erTable
              isGantt={true}
              // {...getOptions()} //
              data={getGanttRecords()}
              columns={getGanttColumns()}
            ></erTable>
          </div> */}
        </div>,
        [
          [
            {
              mounted: async () => {
                // comText() //
              },
            },
          ],
        ],
      )
    }
  },
})
