<template>
  <div :style="panelWidth" class="roy-designer-main__page">
    <SketchRuler
      v-show="showRuler"
      ref="sketchRulerRef"
      :cornerActive="false"
      :height="rulerHeight"
      :horLineArr="lines.h" 
      :lang="lang"
      :palette="palette"
      :scale="realScale"
      :shadow="shadow"
      :startX="startX"
      :startY="startY"
      :thick="thick"
      :verLineArr="lines.v"
      :width="rulerWidth"
      @handleLine="handleLine"
      @onCornerClick="handleCornerClick"
    />
    <div id="screens" ref="screensRef" @scroll="handleScroll" @wheel="handleWheel">
      <div ref="containerRef" class="screen-container">
        <div
          id="designer-page"
          v-contextmenu="'contextmenuRef'" 
          :style="canvasStyle"
          @contextmenu="handleContextMenu"
          @mousedown="handleMouseDown"
        >
          <ComponentAdjuster
            v-for="(item, index) in componentData"
            :key="item.id"
            :active="item.id === (curComponent || {}).id"
            :class="{ lock: item.isLock }"
            :default-style="item.style"
            :element="item"
            :index="index"
            :scale="scale"
            :style="getShapeStyle(item.style)"
          >
            <component
              :is="item.component"
              :id="'roy-component-' + item.id"
              :active="item.id === (curComponent || {}).id"
              :bind-value="item.bindValue"
              :element="item"
              :prop-value="item.propValue"
              :scale="scale"
            />
          </ComponentAdjuster>
          <!-- 选中区域 -->
          <Area v-show="isShowArea" :height="height" :start="start" :width="width" />
          <!-- 标线 -->
          <EditorLine />
          <!-- 上下边距线 -->
          <div
            :style="`top: ${pageConfig.pageMarginTop * realScale}px`"
            class="roy-margin-top-line"
          ></div>
          <div
            :style="`bottom: ${pageConfig.pageMarginBottom * realScale}px`"
            class="roy-margin-bottom-line"
          ></div>
        </div>
      </div>
    </div>
    <Context ref="contextmenuRef" :theme="contextTheme">
      <ContextItem
        v-for="item in contextMenu"
        :key="item.code"
        :class="`roy-context--${item.status}`"
        @click="item.event"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </ContextItem>
    </Context>
    <!-- 坐标-->
    <EditorCoordinate />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import SketchRuler from '../SketchRuler/sketchRuler.vue'
import CONSTANT from '@/printTemplate/utils/constant.js'
import { Context, ContextItem, directive as contextmenuDirective } from '@/printTemplate/components/RoyContext'
import ComponentAdjuster from '@/printTemplate/components/Editor/ComponentAdjuster.vue'
import { getComponentRotatedStyle, getShapeStyle } from '@/printTemplate/utils/style-util.js'
import Big from 'big.js'
import RoyText from '@/printTemplate/components/PageComponents/RoyText.vue'
import RoySimpleText from '@/printTemplate/components/PageComponents/RoySimpleText.vue'
import RoyRect from '@/printTemplate/components/PageComponents/RoyRect.vue'
import RoyLine from '@/printTemplate/components/PageComponents/RoyLine.vue'
import RoyImage from '@/printTemplate/components/PageComponents/RoyImage.vue'
import RoyStar from '@/printTemplate/components/PageComponents/RoyStar.vue'
import RoyCircle from '@/printTemplate/components/PageComponents/RoyCircle.vue'
import RoySimpleTable from '@/printTemplate/components/PageComponents/RoyTable/RoySimpleTable.vue'
import RoyComplexTable from '@/printTemplate/components/PageComponents/RoyTable/RoyComplexTable.vue'
import RoyGroup from '@/printTemplate/components/PageComponents/RoyGroup.vue'
import RoyQRCode from '@/printTemplate/components/PageComponents/RoyQRCode.vue'
import RoyBarCode from '@/printTemplate/components/PageComponents/RoyBarCode.vue'
import Area from '@/printTemplate/components/Editor/Area.vue'
import EditorLine from '@/printTemplate/components/Editor/EditorLine.vue'
import EditorCoordinate from '@/printTemplate/components/Editor/EditorCoordinate.vue'
import commonMixin from '@/printTemplate/mixin/commonMixin'
import { $, isPreventDrop } from '@/printTemplate/utils/html-util.js'
import { provide } from 'vue'

