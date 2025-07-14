import { defineComponent, KeepAlive } from 'vue'
import lowcode from '@/pages/platform/lowcode'
import designVue from '@/pages/platform/design'
import designIndex from '@/pages/platform/designIndex'
export default defineComponent({
  name: 'PlatformIndex',
  components: {
    designIndex,
  },
  setup() {
    return () => {
      let com = <designIndex></designIndex> //
      return com //
    }
  },
})
