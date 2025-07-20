import { defineComponent } from 'vue'
import globalRegister from '@/pages/platform/globalRegister' //
export default defineComponent({
  name: 'platformRegister',
  components: {
    globalRegister, //
  },
  setup() {
    return () => {
      let com = <globalRegister></globalRegister>
      return com
    }
  },
})
