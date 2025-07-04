import { defineComponent, KeepAlive } from 'vue'
import lowcode from '@/pages/platform/lowcode'
import designVue from '@/pages/platform/design'
export default defineComponent({
  name: 'PlatformAdminIndex',
  components: {
    //
    lowcode, 
    designVue, //
    KeepAlive,
  },
  setup() {
    return () => {
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
