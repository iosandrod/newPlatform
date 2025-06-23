import { defineComponent, inject, onMounted, reactive, ref } from 'vue'

export default defineComponent({
  name: 'Login',
  setup() {
    let localUserid = localStorage.getItem('userid')
    const data = reactive({
      // appName: 'platform',
      appName: 'erp',
      loginType: 'email',
      email: '1151685410@qq.com',
      password: '1',
      userid: localUserid, //
      _unUseCaptcha: true,
    })
    const loginFConfig: any = reactive({
      labelWidth: 70,
      data,
      items: [
        // {
        //   label: '登录方式',
        //   field: 'loginType',
        //   type: 'select',
        //   required: true,
        //   options: {
        //     options: [
        //       { label: '邮箱登录', value: 'email' },
        //       { label: '用户名登录', value: 'username' },
        //     ],
        //   },
        // },
        {
          field: 'userid',
          type: 'select',
          label: '选择账套',
          required: true,
          options: {
            options: [
              {
                label: '默认账套',
                value: 1,
              },
            ], //
          },
        },
        { field: 'email', type: 'string', label: '账号', required: true },
        {
          field: 'password',
          type: 'string',
          label: '密码',
          required: true,
          options: { password: true },
        },
        // {
        //   field: 'userid',
        //   type: 'select',
        //   label: '公司',
        //   required: true,
        //   options: { options: [] },
        // },
        // {
        //   field: 'appName',
        //   type: 'select',
        //   label: '应用',
        //   required: true,
        //   options: { options: [] },
        // },
        { field: '_captcha', label: '验证码', type: 'string' },
      ],
      itemSpan: 24,
    })
    async function getCompanyFn() {
      // const all: any[] = await system.getAllRegisterCompany()
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
    let system: any = inject('systemIns')
    return () => {
      let _com = (
        <div class="flex items-center justify-center min-h-screen bg-gray-100">
          <div class="flex w-full max-w-4xl overflow-hidden bg-white rounded-lg shadow-lg">
            <div class="flex-col hidden w-1/2 text-white lg:flex bg-gradient-to-br from-blue-500 to-blue-600">
              <div class="w-full h-full">
                <img alt="Bangboss" class="h-full mb-6" />
              </div>
            </div>
            <div class="flex flex-col w-full h-full p-8 lg:w-1/2 flex justify-center">
              <div class="flex justify-center w-full h-full p-8 lg:w-1/2">
                <h2 class="mb-8 text-3xl font-bold text-gray-900">登录</h2>
              </div>
              <div>
                <er-form
                  ref={(ref: any) => (fins.value = ref)}
                  {...loginFConfig}
                />
              </div>
              <div
                onClick={() => {
                  loadCaptcha()
                }}
                class="flex justify-center w-full my-4 cursor-pointer"
                vHtml={code.value}
              ></div>
              <div class="flex items-center justify-between mb-6">
                <label class="flex items-center text-gray-700">
                  <input
                    type="checkbox"
                    class=" text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span class="ml-2">记住我</span>
                </label>
                <div
                  class="text-blue-600 cursor-pointer"
                  // @click="system.routeTo('register')"
                  onClick={() => {
                    system.routeTo('register')
                  }}
                >
                  忘记密码?
                </div>
              </div>
              <button
                class="w-full py-2 mb-8 font-medium text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
                //   @click="loginFn"
                onClick={() => {
                  loginFn()
                }}
              >
                登录
              </button>
              <div class="flex items-center mb-8 text-gray-500">
                <span class="flex-1 border-t"></span>
                <span class="px-4 text-sm">
                  <span
                    class="text-blue-600 cursor-pointer"
                    //   @click="system.routeTo('register')"
                    onClick={() => {
                      system.routeTo('register')
                    }}
                  >
                    立即注册
                  </span>
                </span>
                <span class="flex-1 border-t"></span>
              </div>
            </div>
          </div>
        </div>
      )
      return _com
    }
  },
})
