import { System } from '@/system'
import { defineComponent, inject, onMounted, reactive, ref } from 'vue'

export default defineComponent({
  name: 'Login',
  setup() {
    let localUserid = localStorage.getItem('userid')
    let _opt = ref([])
    const data = reactive({
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
        {
          field: 'userid',
          type: 'select',
          label: '选择账套',
          required: true,
          options: {
            options: _opt,
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

        { field: '_captcha', label: '验证码', type: 'string' },
      ],
      itemSpan: 24,
    })
    let system: System = inject('systemIns') //
    async function getCompanyFn() {
      // console.log(system.getHttp().getClientBaseUrl())//
      let allCompany = await system.getAllAccountCompany({
        appName: 'erp',
      })
      let appOptions = allCompany.map((item: any) => {
        let v = item.userid
        let label = item.cnName //
        if (!label) {
          //
          label = `账套${v}`
        }
        return {
          label: label, //
          value: item.userid, //
        }
      })
      _opt.value = appOptions //
    }

    onMounted(async () => {
      await getCompanyFn()
    })

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
