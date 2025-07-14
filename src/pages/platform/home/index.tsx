import { System } from '@/system'
import {
  ElButton,
  ElCard,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElMenu,
  ElMenuItem,
} from 'element-plus'
import { defineComponent, inject, onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'

export default defineComponent({
  name: 'PlatformHome',
  setup() {
    // 菜单激活状态
    const activeHeader = ref('1')
    // 用户登录状态及信息
    const isLoggedIn = ref(false)
    // 登录与登出方法 (替换为实际逻辑)

    function logout() {
      isLoggedIn.value = false
    }
    let sys: System = inject('systemIns')
    onMounted(async () => {
      let route = sys.getRouter().currentRoute.path //
      console.log(route, 'testRoute') //
      if (/home$/.test(route) && [...route.match(/home/)].length < 2) {
        let router = sys.getRouter()
        router.push('/home/home') //
      }
    })
    let systemIns: System = inject('systemIns')
    return () => {
      const headerItems = systemIns.getPlatformHomeHeader()
      let _items = headerItems.map((item) => {
        return (
          <ElMenuItem
            onClick={() => {
              let name = item.name
              if (name) {
                systemIns.routeTo(`/home/${name}`) //
              }
            }}
            index={item.label}
            class="pl-10 pr-10"
          >
            {item.label}
          </ElMenuItem>
        )
      })

      let leftMenu = (
        <ElMenu
          mode="horizontal"
          default-active={activeHeader.value}
          background-color="transparent"
          text-color="#ffffff"
          active-text-color="#ffe58f"
          class="flex-1 mx-10"
        >
          {_items}
        </ElMenu>
      )
      let rightMenu = null
      if (systemIns.getIsLogin()) {
        rightMenu = (
          <div class="flex items-center space-x-2">
            <ElDropdown
              type="primary"
              placement="bottom-end"
              class="px-4 rounded-lg"
              v-slots={{
                dropdown: () => {
                  let items = systemIns.getUserDropDown()
                  return (
                    <ElDropdownMenu>
                      {items.map((item) => {
                        return (
                          <ElDropdownItem
                            onClick={() => {
                              item.fn()
                            }}
                            command={item.fn}
                          >
                            {item.label}
                          </ElDropdownItem>
                        )
                      })}
                    </ElDropdownMenu>
                  )
                },
              }}
            >
              <span class="flex items-center space-x-2">
                <span class="font-medium text-white">
                  {systemIns.getUserName()}
                </span>
              </span>
            </ElDropdown>
          </div>
        )
      } else {
        rightMenu = (
          <div class="flex items-center space-x-2">
            <ElButton
              type="primary"
              onClick={() => {
                systemIns.routeTo('/login') //
              }}
            >
              Login
            </ElButton>
          </div>
        )
      }
      let headerCom = (
        <header class="flex items-center justify-between px-5 text-white bg-blue-600 shadow-md">
          <div class="text-2xl font-bold">低代码应用中心</div>
          {leftMenu}
          <div class="flex items-center ml-5">{rightMenu}</div>
        </header>
      )
      let footerCom = (
        <footer class="flex items-center justify-center  text-gray-500 bg-gray-100">
          © 2025 MyApp Platform
        </footer>
      )
      let mainCom = (
        <div class="flex flex-col h-screen">
          {headerCom}
          <div class="flex-1 w-full">
            <RouterView></RouterView>
          </div>
          {footerCom}
        </div>
      )
      return mainCom //
    }
  },
})

