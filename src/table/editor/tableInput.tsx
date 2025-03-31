import { defineComponent, nextTick, onMounted, ref } from 'vue'
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
      type: Object,
    },
  },
  setup(props, { slots }) {
    //
    const column: Column = props.column as any //
    const table = column.table
    let row = props.row
    let modelValue = props.row[column.getField()]
    const updateValue = (config) => {
      column.isChangeValue = true
      column.cacheValue = config.value
    }
    const insRef = ref(null)
    onMounted(() => {
      //
      nextTick(() => {
        insRef.value?.focus()
      })
    })
    return () => (
      <div style={{ width: '100%', height: '100%' }}>
        <VxeInput
          ref={insRef}
          onChange={(v) => {
            updateValue(v)
          }}
          modelValue={modelValue}
        ></VxeInput>
      </div>
    )
  },
})
