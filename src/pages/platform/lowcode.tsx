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
      // let pageHeader = (
      //   <header class="page-header h-5 flex items-center">
      //     <div class="container flex items-center justify-between">
      //       <div class="ml-40">
      //         <er-dropdown
      //           dropMode="hover"
      //           v-slots={{
      //             default: () => {
      //               let com = (
      //                 <div class="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-pink-600">
      //                   <span>系统功能</span>
      //                 </div>
      //               )
      //               return com
      //             },
      //             dropdown: () => {
      //               let btnArr = systemIns.getGlobalDropDown()
      //               let bsComs = btnArr.map((item) => {
      //                 let c = (
      //                   <div class="py-1">
      //                     <div
      //                       class="cursor-pointer block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
      //                       onClick={() => {
      //                         let fn = item.fn
      //                         fn() //
      //                       }}
      //                     >
      //                       {item.label}
      //                     </div>
      //                   </div>
      //                 )
      //                 return c
      //               })
      //               let com = (
      //                 <div class="  mt-2 w-120 bg-white border border-gray-200 rounded-lg shadow-lg transition-opacity">
      //                   {bsComs}
      //                 </div>
      //               )
      //               return com //
      //             },
      //           }}
      //         ></er-dropdown>
      //       </div>
      //       <div class="flex-1 mx-8 flex items-center justify-center">
      //         <er-dropdown
      //           class="w-400"
      //           ref={(el) => {
      //             systemIns.registerRef('gSearch', el)
      //           }}
      //           v-slots={{
      //             default: () => {
      //               let com = (
      //                 <input
      //                   onFocus={() => {
      //                     let _ref: Dropdown = systemIns.getRef('gSearch')
      //                     _ref.showDropdown() //
      //                   }}
      //                   placeholder="全局查询"
      //                   class="w-400 h-35 px-3 border border-gray-300 rounded-l-md outline-none"
      //                 />
      //               )
      //               return com
      //             },
      //             dropdown: () => {
      //               let com = <div class="w-400 h-400 bg-red"></div>
      //               return com
      //             },
      //           }}
      //         ></er-dropdown>
      //       </div>

      //       <div class="flex items-center space-x-4">
      //         <img alt="avatar" class="w-8 h-8 rounded-full cursor-pointer" />
      //         <er-dropdown
      //           dropMode="hover"
      //           v-slots={{
      //             default: () => {
      //               let com = (
      //                 <div class="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-pink-600">
      //                   <span>
      //                     {system.getUserInfo()?.user?.username || '登录'}
      //                   </span>
      //                 </div>
      //               )
      //               return com
      //             },
      //             dropdown: () => {
      //               let items = systemIns.getUserDropDown()
      //               let itemsCom = items.map((item) => {
      //                 let com = (
      //                   <div class="py-1">
      //                     <div
      //                       href="#"
      //                       class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
      //                     >
      //                       {item.label}
      //                     </div>
      //                   </div>
      //                 )
      //                 return com
      //               })
      //               let com = (
      //                 <div
      //                   class="  mt-2 w-120 bg-white border border-gray-200 rounded-lg shadow-lg
      //       transition-opacity
      //      "
      //                 >
      //                   {itemsCom}
      //                 </div>
      //               )
      //               return com
      //             },
      //           }}
      //         ></er-dropdown>
      //       </div>
      //     </div>
      //   </header>
      // )
      const pageHeader = (
        <header class="w-full bg-white shadow flex items-center justify-between px-1 py-2">
          {/* 左侧：功能下拉 */}
          <div class="w-24">
            <er-dropdown
              dropMode="hover"
              v-slots={{
                default: () => (
                  <button class="flex items-center h-10 px-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    <span class="font-medium">系统功能</span>
                    <svg
                      class="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                ),
                dropdown: () => (
                  <div class="mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                    {systemIns.getGlobalDropDown().map((item) => (
                      <div
                        class="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={item.fn}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                ),
              }}
            />
          </div>

          {/* 中间：全局搜索 */}
          <div class="flex-1 mx-6">
            <er-dropdown
              ref={(el) => systemIns.registerRef('gSearch', el)}
              v-slots={{
                default: () => (
                  <div class="relative">
                    <input
                      type="text"
                      placeholder="全局查询"
                      class="w-full h-10 pl-4 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onFocus={() => systemIns.getRef('gSearch').showDropdown()}
                    />
                    <svg
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.65 6.65a7.5 7.5 0 0 0 10.6 10.6z"
                      />
                    </svg>
                  </div>
                ),
                dropdown: () => (
                  <div class="mt-1 w-full bg-white border border-gray-200 rounded shadow-lg">
                    {/* 下拉内容 */}
                  </div>
                ),
              }}
            />
          </div>

          {/* 右侧：头像 + 用户下拉 */}
          <div class="flex items-center space-x-4">
            <img
              src=""
              alt="avatar"
              class="w-10 h-10 rounded-full border border-gray-300"
            />
            <er-dropdown
              dropMode="hover"
              v-slots={{
                default: () => (
                  <button class="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    <span class="font-medium">
                      {system.getUserInfo()?.user?.username || '登录'}
                    </span>
                    <svg
                      class="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                ),
                dropdown: () => (
                  <div class="mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg">
                    {systemIns.getUserDropDown().map((item) => (
                      <div
                        class="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={item.fn}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                ),
              }}
            />
          </div>
        </header>
      )
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
          {/* <div class="w-full flex flex-row flex-1 overflow-auto">
            <div class='' style={{ height: '100%' }}>{leftM}</div>
            <div class="flex flex-col flex-1 h-full ">
              <div class="w-full bg-white tab-line">{tableTab}</div>
              <div class="w-full flex-1 overflow-auto   ">{dCom}</div>
            </div>
          </div> */}
          <div class="flex h-full overflow-hidden">
            {/* 左侧菜单区 */}
            <aside class="w-60 h-full overflow-hidden bg-gray-50 border-r border-gray-200   ">
              {leftM}
            </aside>

            {/* 右侧主体区 */}
            <div class="flex-1 flex flex-col">
              {/* 顶部标签栏 卡片化 */}
              <div class="px-1  bg-white shadow-sm border-b border-gray-200">
                <div class="max-w-full mx-auto">
                  <div class="bg-white rounded-lg shadow-inner">{tableTab}</div>
                </div>
              </div>

              {/* 主内容区 卡片化 + 渐变背景 */}
              <main class="flex-1 overflow-auto bg-gradient-to-b   p-1">
                <div class="max-w-full h-full mx-auto bg-white rounded-lg shadow-lg p-1 w-full">
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
