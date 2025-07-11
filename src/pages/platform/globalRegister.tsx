import { system } from '@/system'
import { Form } from '@ER/form'
import FormCom from '@ER/formCom'
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { faker } from '@faker-js/faker'

export default defineComponent({
  setup() {
    let radomName = ''
    const d = reactive({
      username: radomName, //
      email: radomName,
      password: radomName,
      confirmPassword: radomName, //
      _captcha: radomName, ///
    })
    const vText = ref('')
    const _html = ref('')
    const _f = ref(null)
    const generateUser = () => {
      let p = '123456'
      let obj = {
        username: faker.internet.userName(), // 用户名
        email: faker.internet.email(), // 邮箱
        phone: '+86 ' + faker.phone.number(), // 手机号
        password: p, // 密码（8位随机）
        avatar: faker.image.avatar(), // 头像URL
        company: faker.company.name(), // 公司名
        address: faker.location.city() + ' ' + faker.location.streetAddress(), // 地址
        createdAt: faker.date.past().toISOString(), // 注册时间
        confirmPassword: p,
      }
      Object.assign(d, obj) //
    }
    const loadCaptcha = async () => {
      const res = await system.createCaptcha('users_create')
      _html.value = res.data
      vText.value = res.text
    }

    onMounted(loadCaptcha)

    const fConfig = {
      itemSpan: 24,
      labelWidth: 70,
      items: [
        {
          field: 'username',
          label: '用户名',
          required: true,
        },
        { field: 'email', label: '邮箱', required: true },
        {
          field: 'password',
          label: '密码',
          required: true,
          options: {
            password: true,
          },
        },

        {
          field: 'confirmPassword',
          label: '确认密码',
          required: true,
          options: {
            password: true,
          },
          validate: ({ data }) => {
            if (data.password !== data.confirmPassword) {
              return '密码校验不一致'
            }
          },
        },
        { field: '_captcha', label: '验证码', required: true },
      ],
      data: d,
    }

    const registerFn = async () => {
      const formInstance = _f.value
      await formInstance.validate()
      await system.registerUser(d)
    }
    return () => (
      <div class="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center">
        <div class="bg-white rounded-2xl shadow-2xl overflow-hidden flex max-w-4xl w-full">
          <div class="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white justify-center items-center p-8">
            <img src="/images/loginLogo.png" alt="Logo" class="w-40 mb-4" />
            <h2
              onClick={() => {
                generateUser() //
              }}
              class="text-2xl font-semibold"
            >
              欢迎加入
            </h2>
            <p class="text-sm mt-2 opacity-80">提升企业效率 从现在开始</p>
          </div>

          <div class="w-full lg:w-1/2 p-10">
            <h2 class="text-3xl font-bold text-gray-800 mb-6 flex justify-center">
              创建账户
            </h2>
            <div class="flex-1">
              <erForm ref={(el) => (_f.value = el)} {...fConfig} />
            </div>

            <div
              class="flex justify-center my-4 cursor-pointer"
              onClick={loadCaptcha}
            >
              <div innerHTML={_html.value}></div>
            </div>

            <button
              onClick={registerFn}
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow transition duration-200"
            >
              注册
            </button>

            <div class="flex items-center justify-between mt-6 text-sm text-gray-500">
              <span class="flex-1 border-t"></span>
              <span class="px-4">已有账号？</span>
              <span
                class="text-indigo-600 cursor-pointer"
                onClick={() => system.routeTo('login')}
              >
                立即登录
              </span>
              <span class="flex-1 border-t"></span>
            </div>
          </div>
        </div>
      </div>
    )
  },
})
