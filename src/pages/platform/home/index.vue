<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <header
      class="flex items-center justify-between px-5 text-white bg-blue-600 shadow-md h-60"
    >
      <!-- Logo -->
      <div class="text-2xl font-bold">低代码应用中心</div>
      <!-- Navigation Menu -->
      <el-menu
        mode="horizontal"
        :default-active="activeHeader"
        background-color="transparent"
        text-color="#ffffff"
        active-text-color="#ffe58f"
        class="flex-1 mx-10"
      >
        <el-menu-item index="1" class="px-4">Home</el-menu-item>
        <el-menu-item index="2" class="px-4">About</el-menu-item>
        <el-menu-item index="3" class="px-4">Contact</el-menu-item>
      </el-menu>
      <!-- User Module -->
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

    <!-- Main Layout -->
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

      <!-- Content Area -->
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
            <div class="mb-4 text-sm text-gray-600">{{ app.description }}</div>
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

    <!-- Footer -->
    <footer
      class="flex items-center justify-center h-40 text-gray-500 bg-gray-100"
    >
      © 2025 MyApp Platform
    </footer>
  </div>
</template>

<script setup lang="ts">
import { System } from '@/system'
import { onMounted } from 'vue'
import { computed, inject } from 'vue'
import { ref } from 'vue' //
let systemIns: System = inject('systemIns') //
interface AppItem {
  id: number
  name: string
  description: string
  icon: string
  cnName: string //
} //
onMounted(async () => {
  let allApp = await systemIns.getAllApps()
  console.log(allApp) //
})
// 应用列表数据
const apps = ref<AppItem[]>([
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
const isLoggedIn = computed(() => {
  let loginInfo = systemIns.loginInfo
  if (loginInfo) {
    return true
  }
  return false
})

let user = computed(() => {
  let loginInfo = systemIns.loginInfo
  if (loginInfo) {
    return loginInfo
  }
  return {} //
})

// 登录与登出方法 (替换为实际逻辑)
function login() {
  systemIns.routeTo('/login') //
}

function logout() {
  systemIns.logout() //
}

function handleCommand(command: string) {
  // if (command === 'profile') {
  //   // 跳转到个人中心
  //   console.log('Go to profile')
  // } else if (command === 'logout') {
  //   logout() //
  // }
}
</script>
