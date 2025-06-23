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
import { defineComponent, inject, ref } from 'vue'

export default defineComponent({
  name: 'Home',
  setup() {
    const apps = ref<any[]>([
      {
        id: 1,
        name: 'erp',
        cnName: '低代码ERP应用配置',
        description: '配置化构建应用', //
        icon: 'el-icon-data-analysis',
      },
    ])

    // 菜单激活状态
    const activeHeader = ref('1')
    const activeSidebar = ref('1')

    // 用户登录状态及信息
    const isLoggedIn = ref(false)
    const user = ref({
      name: 'User Name',
      avatar: 'https://via.placeholder.com/40',
    })

    // 登录与登出方法 (替换为实际逻辑)
    function login() {
      isLoggedIn.value = true
    }

    function logout() {
      isLoggedIn.value = false
    }
    let systemIns: System = inject('systemIns')
    return () => {
      /*   let com=<div class="flex flex-col h-screen">
    <header
      class="flex items-center justify-between px-5 text-white bg-blue-600 shadow-md h-60"
    >
      <div class="text-2xl font-bold">低代码应用中心</div>
      <el-menu
        mode={"horizontal"}
        // :default-active="activeHeader"
        default-active="1"
        background-color="transparent"
        text-color="#ffffff"
        active-text-color="#ffe58f"
        class="flex-1 mx-10"
      >
        <el-menu-item index="1" class="px-4">Home</el-menu-item>
        <el-menu-item index="2" class="px-4">About</el-menu-item>
        <el-menu-item index="3" class="px-4">Contact</el-menu-item>
      </el-menu>
      <div class="flex items-center ml-5">
        <template v-if="isLoggedIn">
          <div class="flex items-center space-x-2">
            <el-dropdown
              type="primary"
              @click="handleCommand"
              placement="bottom-end"
              class="h-40 px-4 rounded-lg"
            >
              <span class="flex items-center space-x-2">
                <span class="font-medium text-white">
                  {{ systemIns.getUserName() }}
                </span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile" @click="(e) => {}">
                    个人中心
                  </el-dropdown-item>
                  <el-dropdown-item command="support">
                    联系客服
                  </el-dropdown-item>
                  <el-dropdown-item divided command="author">
                    联系作者
                  </el-dropdown-item>
                  <el-dropdown-item command="promo">获取优惠</el-dropdown-item>
                  <el-dropdown-item
                    @click="
                      (e) => {
                        systemIns.logout() //
                      }
                    "
                    command="logout"
                  >
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
        <template v-else>
          <el-button type="primary" size="small" @click="login">
            Login
          </el-button>
        </template>
      </div>
    </header>

    <div class="flex flex-1">
      <!-- Sidebar Menu -->
      <aside class="bg-gray-100 w-200">
        <el-menu :default-active="activeSidebar" class="w-full">
          <el-menu-item index="1" class="flex items-center h-40 px-4">
            <i class="mr-2 el-icon-menu"></i>
            应用列表
          </el-menu-item>
        </el-menu>
      </aside>

      <main class="flex-1 p-5 overflow-auto bg-gray-50">
        <div
          class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-20"
        >
          <el-card
            v-for="app in apps"
            :key="app.id"
            class="transition-transform transform hover:-translate-y-2"
          >
            <div class="flex items-center mb-2">
              <i :class="app.icon + ' text-24 mr-2'" />
              <span class="text-lg font-semibold">{{ app.cnName }}</span>
            </div>
            <div class="mb-4 text-sm">{{ app.description }}</div>
            <div class="text-right">
              <el-button
                type="primary"
                @click="() => systemIns.installApp(app.name)"
                size="small"
              >
                安装
              </el-button>
              <el-button
                type="primary"
                @click="() => systemIns.openApp(app.name)"
                size="small"
              >
                进入
              </el-button>
            </div>
          </el-card>
        </div>
      </main>
    </div>

    <footer
      class="flex items-center justify-center h-40 text-gray-500 bg-gray-100"
    >
      © 2025 MyApp Platform
    </footer>
  </div> */
      let leftMenu = (
        <ElMenu
          mode="horizontal"
          default-active={activeHeader.value}
          background-color="transparent"
          text-color="#ffffff"
          active-text-color="#ffe58f"
          class="flex-1 mx-10"
        >
          <ElMenuItem index="1" class="px-4">
            Home
          </ElMenuItem>
          <ElMenuItem index="2" class="px-4">
            About
          </ElMenuItem>
          <ElMenuItem index="3" class="px-4">
            Contact
          </ElMenuItem>
        </ElMenu>
      )
      let rightMenu = null
      if (systemIns.getIsLogin()) {
        rightMenu = (
          <div class="flex items-center space-x-2">
            <ElDropdown
              type="primary"
              placement="bottom-end"
              class="h-40 px-4 rounded-lg"
              v-slots={{
                dropdown: () => {
                  // return (
                  //   <ElDropdownMenu
                  //     onClick={(e) => {
                  //       console.log(e)
                  //       let command = e.command

                  //     }}
                  //   >
                  //     <ElDropdownItem command="profile">
                  //       个人中心
                  //     </ElDropdownItem>
                  //     <ElDropdownItem command="support">
                  //       联系客服
                  //     </ElDropdownItem>
                  //     <ElDropdownItem divided command="author">
                  //       联系作者
                  //     </ElDropdownItem>
                  //     <ElDropdownItem command="promo">获取优惠</ElDropdownItem>
                  //     <ElDropdownItem command="logout">退出登录</ElDropdownItem>
                  //   </ElDropdownMenu>
                  // )
                  let items = systemIns.getUserDropDown()
                  return (
                    <ElDropdownMenu>
                      {items.map((item) => {
                        //
                        return (
                          <ElDropdownItem
                            onClick={() => item.fn()}
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
            <ElButton type="primary" onClick={login}>
              Login
            </ElButton>
          </div>
        )
      }
      let headerCom = (
        <header class="flex items-center justify-between px-5 text-white bg-blue-600 shadow-md h-60">
          <div class="text-2xl font-bold">低代码应用中心</div>
          {leftMenu}
          <div class="flex items-center ml-5">{rightMenu}</div>
        </header>
      )
      let footerCom = (
        <footer class="flex items-center justify-center h-40 text-gray-500 bg-gray-100">
          © 2025 MyApp Platform
        </footer>
      )
      let mainLayout = (
        <div class="flex flex-1">
          <aside class="bg-gray-100 w-200">
            <ElMenu class="w-full" default-active={activeSidebar.value}>
              <ElMenuItem index="1" class="flex items-center h-40 px-4">
                <i class="mr-2 el-icon-menu"></i>
                应用列表
              </ElMenuItem>
            </ElMenu>
          </aside>
          <main class="flex-1 p-5 overflow-auto  bg-gray-50">
            <div class="flex flex-wrap">
              {apps.value.map((app) => {
                return (
                  <ElCard class="transition-transform transform  ">
                    <div class="flex items-center mb-2">
                      <i class={app.icon + ' text-24 mr-2'} />
                      <span class="text-lg font-semibold">{app.cnName}</span>
                    </div>
                    <div class="mb-4 text-sm">{app.description}</div>
                    <div class="text-right">
                      <ElButton
                        type="primary"
                        class="bg-blue-500"
                        onClick={() => systemIns.installApp(app.name)}
                        size="small"
                      >
                        <div class="">安装</div>
                      </ElButton>
                      <ElButton
                        class="bg-blue-500"
                        type="primary"
                        onClick={() => systemIns.openApp(app.name)}
                        size="small"
                      >
                        <div class="">进入</div>
                      </ElButton>
                    </div>
                  </ElCard>
                )
              })}
            </div>
          </main>
        </div>
      )
      let mainCom = (
        <div class="flex flex-col h-screen">
          {headerCom}
          {mainLayout}
          {footerCom}
        </div>
      )
      return mainCom //
    }
  },
})
