import { defineComponent, isReactive, nextTick, onMounted, ref } from 'vue'
import { Column } from '../column'
import { VxeInput } from 'vxe-pc-ui'
// import { VxeSelect } from 'vxe-pc-ui'
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
    const column: Column = props.column as any ////
    const table = column.table
    let row = props.row
    let modelValue = props.row[column.getField()]
    const updateValue = (config) => {
      column.canHiddenEditor = false
      column.isChangeValue = true
      column.cacheValue = config.value
    }
    const insRef = (ins: any) => {
      column.registerRef('input', ins)
    }
    onMounted(() => {
      nextTick(() => {
        column.focusInput() //
      })
    })
    let type = column.getEditType()
    return () => {
      let com = null
      if (type == 'string') {
        com = (
          <div style={{ width: '100%', height: '100%' }}>
            <VxeInput
              style={{ width: '100%', height: '100%' }} //
              ref={insRef}
              onChange={(v) => {
                updateValue(v)
              }}
              modelValue={modelValue}
            ></VxeInput>
          </div>
        )
      }
      if (type == 'datetime' || type == 'time' || type == 'date') {
        com = (
          <div style={{ width: '100%', height: '100%' }}>
            <VxeInput
              style={{ width: '100%', height: '100%' }} //
              ref={insRef}
              onChange={(v) => {
                updateValue(v)
              }}
              transfer
              type={type} //
              modelValue={modelValue}
            ></VxeInput>
          </div>
        )
      }
      if (type == 'select') {
        com = (
          <div style={{ width: '100%', height: '100%' }}>
            <VxeSelect
              style={{ width: '100%', height: '100%' }} //
              ref={insRef}
              onChange={(v) => {
                updateValue(v)
              }}//
              options={column.getSelectOptions()} //
              transfer
              type={type} //
              modelValue={modelValue}
            ></VxeSelect>
          </div>
        )
      }
      return com ////
    }
  },
})
