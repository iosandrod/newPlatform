<!-- DesignerMain.vue -->
<template>
  <section class="height-all">
    <ToolBar>
      <template #roy-designer-toolbar-slot>
        <slot name="roy-designer-toolbar-slot"></slot>
      </template>
    </ToolBar>
    <div
      class='w-full h-full'
      @dragover.prevent="handleDragOver"
      @drop.prevent.stop="handleDrop"
      @mousedown="handleMouseDown"
      @mouseup="deselectCurComponent"
    >
      <Editor :show-right="showRight" />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import ToolBar from '@/printTemplate/components/ToolBar/ToolBar.vue'
import Editor from '@/printTemplate/components/Editor/Editor.vue'
import { componentList } from '@/printTemplate/components/config/componentList'
import toast from '@/printTemplate/utils/toast'
import { deepCopy, getUuid } from '@/printTemplate/utils/html-util.js'

// Props
const props = defineProps({
  showRight: {
    type: Boolean,
    default: true
  }
})

// Vuex store
const store = useStore()

// Computed from Vuex state (replacing mapState)
const isClickComponent = computed(
  () => store.state.printTemplateModule.isClickComponent
)

/**
 * handleDrop: When user drops a component onto the canvas
 */
function handleDrop(event) {
  // event.preventDefault() and event.stopPropagation() are handled by @drop.prevent.stop
  const code = event.dataTransfer.getData('code')
  const canvasEl = document.querySelector('#designer-page')
  if (!canvasEl) {
    return
  }
  const rectInfo = canvasEl.getBoundingClientRect()

  if (code) {
    // Find matching template by code
    const template = componentList.find((item) => item.code === code)
    if (template) {
      // Deep‐copy (imported helper)
      const component = deepCopy(template)
      component.style = component.style || {}

      // Position at drop point, relative to canvas top-left
      component.style.top  = event.clientY - rectInfo.y
      component.style.left = event.clientX - rectInfo.x

      // Assign a unique ID and label
      component.id    = getUuid()
      component.label = `${component.name}-${component.id}`

      // Commit to Vuex
      store.commit('printTemplateModule/addComponent', { component })
      store.commit('printTemplateModule/recordSnapshot')
      return
    }
  }

  // If dropped item did not carry a valid component code:
  toast('拖拽元素非页面组件，此次拖拽无效', 'info')
}

/**
 * handleDragOver: allow copy effect
 */
function handleDragOver(event) {
  // @dragover.prevent already prevents default
  event.dataTransfer.dropEffect = 'copy'
}

/**
 * handleMouseDown: deselect current component if clicking in blank area
 */
function handleMouseDown(event) {
  event.stopPropagation()
  store.commit('printTemplateModule/setClickComponentStatus', false)
  store.commit('printTemplateModule/setInEditorStatus', true)
}

/**
 * deselectCurComponent: if no component was clicked, clear selection
 */
function deselectCurComponent() {
  if (!isClickComponent.value) {
    store.commit('printTemplateModule/setCurComponent', {
      component: null,
      index: null
    })
    store.commit('printTemplateModule/setComponentsCount')
  }
}
</script>

<style lang="scss">
.height-all {
  height: 100%;
}

</style>
