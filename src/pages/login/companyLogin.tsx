import ButtonGroupCom from '@/buttonGroup/buttonGroupCom'
import { system } from '@/system'
import { defineComponent, reactive, ref } from 'vue'

export default defineComponent({
  setup(props) {
    let data = reactive({
      loginType: 'email', //
      email: '1151685410@qq.com',
      password: '1',
    })
    let loginFConfig = {
      data: data,
      items: [
        {
          label: '登录方式',
          field: 'loginType',
          type: 'select',
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
        },
        {
          field: 'password',
          type: 'string',
          label: '密码', //
          options: {
            password: true,
          },
        },
        {
          field: '_captcha',
          label: '验证码',
          type: 'string',
        },
      ],
      itemSpan: 24,
    }
    let cdata = ref('')
    let code = ref('')
    let fn = async () => {
      let _res = await system.createCaptcha('authentication_create')
    }
    let buttons = [
      {
        label: '登录',
        fn: async () => {
          let _data = data
          let _res = await system.loginUser(_data)
        },
      },
    ]
    return () => {
      let fc = <erForm {...loginFConfig}></erForm>
      let btnCom = <ButtonGroupCom items={buttons}></ButtonGroupCom>
      let com = (
        <div class="flex flex-row h-full w-full justify-center items-center">
          <div class="w-300 flex flex-col">
            {fc}
            {btnCom}
          </div>
        </div>
      )
      return com
    }
  },
})
