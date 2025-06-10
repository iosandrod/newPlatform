import { computed, defineComponent, provide } from 'vue'
import erForm from '@ER/formCom'
import erFormEditor from '@ER/formEditor/formEditor'
import tableEditor from '@/table/tableCom'
import { formConfig } from '@ER/formEditor/testData'
import menuCom from '@/menu/menuCom'
import fieldCom from '@/menu/fieldCom'
import { system } from '@/system'
import tabCom from '@/buttonGroup/tabCom'
import PageCom from '@ER/pageCom'
import ButtonCom from '@/buttonGroup/buttonCom'
import ButtonGroupCom from '@/buttonGroup/buttonGroupCom'
export default defineComponent({
  components: {
    erForm,
    erFormEditor,
    tableEditor,
    menuCom,
    fieldCom, //
    tabCom,
    ButtonCom,
  },
  setup() {
    const systemIns = system //
    const registerMenu = (el) => {
      systemIns.registerRef('leftMenu', el) //
    }
    const ns = systemIns.hooks.useNamespace('Home')
    const fn = async () => {
      systemIns.getAllApps()
    }
    fn() //
    let appV = computed(() => {
      let arr = systemIns.allApp
      return arr
    })
    return () => {
      let appArr = appV.value.map((app) => {
        //
        const controllerBtns = [
          {
            label: '安装',
            fn: () => {
              systemIns.installApp(app.name) //
            },
          },
          {
            label: '进入',
            fn: () => {
              systemIns.enterApp(app.name)
            },
          },
        ]
        let _com = (
          <div class="app-card">
            <div
              class="app-thumbnail"
              // style="background-image: url('thumb1.jpg');"
            ></div>
            <div class="app-info">
              <div class="app-title">{app.name}</div>
              <div class="app-meta">下载次数：3</div>
            </div>
            <div class="flex flex-row items-center justify-center">
              <ButtonGroupCom items={controllerBtns}></ButtonGroupCom>
            </div>
          </div>
        )
        return _com
      })
      return <div class="app-container">{appArr}</div>
    } //
  },
})
