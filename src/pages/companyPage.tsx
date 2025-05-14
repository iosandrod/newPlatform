import { computed, defineComponent, KeepAlive, provide, ref } from 'vue'
import erForm from '@ER/formCom'
import erFormEditor from '@ER/formEditor/formEditor'
import tableEditor from '@/table/tableCom'
import { formConfig } from '@ER/formEditor/testData'
import menuCom from '@/menu/menuCom'
import fieldCom from '@/menu/fieldCom'
import { fieldsConfig } from '@ER/formEditor/componentsConfig'
import { system } from '@/system'
import tabCom from '@/buttonGroup/tabCom'
import PageCom from '@ER/pageCom'
import { tableConfig } from '@/table/tableData'
import { PageDesign } from '@ER/pageDesign'
import pageCom from '@ER/pageCom'
import _header from './pageHeader'
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
    provide('systemIns', systemIns) //
    let isInstallApp = computed(() => {
      let _a = systemIns.allApp //
      return _a //
    })
    let allApp = computed(() => {
      let _a = systemIns.systemApp
      if (!Array.isArray(_a)) {
        return []
      }
      console.log(_a, 'tesfsjkdslflds') //
      let allApp = system.allApp //当前已经安装的
      _a = _a.filter((a) => {
        let appName = a.appName //
        if (allApp.find((v) => v.appName == appName) != null) {
          return false
        }
        return true
      })
      return _a
    })
    systemIns.initAllApp()
    systemIns.getAllApps() //
    let curNav = ref('install') //
    let _class = (str: string) => {
      let arr = [
        'cursor-pointer block px-4 py-2 rounded hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-gray-700 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-300 transition-colors',
      ]
      if (curNav.value == str) {
        arr.push('text-indigo-600') //
        arr.push('bg-indigo-50') //
      }
      return arr
    }
    return () => {
      let getAppCom = (config, isIns = false) => {
        let btn1 = (
          <button
            onClick={() => {
              systemIns.installApp(config.appName)
            }}
            class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded transition-colors"
          >
            安装应用
          </button>
        )
        if (isIns == true) {
          btn1 = (
            <button
              onClick={() => {
                system.enterApp(config.appName)
              }}
              class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded transition-colors"
            >
              启动应用
            </button>
          )
        }
        return (
          <div
            id="installed"
            class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 max-w-3xl mx-auto"
          >
            <div class="flex items-center mb-6">
              <img alt="应用图标" class="w-40 h-40 rounded mr-4" />
              <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                  示例应用
                </h1>
                <p class="text-gray-600 dark:text-gray-300 mt-1">
                  这是一个示例应用的简要描述，展示它的核心功能和作用。
                </p>
              </div>
            </div>

            <div class="flex space-x-4 mb-6">
              {btn1}
              <button class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors">
                卸载应用
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  版本信息
                </h2>
                <p class="text-gray-700 dark:text-gray-200">v1.2.3</p>
              </div>
              <div>
                <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  作者
                </h2>
                <p class="text-gray-700 dark:text-gray-200">OpenAI 团队</p>
              </div>
              <div>
                <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  最后更新
                </h2>
                <p class="text-gray-700 dark:text-gray-200">2025-05-10</p>
              </div>
            </div>
          </div>
        )
      }
      let userCom = null
      if (systemIns.getIsLogin()) {
        userCom = (
          <div class="relative">
            <er-dropdown
              dropMode={'hover'}
              v-slots={{
                default: () => {
                  let user = systemIns.getUserInfo().user
                  let com = (
                    <button
                      id="user-menu-button"
                      class="flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md transition-colors"
                    >
                      <img
                        src={user.avatar} //
                        alt="用户头像"
                        class="h-40 w-40 rounded-full mr-2"
                      />
                      <span>{user.username}</span>
                      <svg
                        class="h-40 w-5 ml-1 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  )
                  return com
                },
                dropdown: () => {
                  let com = (
                    <div
                      class="origin-top-right absolute right-0 mt-2 w-200 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
                      id="user-menu"
                    >
                      <div
                        onClick={() => {
                          // curNav.value = 'profile'
                          systemIns.routeTo('/companyUserinfo') //
                        }}
                        href="#profile"
                        class="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700"
                      >
                        个人资料
                      </div>
                      <div
                        onClick={() => {
                          curNav.value = 'account' //账号
                        }}
                        class="block px-4 py-2 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        账号设置
                      </div>
                      <div class="border-t border-gray-100 dark:border-gray-700 "></div>
                      <div
                        onClick={() => {
                          systemIns.logout() //
                        }}
                        class="cursor-pointer block px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        退出登录
                      </div>
                    </div>
                  )
                  return com
                },
              }}
            ></er-dropdown>
          </div>
        )
      } else {
        userCom = (
          <div class="space-x-2 flex">
            <div
              onClick={() => {
                systemIns.routeTo('/companyLogin') //
              }}
              href="#login"
              class="cursor-pointer px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-colors"
            >
              登录
            </div>
            <div
              onClick={() => {
                systemIns.routeTo('/companyRegister') //
              }}
              class="cursor-pointer px-4 py-2 border border-indigo-500 text-indigo-500 hover:bg-indigo-50 rounded-md transition-colors"
            >
              注册
            </div>
          </div>
        )
      }
      let name = systemIns.getUserInfo()?.user?.companyCnName
      let headerCom = (
        <div class="bg-gray-100 dark:bg-gray-900">
          <header class="bg-white dark:bg-gray-800 shadow-md">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="flex justify-between h-60 items-center">
                <div class="flex items-center">
                  <img alt="" class="h-50 w-50 mr-3" />
                  <span class="text-xl font-semibold text-gray-900 dark:text-white">
                    {name}
                  </span>
                </div>

                <div class="flex items-center space-x-4">
                  {/* <button
                    class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="系统设置"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-40 w-40 text-gray-600 dark:text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0a1.724 1.724 0 002.592 1.027 1.724 1.724 0 012.168.628c.58.784.196 1.853-.794 2.012a1.724 1.724 0 00-1.244 1.596v2.062c0 .833-.673 1.506-1.506 1.506h-2.062a1.724 1.724 0 00-1.596 1.244c-.159.99-1.228 1.374-2.012.794a1.724 1.724 0 00-1.027-2.592c-.921-.3-.921-1.603 0-1.902a1.724 1.724 0 001.244-1.596V6.833c0-.833.673-1.506 1.506-1.506h2.062a1.724 1.724 0 001.596-1.244c.159-.99 1.228-1.374 2.012-.794z"
                      />
                    </svg>
                  </button> */}
                  {userCom}
                </div>
              </div>
            </div>
          </header>
        </div>
      )
      let insComs = isInstallApp.value.map((row) => {
        let _c = getAppCom(row, true)
        return _c
      })
      if (curNav.value != 'install') {
        insComs = null
      } //
      let allCom = allApp.value.map((row) => {
        let _c = getAppCom(row)
        return _c
      })
      if (curNav.value != 'all') {
        allCom = null
      }
      let com = (
        <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
          {headerCom}
          <div class=" bg-gray-100 dark:bg-gray-900 flex flex">
            <aside class="w-250 bg-white dark:bg-gray-800 p-6">
              <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                我的应用
              </h2>
              <nav class="space-y-2">
                <div
                  onClick={() => (curNav.value = 'install')}
                  class={_class('install')}
                >
                  已安装应用
                </div>
                <div
                  onClick={() => (curNav.value = 'all')}
                  class={_class('all')}
                >
                  可安装应用
                </div>
              </nav>
            </aside>

            <main class="flex-1 p-6 overflow-auto">
              {insComs}
              {allCom}
            </main>
          </div>
        </div>
      )
      return com
    }
  },
})
