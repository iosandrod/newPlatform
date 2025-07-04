import { defineComponent } from 'vue'
import ERDiagram from '@/pages/platform/ERDiagram'
export default defineComponent({
  name: 'GanttERDiagram',
  props: {},
  setup() {
    return () => {
      let com = <ERDiagram></ERDiagram>
      return com //
    }
  },
})
