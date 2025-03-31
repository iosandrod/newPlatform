import { defineComponent, nextTick, onMounted } from 'vue'
import { Column } from '../column'
import { VxeInput } from 'vxe-pc-ui'
export default defineComponent({
  name: 'tableInput',
  components: {
    VxeInput,
  },
  props: {
    row: {
      type: Object,
    },
    column: {
      type: Function,
    },
  },
  setup(props, { slots }) {
    //
    const column: Column = props.column as any //
    const table = column.table
    onMounted(() => {
      nextTick(() => {})
    })
    return () => (
      <div style={{ width: '100%', height: '100%' }}>
        <VxeInput modelValue={props.row[column.getField()]}></VxeInput>
      </div>
    )
  },
})
