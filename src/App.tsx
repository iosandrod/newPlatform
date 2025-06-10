import { computed, defineComponent } from 'vue'
import { ref, onMounted, getCurrentInstance, inject, provide } from 'vue'
import { erFormEditor } from '@ER/formEditor'
import { globalConfig } from '@ER/formEditor/componentsConfig'
import { RouterView } from 'vue-router'
import { system } from './system'
import dialogCom from './dialog/dialogCom'
export default defineComponent({
  components: {
    dialogCom, //
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
      let com = <RouterView></RouterView>
      return (
        <div
          style={{
            height: '100vh',
            width: '100vw',
            overflow: 'hidden', //
          }}
        >
          {com}
          {dArr}
        </div>
      )
    }
  },
})
