<template>
  <div class="roy-mark-line">
    <div
      v-for="line in lines"
      :key="line"
      v-show="lineStatus[line]"
      :id="`rot-editor-line-${line}`"
      :class="[
        'roy-mark-line__line',
        line.startsWith('x')
          ? 'roy-mark-line--xline'
          : 'roy-mark-line--yline'
      ]"
    ></div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import eventBus from '@/printTemplate/utils/eventBus'
import { getComponentRotatedStyle } from '@/printTemplate/utils/style-util.js'

// Vuex
const store = useStore()
const componentData = computed(() => store.state.printTemplateModule.componentData)
const curComponent   = computed(() => store.state.printTemplateModule.curComponent)

// Lines and their visibility state
const lines = ['xt','xc','xb','yl','yc','yr']
const diff = 3
const lineStatus = reactive({
  xt: false, xc: false, xb: false,
  yl: false, yc: false, yr: false
})

// Helpers
function hideLine() {
  for (const key of Object.keys(lineStatus)) {
    lineStatus[key] = false
  }
}
function isNearly(a, b) {
  return Math.abs(a - b) <= diff
}
function translateShift(key, cond, curStyle) {
  const { width, height } = curComponent.value.style
  if (key === 'top') {
    return Math.round(cond.dragShift - (height - curStyle.height) / 2)
  }
  return Math.round(cond.dragShift - (width - curStyle.width) / 2)
}
function chooseTrueLine(need, isDownward, isRightward) {
  // vertical
  if (isRightward) {
    if (need.includes('yr')) lineStatus.yr = true
    else if (need.includes('yc')) lineStatus.yc = true
    else if (need.includes('yl')) lineStatus.yl = true
  } else {
    if (need.includes('yl')) lineStatus.yl = true
    else if (need.includes('yc')) lineStatus.yc = true
    else if (need.includes('yr')) lineStatus.yr = true
  }
  // horizontal
  if (isDownward) {
    if (need.includes('xb')) lineStatus.xb = true
    else if (need.includes('xc')) lineStatus.xc = true
    else if (need.includes('xt')) lineStatus.xt = true
  } else {
    if (need.includes('xt')) lineStatus.xt = true
    else if (need.includes('xc')) lineStatus.xc = true
    else if (need.includes('xb')) lineStatus.xb = true
  }
}

// Core logic: show alignment lines on move
function showLineMove(isDownward, isRightward) {
  const comps = componentData.value || []
  const curStyle = getComponentRotatedStyle(curComponent.value?.style || {})
  const halfW = curStyle.width / 2
  const halfH = curStyle.height / 2

  hideLine()
  for (const comp of comps) {
    if (comp === curComponent.value) continue
    const s = getComponentRotatedStyle(comp.style)
    const { top, left, bottom, right } = s
    const halfCW = s.width / 2
    const halfCH = s.height / 2

    const conditions = {
      top: [
        { isNearly: isNearly(curStyle.top,    top),  line: 'xt', dragShift: top,                     lineShift: top },
        { isNearly: isNearly(curStyle.bottom, top),  line: 'xt', dragShift: top - curStyle.height,  lineShift: top },
        { isNearly: isNearly(curStyle.top+halfH, top+halfCH), line:'xc', dragShift: top+halfCH-halfH, lineShift: top+halfCH },
        { isNearly: isNearly(curStyle.top,    bottom), line:'xb', dragShift: bottom,                  lineShift: bottom },
        { isNearly: isNearly(curStyle.bottom, bottom), line:'xb', dragShift: bottom-curStyle.height,  lineShift: bottom }
      ],
      left: [
        { isNearly: isNearly(curStyle.left,   left),  line:'yl', dragShift: left,                     lineShift: left },
        { isNearly: isNearly(curStyle.right,  left),  line:'yl', dragShift: left-curStyle.width,      lineShift: left },
        { isNearly: isNearly(curStyle.left+halfW, left+halfCW), line:'yc', dragShift: left+halfCW-halfW, lineShift: left+halfCW },
        { isNearly: isNearly(curStyle.left,   right), line:'yr', dragShift: right,                    lineShift: right },
        { isNearly: isNearly(curStyle.right,  right), line:'yr', dragShift: right-curStyle.width,     lineShift: right }
      ]
    }

    const need = []
    const rotate = curComponent.value.style.rotate
    for (const key of Object.keys(conditions)) {
      for (const cond of conditions[key]) {
        if (!cond.isNearly) continue
        // reposition dragging component
        store.commit('printTemplateModule/setShapeSingleStyle', {
          key,
          value: rotate !== 0
            ? translateShift(key, cond, curStyle)
            : cond.dragShift
        })
        // position the guideline
        const el = document.getElementById(`rot-editor-line-${cond.line}`)
        if (el) el.style[key] = `${cond.lineShift}px`
        need.push(cond.line)
      }
    }
    if (need.length) chooseTrueLine(need, isDownward, isRightward)
  }
}

// Event handlers
function onMove(isDown, isRight) {
  showLineMove(isDown, isRight)
}
function onUnmove() {
  hideLine()
}

// Register/deregister listeners
onMounted(() => {
  eventBus.on('move',   onMove)
  eventBus.on('unmove', onUnmove)
}) 
onUnmounted(() => {
  eventBus.off('move',   onMove)
  eventBus.off('unmove', onUnmove)
})
</script>

<style scoped lang="scss">
.roy-mark-line {
  height: 100%;
}
.roy-mark-line__line {
  position: absolute;
  z-index: 1000;
  background: var(--roy-color-primary);
}
.roy-mark-line--xline {
  width: 100%;
  height: 0.5px;
}
.roy-mark-line--yline {
  width: 0.5px;
  height: 100%;
}
</style>
