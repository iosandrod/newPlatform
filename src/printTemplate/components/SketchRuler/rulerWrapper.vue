<template>
  <div :class="rwClassName" :style="rwStyle">
    <CanvasRuler
      :canvas-configs="canvasConfigs"
      :height="height"
      :scale="scale"
      :select-length="selectLength"
      :select-start="selectStart"
      :start="start"
      :vertical="vertical"
      :width="width"
      @onAddLine="handleNewLine"
      @onIndicatorHide="handleIndicatorHide"
      @onIndicatorMove="handleIndicatorMove"
      @onIndicatorShow="handleIndicatorShow"
    />
    <div v-show="isShowReferLine" class="lines">
      <LineRuler
        v-for="(v, i) in lines"
        :key="`${v}-${i}`"
        :index="i"
        :is-show-refer-line="isShowReferLine"
        :palette="palette"
        :scale="scale"
        :start="start"
        :thick="thick"
        :value="v >> 0"
        :vertical="vertical"
        @onMouseDown="handleLineDown"
        @onRelease="handleLineRelease"
        @onRemove="handleLineRemove"
      />
    </div>
    <div v-show="showIndicator" :style="indicatorStyle" class="indicator">
      <div class="value">{{ value }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, toRefs } from 'vue'
import { defineProps, defineEmits } from 'vue'
import CanvasRuler from './canvasRuler/canvasRuler.vue'
import LineRuler from './line.vue'

// 定义 props
const props = defineProps({
  vertical: Boolean,
  scale: Number,
  width: Number,
  thick: Number,
  height: Number,
  start: Number,
  lines: {
    type: Array,
    default: () => []
  },
  selectStart: Number,
  selectLength: Number,
  canvasConfigs: Object,
  palette: Object,
  isShowReferLine: Boolean,
  onShowRightMenu: Function,
  handleShowReferLine: Function
})

// 定义可触发的事件
const emit = defineEmits(['onLineChange'])

// 解构 props 以便在模板中使用
const {
  vertical,
  scale,
  width,
  thick,
  height,
  start,
  lines,
  selectStart,
  selectLength,
  canvasConfigs,
  palette,
  isShowReferLine
} = toRefs(props)

// 本地状态
const isDraggingLine = ref(false)
const showIndicator = ref(false)
const value = ref(0)

// 计算类名：水平或垂直容器
const rwClassName = computed(() => (vertical.value ? 'v-container' : 'h-container'))

// 计算样式：根据方向调整宽高与偏移
const rwStyle = computed(() => {
  if (vertical.value) {
    return {
      width: `${thick.value + 1}px`,
      height: `calc(100% - ${thick.value}px)`,
      top: `${thick.value}px`
    }
  } else {
    return {
      width: `calc(100% - ${thick.value}px)`,
      height: `${thick.value + 1}px`,
      left: `${thick.value}px`
    }
  }
})

// 计算指示器样式：位置与边框
const indicatorStyle = computed(() => {
  const offset = (value.value - start.value) * scale.value
  const posKey = vertical.value ? 'top' : 'left'
  const borderKey = vertical.value ? 'borderBottom' : 'borderLeft'
  return {
    [posKey]: `${offset}px`,
    [borderKey]: `1px solid ${palette.value.lineColor}`
  }
})

// 处理新建对齐线：将新值加入 lines 并触发 onLineChange
function handleNewLine(newValue) {
  // 直接修改 prop 数组（Vue3 暂不报错，但可考虑克隆后赋值）
  lines.value.push(newValue)
  emit('onLineChange', lines.value, vertical.value)
  // 如果需要在此处调用 handleShowReferLine，可取消下面注释
  // !isShowReferLine.value && props.handleShowReferLine()
}

// 当指示器需要显示时，如果未在拖拽，显示并记录值
function handleIndicatorShow(newValue) {
  if (!isDraggingLine.value) {
    showIndicator.value = true
    value.value = newValue
  }
}

// 当指示器移动时，如果正在显示，则更新位置
function handleIndicatorMove(newValue) {
  if (showIndicator.value) {
    value.value = newValue
  }
}

// 隐藏指示器
function handleIndicatorHide() {
  showIndicator.value = false
}

// 开始拖动某条对齐线
function handleLineDown() {
  isDraggingLine.value = true
}

// 拖动结束时，检查线是否超出范围，超出则删除，否则更新并触发 onLineChange
function handleLineRelease(newValue, index) {
  isDraggingLine.value = false

  const offset = newValue - start.value
  const maxOffset = (vertical.value ? height.value : width.value) / scale.value

  if (offset < 0 || offset > maxOffset) {
    handleLineRemove(index)
  } else {
    lines.value[index] = newValue
    emit('onLineChange', lines.value, vertical.value)
  }
}

// 删除指定索引的对齐线，并触发 onLineChange
function handleLineRemove(index) {
  lines.value.splice(index, 1)
  emit('onLineChange', lines.value, vertical.value)
}
</script>

<style lang="scss" scoped>
.line {
  position: absolute;
}

.h-container,
.v-container {
  position: absolute;

  .lines {
    pointer-events: none;
  }

  &:hover .lines {
    pointer-events: auto;
  }
}

.h-container {
  top: 0;

  .line {
    height: 100vh;
    top: 0;
    padding-left: 5px;

    .action {
      transform: translateX(-24px);

      .value {
        margin-left: 4px;
      }
    }
  }

  .indicator {
    top: 0;
    height: 100vw;

    .value {
      padding: 0 2px;
      width: auto;
      margin-left: 4px;
      margin-top: 4px;
    }
  }
}

.v-container {
  left: 0;

  .line {
    width: 100vw;
    left: 0;
    padding-top: 5px;

    .action {
      transform: translateY(-24px);
      flex-direction: column;

      .value {
        margin-top: 4px;
      }
    }
  }

  .indicator {
    width: 100vw;

    .value {
      padding: 0 2px;
      width: auto;
      left: 0;
      margin-left: 2px;
      margin-top: -5px;
      transform-origin: 0 0;
      transform: rotate(-90deg);
    }
  }
}
</style>
 