<template>
  <canvas
    ref="canvasRef"
    class="ruler"
    @click="handleClick"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
    @mousemove="handleMove"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { drawHorizontalRuler, drawVerticalRuler } from './utils'

// props
const props = defineProps({
  vertical: Boolean,
  start: Number,
  scale: Number,
  width: Number,
  height: Number,
  canvasConfigs: Object,
  selectStart: Number,
  selectLength: Number
})

// emits
const emit = defineEmits([
  'onAddLine',
  'onIndicatorShow',
  'onIndicatorMove',
  'onIndicatorHide'
])

// refs
const canvasRef = ref(null)
let canvasContext = null

// helper to compute value
const getValueByOffset = (offset, start, scale) =>
  Math.round(start + offset / scale)

// initialize the Canvas 2D context
function initCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvasContext = canvas.getContext('2d')
}

// update canvas size and context settings
function updateCanvasContext() {
  const { ratio } = props.canvasConfigs || {}
  const canvas = canvasRef.value
  if (!canvas || !canvasContext) return

  canvas.width  = props.width  * ratio
  canvas.height = props.height * ratio

  const ctx = canvasContext
  ctx.font         = `${12 * ratio}px -apple-system, "Helvetica Neue", Arial, sans-serif`
  ctx.lineWidth    = 1
  ctx.textBaseline = 'middle'
}

// draw the ruler (horizontal or vertical)
function drawRuler() {
  if (!canvasContext) return

  const options = {
    scale: props.scale,
    width: props.width,
    height: props.height,
    canvasConfigs: props.canvasConfigs
  }

  if (props.vertical) {
    drawVerticalRuler(
      canvasContext,
      props.start,
      { y: props.selectStart, height: props.selectLength },
      options
    )
  } else {
    drawHorizontalRuler(
      canvasContext,
      props.start,
      { x: props.selectStart, width: props.selectLength },
      options
    )
  }
}

// event handlers
function handleClick(e) {
  const offset = props.vertical ? e.offsetY : e.offsetX
  const value  = getValueByOffset(offset, props.start, props.scale)
  emit('onAddLine', value)
}

function handleEnter(e) {
  const offset = props.vertical ? e.offsetY : e.offsetX
  const value  = getValueByOffset(offset, props.start, props.scale)
  emit('onIndicatorShow', value)
}

function handleMove(e) {
  const offset = props.vertical ? e.offsetY : e.offsetX
  const value  = getValueByOffset(offset, props.start, props.scale)
  emit('onIndicatorMove', value)
}

function handleLeave() {
  emit('onIndicatorHide')
}

// lifecycle
onMounted(() => {
  initCanvas()
  updateCanvasContext()
  drawRuler()
})

// re-draw when key props change
watch(() => props.start,     drawRuler)
watch(() => props.width,     () => { updateCanvasContext(); drawRuler() })
watch(() => props.height,    () => { updateCanvasContext(); drawRuler() })
</script>

<style scoped>
.ruler {
  display: block;
  /* 可根据需要再加其他样式 */
}
</style>
