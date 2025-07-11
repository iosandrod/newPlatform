// import { System } from '@/system'
// import { defineComponent, inject, onMounted, reactive, ref } from 'vue'

import { defineComponent, reactive } from 'vue'
import GlobalLogin from '../globalLogin'
import { formConfig } from '@ER/formEditor/testData'
import { system } from '@/system'

export default defineComponent({
  name: 'PlatformLogin',
  components: {
    GlobalLogin, //
  },
  setup() {
    let loginMail = system.getLocalItem('loginEmail')
    let data = reactive({
      email: loginMail || '',
    })
    let fConfig = reactive({
      labelWidth: 70,
      items: [
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
    return () => {
      let com = <GlobalLogin formData={data} formConfig={fConfig}></GlobalLogin>
      return com
    }
  },
})
