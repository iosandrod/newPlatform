<template>
  <div class="wrapper">
    <SketchRule
      :cornerActive="true"
      :height="482"
      :horLineArr="lines.h"
      :lang="lang"
      :scale="scale"
      :shadow="shadow"
      :startX="startX"
      :startY="startY"
      :thick="thick"
      :verLineArr="lines.v"
      :width="582"
      @handleLine="handleLine"
      @onCornerClick="handleCornerClick"
    />
    <div id="screens" ref="screensRef" @scroll="handleScroll" @wheel="handleWheel">
      <div ref="containerRef" class="screen-container">
        <div id="canvas" :style="canvasStyle" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import SketchRule from './sketchRuler.vue'

const rectWidth = 160
const rectHeight = 200

const scale = ref(2)
const startX = ref(0)
const startY = ref(0)
const thick = ref(20)
const lang = ref('zh-CN')

const lines = reactive({
  h: [100, 200],
  v: [100, 200]
})

const screensRef = ref(null)
const containerRef = ref(null)

const shadow = computed(() => ({
  x: 0,
  y: 0,
  width: rectWidth,
  height: rectHeight
}))

const canvasStyle = computed(() => ({
  width: rectWidth + 'px',
  height: rectHeight + 'px',
  transform: `scale(${scale.value})`
}))

function handleLine(newLines) {
  lines.h = newLines.h
  lines.v = newLines.v
}

function handleCornerClick() {
  // Do nothing for now
}

function handleScroll() {
  const screensRect = screensRef.value.getBoundingClientRect()
  const canvasRect = document.querySelector('#canvas').getBoundingClientRect()

  startX.value = (screensRect.left + thick.value - canvasRect.left) / scale.value
  startY.value = (screensRect.top + thick.value - canvasRect.top) / scale.value
}

function handleWheel(e) {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
    const nextScale = parseFloat(Math.max(0.2, scale.value - e.deltaY / 500).toFixed(2))
    scale.value = nextScale
  }
  nextTick(() => {
    handleScroll()
  })
}

onMounted(() => {
  const width = containerRef.value.getBoundingClientRect().width
  screensRef.value.scrollLeft = width / 2 - 300
})
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  overflow: hidden;
}
body * {
  box-sizing: border-box;
  user-select: none;
}
.wrapper {
  background-color: #f5f5f5;
  position: absolute;
  top: 100px;
  left: 100px;
  width: 600px;
  height: 500px;
  border: 1px solid #dadadc;
}
#screens {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
}
.screen-container {
  position: absolute;
  width: 5000px;
  height: 3000px;
}
#canvas {
  position: absolute;
  top: 80px;
  left: 50%;
  margin-left: -80px;
  width: 160px;
  height: 200px;
  background: lightblue;
  transform-origin: 50% 0;
}
</style>
