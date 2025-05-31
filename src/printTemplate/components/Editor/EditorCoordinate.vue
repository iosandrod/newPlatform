<!--
 * @description 坐标
 * @filename EditorCoordinate.vue
 * @author ROYIANS
 * @date 2022/10/21
-->
<template>
  <div
    v-show="showCoordinate"
    :style="coordinateStyle"
    class="roy-editor-coordinate"
  >
    {{ left }},{{ top }}
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import eventBus from '@/printTemplate/utils/eventBus'
import Big from 'big.js'

// Vuex store
const store = useStore()
const curComponent = computed(() => store.state.printTemplateModule.curComponent)

// reactive state
const x = ref(0)
const y = ref(0)
const left = ref(0)
const top = ref(0)
const showCoordinate = ref(false)

// computed style string
const coordinateStyle = computed(() => 
  `left: ${x.value + 10}px; top: ${y.value + 10}px`
)

// handlers
function onMove(isDownward, isRightward, curX, curY) {
  showCoordinate.value = true 
  x.value = curX
  y.value = curY
  const style = curComponent.value?.style || {}
  left.value = new Big(style.left || 0).div(5).toNumber()
  top.value  = new Big(style.top  || 0).div(5).toNumber()
}

function onUnmove() {
  showCoordinate.value = false
}

// register events
onMounted(() => {
  eventBus.on('move',   onMove)
  eventBus.on('unmove', onUnmove)
})

// cleanup
onUnmounted(() => {
  eventBus.off('move',   onMove)
  eventBus.off('unmove', onUnmove)
})
</script>

<style scoped lang="scss">
.roy-editor-coordinate {
  height: 14px;
  font-size: 10px;
  line-height: 14px;
  text-align: center;
  padding: 3px 6px;
  background: var(--roy-color-primary);
  color: #ffffff;
  position: fixed;
  border-radius: 2px;
  transform: scale(0.9);
}
</style>