const { MIN_SCALE, MAX_SCALE } = CONSTANT

export default {
  name: 'RoyEditor',
  directives: {
    contextmenu: contextmenuDirective
  },
  mixins: [commonMixin],
  components: {
    EditorCoordinate,
    EditorLine,
    SketchRuler,
    Context,
    ContextItem,
    ComponentAdjuster,
    RoyText,
    RoySimpleText,
    RoyGroup,
    RoyRect,
    RoyLine,
    RoyCircle,
    RoyStar,
    RoyImage,
    RoyQRCode,
    RoyBarCode,
    RoySimpleTable,
    RoyComplexTable,
    Area
  },
  props: {
    showRight: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const store = useStore()

    // Refs for DOM elements
    const sketchRulerRef = ref(null)
    const screensRef = ref(null)
    const containerRef = ref(null)
    const contextmenuRef = ref(null)

    // Data properties (converted to refs/reactive)
    const rulerWidth = ref(0)
    const rulerHeight = ref(0)
    const startX = ref(-19)
    const startY = ref(-25)
    const lines = reactive({ h: [], v: [] })
    const thick = ref(20)
    const lang = ref('zh-CN')
    const isShowRuler = ref(true)
    const isShowReferLine = ref(true)
    const palette = reactive({
      bgColor: 'rgba(225,225,225, 0)',
      longfgColor: '#BABBBC',
      shortfgColor: '#C8CDD0',
      fontColor: '#7D8694',
      shadowColor: '#E8E8E8',
      lineColor: '#4579e1',
      borderColor: '#DADADC',
      cornerActiveColor: '#4579e1'
    })
    const editorX = ref(0)
    const editorY = ref(0)
    const start = reactive({ x: 0, y: 0 })
    const width = ref(0)
    const height = ref(0)
    const isShowArea = ref(false)
    const svgFilterAttrs = ['width', 'height', 'top', 'left', 'rotate']

    // Map state from Vuex
    const realScale = computed(() => store.state.printTemplateModule.rulerThings.scale)
    const rectWidth = computed(() => store.state.printTemplateModule.rulerThings.rectWidth)
    const rectHeight = computed(() => store.state.printTemplateModule.rulerThings.rectHeight)
    const needReDrawRuler = computed(() => store.state.printTemplateModule.rulerThings.needReDrawRuler)
    const showRuler = computed(() => store.state.printTemplateModule.rulerThings.showRuler)
    const componentData = computed(() => store.state.printTemplateModule.componentData)
    const curComponent = computed(() => store.state.printTemplateModule.curComponent)
    const editor = computed(() => store.state.printTemplateModule.editor)
    const pageConfig = computed(() => store.state.printTemplateModule.pageConfig)

    // Computed properties
    const scale = computed(() => {
      return new Big(realScale.value).div(new Big(5)).toNumber()
    })
    const shadow = computed(() => ({
      x: 0,
      y: 0,
      width: rectWidth.value,
      height: rectHeight.value
    }))
    const canvasStyle = computed(() => ({
      width: `${rectWidth.value * 5}px`,
      height: `${rectHeight.value * 5}px`,
      transform: `scale(${scale.value})`,
      background: pageConfig.value.background,
      color: pageConfig.value.color,
      fontFamily: pageConfig.value.fontFamily,
      fontSize: pageConfig.value.fontSize,
      lineHeight: pageConfig.value.lineHeight
    }))
    const isNightMode = computed(() => store.state.printTemplateModule.nightMode.isNightMode)
    const panelWidth = computed(() =>
      props.showRight ? 'width: calc(100% - 330px);' : 'width: calc(100% - 95px);'
    )
    const contextTheme = computed(() => (isNightMode.value ? 'dark' : 'default'))
    provide('theme', contextTheme.value)//
    // Computed: context menu items
    const contextMenu = computed(() => {
      if (!curComponent.value) {
        return [
          {
            code: 'setting',
            icon: 'ri-list-settings-line',
            label: '属性',
            status: 'default',
            event: () => {
              store.commit('printTemplateModule/setGlobalCount')
            }
          },
          {
            code: 'paste',
            icon: 'ri-clipboard-line',
            label: '粘贴',
            status: 'default',
            event: () => {
              store.commit('printTemplateModule/paste', true)
              store.commit('printTemplateModule/recordSnapshot')
            }
          }
        ]
      }
      if (curComponent.value.isLock) {
        return [
          {
            code: 'unlock',
            icon: 'ri-lock-unlock-line',
            label: '解锁',
            status: 'default',
            event: () => {
              store.commit('printTemplateModule/unlock')
            }
          }
        ]
      }
      return [
        {
          code: 'setting',
          icon: 'ri-list-settings-line',
          label: '属性',
          status: 'default',
          event: () => {
            store.commit('printTemplateModule/setPaletteCount')
          }
        },
        {
          code: 'copy',
          icon: 'ri-file-copy-line',
          label: '复制',
          status: 'default',
          event: () => {
            store.commit('printTemplateModule/copy')
          }
        },
        {
          code: 'cut',
          icon: 'ri-scissors-cut-line',
          label: '剪切',
          status: 'default',
          event: () => {
            store.commit('printTemplateModule/cut')
          }
        },
        {
          code: 'del',
          icon: 'ri-delete-bin-line',
          label: '删除',
          status: 'danger',
          event: () => {
            store.commit('printTemplateModule/deleteComponent')
            store.commit('printTemplateModule/recordSnapshot')
          }
        },
        {
          code: 'lock',
          icon: 'ri-lock-line',
          label: '锁定',
          status: 'default',
          event: () => {
            store.commit('printTemplateModule/lock')
          }
        },
        {
          code: 'top',
          icon: 'ri-align-top',
          label: '置顶',
          status: 'default',
          event: () => {
            store.commit('printTemplateModule/topComponent')
            store.commit('printTemplateModule/recordSnapshot')
          }
        },
        {
          code: 'bottom',
          icon: 'ri-align-bottom',
          label: '置底',
          status: 'default',
          event: () => {
            store.commit('printTemplateModule/bottomComponent')
            store.commit('printTemplateModule/recordSnapshot')
          }
        },
        {
          code: 'up',
          icon: 'ri-arrow-up-line',
          label: '上移',
          status: 'default',
          event: () => {
            store.commit('printTemplateModule/upComponent')
            store.commit('printTemplateModule/recordSnapshot')
          }
        },
        {
          code: 'down',
          icon: 'ri-arrow-down-line',
          label: '下移',
          status: 'default',
          event: () => {
            store.commit('printTemplateModule/downComponent')
            store.commit('printTemplateModule/recordSnapshot')
          }
        }
      ]
    })

    // Methods
    const { reDrawRuler, setScale } = {
      reDrawRuler: () => store.dispatch('printTemplateModule/rulerThings/reDrawRuler'),
      setScale: (val) => store.dispatch('printTemplateModule/rulerThings/setScale', val)
    }

    function getShapeStyleProxy(styleObj) {
      return getShapeStyle(styleObj)
    }

    function handleMouseDown(e) {
      if (!curComponent.value || isPreventDrop(curComponent.value.component)) {
        e.preventDefault()
      }
      hideArea()
      const rectInfo = editor.value.getBoundingClientRect()
      editorX.value = rectInfo.x
      editorY.value = rectInfo.y
      const sx = e.clientX
      const sy = e.clientY
      start.x = (sx - editorX.value) / scale.value
      start.y = (sy - editorY.value) / scale.value
      isShowArea.value = true

      const move = (moveEvent) => {
        width.value = Math.abs((moveEvent.clientX - sx) / scale.value)
        height.value = Math.abs((moveEvent.clientY - sy) / scale.value)
        if (moveEvent.clientX < sx) {
          start.x = (moveEvent.clientX - editorX.value) / scale.value
        }
        if (moveEvent.clientY < sy) {
          start.y = (moveEvent.clientY - editorY.value) / scale.value
        }
      }
      const up = (event) => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
        if (event.clientX === sx && event.clientY === sy) {
          hideArea()
          return
        }
        createGroup()
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    }

    function handleContextMenu(e) {
      e.stopPropagation()
      e.preventDefault()
      const top = e.offsetY
      const left = e.offsetX
      store.commit('printTemplateModule/showContextMenu', { top, left })
    }

    function hideArea() {
      isShowArea.value = false
      width.value = 0
      height.value = 0
      store.commit('printTemplateModule/setAreaData', {
        style: { left: 0, top: 0, width: 0, height: 0 },
        components: []
      })
    }

    function createGroup() {
      const areaData = getSelectArea()
      if (areaData.length <= 1) {
        hideArea()
        return
      }
      let topVal = Infinity,
        leftVal = Infinity
      let rightVal = -Infinity,
        bottomVal = -Infinity
      areaData.forEach((component) => {
        let styleObj = {}
        if (component.component === 'Group') {
          component.propValue.forEach((item) => {
            const rectInfo = $(`#roy-component-${item.id}`).getBoundingClientRect()
            styleObj.left = rectInfo.left - editorX.value
            styleObj.top = rectInfo.top - editorY.value
            styleObj.right = rectInfo.right - editorX.value
            styleObj.bottom = rectInfo.bottom - editorY.value

            leftVal = Math.min(leftVal, styleObj.left)
            topVal = Math.min(topVal, styleObj.top)
            rightVal = Math.max(rightVal, styleObj.right)
            bottomVal = Math.max(bottomVal, styleObj.bottom)
          })
        } else {
          styleObj = getComponentRotatedStyle(component.style)
        }
        leftVal = Math.min(leftVal, styleObj.left)
        topVal = Math.min(topVal, styleObj.top)
        rightVal = Math.max(rightVal, styleObj.right)
        bottomVal = Math.max(bottomVal, styleObj.bottom)
      })
      start.x = leftVal
      start.y = topVal
      width.value = rightVal - leftVal
      height.value = bottomVal - topVal
      store.commit('printTemplateModule/setAreaData', {
        style: { left: leftVal, top: topVal, width: width.value, height: height.value },
        components: areaData
      })
    }

    function getSelectArea() {
      const result = []
      const { x, y } = start
      componentData.value.forEach((component) => {
        if (component.isLock) return
        const { left, top, width: w, height: h } = getComponentRotatedStyle(component.style)
        if (x <= left && y <= top && left + w <= x + width.value && top + h <= y + height.value) {
          result.push(component)
        }
      })
      return result
    }

    function handleLine(newLines) {
      lines.h = newLines.h
      lines.v = newLines.v
    }

    function handleCornerClick() {
      // placeholder
    }

    function handleScroll() {
      const screensRect = screensRef.value.getBoundingClientRect()
      const canvasRect = document.querySelector('#designer-page').getBoundingClientRect()
      startX.value = (screensRect.left + thick.value - canvasRect.left) / realScale.value
      startY.value = (screensRect.top + thick.value - canvasRect.top) / realScale.value
    }

    function handleWheel(e) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const nextScale = parseFloat(Math.max(0.2, scale.value - e.deltaY / 500).toFixed(2))
        if (nextScale <= MAX_SCALE && nextScale >= MIN_SCALE) {
          setScale(nextScale)
        }
      }
      // Next tick equivalent
      setTimeout(() => {
        handleScroll()
      })
    }

    // Lifecycle
    onMounted(() => {
      rulerWidth.value = document.querySelector('.roy-designer-main__page').offsetWidth
      rulerHeight.value = document.querySelector('.roy-designer-main__page').offsetHeight
      screensRef.value.scrollLeft =
        containerRef.value.getBoundingClientRect().width / 2 - rectWidth.value
      store.commit('printTemplateModule/getEditor')
    })

    // Watchers
    watch(isNightMode, (newVal) => {
      palette.bgColor = 'rgba(225,225,225, 0)'
      palette.longfgColor = '#BABBBC'
      palette.shortfgColor = '#C8CDD0'
      palette.fontColor = '#7D8694'
      palette.shadowColor = newVal ? '#444444' : '#E8E8E8'
      palette.lineColor = '#4579e1'
      palette.borderColor = newVal ? '#636466' : '#DADADC'
      palette.cornerActiveColor = '#4579e1'
      reDrawRuler()
    })

    watch(() => props.showRight, () => {
      // Equivalent to nextTick
      setTimeout(() => {
        rulerWidth.value = document.querySelector('.roy-designer-main__page').offsetWidth
        rulerHeight.value = document.querySelector('.roy-designer-main__page').offsetHeight
        screensRef.value.scrollLeft =
          containerRef.value.getBoundingClientRect().width / 2 - rectWidth.value
        reDrawRuler()
      })
    })

    watch(needReDrawRuler, () => {
      // placeholder if needed later
      // setTimeout(() => { ... })
    })

    return {
      // Refs
      sketchRulerRef,
      screensRef,
      containerRef,
      contextmenuRef,
      // Reactive data
      rulerWidth,
      rulerHeight,
      startX,
      startY,
      lines,
      thick,
      lang,
      isShowRuler,
      isShowReferLine,
      palette,
      editorX,
      editorY,
      start,
      width,
      height,
      isShowArea,
      svgFilterAttrs,
      // Computed
      realScale,
      rectWidth,
      rectHeight,
      needReDrawRuler,
      showRuler,
      componentData,
      curComponent,
      editor,
      pageConfig,
      scale,
      shadow,
      canvasStyle,
      isNightMode,
      panelWidth,
      contextTheme,
      contextMenu,
      // Methods
      reDrawRuler,
      setScale,
      getShapeStyleProxy,
      handleMouseDown,
      getShapeStyle,
      handleContextMenu,
      hideArea,
      createGroup,
      getSelectArea,
      handleLine,
      handleCornerClick,
      handleScroll,
      handleWheel
    }
  }
}
</script> 
<style lang="scss">
#screens {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.screen-container {
  position: absolute;
  width: 5000px;
  height: 5000px;
}

