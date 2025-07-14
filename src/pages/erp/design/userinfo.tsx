import { defineComponent } from 'vue'
import globalUserinfo from '@/pages/platform/globalUserinfo'
export default defineComponent({
  name: 'ErpUserInfo', //
  components: {
    globalUserinfo,
  },
  setup() {
    return () => {
      let com = <globalUserinfo></globalUserinfo>
      return com //
    }
  },
})
