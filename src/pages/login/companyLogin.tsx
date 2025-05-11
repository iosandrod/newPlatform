import ButtonGroupCom from '@/buttonGroup/buttonGroupCom'
import { system } from '@/system'
import { defineComponent, onMounted, reactive, ref } from 'vue'

export default defineComponent({
  setup(props) {
    let data = reactive({
      loginType: 'email', //
      email: '1151685410@qq.com',
      password: '1',
      _unUseCaptcha: true,
    })
    let loginFConfig = {
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
          field: '_captcha',
          label: '验证码',
          type: 'string',
          // required: true, //
        },
      ],
      itemSpan: 24,
    }
    let cdata = ref('')
    let code = ref('')
    let fn = async () => {
      let _res = await system.createCaptcha('authentication_create')
      let data = _res.data
      code.value = data
      cdata.value = _res.text //
    }
    onMounted(async () => {
      await fn() //
    })
    let buttons = [
      {
        label: '登录',
        fn: async () => {
          let _f: any = fins.value
          console.log(_f)
          await _f.validate() //
          let _data = data
          let _res = await system.loginUser(_data)
        },
      },
      {
        label: '刷新验证码',
        fn: async () => {
          fn()
        },
      },
    ]
    let fins = ref('')
    return () => {
      let fc = <erForm ref={fins} {...loginFConfig}></erForm>
      let btnCom = <ButtonGroupCom items={buttons}></ButtonGroupCom>
      let capt = <div v-html={code.value}></div>
      let com = (
        <div class="flex flex-row h-full w-full justify-center items-center">
          <div class="w-300 flex flex-col">
            {fc}
            {capt}
            {btnCom}
          </div>
        </div>
      )
      return com
    }
  },
})
