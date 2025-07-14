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
    let data = reactive({
      loginType: 'email',
      email: 'admin',
      password: 'admin', //
      userid: localUserid, //
      _unUseCaptcha: true,
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
      let com = <globalLogin formData={data} onLogin={loginFn}></globalLogin>
      return com //
    } //
  },
})
