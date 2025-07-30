import {
  computed,
  defineComponent,
  KeepAlive,
  onMounted,
  provide,
  ref,
  useSlots,
  withDirectives,
} from 'vue'
import erForm from '@ER/formCom'
import erFormEditor from '@ER/formEditor/formEditor'
import tableEditor from '@/table/tableCom'
import menuCom from '@/menu/menuCom'
import fieldCom from '@/menu/fieldCom'
import { system } from '@/system'
import tabCom from '@/buttonGroup/tabCom'
import PageCom from '@ER/pageCom'
import { tableConfig } from '@/table/tableData'
import { PageDesign } from '@ER/pageDesign'
import pageCom from '@ER/pageCom'
import TableCom from '@/table/tableCom'
import { Table } from '@/table/table'
import LeftMenu from './leftMenu' //
import { RouterView, useRoute } from 'vue-router'
import ContextmenuCom from '@/contextM/components/ContextmenuCom'
import { Dropdown } from '@/menu/dropdown'
import {
  ElContainer,
  ElHeader,
  ElDropdownMenu,
  ElDropdownItem,
  ElInput,
  ElAvatar,
  ElDropdown,
  ElAside,
  ElTabs,
  ElTabPane,
  ElMain,
  ClickOutside,
} from 'element-plus'
import LowcodeHeader from './lowcodeHeader'
import Design from './design'

export default defineComponent({
  components: {
    ContextmenuCom,
    erForm,
    erFormEditor,
    tableEditor,
    menuCom,
    fieldCom, //
    tabCom,
    LeftMenu,
    LowcodeHeader,
  },

  setup() {
    const systemIns = system //

    const ns = systemIns.hooks.useNamespace('Home')
    const getMenuData = async () => {
      await systemIns.getMenuData()
    }
    onMounted(async () => {
      await getMenuData() //
    })
    let router = useRoute()
    provide('systemIns', systemIns) //
    let currentRoutePath = computed(() => {
      let path = router.fullPath
      return path
    })
    onMounted(() => {})
    return () => {
      let leftM = withDirectives(
        <div
          ref={(el) => {
            systemIns.registerRef('leftMenuDiv', el) //
          }}
          class="hidden md:border z-50 md:block absolute md:relative  w-[200px] h-full overflow-auto"
        >
          <LeftMenu></LeftMenu>
        </div>,
        [
          [
            ClickOutside,
            () => {
              systemIns.closeLeftMenu()
            },
          ],
        ],
      )
      let tableTab = (
        <tabCom
          height={32}
          onCloseClick={(config) => {
            system.onTableTabClose(config) //
          }}
          onTabChange={(config) => {
            system.onMainTabChange(config)
          }}
          showCloseIcon={true} //
          items={systemIns.getTabItems()}
          modelValue={systemIns.getTabModelValue()}
          showContextMenu={true}
          contextItems={systemIns.getTabContextItems()}
          v-slots={{
            item: (item) => {
              //
              let com = (
                <div class="h-full px-3 border-x border-t border-gray-300 rounded-t-md text-gray-700 hover:bg-gray-100 flex justify-center items-center">
                  <div class="h-full w-full flex justify-center items-center">
                    <div>{item.getLabel()}</div>
                  </div>
                </div>
              )
              return com
            },
          }}
        ></tabCom>
      )

      const pageHeader = <LowcodeHeader></LowcodeHeader>
      let dCom = null
      // if (useSlots()?.default) {
      //   dCom = useSlots()?.default(currentRoutePath.value)
      // }
      dCom = (
        <RouterView
          v-slots={{
            default: (config) => {
              let route = config.route
              let fullPath = route.fullPath
              let _com = ( //
                <KeepAlive>
                  <Design key={fullPath}></Design>
                </KeepAlive>
              )
              return _com
            },
          }}
        ></RouterView>
      )
      let context = (
        <ContextmenuCom
          ref={(el) => systemIns.registerRef('contextmenu', el)}
          items={systemIns.getSysContextItems()}
        ></ContextmenuCom>
      )
      return (
        <div class="flex flex-col w-screen h-screen">
          {context}
          {pageHeader}

          <div class="flex flex-1 overflow-hidden">
            {leftM}
            <div class="flex flex-1 flex-col overflow-hidden">
              <div class="px-2 bg-white shadow-sm border-b border-gray-200">
                <div class="max-w-full">
                  <div class="bg-white rounded-lg shadow-inner">{tableTab}</div>
                </div>
              </div>

              <main class="flex-1 overflow-auto bg-gradient-to-b from-gray-50 to-gray-100">
                <div class="w-full h-full bg-white rounded-lg shadow  overflow-hidden">
                  {dCom}
                </div>
              </main>
            </div>
          </div>
        </div>
      )
    }
  },
})
/* 


*/
