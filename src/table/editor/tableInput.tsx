import {
  computed,
  defineComponent,
  isReactive,
  nextTick,
  onMounted,
  ref,
} from 'vue'
import { Column } from '../column'
import { VxeInput } from 'vxe-pc-ui'
import SelectCom from '@/select/selectCom'
import InputCom from '@/input/inputCom'
// import { VxeSelect } from 'vxe-pc-ui'
export default defineComponent({
  name: 'tableInput',
  components: {
    VxeInput,
    SelectCom,
    InputCom, //
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
    let modelValue = computed(() => {
      let _value = props.row[column.getField()]
      return _value ////
    })
    let selectModelValue = computed(() => {
      let _value = modelValue.value
      let cacheValue = column.cacheValue
      if (cacheValue != null) {
        _value = cacheValue
      }
      return _value
    })
    const updateValue = (config) => {
      column.canHiddenEditor = false
      column.isChangeValue = true
      column.cacheValue = config.value //
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
            <InputCom
              style={{ width: '100%', height: '100%' }} //
              ref={insRef}
              onChange={(v) => {
                updateValue(v)
              }} //
              modelValue={modelValue.value}
            ></InputCom>
          </div>
        )
      }
      if (type == 'datetime' || type == 'time' || type == 'date') {
        com = (
          <div style={{ width: '100%', height: '100%' }}>
            <InputCom
              style={{ width: '100%', height: '100%' }} //
              ref={insRef}
              onChange={(v) => {
                updateValue(v)
              }}
              transfer
              type={type} //
              modelValue={modelValue.value}
            ></InputCom>
          </div>
        )
      }
      if (type == 'select') {
        com = (
          <div style={{ width: '100%', height: '100%' }}>
            <SelectCom
              style={{ width: '100%', height: '100%' }} //
              ref={insRef}
              onChange={(v) => {
                updateValue(v)
              }} //
              options={column.getSelectOptions()} //
              transfer
              type={type} //
              modelValue={selectModelValue.value} //
            ></SelectCom>
          </div>
        ) //
      }
      if (type == 'baseinfo') {
        com = <div style={{ width: '100%', height: '100%' }}>参照表</div>
      }
      if (type == 'code') {
        com = <div>codeEditor</div> //
      }
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            paddingTop: '1px',
            paddingBottom: '1px',
            boxSizing: 'border-box', //
          }}
        >
          {com}
        </div>
      )
    }
  },
})
