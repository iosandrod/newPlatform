import {
  computed,
  defineComponent,
  KeepAlive,
  onMounted,
  provide,
  ref,
  useSlots,
} from 'vue'
import erForm from '@ER/formCom'
import erFormEditor from '@ER/formEditor/formEditor'
import tableEditor from '@/table/tableCom'
import { formConfig } from '@ER/formEditor/testData'
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
import { useRoute } from 'vue-router'
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
} from 'element-plus'
import LowcodeHeader from './lowcodeHeader'

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
    return () => {
      let leftM = (
        <div class="w-200 h-full overflow-auto">
          <LeftMenu></LeftMenu>
        </div>
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
      if (useSlots()?.default) {
        dCom = useSlots()?.default(currentRoutePath.value)
      }
      let context = (
        <ContextmenuCom
          ref={(el) => systemIns.registerRef('contextmenu', el)}
          items={systemIns.getSysContextItems()}
        ></ContextmenuCom>
      )
      return (
        <div
          class={[ns.b(), 'flex-col']}
          style={{ display: 'flex', width: '100vw', height: '100vh' }}
        >
          {context}
          {pageHeader}

          <div class="flex h-full overflow-hidden">
            {/* 左侧菜单区 */}
            <aside class="er-w-200 h-full overflow-hidden bg-gray-50 border-r border-gray-200   ">
              {leftM}
            </aside>

            {/* 右侧主体区 */}
            <div class="flex-1 flex flex-col overflow-hidden">
              {/* 顶部标签栏 卡片化 */}
              <div class="px-1  bg-white shadow-sm border-b border-gray-200">
                <div class="max-w-full ">
                  <div class="bg-white rounded-lg shadow-inner">{tableTab}</div>
                </div>
              </div>

              {/* 主内容区 卡片化 + 渐变背景 */}
              <main class="flex-1 overflow-auto bg-gradient-to-b   p-1">
                <div class="max-w-full h-full  bg-white rounded-lg shadow-lg p-1 w-full">
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
