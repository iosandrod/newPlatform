import { computed, defineComponent, h, KeepAlive, withDirectives } from 'vue'
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
import dialogArrCom from './dialog/dialogArrCom'
import { useKeyboard } from '@ER/utils'
import errorPage from './errorPage'
import errorPage1 from './errorPage1.vue'
//@ts-ignore
window.CONTAINER_ID = 'main_app'
export default defineComponent({
  components: {
    dialogCom, //
    errorPage,
    errorPage1,
    // flowCom,
    // ERNodeVue, //
    // dialogArrCom, //
    dialogArrCom,
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
      let dArr = <dialogArrCom dialogArr={diaArr.value}></dialogArrCom>
      let com = <RouterView></RouterView> //
      if (system.isError == true) {
        com = <errorPage1></errorPage1>
      }
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
