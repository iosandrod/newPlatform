import {
  computed,
  defineComponent,
  KeepAlive,
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
  },
  setup() {
    const systemIns = system //
    const registerMenu = (el) => {
      systemIns.registerRef('leftMenu', el) //
    }
    const ns = systemIns.hooks.useNamespace('Home')
    const fn = async () => {
      let menuData = await systemIns.getMenuData()
      let menuData1 = await systemIns.getMenuData() //
    }
    fn()
    let router = useRoute()
    provide('systemIns', systemIns) //
    let show = ref(false)
    let _config = null
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
          height={40}
          onCloseClick={(config) => {
            let item = config.item
            let name = item.name
            let page = systemIns.getTargetDesign(name) //
            page.tabHidden = true
            let pre = config.pre
            let modelValue = config.modelValue
            if (modelValue != item.name) {
              return //
            }
            if (pre) {
              systemIns.routeOpen(pre.name) //
            } else if (config.next) {
              //
              systemIns.routeOpen(config.next.name) //
            }
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
            //
            item: (item) => {
              //
              // let com = (
              //   <div class="cursor-pointer   pl-10 pr-10 -mb-px text-blue-500   focus:outline-none">
              //     <div>{item.getLabel()}</div>
              //   </div>
              // )
              let com = (
                <div class="h-30 px-4 py-2 border-x border-t border-gray-300 rounded-t-md text-gray-700 hover:bg-gray-100 flex justify-center items-center">
                  <div>{item.getLabel()}</div>
                </div>
              )
              return com
            },
          }}
        ></tabCom>
      )
      let pageHeader = (
        <header class="page-header h-50 flex items-center">
          <div class="container flex items-center justify-between">
            <div class="ml-40">
              <er-dropdown
                dropMode="hover"
                v-slots={{
                  default: () => {
                    let com = (
                      <div class="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-pink-600">
                        <span>系统功能</span>
                      </div>
                    )
                    return com
                  },
                  dropdown: () => {
                    let btnArr = systemIns.getGlobalDropDown()
                    let bsComs = btnArr.map((item) => {
                      let c = (
                        <div class="py-1">
                          <div
                            class="cursor-pointer block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                            onClick={() => {
                              let fn = item.fn
                              fn() //
                            }}
                          >
                            {item.label}
                          </div>
                        </div>
                      )
                      return c
                    })
                    let com = (
                      <div class="  mt-2 w-120 bg-white border border-gray-200 rounded-lg shadow-lg transition-opacity">
                        {bsComs}
                      </div>
                    )
                    return com //
                  },
                }}
              ></er-dropdown>
            </div>
            <div class="flex-1 mx-8 flex items-center justify-center">
              <er-dropdown
                class="w-400"
                ref={(el) => {
                  systemIns.registerRef('gSearch', el)
                }}
                v-slots={{
                  default: () => {
                    let com = (
                      <input
                        onFocus={() => {
                          let _ref: Dropdown = systemIns.getRef('gSearch')
                          _ref.showDropdown() //
                        }}
                        placeholder="全局查询"
                        class="w-400 h-35 px-3 border border-gray-300 rounded-l-md outline-none"
                      />
                    )
                    return com
                  },
                  dropdown: () => {
                    let com = <div class="w-400 h-400 bg-red"></div>
                    return com
                  },
                }}
              ></er-dropdown>
            </div>

            <div class="flex items-center space-x-4">
              <img alt="avatar" class="w-8 h-8 rounded-full cursor-pointer" />
              <er-dropdown
                dropMode="hover"
                v-slots={{
                  default: () => {
                    let com = (
                      <div class="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-pink-600">
                        <span>
                          {system.getUserInfo()?.user?.username || '登录'}
                        </span>
                      </div>
                    )
                    return com
                  },
                  dropdown: () => {
                    let items = systemIns.getUserDropDown()
                    let itemsCom = items.map((item) => {
                      let com = (
                        <div class="py-1">
                          <div
                            href="#"
                            class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                          >
                            {item.label}
                          </div>
                        </div>
                      )
                      return com
                    })
                    let com = (
                      <div
                        class="  mt-2 w-120 bg-white border border-gray-200 rounded-lg shadow-lg
            transition-opacity
           "
                      >
                        {itemsCom}
                      </div>
                    )
                    return com
                  },
                }}
              ></er-dropdown>
            </div>
          </div>
        </header>
      )
      let dCom = useSlots()?.default(currentRoutePath.value)
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
          <div class="w-full flex flex-row flex-1 overflow-auto">
            <div style={{ height: '100%' }}>{leftM}</div>
            <div class="flex flex-col flex-1 h-full ">
              <div class="w-full bg-white tab-line">{tableTab}</div>
              <div class="w-full flex-1 overflow-auto   ">{dCom}</div>
            </div>
          </div>
        </div>
      )
    }
  },
})
