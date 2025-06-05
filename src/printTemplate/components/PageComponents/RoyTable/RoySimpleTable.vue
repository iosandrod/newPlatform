<template>
  <div class="roy-simple-table">
    <!-- 上下文菜单（右键菜单） -->
    <Context ref="simpleTableContext" :theme="contextTheme">
      <ContextItem
        v-for="item in contextMenu"
        :key="item.code"
        :class="`roy-context--${item.status}`"
        @click="
          (e) => {
            // debugger //
            if (e.$$contextmenu == null) {
              item.event()
            }
          }
        "
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </ContextItem>
    </Context>

    <!-- 表格容器 -->
    <StyledSimpleTable v-bind="tableStyle">
      <table ref="royTable">
        <tbody>
          <tr v-for="rowIndex in tableConfig.rows" :key="`row-${rowIndex}`">
            <td
              v-for="colIndex in tableConfig.cols"
              :key="`cell-${rowIndex}-${colIndex}`"
              v-show="isNeedShow(rowIndex - 1, colIndex - 1)"
              v-contextmenu="'simpleTableContext'"
              :class="{
                'roy-simple-table-cell--selected': getIsActiveCell(
                  rowIndex,
                  colIndex,
                ),
              }"
              :colspan="getItColSpan(rowIndex, colIndex)"
              :rowspan="getItRowSpan(rowIndex, colIndex)"
              :style="{
                width: `${tableData?.[`${rowIndex}-${colIndex}`]?.width}px`,
                height: `${tableData?.[`${rowIndex}-${colIndex}`]?.height}px`,
                padding: '0',
                overflow: 'hidden', //
              }"
              @contextmenu.prevent.stop="handleContextMenu"
              @mouseup="handleMouseUp"
              @mousedown.stop="handleCellMouseDown($event, rowIndex, colIndex)"
              @mouseenter.stop.prevent="
                handleCellMouseEnter(rowIndex, colIndex)
              "
            >
              <!-- 如果该单元格配置了组件，则渲染该组件 -->
              <component
                v-if="tableData[`${rowIndex}-${colIndex}`]"
                :is="tableData[`${rowIndex}-${colIndex}`].component"
                :id="`roy-component-${
                  tableData[`${rowIndex}-${colIndex}`]?.id
                }`"
                v-model:bindValue="
                  tableData[`${rowIndex}-${colIndex}`].bindValue
                "
                :cur-id="curClickedId"
                :element="tableData[`${rowIndex}-${colIndex}`]"
                v-model:propValue="
                  tableData[`${rowIndex}-${colIndex}`].propValue
                "
                :style="{
                  width: `${tableData[`${rowIndex}-${colIndex}`]?.width}px`,
                  height: `${tableData[`${rowIndex}-${colIndex}`]?.height}px`,
                }"
                @activeCell="onCellActive"
                @componentUpdated="
                  (value) => componentUpdated(rowIndex, colIndex, value)
                "
              />
              <!-- 如果该单元格被选中且仅选中一个，则显示右下角的调整大小点 -->
              <div
                v-if="
                  getIsActiveCell(rowIndex, colIndex) &&
                  selectedCells.length === 1
                "
                class="roy-simple-table__cell__corner"
                @mousedown.prevent.stop="
                  handleMouseDownOnResize(rowIndex, colIndex, $event)
                "
              ></div>

              <!-- 如果该单元格有绑定值，则显示绑定标志 -->
              <span
                v-show="tableData[`${rowIndex}-${colIndex}`]?.bindValue"
                class="ri-link-unlink-m roy-simple-table__cell__corner__bind"
                @click.prevent.stop="unlinkCell(rowIndex, colIndex, $event)"
              ></span>
            </td>
          </tr>
        </tbody>
      </table>
    </StyledSimpleTable>
  </div>
</template>

<script>
import {
  defineComponent,
  nextTick,
  ref,
  reactive,
  computed,
  watch,
  onMounted,
} from 'vue'
import { useStore } from 'vuex'
import {
  Context,
  ContextItem,
  directive as contextmenuDirective,
} from '@/printTemplate/components/RoyContext'
import RoySimpleTextIn from './RoySimpleTextInTable.vue'
import RoyTextIn from '@/printTemplate/components/PageComponents/RoyTable/RoyTextInTable.vue'
import { StyledSimpleTable } from '@/printTemplate/components/PageComponents/style'
import toast from '@/printTemplate/utils/toast'

// 假设 commonMixin 导出了 deepCopy 和 getUuid 两个辅助函数，
// 如果你的项目里是以混入 (mixin) 形式编写，你可以单独将两个函数拷贝到本文件或单独 import
import { deepCopy, getUuid } from '@/printTemplate/mixin/commonMixin'

export default defineComponent({
  name: 'RoySimpleTable',
  directives: {
    // 注册 v-contextmenu 指令
    contextmenu: contextmenuDirective,
  },
  components: {
    Context,
    ContextItem,
    RoyTextIn,
    RoySimpleTextIn,
    StyledSimpleTable,
  },
  props: {
    element: {
      type: Object,
      default: () => ({}),
    },
    propValue: {
      type: Object,
      default: () => ({}),
    },
    scale: {
      type: [Number, String],
      required: true,
      default: 1,
    },
  },
  setup(props, { emit }) {
    // —— 1. Vuex 状态 ——
    const store = useStore()
    const editor = computed(() => store.state.printTemplateModule.editor)
    const isNightMode = computed(
      () => store.state.printTemplateModule.nightMode.isNightMode,
    )

    // —— 2. 本地响应式状态 ——
    const curClickedId = ref('')

    // 默认单元格配置
    const defaultTableCell = {
      icon: 'ri-text',
      code: 'text',
      name: '文本',
      component: 'RoySimpleTextIn',
      propValue: '',
      width: 100,
      height: 30,
      textStyle: {
        width: '100%',
        height: '100%',
        fontSize: 12,
        background: null,
        borderType: 'none',
        rotate: 0,
        padding: '0',
      },
      simpleTextStyle: {},
      style: {
        color: '#212121',
        borderRadius: 'inherit',
        padding: '0',
        margin: '0',
        fontFamily: 'default',
        lineHeight: '1',
        letterSpacing: '0',
        borderWidth: 0,
        borderColor: '#212121',
        borderType: 'none',
        width: '100%',
        height: '100%',
        fontSize: 12,
        background: null,
        rotate: 0,
        justifyContent: 'flex-start',
        alignItems: 'center',
        fontWeight: 'normal',
        fontStyle: 'normal',
        isUnderLine: false,
        isDelLine: false,
      },
      groupStyle: {},
    }

    // tableConfig 与 tableData
    const tableConfig = reactive({
      cols: 2,
      rows: 2,
      layoutDetail: [],
    })
    const tableData = reactive({})

    // 记录选中单元格（以 “序号” 记录，序号 = (rowIndex-1)*cols + (colIndex-1)）
    const selectedCells = ref([])

    // mousedown 时的状态记录
    const selectionHold = ref(-1)
    const startX = ref(-1)
    const startY = ref(-1)
    const endX = ref(-1)
    const endY = ref(-1)
    // 右键菜单项
    const contextMenu = reactive([
      {
        label: '添加行',
        code: 'addRow',
        icon: 'ri-insert-row-bottom',
        status: 'default',
        event: () => {
          menyItemCmd('addRow')
        },
      },
      {
        label: '添加列',
        code: 'addCol',
        icon: 'ri-insert-column-right',
        status: 'default',
        event: () => menyItemCmd('addCol'),
      },
      {
        label: '删除行',
        code: 'delRow',
        icon: 'ri-delete-row',
        status: 'default',
        event: () => menyItemCmd('delRow'),
      },
      {
        label: '删除列',
        code: 'delCol',
        icon: 'ri-delete-column',
        status: 'default',
        event: () => menyItemCmd('delCol'),
      },
      {
        label: '合并',
        code: 'merge',
        icon: 'ri-merge-cells-horizontal',
        status: 'default',
        event: () => menyItemCmd('merge'),
      },
      {
        label: '拆分',
        code: 'split',
        icon: 'ri-split-cells-horizontal',
        status: 'default',
        event: () => menyItemCmd('split'),
      },
      {
        label: '清空选择',
        code: 'clearSelection',
        icon: 'ri-eraser-line',
        status: 'default',
        event: () => menyItemCmd('clearSelection'),
      },
      {
        code: 'setting',
        icon: 'ri-list-settings-line',
        label: '属性',
        status: 'default',
        event: () => {
          store.commit('printTemplateModule/setPaletteCount')
        },
      },
    ])

    // —— 3. “初始化” 逻辑 ——
    function initMounted(init) {
      let preSettled = false
      if (props.propValue.tableConfig) {
        preSettled = true
        Object.assign(tableConfig, deepCopy(props.propValue.tableConfig))
      }
      if (props.propValue.tableData) {
        preSettled = true
        Object.assign(tableData, deepCopy(props.propValue.tableData))
      }
      if (!preSettled || init) {
        // 生成初始 layoutDetail
        // reRenderTableLayout()
        // 根据行数、列数生成默认 tableData
        for (let r = 1; r <= tableConfig.rows; r++) {
          for (let c = 1; c <= tableConfig.cols; c++) {
            const key = `${r}-${c}`
            tableData[key] = {
              ...deepCopy(defaultTableCell),
              id: getUuid(),
            }
          }
        }
      }
    }
    let _p = props.propValue.tableData
    let _p1 = props.propValue.tableConfig
    let s = !_p && !_p1
    onMounted(() => {
      initMounted(s)
    })

    // —— 4. 计算属性 ——
    const contextTheme = computed(() =>
      isNightMode.value ? 'dark' : 'default',
    )
    const tableStyle = computed(() => {
      return props.element.style || {}
    })

    // 计算哪些单元格因为合并而隐藏
    const hiddenTdMaps = computed(() => {
      const hidden = {}
      for (let i = 0; i < tableConfig.rows; i++) {
        for (let j = 0; j < tableConfig.cols; j++) {
          const idx = i * tableConfig.cols + j
          const info = tableConfig.layoutDetail[idx]
          if (
            info &&
            ((info.colSpan && info.colSpan > 1) ||
              (info.rowSpan && info.rowSpan > 1))
          ) {
            const rowSpan = info.rowSpan || 1
            const colSpan = info.colSpan || 1
            for (let rr = i; rr < i + rowSpan; rr++) {
              for (let cc = rr === i ? j + 1 : j; cc < j + colSpan; cc++) {
                hidden[`${rr}_${cc}`] = true
              }
            }
          }
        }
      }
      return hidden
    })

    // —— 5. 核心方法 ——
    function clearSelection() {
      selectedCells.value = []
    }

    function isNeedShow(row, col) {
      // return !hiddenTdMaps.value[`${row}_${col}`]
      let layout = tableConfig.layoutDetail?.[row]?.[col]
      // console.log(layout, tableConfig.layoutDetail, row, col, 'layout') //
      if (layout?.colSpan == 0 || layout?.rowSpan == 0) {
        return false
      }
      return true //
    }

    function getIsActiveCell(row, col) {
      // const idx = (row - 1) * tableConfig.cols + (col - 1)
      // return selectedCells.value.includes(idx)
      return (
        selectedCells.value.findIndex(
          (item) => item[0] == row && item[1] == col,
        ) !== -1
      ) //
    }

    function getItColSpan(row, col) {
      // const idx = (row - 1) * tableConfig.cols + (col - 1)
      // const info = tableConfig.layoutDetail[idx]
      // return info?.colSpan || 1
      let arr = tableConfig.layoutDetail?.[row - 1]
      let obj = arr?.[col - 1]
      return obj?.colSpan || 1
    }
    function getItRowSpan(row, col) {
      // const idx = (row - 1) * tableConfig.cols + (col - 1)
      // const info = tableConfig.layoutDetail[idx]
      // return info?.rowSpan || 1
      let arr = tableConfig.layoutDetail?.[row - 1]
      let obj = arr?.[col - 1]
      return obj?.rowSpan || 1 //
    }

    function handleCellMouseDown(e, r, c) {
      // 隐藏右键菜单
      simpleTableContext.value?.hide()

      store.commit('printTemplateModule/setInEditorStatus', true)
      store.commit('printTemplateModule/setClickComponentStatus', true)
      store.commit('printTemplateModule/setCurTableCell', {
        component: tableData[`${r}-${c}`],
      })

      // 只处理鼠标左键 (e.which === 1)
      if (e.which !== 1) {
        if (endX.value === -1 && endY.value === -1) {
          const idx = (r - 1) * tableConfig.cols + (c - 1)
          startX.value = r
          startY.value = c
          selectedCells.value = [[r, c]] //
        }
        return
      }
      const idx = (r - 1) * tableConfig.cols + (c - 1)
      startX.value = r
      startY.value = c
      selectedCells.value = [[r, c]] //]
      endX.value = endY.value = -1
      selectionHold.value = [r, c] //
    }

    function handleCellMouseEnter(r, c) {
      // if ((selectionHold.value = -1)) return //
      let layoutDetail = tableConfig.layoutDetail
      let _r = r
      let _c = c
      let layout = layoutDetail?.[r - 1]?.[c - 1]

      let startLayout = layoutDetail?.[startX.value - 1]?.[startY.value - 1]
      if (r == startX.value && c == startY.value) {
        if (selectionHold.value != -1) {
          endX.value = r
          endY.value = c
          rendSelectedCell()
        }
        return
      }

      // if (startLayout?.colSpan > 1) {
      //   c = c + startLayout.colSpan - 1
      // }
      // if (startLayout?.rowSpan > 1) {
      //   r = r + startLayout.rowSpan - 1 //
      // }
      // if (layout?.colSpan > 1) {
      //   c = c + layout.colSpan - 1
      // }
      // if (layout?.rowSpan > 1) {
      //   r = r + layout.rowSpan - 1
      // }
      if (selectionHold.value !== -1) {
        endX.value = r
        endY.value = c
        rendSelectedCell()
      }
      console.log(
        'startX',
        startX.value,
        'startY',
        startY.value,
        'endX',
        endX.value,
        'endY',
        endY.value,
      ) //
      // console.log(selectedCells.value, 'testValue') //
    }

    function rendSelectedCell() {
      // let layoutDetail = tableConfig.layoutDetail
      // const sx = Math.min(startX.value, endX.value)
      // const sy = Math.min(startY.value, endY.value)
      // const ex = Math.max(startX.value, endX.value)
      // const ey = Math.max(startY.value, endY.value)
      // const sels = []
      // for (let rr = 1; rr <= tableConfig.rows; rr++) {
      //   for (let cc = 1; cc <= tableConfig.cols; cc++) {
      //     if (rr >= sx && rr <= ex && cc >= sy && cc <= ey) {
      //       // sels.push((rr - 1) * tableConfig.cols + (cc - 1))
      //       sels.push([rr, cc])
      //     } //
      //   }
      // }
      // selectedCells.value = sels //
      const layoutDetail = tableConfig.layoutDetail

      let sx = Math.min(startX.value, endX.value)
      let sy = Math.min(startY.value, endY.value)
      let ex = Math.max(startX.value, endX.value)
      let ey = Math.max(startY.value, endY.value)

      let changed = true

      // 🚀 迭代扩展，只要有任何合并单元格跟现有区域有交集，就把它整体并入
      while (changed) {
        changed = false

        for (let r = 1; r <= tableConfig.rows; r++) {
          for (let c = 1; c <= tableConfig.cols; c++) {
            const layout = layoutDetail?.[r - 1]?.[c - 1]
            if (!layout || layout.colSpan === 0 || layout.rowSpan === 0)
              continue

            const rowSpan = layout.rowSpan ?? 1
            const colSpan = layout.colSpan ?? 1
            const r1 = r
            const r2 = r + rowSpan - 1
            const c1 = c
            const c2 = c + colSpan - 1

            // 判断这个合并单元格是否与当前区域有交集
            const isOverlap = !(r2 < sx || r1 > ex || c2 < sy || c1 > ey)

            if (isOverlap) {
              if (r1 < sx) {
                sx = r1
                changed = true
              }
              if (r2 > ex) {
                ex = r2
                changed = true
              }
              if (c1 < sy) {
                sy = c1
                changed = true
              }
              if (c2 > ey) {
                ey = c2
                changed = true
              }
            }
          }
        }
      }

      // ✅ 生成最终选中格子
      const sels = []
      for (let rr = sx; rr <= ex; rr++) {
        for (let cc = sy; cc <= ey; cc++) {
          sels.push([rr, cc])
        }
      }

      selectedCells.value = sels
    }

    function handleMouseUp() {
      selectionHold.value = -1
    }

    function handleContextMenu(e) {
      e.preventDefault()
      e.stopPropagation()
      // 如果需要手动定位右键菜单，可以在此记录 e.clientX / e.clientY
    }

    function reRenderTableLayout() {
      // const total = tableConfig.rows * tableConfig.cols
      // const arr = []
      // for (let i = 0; i < total; i++) {
      //   arr.push({ uniId: getUuid(), colSpan: 1, rowSpan: 1 })
      // }
      // tableConfig.layoutDetail = arr
    }
    function resetLayout() {
      // tableConfig.layoutDetail = tableConfig.layoutDetail.filter((item) => {
      //   let colSpan = item.colSpan
      //   let rowSpan = item.rowSpan
      //   if (colSpan === 1 && rowSpan === 1) {
      //     return false
      //   }
      //   return true
      // }) //
    }
    function addRow() {
      console.log(
        JSON.parse(JSON.stringify(tableConfig)),
        JSON.parse(JSON.stringify(tableData)),
        'tableConfig, tableData',
      )
      // function reRenderTableLayout() {
      //   const total = tableConfig.rows * tableConfig.cols
      //   const arr = []
      //   for (let i = 0; i < total; i++) {
      //     arr.push({ uniId: getUuid(), colSpan: 1, rowSpan: 1 })
      //   }
      //   tableConfig.layoutDetail = arr
      // }
      tableConfig.rows++
      const newR = tableConfig.rows
      for (let c = 1; c <= tableConfig.cols; c++) {
        let firstCell = tableData[`1-${c}`] //
        tableData[`${newR}-${c}`] = {
          ...deepCopy(defaultTableCell),
          // width: firstCell ? firstCell.width : defaultTableCell.width,
          width: defaultTableCell.width,
          id: getUuid(),
        }
        // tableConfig.layoutDetail.push({
        //   uniId: getUuid(),
        //   colSpan: 1,
        //   rowSpan: 1,
        // }) //
      } //
      resetLayout()
      // // 找当前列上面单元格
      // reRenderTableLayout()
      //123123123
      nextTick(() => {
        // console.log(tableConfig, tableData, 'tableConfig, tableData') //
        console.log(
          JSON.parse(JSON.stringify(tableConfig)),
          JSON.parse(JSON.stringify(tableData)),
          'tableConfig, tableData',
        )
      })
    }

    function addCol() {
      console.log(
        JSON.parse(JSON.stringify(tableConfig)),
        JSON.parse(JSON.stringify(tableData)),
        'tableConfig, tableData',
      )
      tableConfig.cols++
      const newC = tableConfig.cols
      for (let r = 1; r <= tableConfig.rows; r++) {
        tableData[`${r}-${newC}`] = {
          ...deepCopy(defaultTableCell),
          height: defaultTableCell.height, //
          width: defaultTableCell.width, //
          id: getUuid(),
        }
      }
      resetLayout() //
      nextTick(() => {
        console.log(
          JSON.parse(JSON.stringify(tableConfig)),
          JSON.parse(JSON.stringify(tableData)),
          'tableConfig, tableData',
        )
      }) //
    }

    function mergeCell() {
      let _selectedCells = selectedCells.value
      let leftTopCell = null
      let rightBottomCell = null

      for (const [r, c] of _selectedCells) {
        if (
          !leftTopCell ||
          r < leftTopCell[0] ||
          (r === leftTopCell[0] && c < leftTopCell[1])
        ) {
          leftTopCell = [r, c]
        }
        if (
          !rightBottomCell ||
          r > rightBottomCell[0] ||
          (r === rightBottomCell[0] && c > rightBottomCell[1])
        ) {
          rightBottomCell = [r, c]
        }
      }
      // let sx = Math.min(startX.value, endX.value)
      // let sy = Math.min(startY.value, endY.value)
      // let ex = Math.max(startX.value, endX.value)
      // let ey = Math.max(startY.value, endY.value)
      const sx = leftTopCell[0]
      const sy = leftTopCell[1]
      const ex = rightBottomCell[0]
      const ey = rightBottomCell[1] //
      // const startIndex = (sx - 1) * tableConfig.cols + (sy - 1)
      const groupId = getUuid()
      if (
        sx === -1 ||
        sy === -1 ||
        ex === -1 ||
        ey === -1 ||
        (sx === ex && sy === ey)
      ) {
        toast('请选中要合并的单元格')
        return
      }

      for (let rr = sx; rr <= ex; rr++) {
        for (let cc = sy; cc <= ey; cc++) {
          // const idx = (rr - 1) * tableConfig.cols + (cc - 1)
          // let info = tableConfig.layoutDetail[idx]
          // if (info == null) {
          //   tableConfig.layoutDetail[idx] = {
          //     uniId: getUuid(),
          //     colSpan: 1,
          //     rowSpan: 1,
          //   }
          //   info = tableConfig.layoutDetail[idx]
          // } //
          let layoutDetail = tableConfig.layoutDetail
          let rowArr = layoutDetail[rr - 1]
          if (!rowArr) {
            rowArr = []
            layoutDetail[rr - 1] = rowArr
          }
          let info = rowArr[cc - 1]
          if (!info) {
            info = {}
            rowArr[cc - 1] = info
          }
          info.groupId = groupId
          // if (idx === startIndex) {
          if (rr === sx && cc === sy) {
            let startCell = tableData[`${sx}-${sy}`]
            let endCell = tableData[`${ex}-${ey}`]
            let endLayout = layoutDetail?.[ex - 1]?.[ey - 1] //
            if (endLayout?.colSpan == 0 && endLayout?.rowSpan == 0) {
              let _ex = null
              let _ey = null
              let found = false
              let mergeX = null
              let mergeY = null

              for (let i = ex; i >= 1; i--) {
                for (let j = ey; j >= 1; j--) {
                  const layout = layoutDetail?.[i - 1]?.[j - 1]
                  if (!layout) continue

                  const colSpan = layout.colSpan ?? 1
                  const rowSpan = layout.rowSpan ?? 1

                  // 判断 (ex, ey) 是否在当前 layout 的合并范围内
                  if (
                    colSpan >= 1 &&
                    rowSpan >= 1 &&
                    i + rowSpan - 1 >= ex &&
                    j + colSpan - 1 >= ey
                  ) {
                    mergeX = i
                    mergeY = j
                    found = true
                    break
                  }
                }
                if (found) {
                  _ex = mergeX
                  _ey = mergeY
                  break //
                }
              }
              if (_ex) {
                endCell = tableData[`${_ex}-${_ey}`]
                endLayout = layoutDetail[_ex - 1][_ey - 1] //
              }
            }
            const startRect = document
              .getElementById(`roy-component-${startCell.id}`)
              .getBoundingClientRect()
            const endRect = document
              .getElementById(`roy-component-${endCell.id}`)
              .getBoundingClientRect()
            startCell.width = Math.abs(endRect.x - startRect.x) + endRect.width
            startCell.height =
              Math.abs(endRect.y - startRect.y) + endRect.height
            info.rowSpan = ex - sx + 1
            info.colSpan = ey - sy + 1
          } else {
            // const cellInfo = tableConfig?.layoutDetail?.[idx] //
            // if (cellInfo) {
            //   cellInfo.colSpan = 0
            //   cellInfo.rowSpan = 0
            // }
            info.rowSpan = 0
            info.colSpan = 0 //
          }
        }
      }
    }

    // function splitCell() {
    //   const sx = startX.value
    //   const sy = startY.value
    //   if (sx === -1 || sy === -1) {
    //     toast('请选中要拆分的单元格')
    //     return
    //   }
    //   let layoutDetail = tableConfig.layoutDetail

    //   let rowArr = layoutDetail?.[sx - 1]?.[sy - 1]
    //   if (!rowArr) {
    //     return
    //   }
    //   let rowSpan=rowArr.rowSpan
    //   let colSpan=rowArr.colSpan

    // }
    function splitCell() {
      const sx = startX.value
      const sy = startY.value

      if (sx === -1 || sy === -1) {
        toast('请选中要拆分的单元格')
        return
      }

      const layoutDetail = tableConfig.layoutDetail
      const mainLayout = layoutDetail?.[sx - 1]?.[sy - 1]

      if (!mainLayout || (mainLayout.colSpan <= 1 && mainLayout.rowSpan <= 1)) {
        toast('当前单元格未合并，无需拆分')
        return
      }

      const rowSpan = mainLayout.rowSpan
      const colSpan = mainLayout.colSpan

      // 遍历该合并区域，恢复所有被合并格子
      for (let r = sx; r < sx + rowSpan; r++) {
        for (let c = sy; c < sy + colSpan; c++) {
          const layout = layoutDetail?.[r - 1]?.[c - 1]
          if (layout) {
            layout.colSpan = 1
            layout.rowSpan = 1
          }

          // 如果 tableData 中某格被 width/height = 0，也还原为默认
          const key = `${r}-${c}`
          if (tableData[key]) {
            tableData[key].width ||= defaultTableCell.width
            tableData[key].height ||= defaultTableCell.height
          }
        }
      }

      // 最后清除主格的合并信息
      layoutDetail[sx - 1][sy - 1].colSpan = 1
      layoutDetail[sx - 1][sy - 1].rowSpan = 1

      toast('拆分成功')
    }

    function menyItemCmd(cmd) {
      switch (cmd) {
        case 'merge':
          mergeCell()
          break
        case 'split':
          splitCell()
          break
        case 'delRow':
          if (tableConfig.rows === 1) {
            toast('只剩一行了')
            return
          }
          tableConfig.rows--
          reRenderTableLayout()
          break
        case 'delCol':
          if (tableConfig.cols === 1) {
            toast('只剩一列了')
            return
          }
          tableConfig.cols--
          reRenderTableLayout()
          break
        case 'addRow':
          addRow()
          break
        case 'addCol':
          addCol()
          break
        case 'clearSelection':
          clearSelection()
          break
      }
    }

    function onCellActive({ id }) {
      curClickedId.value = id
    }

    function handleMouseDownOnResize(r, c, e) {
      e.stopPropagation()
      e.preventDefault()
      const elementData = tableData[`${r}-${c}`]
      // const curIndex = (r - 1) * tableConfig.cols + (c - 1)
      // const curConfig = tableConfig.layoutDetail[curIndex]
      let curConfig = tableConfig.layoutDetail?.[r - 1]?.[c - 1]
      if (!elementData) return
      const cellEl = document.getElementById(`roy-component-${elementData.id}`)
      if (!cellEl) {
        // debugger //
        return
      }

      function onMove(moveEvent) {
        const rect = cellEl.getBoundingClientRect()
        const dX = moveEvent.movementX
        const dY = moveEvent.movementY
        // 同一列宽度
        for (let rr = 1; rr <= tableConfig.rows; rr++) {
          let info = tableConfig.layoutDetail?.[rr - 1]?.[c - 1]
          if (info?.colSpan === curConfig?.colSpan) {
            tableData[`${rr}-${c}`].width =
              (rect.width + dX) / Number(props.scale)
          }
        }
        // 同一行高度
        for (let cc = 1; cc <= tableConfig.cols; cc++) {
          let info = tableConfig.layoutDetail?.[r - 1]?.[cc - 1]
          if (info?.rowSpan === curConfig?.rowSpan) {
            tableData[`${r}-${cc}`].height =
              (rect.height + dY) / Number(props.scale)
          }
        } //
      }

      function onUp() {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
      }
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    }

    function unlinkCell(r, c, e) {
      e.stopPropagation()
      e.preventDefault()
      tableData[`${r}-${c}`].bindValue = null
      tableData[`${r}-${c}`].propValue = ''
    }

    function setTablePropValue() {
      const newValue = {
        tableData: deepCopy(tableData),
        tableConfig: deepCopy(tableConfig),
      }
      store.commit('printTemplateModule/setPropValue', {
        id: props.element.id,
        propValue: newValue,
      })
      store.commit('printTemplateModule/updateDataValue', {
        data: props.element,
        value: newValue,
        key: 'propValue',
      })
      emit('componentUpdated', newValue)
    }

    function componentUpdated(r, c, value) {
      const cellData = tableData[`${r}-${c}`]
      cellData.propValue = value
      setTablePropValue()
    }

    // 6. 监听 tableData 与 tableConfig 的变化
    watch(
      () => tableData,
      () => {
        setTablePropValue()
      },
      { deep: true },
    )
    watch(
      () => tableConfig,
      () => {
        setTablePropValue()
      },
      { deep: true },
    )

    // —— 7. 获取上下文菜单实例 ——
    const simpleTableContext = ref(null)

    return {
      // state
      curClickedId,
      tableConfig,
      tableData,
      selectedCells,
      selectionHold,
      startX,
      startY,
      endX,
      endY,
      contextMenu,
      // computed
      contextTheme,
      tableStyle,
      isNeedShow,
      getIsActiveCell,
      getItColSpan,
      getItRowSpan,
      // methods
      handleCellMouseDown,
      handleCellMouseEnter,
      handleMouseUp,
      handleContextMenu,
      menyItemCmd,
      onCellActive,
      handleMouseDownOnResize,
      unlinkCell,
      componentUpdated,
      // ref
      simpleTableContext,
    }
  },
})
</script>

<style lang="scss">
.roy-simple-table {
  user-select: none;
}
</style>
