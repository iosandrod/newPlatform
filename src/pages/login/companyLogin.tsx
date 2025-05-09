import { defineComponent, reactive } from 'vue'

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
      ],
      itemSpan: 24,
    }
    let buttons = []
    return () => {
      let fc = <erForm {...loginFConfig}></erForm>
      let com = (
        <div class="flex flex-row h-full w-full justify-center items-center">
          <div class="w-300">{fc}</div>
        </div>
      )
      return com
    }
  },
})
