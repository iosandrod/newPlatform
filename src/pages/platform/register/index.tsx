import { system } from '@/system'
import { Form } from '@ER/form'
import FormCom from '@ER/formCom'
import { defineComponent, onMounted, reactive, ref } from 'vue'

export default defineComponent({
  setup(props, ctx) {
    let uName = Date.now().toString().slice(0, 4)
    let d = reactive({
      companyName: 'newC',
      companyCnName: '新公司',
      username: uName, //
      email: '1151685410@qq.com',
      password: '1',
      confirmPassword: '1', //
    })
    let fn = async () => {
      let d = await system.createCaptcha('users_create')
      _html.value = d.data
      vText.value = d.text //
    }
    onMounted(async () => {
      await fn()
    })
    const fConfig = {
      itemSpan: 24, //
      labelWidth: 70,
      items: [
        {
          field: 'companyName',
          label: '公司名称',
          required: true,
        },
        {
          field: 'companyCnName',
          label: '公司中文名',
          required: true,
        },
        {
          field: 'username', //
          label: '管理账号',
          required: true,
        },
        {
          field: 'email',
          label: '邮箱',
          required: true,
        },
        {
          field: 'password',
          label: '密码',
          required: true,
        },
        {
          field: 'confirmPassword',
          label: '确认密码',
          required: true,
        },
        {
          field: '_captcha',
          label: '验证码',
          required: true,
        },
      ],
      validate: async (config) => {
        let data = config.data
        let password = data.password //
        let confirmPassword = data.confirmPassword //
        if (password != confirmPassword) {
          return '密码校验不一致' //
        }
      },
      data: d, //
    }
    const buttons = [
      {
        label: '注册',
        fn: async () => {
          let _d = d
          let _f1: Form = _f.value as any
          await _f1.validate() //
          let res1 = await system.registerUser(_d) //
        },
      },
      {
        label: '刷新验证码',
        fn: async () => {
          await fn() //
        },
      },
    ]
    let registerFn = async () => {
      let _d = d
      let _f1: Form = _f.value as any
      await _f1.validate() //
      await system.registerUser(_d) //
    }
    let vText = ref('')
    let _html = ref('')
    let _f = ref('')
    return () => {
      let rF = <erForm ref={(e) => (_f.value = e)} {...fConfig}></erForm>
      let svg = (
        <div
          class="cursor-pointer"
          onClick={() => {
            fn() //
          }}
          v-html={_html.value}
        ></div>
      )
      let com = (
        <div class="h-full w-full flex flex-row items-center">
          <div class="w-600 "></div>
          <div class="w-500 flex flex-col">
            {rF}
            {svg}
            <div>
              <erButtonGroup items={buttons}></erButtonGroup>
            </div>
          </div>
        </div>
      )
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
              <h2 class="text-3xl font-bold text-gray-900 mb-8">注册</h2>
              <div>
                {rF}
                <div class="w-full flex justify-center">{svg}</div>
                {/* <div class="flex items-center justify-between mb-6">
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
                </div> */}
                <button
                  onClick={registerFn}
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded mb-20 transition-colors"
                >
                  注册
                </button>

                <div class="flex items-center text-gray-500 mb-20">
                  <span class="flex-1 border-t"></span>
                  <span class="px-4 text-sm">
                    已有账号
                    <div
                      onClick={() => {
                        system.routeTo('companyLogin') //
                      }}
                      href="#"
                      class="text-blue-600 cursor-pointer"
                    >
                      立即登录
                    </div>
                  </span>
                  <span class="flex-1 border-t"></span>
                </div>

                {/* <div class="flex justify-center space-x-6">
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
                 
                </div> */}
              </div>
            </div>
          </div>
        </div>
      )
      return _com 
    }
  },
})
