<!-- ComponentAdjuster.vue -->
<template>
  <div
    ref="adjuster"
    :style="adjusterStyle"
    class="roy-component-adjuster"
    @click="selectCurComponent"
    @mousedown="handleMouseDownOnShape"
  >
    <!-- 旋转控制点 -->
    <span
      v-show="isActive && showRotate"
      class="ri-checkbox-blank-circle-line roy-component-adjuster__rotate"
      @mousedown="handleRotate"
    ></span>

    <!-- 锁定标记 -->
    <span
      v-show="element.isLock"
      class="ri-lock-fill roy-component-adjuster__lock"
    ></span>

    <!-- 绑定标记 -->
    <span
      v-show="element.bindValue"
      class="ri-link-unlink-m roy-component-adjuster__bind"
      @click="unlinkElement"
    ></span>

    <!-- 拖动把手 -->
    <span
      :class="element.icon"
      class="roy-component-adjuster__move"
      @mousedown="handleMouseMoveItem"
    ></span>

    <!-- 八个（或少数）缩放／调整节点 -->
    <div
      v-for="point in pointList"
      :key="point"
      v-show="isActive"
      :class="`roy-component-adjuster__shape-point--${point}`"
      :style="getPointStyle(point)"
      @mousedown.prevent.stop="handleMouseDownOnPoint(point, $event)"
    ></div>

    <!-- 插槽：真正放置待调整组件的位置 -->
    <div ref="slotContainer" class="adjuster-container">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted, toRefs } from 'vue'
import { useStore } from 'vuex'
import { mod360 } from '@/printTemplate/utils/translate'
import calculateComponentPositionAndSize from '@/printTemplate/utils/calculateComponentPositonAndSize'
import { isPreventDrop } from '@/printTemplate/utils/html-util'
import ResizeObserver from '@/printTemplate/utils/ResizeObserver'
import eventBus from '@/printTemplate/utils/eventBus'

// ==== 1. 定义 Props ====
const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  element: {
    type: Object,
    required: true,
    default: () => ({})
  },
  defaultStyle: {
    type: Object,
    required: true,
    default: () => ({})
  },
  index: {
    type: [Number, String],
    required: true,
    default: 0
  },
  scale: {
    type: [Number, String],
    required: true,
    default: 1
  }
})

// ==== 2. 从 Vuex Store 中取出需要的 state ====
const store = useStore()
const { editor, curComponent } = toRefs(store.state.printTemplateModule)

// ==== 3. 本地引用和响应式数据 ====
const adjuster = ref(null)
const slotContainer = ref(null)

// initialAngle 和 angleToCursor 用于计算各个 resize 点对应的鼠标光标样式
const state = reactive({
  cursors: {},
  initialAngle: {
    lt: 0,
    t: 45,
    rt: 90,
    r: 135,
    rb: 180,
    b: 225,
    lb: 270,
    l: 315
  },
  angleToCursor: [
    { start: 338, end: 23, cursor: 'nw' },
    { start: 23, end: 68, cursor: 'n' },
    { start: 68, end: 113, cursor: 'ne' },
    { start: 113, end: 158, cursor: 'e' },
    { start: 158, end: 203, cursor: 'se' },
    { start: 203, end: 248, cursor: 's' },
    { start: 248, end: 293, cursor: 'sw' },
    { start: 293, end: 338, cursor: 'w' }
  ]
})

// ==== 4. 计算属性 ====

// 4.1 根据 element.component 决定要显示哪些缩放点
const pointList = computed(() => {
  const isTable = ['RoySimpleTable', 'RoyComplexTable'].includes(props.element.component)
  if (isTable) return ['b']
  if (props.element.component === 'RoyLine') return ['r', 'l']
  return ['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l']
})

// 4.2 控制 adjuster 是否处于“激活”状态
const isActive = computed(() => props.active && !props.element.isLock)

// 4.3 控制是否显示旋转按钮
const showRotate = computed(() => {
  return !['RoySimpleTable', 'RoyComplexTable'].includes(props.element?.component || '')
})

