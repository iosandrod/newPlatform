import { defineComponent } from 'vue'
import print from '@/printTemplate/print.vue'
import Print from '@/printTemplate/print.vue'
export default defineComponent({
  name: 'printIndex', //
  components: { print },
  setup() {
    return () => {
      let com = <Print></Print>
      return com //
    }
  },
}) //
