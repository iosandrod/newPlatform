import {
  computed,
  defineComponent,
  isReactive,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from 'vue'
import { Column } from '../column'
import { VxeCheckbox, VxeInput } from 'vxe-pc-ui'
import SelectCom from '@/select/selectCom'
import InputCom from '@/input/inputCom'
import CheckboxCom from '@/checkbox/checkboxCom'
import { XeColumn } from '../xecolumn'
import { XeTable } from '../xetable'
// import { VxeSelect } from 'vxe-pc-ui'
export default defineComponent({
  name: 'tableInput',
  components: {
    VxeInput,
    SelectCom,
    InputCom, //
    VxeCheckbox,
    CheckboxCom,
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
    let column: XeColumn = reactive(props.column) as any ////
    let table: XeTable = column.table as any
    let row = props.row
    let _f = column.getField()
    let _column = table.columnsMap[_f] //
    if (props.row == column.config) {
      _f = 'title' //
    }
    let modelValue = computed(() => {
      let _value = props.row[_f] //
      if (column.isChangeValue == true) {
        _value = column.cacheValue
      } //
      return _value
    })
    let selectModelValue = computed(() => {
      let _value = modelValue.value
      let cacheValue = column.cacheValue
      if (cacheValue != null) {
        _value = cacheValue
      }
      if (column.isChangeValue == true) {
        _value = column.cacheValue //
      } //
      return _value //
    })
    const updateValue = (config) => {
      column.canHiddenEditor = false //
      column.isChangeValue = true
      column.cacheValue = config.value //
      let editType = table.getEditType()
      if (editType != 'cell') {
        column.updateBindValue({
          value: config.value,
          row: props.row,
          field: _f,
        }) //
      } //
      // console.log(column.cacheValue,'testCacehValue')//
    }
    let _index = row._index
    let inputIns = ref(null)
    const insRef = (ins: any) => {
      inputIns.value = ins?._instance || ins
      column.registerRef('input', ins)
    } //
    onMounted(() => {
      // debugger//
      // if (table.getEditType() == 'cell') {
      //   if (typeof inputIns.value?.focus == 'function') {
      //     inputIns.value.focus() //
      //   }
      // }
      // if (table.getEditType() == 'row') {
      //   if (typeof inputIns.value?.focus == 'function') {
      //     let editConfig = table.editConfig
      //     if (editConfig.currentEditField == column.getField()) {
      //       inputIns.value.focus() //
      //     }
      //   }
      // }
    })
    onUnmounted(() => {
      // if (table.getEditType() == 'cell') {
      //   //
      //   column.cacheValue = null
      //   column.isChangeValue = false
      // }
    })
    let type = column.getEditType()
    if (props.row == props.column.config) {
      type = 'string' //
    }
    return () => {
      let com = null
      if (type == 'string' || type == 'input') {
        //
        com = (
          <div style={{ width: '100%', height: '100%' }}>
            <InputCom
              style={{ width: '100%', height: '100%' }} //
              ref={insRef}
              onChange={(v) => {
                updateValue(v)
              }}
              onInput={(v) => {
                updateValue(v) //
              }}
              {...column.getBindConfig()} //
              modelValue={modelValue.value}
            ></InputCom>
          </div>
        )
        let columnSelect = column.config.columnSelect
        if (columnSelect == true) {
          com = (
            <div style={{ width: '100%', height: '100%' }}>
              <SelectCom
                style={{ width: '100%', height: '100%' }} //
                ref={insRef}
                onChange={(v) => {
                  updateValue(v)
                }} //
                clearable
                options={column.getSelectOptions()} //
                transfer
                type={type} //
                modelValue={selectModelValue.value} //
              ></SelectCom>
            </div>
          )
        }
      }
      if (type == 'number') {
        com = (
          <div style={{ width: '100%', height: '100%' }}>
            <InputCom
              style={{ width: '100%', height: '100%' }} //
              ref={insRef}
              type="number" //
              onChange={(v) => {
                updateValue(v)
              }}
              {...column.getBindConfig()} //
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
              clearable
              options={column.getSelectOptions()} //
              transfer
              type={type} //
              modelValue={selectModelValue.value} //
            ></SelectCom>
          </div>
        ) //
      }
      if (type == 'baseinfo') {
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
              isBaseinfo
              onVisibleChange={(v) => {
                let visible = v.visible //
                column.disableHideCell = visible
                nextTick(() => {
                  column.table.clearEditCell() //
                })
              }}
              onFocus={(config) => {
                column.openBaseInfoTable() //
              }}
              onConfirmTinyTable={(config) => {
                column.confirmTinyTableRow(config.row)
              }}
              baseinfoConfig={column._getBaseinfoConfig()}
            ></InputCom>
          </div>
        )
      }
      if (type == 'code') {
        com = (
          <div class="h-full w-full flex items-center">
            <inputCom
              class={['h-full']} //
              ref={insRef}
              modelValue={'...'}
              readonly //
              v-slots={{
                buttons: () => {
                  let com = (
                    <div
                      onClick={() => {
                        column.openCodeDialog({
                          updateFn: updateValue,
                        }) //
                      }}
                      class="h-full pointer"
                    >
                      <i class="vxe-icon-edit"></i>
                    </div>
                  )
                  return com
                },
              }}
            ></inputCom>
          </div>
        )
      }
      if (type == 'boolean') {
        com = (
          <div
            style={{ width: '100%', height: '100%' }}
            class="flex flex-row justify-center items-center"
          >
            <CheckboxCom
              modelValue={modelValue.value}
              onChange={(v) => {
                updateValue(v)
              }} //
              disabled={false}
            ></CheckboxCom>
          </div>
        )
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
