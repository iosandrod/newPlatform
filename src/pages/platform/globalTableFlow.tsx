import { defineComponent } from 'vue'
import ERDesign from '../gantt/ERDesign'

export default defineComponent({
  name: 'globalTableFlow',
  components: {
    ERDesign,
  }, //
  setup() {
    return () => {
      let com = <ERDesign></ERDesign>
      return com
    }
  },
})
