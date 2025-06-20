import { defineComponent, KeepAlive, provide, ref } from 'vue'
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
import LeftMenu from './leftMenu'
import { Dropdown } from '@/menu/dropdown'

export default defineComponent({
  components: {
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
    provide('systemIns', systemIns) //
    let show = ref(false)
    let _config = null

    return () => {
      let leftM = <LeftMenu></LeftMenu>
      let tableTab = (
        <tabCom
          height={40}
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
              let com = (
                <div class="cursor-pointer   pl-10 pr-10 -mb-px text-blue-500   focus:outline-none">
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
                    let btnArr = [
                      {
                        label: '设计菜单',
                        fn: async () => {
                          await system.designSystemNavs()
                        },
                      },
                      {
                        label: '当前页面设计',
                        fn: async () => {
                          let currentPageDesign = system.getCurrentPageDesign()
                          currentPageDesign.setCurrentDesign(true) //
                        },
                      },
                      {
                        label: '退出页面设计',
                        fn: async () => {
                          system.refreshPageDesign() //
                        },
                      },
                      {
                        label: '保存页面设计',
                        fn: async () => {
                          let currentPageDesign = system.getCurrentPageDesign()
                          await currentPageDesign.saveTableDesign()
                        },
                      },
                      {
                        label: '同步当前列',
                        fn: async () => {
                          let currentPageDesign = system.getCurrentPageDesign()
                          await currentPageDesign.syncErpTableColumns() //
                        },
                      },
                      {
                        label: '打印页面',
                        fn: async () => {
                          let pageDesign = system.getCurrentPageDesign()
                          let layout = pageDesign.getLayoutData()
                          console.log(layout) //
                        },
                      },
                    ]
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
                    let com = (
                      <div
                        class="  mt-2 w-120 bg-white border border-gray-200 rounded-lg shadow-lg
            transition-opacity
           "
                      >
                        <div class="py-1">
                          <div
                            href="#"
                            class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                          >
                            个人中心
                          </div>
                        </div>
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
      return (
        <div
          class={[ns.b(), 'flex-col']}
          style={{ display: 'flex', width: '100vw', height: '100vh' }}
        >
          {pageHeader}
          <div class="h-full w-full flex flex-row">
            <div style={{ width: '300px', height: '100%' }}>{leftM}</div>
            <div class="flex flex-col flex-1 h-full ">
              <div class="w-full bg-white tab-line">{tableTab}</div>
              <div class="w-full h-full overflow-hidden">
                <router-view
                  v-slots={{
                    default: (config) => {
                      const { Component, route } = config
                      if (!Component) {
                        return <div></div>
                      }
                      const FullPath = route.fullPath
                      let _com = (
                        <KeepAlive>
                          <Component key={FullPath} />
                        </KeepAlive>
                      ) //
                      return _com
                    },
                  }}
                ></router-view>
              </div>
            </div>
          </div>
        </div>
      )
    }
  },
})
