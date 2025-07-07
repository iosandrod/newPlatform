import { defineComponent, inject, onMounted, reactive, ref } from 'vue'
import globalLogin from '@/pages/platform/globalLogin'
import { System } from '@/system'
export default defineComponent({
  name: 'GanttLogin',
  components: {
    globalLogin,
  }, //
  setup(props) {
    let localUserid = localStorage.getItem('userid') //
    let _opt = ref([])
    const data = reactive({
      loginType: 'email',
      email: '1151685410@qq.com',
      password: '1',
      userid: localUserid, //
      _unUseCaptcha: true,
    })
    const loginFConfig: any = reactive({
      labelWidth: 70,
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
      let allCompany = await system.getAllAccountCompany({
        getLabel: true,
      })
      _opt.value = allCompany //
    }
    onMounted(async () => {
      //
      await getCompanyFn()
    })
    async function loginFn(data) {
      //
      await system.loginUser(data)
    }
    return () => {
      let com = (
        <globalLogin
          formData={data}
          formConfig={loginFConfig}
          onLogin={loginFn}
        ></globalLogin>
      )
      return com //
    } //
  },
})
