import { defineComponent, KeepAlive } from 'vue'
import designVue from './design'
export default defineComponent({
  name: 'PlatformIndex',
  components: {
    designVue, //
    KeepAlive,
  },
  setup() {
    return () => {
      
      let com = <div>404</div>
      return com //
    }
  },
})
