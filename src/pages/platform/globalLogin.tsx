import { System, system } from '@/system'
import {
  computed, //
  defineComponent,
  inject,
  onMounted,
  reactive,
  ref,
} from 'vue'

export default defineComponent({
  name: 'GlobalLogin',
  props: {
    formConfig: Object,
    formData: {
      type: Object,
      default: () => ({}),
    },
    onLogin: Function,
    onRegister: Function,
  },
  setup(props) {
    //
    const data = computed(() => props.formData)
    const loginFConfig = reactive(
      props.formConfig || {
        labelWidth: 70,
        items: [
          {
            field: 'userid',
            type: 'select',
            label: '账套',
            required: true,
            options: { options: [] },
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
      },
    )

    const code = ref('')
    const cdata = ref('')
    const fins = ref(null)

    const system: System = inject('systemIns')

    const loadCaptcha = async () => {
      const res = await system.createCaptcha('authentication_create')
      code.value = res.data
      cdata.value = res.text
    }
    const getCompanyFn = async () => {
      const allCompany = await system.getAllAccountCompany({ getLabel: true })
      loginFConfig.items[0].options.options = allCompany
    }

    const loginFn = async () => {
      const form = fins.value
      await form.validate()
      if (typeof props.onLogin === 'function') {
        await props.onLogin(data.value)
      } else {
        await system.loginUser(data.value) //
      }
    }

    onMounted(async () => {
      await getCompanyFn()
      await loadCaptcha()
    })

    return () => (
      <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200">
        <div class="max-w-5xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex">
          <div class="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-10 items-center justify-center">
            <div class="text-center">
              <img
                src="/images/loginLogo.png"
                alt="Logo"
                class="w-36 mx-auto mb-6 rounded-lg shadow-lg"
              />
              <h2 class="text-3xl font-bold mb-2">欢迎回来</h2>
              <p class="text-sm opacity-80">高效管理您的企业账户</p>
            </div>
          </div>

          <div class="w-full lg:w-1/2 p-10 flex flex-col justify-center">
            <h2 class="text-4xl font-bold text-gray-800 mb-6 flex justify-center">
              账户登录
            </h2>

            <er-form
              ref={(el) => (fins.value = el)}
              {...loginFConfig}
              data={data.value}
            />

            <div
              class="my-4 flex justify-center cursor-pointer"
              innerHTML={code.value}
              onClick={loadCaptcha}
            ></div>

            <div class="flex items-center justify-between text-sm text-gray-600 mb-4">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="ml-2">记住我</span>
              </label>
              <div
                class="text-indigo-600 cursor-pointer hover:underline"
                onClick={() => system.routeTo('register')}
              >
                忘记密码？
              </div>
            </div>

            <button
              onClick={loginFn}
              class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
            >
              登录
            </button>

            <div class="mt-6 flex items-center text-gray-500 text-sm">
              <span class="flex-1 border-t"></span>
              <span class="px-4">
                没有账号？
                <span
                  class="text-indigo-600 cursor-pointer hover:underline ml-1"
                  onClick={() => system.routeTo('/register')}
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
  },
})
