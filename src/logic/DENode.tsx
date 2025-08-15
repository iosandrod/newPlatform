import { defineComponent, inject } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { TableFlow } from './tableFlow'
export default defineComponent({
  name: 'ERNode',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const flow: TableFlow = inject('flowIns', null)
    return () => {
      let com = <div></div>
      return com //
    }
  },
}) //
