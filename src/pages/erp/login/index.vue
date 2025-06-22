<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div
      class="flex w-full max-w-4xl overflow-hidden bg-white rounded-lg shadow-lg"
    >
      <!-- 左侧宣传/Logo 区 -->
      <div
        class="flex-col  w-1/2 text-white  bg-gradient-to-br from-blue-500 to-blue-600"
      >
        <div class="w-full h-full">
          <!-- <img alt="Bangboss" class="h-full mb-6" /> -->
        </div>
      </div>
      <!-- 右侧表单区 -->
      <div class="flex flex-col w-1/2 h-full p-8  ">
        <h2 class=" w-full flex justify-center mb-8 text-3xl font-bold text-gray-900">登录</h2>
        <!-- 登录表单组件 -->
        <div>
          <er-form ref="fins" v-bind="loginFConfig" />
        </div>
        <!-- 验证码 -->
        <div class="flex justify-center w-full my-4" v-html="code"></div>
        <!-- 记住我 & 忘记密码 -->
        <div class="flex items-center justify-between mb-6">
          <label class="flex items-center text-gray-700">
            <input
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="ml-2">记住我</span>
          </label>
          <div
            class="text-blue-600 cursor-pointer"
            @click="system.routeTo('register')"
          >
            忘记密码?
          </div>
        </div>
        <!-- 登录按钮 -->
        <button
          @click="loginFn"
          class="cursor-pointer w-full py-2 mb-8 font-medium text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
        >
          登录
        </button>
        <!-- 分割线 & 注册入口 -->
        <div class="flex items-center mb-8 text-gray-500">
          <span class="flex-1 border-t"></span>
          <span class="px-4 text-sm">
            第三方登录 或
            <span
              class="text-blue-600 cursor-pointer"
              @click="system.routeTo('register')"
            >
              立即注册
            </span>
          </span>
          <span class="flex-1 border-t"></span>
        </div>
        <!-- 第三方登录按钮 -->
        <div class="flex justify-center space-x-6">
          <button type="button">
            <img alt="WeChat" class="w-10 h-10" />
          </button>
          <button type="button">
            <img alt="QQ" class="w-10 h-10" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { system } from '@/system'

interface Company {
  appName: string
  appCnName?: string
  companyName: string
  companyCnName?: string
  userid: number
}
onMounted(() => {
  // let allCompany
})
const data = reactive({
  appName: 'platform',
  userid: 1,
  loginType: 'email', 
  email: '1151685410@qq.com',
  password: '1',
  _unUseCaptcha: true,
})

const loginFConfig: any = reactive({
  labelWidth: 70,
  data,
  items: [
    {
      field: 'email', //
      type: 'string',
      label: '账号', //
      required: true,
    },
    {
      field: 'password',
      type: 'string', //
      label: '密码',
      required: true,
      options: { password: true },
    },
    {
      field: 'userid',
      // type: 'select',
      type: 'string',
      label: '账套',
      required: true,
      // options: { options: [] },
    },
    { field: '_captcha', label: '验证码', type: 'string' },
  ],
  itemSpan: 24,
})
onMounted(async () => {
  //
  let allApp = await system.getAllAppCompany({
    appName: 'erp',
  })
  console.log(allApp) //
})
async function getCompanyFn() {
  // const all: Company[] = await system.getAllRegisterCompany()
  // loginFConfig.items[3].options.options = all.map((item) => ({
  //   label: item.companyCnName || item.companyName,
  //   value: item.userid,
  // }))
  // loginFConfig.items[4].options.options = all.map((item) => ({
  //   label: item.appCnName || item.appName,
  //   value: item.appName,
  // }))
}

onMounted(getCompanyFn)

const code = ref<string>('')
const cdata = ref<string>('')

async function loadCaptcha() {
  const res = await system.createCaptcha('authentication_create')
  code.value = res.data
  cdata.value = res.text
}

onMounted(loadCaptcha)

const fins = ref<any>(null)

async function loginFn() {
  const form = fins.value as any
  await form.validate()
  await system.loginUser(data)
}
</script>
