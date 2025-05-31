<template>
  <div
    v-show="showLine"
    :style="[offsetStyle, borderCursorStyle]"
    class="line"
    @mousedown="handleDown"
  >
    <div :style="actionStyle" class="action">
      <span class="del" @click="handleRemove">&times;</span>
      <span class="value">{{ startValue }}</span>
    </div>
  </div>
</template> 

<script setup>
import { ref, computed, onMounted } from 'vue'

// 1. 定义 Props 和 Emits
const props = defineProps({
  index: Number,
  start: Number,
  vertical: Boolean,
  scale: Number,
  value: Number,
  palette: Object,
  isShowReferLine: Boolean,
  thick: Number
})
const emit = defineEmits(['onMouseDown', 'onRelease', 'onRemove'])

// 2. 本地响应式状态
const startValue = ref(0)

// 3. 计算属性：偏移位置
const offsetStyle = computed(() => {
  const offsetPx = (startValue.value - props.start) * props.scale + 'px'
  return props.vertical ? { top: offsetPx } : { left: offsetPx }
})

// 4. 计算是否显示标线
const showLine = computed(() => {
  const offset = (startValue.value - props.start) * props.scale
  return offset >= 0
})

// 5. 计算边框和鼠标样式
const borderCursorStyle = computed(() => {
  const borderValue = `1px solid ${props.palette.lineColor}`
  const border = props.vertical ? { borderTop: borderValue } : { borderLeft: borderValue }
  const cursorValue = props.isShowReferLine
    ? props.vertical
      ? 'ns-resize'
      : 'ew-resize'
    : 'none'
  return { cursor: cursorValue, ...border }
})

// 6. 计算操作面板样式
const actionStyle = computed(() => {
  return props.vertical ? { left: props.thick + 'px' } : { top: props.thick + 'px' }
})

// 7. 初始化 startValue
onMounted(() => {
  startValue.value = props.value
})

// 8. 鼠标按下事件，开始拖动
function handleDown(e) {
  const startCoord = props.vertical ? e.clientY : e.clientX
  const initValue = startValue.value

  emit('onMouseDown')
  const onMove = (moveEvent) => {
    const currentCoord = props.vertical ? moveEvent.clientY : moveEvent.clientX
    startValue.value = Math.round(initValue + (currentCoord - startCoord) / props.scale)
  }
  const onUp = () => {
    emit('onRelease', startValue.value, props.index)
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

// 9. 移除线条
function handleRemove() {
  emit('onRemove', props.index)
}
</script>

<style lang="scss" scoped>
.line {
  position: absolute;

  .action {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .value {
    pointer-events: none;
    transform: scale(0.83);
  }

  .del {
    cursor: pointer;
    padding: 3px 5px;
    visibility: hidden;
  }

  &:hover .del {
    visibility: visible;
  }
}

.h-container {
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
}

.v-container {
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
}
</style>
