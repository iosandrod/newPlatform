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
import { columnTypeMap } from '@ER/columnTypeMap'
import { useKeyboard } from '@ER/utils'
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
    let table: XeTable = column.getTable() as any
    let inputIns = ref(null)
    let insRef = (ins: any) => {
      inputIns.value = ins?._instance || ins
    }
    // useKeyboard('enter', () => {
    //   table.clearEditCell() //
    // })
    onMounted(() => {
      let state = false
      if (table.getEditType() == 'cell') {
        if (typeof inputIns.value?.focus == 'function') {
          state = true
          // inputIns.value.focus()
        }
      }
      if (table.getEditType() == 'row') {
        if (typeof inputIns.value?.focus == 'function') {
          let editConfig = table.editConfig
          if (editConfig.currentEditField == column.getField()) {
            // inputIns.value.focus() //
            state = true
          }
        }
      } //
      if (state == true) {
        inputIns.value.focus()
      }
    })
    onUnmounted(() => {
      if (table.getEditType() == 'cell') {
        //
        column.cacheValue = null
        column.isChangeValue = false
      }
    })
    let type = column.getEditType()
    if (props.row == props.column.config) {
      type = 'string' //
    }
    let bindConfig = computed(() => {
      let type = column.getEditType()
      let bindFn = columnTypeMap[type]
      if (typeof bindFn == 'function') {
        return bindFn(column, props.row)
      }
      return {}
    }) //
    return () => {
      let com = null
      if (type == 'string' || type == 'input') {
        //
        com = (
          <div style={{ width: '100%', height: '100%' }}>
            <InputCom
              style={{ width: '100%', height: '100%' }} //
              ref={insRef}
              {...bindConfig.value} //
            ></InputCom>
          </div>
        ) //
        let columnSelect = column.config.columnSelect
        if (columnSelect == true) {
          com = (
            <div style={{ width: '100%', height: '100%' }}>
              <SelectCom
                style={{ width: '100%', height: '100%' }} //
                ref={insRef}
                {...bindConfig.value} //
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
              {...bindConfig.value} //
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
              {...bindConfig.value} //
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
              {...bindConfig.value} //
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
              {...bindConfig.value}
              dropdownModelValue={column.getDropdownModelValue(props.row)}
              //   onChange={(v) => {
              //     updateValue(v)
              //   }}
              //   transfer
              //   type={type} //
              //   modelValue={modelValue.value}
              //   isBaseinfo
              //   onVisibleChange={(v) => {
              //     let visible = v.visible //
              //     column.disableHideCell = visible
              //     nextTick(() => {
              //       column.table.clearEditCell() //
              //     })
              //   }}
              //   onFocus={(config) => {
              //     column.openBaseInfoTable() //
              //   }}
              //   onConfirmTinyTable={(config) => {
              //     ///
              //     column.confirmTinyTableRow(config.row)
              //   }}
              //   baseinfoConfig={column._getBaseinfoConfig()}
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
                          updateFn: (config) => {
                            let value = config.value
                            column.updateBindValue({
                              value,
                              row: props.row,
                              field: column.getField(),
                            }) //
                          },
                          row: props.row, //
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
      if (type == 'boolean' || type == 'bool') {
        com = (
          <div
            style={{ width: '100%', height: '100%' }}
            class="flex flex-row justify-center items-center"
          >
            <CheckboxCom
              {...bindConfig.value} //
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
}) //