// 4.4 adjuster 边框样式
const adjusterStyle = computed(() => ({
  border: isActive.value
    ? '0.5px solid var(--roy-text-color-secondary)'
    : '0.5px dashed var(--roy-text-color-secondary)'
}))

// ==== 5. 生命周期和监听 ====

// 5.1 初始化：设置 cursors 并监听插槽尺寸变化
onMounted(() => {
  state.cursors = getCursorMap()
  observeElementShape()
})

// 5.2 如果当前组件旋转角度发生变化，重新计算 cursors
watch(
  () => curComponent.value?.style?.rotate,
  () => {
    state.cursors = getCursorMap()
  }
)

// ==== 6. 辅助函数 ====

// 6.1 计算各个 point（缩放柄）的鼠标光标样式
function getCursorMap() {
  const rotate = mod360(curComponent.value?.style?.rotate || 0)
  const result = {}
  let lastMatchIndex = -1
  pointList.value.forEach((point) => {
    const angle = mod360(state.initialAngle[point] + rotate)
    const len = state.angleToCursor.length
    while (true) {
      lastMatchIndex = (lastMatchIndex + 1) % len
      const angleLimit = state.angleToCursor[lastMatchIndex]
      if (angle < 23 || angle >= 338) {
        result[point] = 'nw-resize'
        return
      }
      if (angleLimit.start <= angle && angle < angleLimit.end) {
        result[point] = `${angleLimit.cursor}-resize`
        return
      }
    }
  })
  return result
}

// 6.2 监听插槽内容尺寸改变，并提交给 Store 更新 shapePosition
function observeElementShape() {
  nextTick(() => {
    const el = slotContainer.value
    if (!el) return
    const ro = new ResizeObserver()
    const callback = () => {
      nextTick(() => {
        store.commit('printTemplateModule/setShapePosition', {
          width: el.clientWidth,
          height: el.clientHeight
        })
      })
    }
    ro.onElResize(el, callback)
  })
}

// 6.3 根据 point 与 defaultStyle 计算每个缩放柄的位置、鼠标光标
function getPointStyle(point) {
  let { width, height } = props.defaultStyle
  const adj = adjuster.value
  if (adj && (!width || isNaN(width) || !height || isNaN(height))) {
    width = adj.clientWidth
    height = adj.clientHeight
  }
  const hasT = /t/.test(point)
  const hasB = /b/.test(point)
  const hasL = /l/.test(point)
  const hasR = /r/.test(point)
  let newLeft = 0
  let newTop = 0

  // “双字母”代表角落，单字母代表边缘
  if (point.length === 2) {
    newLeft = hasL ? 0 : width
    newTop = hasT ? 0 : height
  } else {
    if (hasT || hasB) {
      newLeft = width / 2
      newTop = hasT ? 0 : height
    }
    if (hasL || hasR) {
      newLeft = hasL ? 0 : width
      newTop = Math.floor(height / 2)
    }
  }

  return {
    marginLeft: '-4px',
    marginTop: '-4px',
    left: `${newLeft}px`,
    top: `${newTop}px`,
    cursor: state.cursors[point]
  }
}

