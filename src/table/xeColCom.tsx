import { computed, defineComponent, onMounted, onUnmounted } from 'vue'
import { XeColumn } from './xecolumn'
import { XeTable } from './xetable'
import InputCom from '@/input/inputCom'
import SelectCom from '@/select/selectCom'
import { columnTypeMap } from '@ER/columnTypeMap'

export default defineComponent({
  name: 'XeColCom',
  props: {
    config: {
      type: Object,
    },
    type: {
      type: String,
      default: 'default',
    },
    checked: {
      type: Boolean,
    },
    row: {
      type: Object,
    },
  }, //
  setup(props) {
    let config = props.config //
    let column: XeColumn = config.column.params //
    let table: XeTable = column.getTable() as any //
    let record = computed(() => {
      return props.row //
    })
    let showValue = computed(() => {
      let format = column.getFormat() //
      if (typeof format == 'function') {
        let v = format({
          row: record.value, //
          field: column.getField(),
          table,
          column: column, //
        })
        // console.log(v, 'testV') //
        return v //
      } //
      return '' //
    }) //

    onMounted(() => {}) //
    onUnmounted(() => {}) //
    let mousedownFn = (e: MouseEvent) => {}
    let root = null
    let startX = 0
    let startY = 0
    let dragging = false
    const threshold = 5 // 超过 5 像素认为是拖动
    const addBorderToRoot = () => {}
    const removeBorderFromRoot = () => {}
    function onMouseDown(e: MouseEvent) {
      table.onCellMousedown({ ...config, event: e })
    }
    function onMouseenter(e: MouseEvent) {
      table.onCellMouseEnter({ ...config, event: e }) //
    }
    let type = props.type
    let isEditCell = computed(() => {
      let s = table.getIsActiveEditCell(record.value, column)
      return s //
    })
    let editType = computed(() => {
      return column.getEditType() //
    })
    let f = column.getField()
    let modelValue = computed(() => {
      let value = record.value[f]
      return value
    }) //
    const inputBind = computed(() => {
      let _editType = editType.value
      let bind = columnTypeMap[_editType]
      if (typeof bind == 'function') {
        return bind(column, record.value)
      }
      return {}
    })
    return () => {
      let com = null
      if (type == 'checkbox') {
        //
        com = (
          <div class="w-full flex h-full justify-center items-center">
            <vxe-checkbox
              onChange={(e) => {
                let checked = e.checked //
                column.getTable().onCheckboxChange({ ...config, checked })
              }}
              modelValue={props.checked}
            ></vxe-checkbox>
          </div>
        )
      } else if (type == 'default') {
        com = (
          <div
            class="h-full w-full flex items-center justify-center"
            ref={(el) => {
              root = el
            }} //
            onMousedown={(e: MouseEvent) => {
              onMouseDown(e) //
            }}
            onMouseenter={(e: MouseEvent) => {
              onMouseenter(e) //
            }}
          >
            {showValue.value}
          </div>
        )
        if (isEditCell.value == true) {
          if (editType.value == 'select') {
            com = <SelectCom {...inputBind.value}></SelectCom> //
          }
          if (editType.value == 'bool') {
            com = (
              <div class="h-full w-full overflow-hidden">
                <vxe-checkbox
                  {...inputBind.value}
                  modelValue={modelValue.value}
                ></vxe-checkbox>
              </div>
            )
          }
          if (['string', 'input'].includes(editType.value)) {
            com = <InputCom {...inputBind.value}></InputCom> //
          }
        } //
      }
      return com
    }
  },
})
