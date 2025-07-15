import { computed, defineComponent, onMounted, onUnmounted } from 'vue'
import { XeColumn } from './xecolumn'
import { XeTable } from './xetable'

export default defineComponent({
  name: 'XeColCom',
  props: {
    config: {
      type: Object,
    },
  },
  setup(props) {
    let config = props.config //
    let column: XeColumn = config.column.params //
    let table: XeTable = column.getTable() as any //
    let record = computed(() => {
      return config.row //
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
    let isCurrentEdit = computed(() => {
      let currentEditCell = table.currentEditCell
      let _index = currentEditCell?._index
      let editType = table.getEditType()
      let state = false
      if (editType == 'cell') {
        if (_index != record.value._index) {
          return false
        } //
        let f = currentEditCell.field
        if (f == null || f !== column.getField()) {
          return false
        }
      }
      return false
    })
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
    return () => {
      if (isCurrentEdit.value == true) {
        return <div> 编辑节点</div>
      }
      let com = (
        <div
          class="h-full w-full flex items-center"
          ref={(el) => {
            root = el
          }} //
          onMousedown={(e: MouseEvent) => {
            onMouseDown(e) //
          }}
          onMouseenter={(e: MouseEvent) => {
            onMouseenter()
          }}
        >
          {showValue.value}
        </div>
      )
      return com
    }
  },
})