// 6.4 处理“旋转”操作
function handleRotate(e) {
  store.commit('printTemplateModule/setClickComponentStatus', true)
  e.preventDefault()
  e.stopPropagation()

  // 保存初始状态
  const pos = { ...props.defaultStyle }
  const startY = e.clientY
  const startX = e.clientX
  const startRotate = pos.rotate
  const rect = adjuster.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const rotateBefore = Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180)

  let hasMoved = false

  function onMove(moveEvent) {
    hasMoved = true
    const curX = moveEvent.clientX
    const curY = moveEvent.clientY
    const rotateAfter = Math.atan2(curY - centerY, curX - centerX) / (Math.PI / 180)
    pos.rotate = startRotate + (rotateAfter - rotateBefore)
    store.commit('printTemplateModule/setShapeStyle', pos)
  }
  function onUp() {
    if (hasMoved) {
      store.commit('printTemplateModule/recordSnapshot')
    }
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    state.cursors = getCursorMap()
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

// 6.5 解除“绑定”操作
function unlinkElement() {
  store.commit('printTemplateModule/setBindValue', {
    id: props.element.id,
    bindValue: null
  })
  store.commit('printTemplateModule/setPropValue', {
    id: props.element.id,
    propValue: ''
  })
}

// 6.6 处理“按住角落/边缘”开始拖拽调整大小
function handleMouseDownOnPoint(point, e) {
  store.commit('printTemplateModule/setInEditorStatus', true)
  store.commit('printTemplateModule/setClickComponentStatus', true)
  e.stopPropagation()
  e.preventDefault()

  const styleCopy = { ...props.defaultStyle }
  const elementNode = adjuster.value.querySelector(
    `#roy-component-${props.element.id}`
  )

  let newStyle = {
    ...styleCopy,
    width: isNaN(styleCopy.width) ? elementNode.clientWidth : styleCopy.width,
    height: isNaN(styleCopy.height)
      ? elementNode.clientHeight
      : styleCopy.height
  }

  const proportion = newStyle.width / newStyle.height
  const center = {
    x: newStyle.left + newStyle.width / 2,
    y: newStyle.top + newStyle.height / 2
  }

  const editorRect = editor.value.getBoundingClientRect()
  const pointRect = e.target.getBoundingClientRect()
  const curPoint = {
    x:
      Math.round(pointRect.left / props.scale) -
      Math.round(editorRect.left) / props.scale +
      e.target.offsetWidth / props.scale / 2,
    y:
      Math.round(pointRect.top / props.scale) -
      Math.round(editorRect.top) / props.scale +
      e.target.offsetHeight / props.scale / 2
  }
  const symmetricPoint = {
    x: center.x - (curPoint.x - center.x),
    y: center.y - (curPoint.y - center.y)
  }

  let needSave = false
  let firstMove = true
  const isTable = ['RoySimpleTable', 'RoyComplexTable'].includes(
    props.element.component
  )
  const needLockProp = isNeedLockProportion()

  function onMoveResize(moveEvent) {
    if (firstMove) {
      firstMove = false
      return
    }
    needSave = true
    const curPosition = {
      x:
        (moveEvent.clientX - Math.round(editorRect.left)) / props.scale,
      y:
        (moveEvent.clientY - Math.round(editorRect.top)) / props.scale
    }

    calculateComponentPositionAndSize(
      point,
      newStyle,
      curPosition,
      proportion,
      needLockProp,
      { center, curPoint, symmetricPoint },
      isTable ? elementNode.clientHeight : 0
    )

    store.commit('printTemplateModule/setShapeStyle', {
      ...newStyle,
      height: props.element.isSyncWH
        ? Math.max(newStyle.width, newStyle.height)
        : newStyle.height,
      width: isTable
        ? 'auto'
        : props.element.isSyncWH
        ? Math.max(newStyle.width, newStyle.height)
        : newStyle.width
    })
  }
  function onUpResize() {
    if (needSave) {
      store.commit('printTemplateModule/recordSnapshot')
    }
    document.removeEventListener('mousemove', onMoveResize)
    document.removeEventListener('mouseup', onUpResize)
  }

  document.addEventListener('mousemove', onMoveResize)
  document.addEventListener('mouseup', onUpResize)
}

// 6.7 判断 Group 组件是否需要锁宽高比
function isNeedLockProportion() {
  if (props.element.component !== 'RoyGroup') return false
  const rotates = [0, 90, 180, 360]
  for (const child of props.element.propValue) {
    if (!rotates.includes(mod360(parseInt(child.style.rotate)))) {
      return true
    }
  }
  return false
}

// 6.8 选中整个组件时，阻止冒泡
function selectCurComponent(e) {
  e.stopPropagation()
  e.preventDefault()
}

// 6.9 拖动整个组件时触发“移动”逻辑
function handleMouseMoveItem(e) {
  if (!isActive.value) return
  const adjustNode = adjuster.value.querySelector(
    `#roy-component-${props.element.id}`
  )
  const pos = { ...props.defaultStyle }
  const startY = e.clientY
  const startX = e.clientX
  const startTop = Number(pos.top)
  const startLeft = Number(pos.left)
  let hasMoved = false

  function onMove(moveEvent) {
    hasMoved = true
    const curX = moveEvent.clientX
    const curY = moveEvent.clientY
    const editorRectEl = editor.value
    pos.top = Math.min(
      Math.max(0, (curY - startY) / props.scale + startTop),
      editorRectEl.offsetHeight - adjustNode.offsetHeight
    )
    pos.left = Math.min(
      Math.max(0, (curX - startX) / props.scale + startLeft),
      editorRectEl.offsetWidth - adjustNode.offsetWidth
    )
    store.commit('printTemplateModule/setShapeStyle', pos)
    nextTick(() => {
      eventBus.$emit(
        'move',
        curY - startY > 0,
        curX - startX > 0,
        curX,
        curY
      )
    })
  }

  function onUp() {
    if (hasMoved) {
      store.commit('printTemplateModule/recordSnapshot')
    }
    eventBus.$emit('unmove')
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

// 6.10 点击 adjuster 背景区域：阻止冒泡（不让父级取消选中）
function handleMouseDownOnShape(e) {
  nextTick(() => eventBus.$emit('componentClick'))
  store.commit('printTemplateModule/setInEditorStatus', true)
  store.commit('printTemplateModule/setClickComponentStatus', true)
  if (isPreventDrop(props.element.component)) {
    e.preventDefault()
  }
  e.stopPropagation()
  store.commit('printTemplateModule/setCurComponent', {
    component: props.element,
    index: props.index
  })
  store.commit('printTemplateModule/setPaletteCount')
  if (!props.element.isLock) {
    state.cursors = getCursorMap()
  }
}
</script>

<style lang="scss">
.roy-component-adjuster {
  margin: 0;
  padding: 0;
  position: absolute;
  user-select: none;

  &:hover {
    border: 0.5px dotted var(--roy-text-color-secondary);
  }

  .roy-component-adjuster__rotate {
    position: absolute;
    top: -28px;
    left: 50%;
    transform: translateX(-50%);
    cursor: grab;
    color: var(--roy-text-color-regular);
    font-size: 10px;
    font-weight: 400;

    &:active {
      cursor: grabbing;
    }

    &:after {
      content: '';
      height: 20px;
      border-right: var(--roy-text-color-regular) dashed 1px;
      position: absolute;
      left: 5.5px;
      top: 12px;
    }
  }

  .roy-component-adjuster__lock {
    position: absolute;
    top: -15px;
    right: 0;
    z-index: 9;
  }

  .roy-component-adjuster__move {
    position: absolute;
    top: 0;
    left: -25px;
    z-index: 9;
    padding: 2px;
    font-size: 10px;
    border-radius: 2px;
    font-weight: 100;
    cursor: move;
    background: var(--roy-color-primary-light-7);
    color: #aaaaaa;

    &:hover {
      color: #212121;
    }

    &:active {
      color: #212121;
      background: var(--roy-color-primary-light-3);
    }
  }

  .roy-component-adjuster__bind {
    position: absolute;
    top: 20px;
    left: -25px;
    z-index: 9;
    cursor: pointer;
    border-radius: 2px;
    padding: 2px;
    font-size: 10px;
    background: #ffffff;
    color: #999;
  }

  [class^='roy-component-adjuster__shape-point--'] {
    position: absolute;
    border: 1px solid var(--roy-color-primary);
    box-shadow: 0 0 2px #bbb;
    background: #fff;
    width: 6px;
    height: 6px;
    border-radius: 0;
    z-index: 9;
  }

  .adjuster-container {
    cursor: initial;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
</style>