.roy-designer-main__page {
  position: absolute;
  height: calc(100% - 100px);
  border: 1px solid var(--roy-border-color);
  padding: 0 !important;
  margin: 0;
  background-color: rgb(255, 255, 255);
  background-image: linear-gradient(45deg, rgb(247, 247, 247) 25%, transparent 25%),
    linear-gradient(-45deg, rgb(247, 247, 247) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgb(247, 247, 247) 75%),
    linear-gradient(-45deg, transparent 75%, rgb(247, 247, 247) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;

  #designer-page {
    background: #fff;
    box-shadow: rgba(0, 0, 0, 0.12) 0 1px 3px, rgba(0, 0, 0, 0.24) 0 1px 2px;
    position: absolute;
    top: 60px;
    transform-origin: 50% 0;
    margin-left: -80px;
    left: 50%;

    .lock {
      opacity: 0.5;

      &:hover {
        cursor: not-allowed;
      }
    }
  }

  .roy-margin-top-line,
  .roy-margin-bottom-line {
    position: absolute;
    height: 0;
    width: 100%;
    border-top: 1px dashed #ccc;
  }
}

#roy-print-template-designer[theme='dark'] {
  .roy-designer-main__page {
    background-color: #1c1c1c;
    background-image: linear-gradient(45deg, #212121 25%, transparent 25%),
      linear-gradient(-45deg, #232323 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #232323 75%),
      linear-gradient(-45deg, transparent 75%, #232323 75%);
  }

  #designer-page {
    filter: brightness(0.6);
  }
}
</style>
