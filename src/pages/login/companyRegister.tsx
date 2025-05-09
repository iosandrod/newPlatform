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
    let vText = ref('')
    let _html = ref('')
    let _f = ref('')
    return () => {
      let rF = <FormCom ref={(e) => (_f.value = e)} {...fConfig}></FormCom>
      let svg = <div v-html={_html.value}></div>
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
      return com
    }
  },
})
