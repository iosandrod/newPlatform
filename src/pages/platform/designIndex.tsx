import { defineComponent, inject, KeepAlive, onMounted, computed } from 'vue'
import lowcode from '@/pages/platform/lowcode'
import designVue from '@/pages/platform/design'
import { System } from '@/system'
import unLogin from './unLogin'
export default defineComponent({
  name: 'PlatformAdminIndex',
  components: {
    //
    lowcode,
    unLogin,
    designVue,//
    KeepAlive,
  },
  setup() {
    let sys: System = inject('systemIns')
    let isLogin = computed(() => {
      return sys.getIsLogin()
    })
    onMounted(() => {})
    return () => {
      if (isLogin.value == false) {
        return <unLogin></unLogin>
      }
      let com = (
        <div class="w-full h-full">
          <lowcode
            v-slots={{
              default: (path) => {
                let _com = (
                  <KeepAlive>
                    <designVue key={path}></designVue>
                  </KeepAlive>
                )
                return _com
              },
            }}
          ></lowcode>
        </div>
      )
      return com //
    }
  },
})
