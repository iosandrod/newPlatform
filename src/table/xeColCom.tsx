import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  watchEffect,
  withDirectives,
} from 'vue'
import { XeColumn } from './xecolumn'
import { XeTable } from './xetable'
import InputCom from '@/input/inputCom'
import SelectCom from '@/select/selectCom'
import { columnTypeKeys, columnTypeMap } from '@ER/columnTypeMap'
import CheckboxCom from '@/checkbox/checkboxCom'
import { ClickOutside } from 'element-plus'
import TableInput from './editor/tableInput'
import XeTableInput from './editor/xeTableInput'

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
    let _type = config.column.type
    let column: XeColumn = config.column.params //
    let table: XeTable = column.getTable() as any //
    let record = computed(() => {
      return props.row //
    })
    let showValue = computed(() => {
      let _v = ''
      if (_type == 'seq') {
        return config.seq //
      }
      let format = column.getFormat() //
      if (typeof format == 'function') {
        let v = format({
          row: record.value, //
          field: column.getField(),
          table,
          column: column, //
        })
        // console.log(v, 'testV') //
        _v = v //
      } //
      return _v //
    }) //

    onMounted(() => {}) //
    onUnmounted(() => {}) //
    let mousedownFn = (e: MouseEvent) => {}
    let root = ref(null)
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

    const isCurrentRow = computed(() => {
      const tableData = table.tableData
      let curRow = tableData.curRow
      if (curRow?.['_index'] == record.value['_index']) {
        return true
      }
      return false //
    })
    const registerRoot = (el) => {
      root.value = el
      if (root.value == null) {
        return
      } //
      addCurRowClass(isCurrentRow.value)
    }
    const addCurRowClass = (bool) => {
      //
      if (root.value == null) {
        return
      }
      if (bool) {
        root.value.classList.add('xe-table-current-row')
      } else {
        root.value.classList.remove('xe-table-current-row')
      }
      if (column.getIsTree()) {
        let treeNode = table
          .getAllParentDivs(root.value)
          .find((el) => el.classList.contains('vxe-cell--tree-node'))
        if (treeNode) {
          if (bool) {
            treeNode.classList.add('xe-table-current-row')
          } else {
            treeNode.classList.remove('xe-table-current-row')
          } //
        }
      }
    } //
    onMounted(() => {
      addCurRowClass(isCurrentRow.value) //
    })
    watch(
      () => isCurrentRow.value,
      (newVal) => {
        addCurRowClass(newVal) //
      },
    )
    return () => {
      let com = null
      if (type == 'checkbox') {
        //
        com = (
          <div
            onClick={(e) => {
              e.stopPropagation()
              column
                .getTable()
                .onCheckboxChange({ ...config, checked: !props.checked })
            }}
            ref={(el) => {
              registerRoot(el)
            }} //
            class="w-full flex h-full justify-center items-center cursor-pointer"
          >
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
        let style = column.getCellStyle({ row: record.value })
        com = (
          <div
            class="whitespace-nowrap"
            style={style} //
            ref={(el) => {
              registerRoot(el)
            }} //
            onMousedown={(e: MouseEvent) => {
              onMouseDown(e) //
            }}
            onMouseenter={(e: MouseEvent) => {
              onMouseenter(e) //
            }}
            onContextmenu={(e: MouseEvent) => {
              table.onBodyCellContext({ ...config, event: e })
            }}
          >
            {showValue.value}
          </div>
        )
        let com0 = com //
        if (isEditCell.value == true) {
          let editCom = null
          if (columnTypeKeys.includes(editType.value)) {
            editCom = (
              <XeTableInput row={record.value} column={column}></XeTableInput>
            )
          } //
          if (editCom != null) {
            //
            com = withDirectives(
              <div
                ref={(el) => {
                  registerRoot(el)
                }}
                class="h-full w-full my-class"
              >
                {editCom}
              </div>,
              [
                [
                  {
                    unmounted: () => {},
                  },
                ],
              ],
            )
          }
        } //
      }
      return com
    }
  },
})
