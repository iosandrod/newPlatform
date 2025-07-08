import { defineComponent, KeepAlive } from 'vue'
import lowcode from '@/pages/platform/lowcode'
import designVue from '@/pages/platform/design'
import DesignIndex from '@/pages/platform/designIndex'
export default defineComponent({
  name: 'gtPlatformIndex',
  components: {
    DesignIndex, //
  },
  setup() {
    return () => {
      let com = <DesignIndex></DesignIndex>
      return com
    }
  },
})
