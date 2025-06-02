import ButtonGroupCom from '@/buttonGroup/buttonGroupCom'
import { system } from '@/system'
import { defineComponent, onMounted, reactive, ref } from 'vue' //
export default defineComponent({
  setup(props) {
    let data = reactive({
      appName: 'platform', //
      userid: 0,
      loginType: 'email',
      email: '1151685410@qq.com',
      password: '1',
      _unUseCaptcha: true,
    })
    let loginFConfig: any = reactive({
      labelWidth: 70,
      data: data,
      items: [
        {
          label: '登录方式',
          field: 'loginType',
          type: 'select',
          required: true,
          options: {
            options: [
              {
                label: '邮箱登录',
                value: 'email',
              },
              {
                label: '用户名登录',
                value: 'username',
              },
            ],
          },
        },
        {
          field: 'email',
          type: 'string',
          label: '邮箱',
          required: true,
        },
        {
          field: 'password',
          type: 'string',
          label: '密码', //
          required: true,
          options: {
            password: true,
          },
        },
        {
          field: 'userid', //
          type: 'select',
          options: {
            options: [],
          },
          label: '公司',
          required: true,
        },
        {
          field: 'appName',
          type: 'select',
          options: {
            options: [],
          },
          label: '应用',
          required: true, //
        },
        {
          field: '_captcha',
          label: '验证码',
          type: 'string',
          // required: true, //
        },
      ],
      itemSpan: 24,
    })
    let getCompanyFn = async () => {
      let allCompany = await system.getAllRegisterCompany()
      let appOptions = allCompany.map((item: any) => {
        return {
          label: item.appCnName || item.appName,
          value: item.appName,
        }
      })
      let companyOptions = allCompany.map((item: any) => {
        return {
          label: item.companyCnName || item.companyName,
          value: item.userid, //
        }
      })
      loginFConfig.items[3].options.options = companyOptions //
      loginFConfig.items[4].options.options = appOptions
    }
    onMounted(async () => {
      await getCompanyFn() //
    })
    let cdata = ref('')
    let code = ref('')
    let fn = async () => {
      let _res = await system.createCaptcha('authentication_create')
      let data = _res.data
      code.value = data
      cdata.value = _res.text
    }
    onMounted(async () => {
      await fn() //
    })
    let loginFn = async () => {
      let _f: any = fins.value
      await _f.validate()
      let _data = data
      // let appName = _data.appName
      // let userid = _data.company
      await system.loginUser(_data)
    }
    let buttons = [
      // {
      //   label: '登录',
      //   fn: async () => {
      //     let _f: any = fins.value
      //     await _f.validate() //
      //     let _data = data
      //     let _res = await system.loginUser(_data)
      //   },
      // },
      // {
      //   label: '刷新验证码',
      //   fn: async () => {
      //     fn()
      //   },
      // },
    ]
    let fins = ref('')
    return () => {
      let fc = <erForm ref={fins} {...loginFConfig}></erForm>
      let capt = <div onClick={fn} v-html={code.value}></div>
      // let com = (
      //   <div class="flex flex-row h-full w-full justify-center items-center">
      //     <div class="w-300 flex flex-col">
      //       {fc}
      //       {capt}
      //       {btnCom}
      //     </div>
      //   </div>
      // )
      // return com
      let _com = (
        <div class="min-h-screen bg-gray-100 flex items-center justify-center">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden flex max-w-4xl w-full">
            <div class="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-blue-500 to-blue-600 text-white ">
              <div class="h-full w-full">
                <img
                  src="/images/loginLogo.png"
                  alt="Bangboss"
                  class="h-full mb-6"
                />
              </div>
            </div>

            <div class="w-full lg:w-1/2 p-8">
              <h2 class="text-3xl font-bold text-gray-900 mb-8">登录</h2>
              <div>
                {fc}
                <div class="w-full flex justify-center">{capt}</div>
                <div class="flex items-center justify-between mb-6">
                  <label class="flex items-center text-gray-700">
                    <input
                      type="checkbox"
                      class="h-16 w-16 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span class="ml-2">记住我</span>
                  </label>
                  <div href="#" class="text-blue-600 cursor-pointer">
                    忘记密码?
                  </div>
                </div>
                <button
                  onClick={loginFn}
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded mb-20 transition-colors"
                >
                  登录
                </button>

                <div class="flex items-center text-gray-500 mb-20">
                  <span class="flex-1 border-t"></span>
                  <span class="px-4 text-sm">
                    第三方登录 或
                    <div
                      onClick={() => {
                        system.routeTo('companyRegister') //
                      }}
                      href="#"
                      class="text-blue-600 cursor-pointer"
                    >
                      立即注册
                    </div>
                  </span>
                  <span class="flex-1 border-t"></span>
                </div>

                <div class="flex justify-center space-x-6">
                  <button type="button">
                    <img
                      src="/images/wcLogin.png"
                      alt="WeChat"
                      class="h-20 w-20"
                    />
                  </button>
                  <button type="button">
                    <img src="/images/qqLogin.png" alt="QQ" class="h-20 w-20" />
                  </button>
                  {/* <button type="button">
                    <img src="dingding-icon.png" alt="钉钉" class="h-8 w-8" />
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
      return _com //
    }
  },
})
