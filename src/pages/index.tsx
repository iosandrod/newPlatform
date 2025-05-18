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
import _header from './pageHeader'
import TableCom from '@/table/tableCom'
import { Table } from '@/table/table'

export default defineComponent({
  components: {
    erForm,
    erFormEditor,
    tableEditor,
    menuCom,
    fieldCom, //
    tabCom,
    _header,
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
      // if (show.value == false) {
      //   return null
      // }
      // if (1 == 1) {
      //   let com = (
      //     <div class="h-400 w-400">
      //       <TableCom
      //         {..._config}
      //         showHeaderButtons={true}
      //         buttons={[
      //           {
      //             label: '更新',
      //             fn: async (config) => {
      //               console.log('更新') //
      //               let table: Table = config.parent //
      //               // console.log(config) ////
      //               let fData = table.getFlatTreeData()
      //               let _data = fData.filter((item) => {
      //                 let _rowState = item['_rowState']
      //                 return _rowState == 'change'
      //               })
      //               console.log(_data) //
      //             },
      //           },
      //         ]}
      //       ></TableCom>
      //     </div>
      //   )
      //   return com //
      // }
      let leftMenu = (
        <menuCom
          items={systemIns.getMenuItems()}
          ref={registerMenu}
          showSearch={true}
          searchFn={(config) => {
            let value = config.value
            let item = config.item
            let _config = item.config.navname //
            let reg = new RegExp(value, 'gi') //
            let bool = false
            let tableName = item.config.tableName
            if (reg.test(_config)) {
              bool = true
            }
            if (reg.test(tableName)) {
              bool = true
            }
            return bool //
          }}
          v-slots={{
            subItemTitle: (item) => {
              let config = item.config
              let navname = config.navname
              return <div>{navname}</div>
            },
            itemTitle: (item) => {
              let config = item.config
              let navname = config.navname
              let com = (
                <div
                  // onClick={(config) => {
                  //   console.log('我点击了这个东西') //
                  // }}
                >
                  {navname}
                </div>
              ) //
              return com
            },
          }}
        ></menuCom>
      )
      let tableTab = (
        <tabCom
          height={30}
          items={systemIns.getTabItems()}
          showContextMenu={true}
          contextItems={systemIns.getTabContextItems()}
          v-slots={{
            //
            item: (item) => {
              let com = (
                <div class="cursor-pointer pl-10 pr-10 -mb-px text-blue-500  border-b-2 border-blue-500 focus:outline-none">
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
                        label: '设计表格',
                        fn: async () => {},
                      },
                      {
                        label: '页面高级配置',
                        fn: async () => {}, //
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
              <input
                placeholder="全局查询"
                class="w-400 h-35 px-3 border border-gray-300 rounded-l-md outline-none"
              />
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
                            回复我的
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
            <div style={{ width: '300px', height: '100%' }}>{leftMenu}</div>
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
                      const FullPath = route.fullPath //
                      return <Component key={FullPath} />
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
