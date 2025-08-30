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
import { position } from 'html2canvas/dist/types/css/property-descriptors/position'

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
      // 初始化返回值
      let _v = ''

      // 如果是序号列，直接返回序号
      if (_type === 'seq') {
        return config.seq
      }

      // 获取列配置中的格式化函数
      const format = column.getFormat()
      if (typeof format === 'function') {
        const v = format({
          row: record.value,
          field: column.getField(),
          table,
          column,
        })
        _v = v != null ? String(v) : ''
      } else {
        // 如果没有格式化函数，直接取值
        const rawVal = record.value?.[column.getField()]
        _v = rawVal != null ? String(rawVal) : ''
      }

      // 处理全局搜索高亮（可选）
      const globalValue = table.globalConfig.value
      if (
        globalValue &&
        typeof globalValue === 'string' &&
        globalValue.length > 0
      ) {
        try {
          const reg = new RegExp(globalValue, 'gi')
          _v = _v.replace(
            reg,
            (match) => `<span class="keyword-highlight">${match}</span>`,
          )
        } catch (e) {
          // 正则构造失败时直接跳过高亮//
          console.warn('Invalid global search keyword', e)
        }
      }
      // 用 div 包一层以支持渲染 HTML
      return `<div class="cell-content">${_v}</div>`
    })

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
    const setMergeStyle = () => {
      let mergeConfig = table.mergeConfig //
      let _index = record.value._index
      let field = column.getField()
      let _config = mergeConfig[`${_index}_${field}`] //
      if (_config == null) {
        return
      } //
      if (root.value == null) {
        return //
      }
      let _style = {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        zIndex: 1,
      }
      let { rowSpan, colSpan } = _config
      if (rowSpan > 1) {
        let height = table.getCellHeight()
        let _height = height * rowSpan
        _style['height'] = _height + 'px!important'
      }
      let _r1: HTMLDivElement = root.value
      let parent = _r1.parentElement
      let pparent = parent.parentElement
      /* 
      height: 30px;height: 60px;position: absolute;left: 0;top: 0;width: 100%;z-index: 1;
      */
      // if (pparent == null) {
      //   return //
      // }
      // let ppparent = pparent.parentElement
      // if (ppparent == null) {
      //   return //
      // }
      // Object.entries(_style).forEach(([key, value]) => {
      //   if (pparent) {
      //     pparent.style[key] = value
      //   } //
      // }) //
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
    let dragConfig = null
    let comType = column.getComType() //
    if (comType == 'dragCom') {
      //
      dragConfig = column.getDragConfig()
      // console.log(dragConfig)
    }
    // console.log(dragConfig,'test_config')//
    const isCurrentRow = computed(() => {
      // if (table.getTableName() == 'pd_rmb_eag') {
      //   // 处理特定表格的逻辑
      //   debugger//
      // }//
      const tableData = table.tableData
      let curRow = tableData.curRow
      if (curRow?.['_index'] == record.value?.['_index']) {
        return true
      } //
      return false //
    })
    const registerRoot = (el) => {
      root.value = el
      if (root.value == null) {
        return
      }
      setMergeStyle() //
      addCurRowClass(isCurrentRow.value)
    }
    const addCurRowClass = (bool) => {
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
      let dragCom = null
      if (dragConfig != null) {
        dragCom = (
          <div
            class="cursor-move"
            onDrop={(e: DragEvent) => {}}
            onDragstart={(e: DragEvent) => {
              table.onColComDragStart({
                event: e,
                row: record.value,
                column,
              })
            }}
            onClick={(e) => {
              // console.log('node click') //
              table.onColumnDragClick({
                event: e,
                row: record.value,
                column, //
              })
            }}
            onDragend={(e: DragEvent) => {
              table.onColComDragEnd({
                event: e,
                row: record.value,
                column,
              })
            }} //
            draggable="true"
          >
            拖动
          </div>
        ) //
      }
      if (type == 'checkbox') {
        //
        com = (
          <div
            onClick={(e) => {
              e.stopPropagation()
              column
                .getTable()
                .toggleAllCheckboxRow({ ...config, checked: !props.checked })
            }}
            ref={(el) => {
              registerRoot(el)
            }} //
            class="w-full flex h-full justify-center items-center cursor-pointer"
          >
            <vxe-checkbox
              onChange={(e) => {
                let checked = e.checked //
                column.getTable().toggleAllCheckboxRow({ ...config, checked })
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
            }}
            onContextmenu={(e: MouseEvent) => {
              table.onBodyCellContext({ ...config, event: e })
            }}
          >
            {/* {showValue.value} */}
            <div vHtml={showValue.value}></div>
            {dragCom}
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
