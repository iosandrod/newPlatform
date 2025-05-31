<!-- RoySimpleText.vue -->
<template>
  <div
    class="RoySimpleText"
    style="width: 100%; height: 100%"
    @click="setEdit"
    @contextmenu.prevent="setEdit"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @drop.prevent.stop="handleDrop"
  >
    <StyledSimpleText
      ref="editAreaRef"
      :class="{
        'can-edit': canEdit,
        'is-drag-over': dragOver
      }"
      :contenteditable="canEdit"
      class="edit-area"
      tabindex="0"
      v-bind="element.style"
      @blur="handleBlur"
      @keydown="handleKeyDown"
      @mousedown="handleMouseDown"
      @paste="clearStyle"
    >
      <div class="roy-simple-text-inner" v-html="propValue"></div>
    </StyledSimpleText>
  </div>
</template>
 
<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { StyledSimpleText } from '@/printTemplate/components/PageComponents/style'
import toast from '@/printTemplate/utils/toast'

/**
 * props
 */
const props = defineProps({
  element: {
    type: Object,
    default: () => ({}),
  },
  propValue: {
    type: String,
    default: '',
  },
  bindValue: {
    type: Object,
    default: null,
  },
})

/**
 * store access
 */
const store = useStore()

// computed from Vuex state
const curComponent = computed(() => store.state.printTemplateModule.curComponent)
const dataSource   = computed(() => store.state.printTemplateModule.dataSource)

/**
 * reactive state
 */
const canEdit  = ref(false)
const dragOver = ref(false)

/**
 * ref to the StyledSimpleText component instance
 */
const editAreaRef = ref(null)

/**
 * Computed: “mayEdit” – only allow editing if this element is the currently selected component
 */
const mayEdit = computed(() => {
  return curComponent.value?.id === props.element?.id
})

/**
 * setEdit()
 * Invoked on click or contextmenu – enables editing if allowed.
 */
function setEdit() {
  if (canEdit.value) {
    return
  }
  // If bound to a data source, don’t enter manual edit
  if (props.bindValue) {
    return
  }
  // If locked, don’t edit
  if (props.element.isLock) {
    return
  }
  // Otherwise enable editing
  canEdit.value = true

  // Select all text in the inner editable area
  selectText(editAreaDOM())

  // Focus the editable area
  editAreaDOM().focus()
}

/**
 * Helper: returns the raw DOM node inside StyledSimpleText
 */
function editAreaDOM() {
  // editAreaRef.value is the component instance; its `$el` is the underlying root DOM node
  return editAreaRef.value?.$el ?? null
}

/**
 * Select all text inside a given element
 */
function selectText(el) {
  if (!el) return
  const selection = window.getSelection()
  const range     = document.createRange()
  range.selectNodeContents(el)
  selection.removeAllRanges()
  selection.addRange(range)
}

/**
 * handleDrop – when user drops a data‐source item into this text field
 */
function handleDrop(event) {
  // `@drop.prevent.stop` already prevents default + stops propagation
  dragOver.value = false
  const index = event.dataTransfer.getData('datasource-index')
  if (index) {
    const bindingDataSource = dataSource.value[index]
    if (bindingDataSource) {
      // Commit binding
      store.commit('printTemplateModule/setBindValue', {
        id: props.element.id,
        bindValue: bindingDataSource,
      })
      store.commit('printTemplateModule/setPropValue', {
        id: props.element.id,
        propValue: `<span class="roy-binding-value">[绑定:${bindingDataSource.title}]</span>`,
      })
      canEdit.value = false
      return
    }
  }
  toast('拖拽元素非数据源元素，此次拖拽无效', 'info')
}

/**
 * handleBlur – leave editing mode
 */
function handleBlur() {
  canEdit.value = false
}

/**
 * handleMouseDown – if editing, stop propagation so parent drag/selection doesn’t interfere
 */
function handleMouseDown(event) {
  if (canEdit.value) {
    event.stopPropagation()
  }
}

/**
 * handleKeyDown – on Enter, insert line-break rather than blur or submit
 */
function handleKeyDown(event) {
  if (canEdit.value && event.key === 'Enter') {
    event.preventDefault()
    document.execCommand('insertLineBreak')
    return false
  }
}

/**
 * clearStyle – emit an “input” event carrying the changed HTML
 */
function clearStyle(event) {
  const html = event.target.innerHTML
  // Proxy the old Vue2 `@input` pattern: we emit “input” with (element, newHtml)
  // Parent might have v-model equivalent
  emit('update:propValue', html) // or simply `emit('input', props.element, html)` if parent expects old signature
}

/**
 * handleDragEnter / handleDragLeave – toggle dragOver
 */
function handleDragEnter() {
  dragOver.value = true
}
function handleDragLeave() {
  dragOver.value = false
}

/**
 * Watchers
 */
// Whenever `mayEdit` becomes false, turn off `canEdit`
watch(mayEdit, (newVal) => {
  if (!newVal) {
    canEdit.value = false
  }
})

// When `canEdit` flips from true→false (user stopped editing),
// commit the final content back to Vuex
watch(canEdit, (newVal) => {
  if (!newVal) {
    const finalHtml = editAreaDOM()?.innerHTML || ''
    store.commit('printTemplateModule/setPropValue', {
      id: props.element.id,
      propValue: finalHtml,
    })
  }
})
</script>

<style lang="scss">
.RoySimpleText {
  .edit-area {
    width: 100%;
    height: 100%;
    outline: none;
    word-break: break-all;
  }

  .is-drag-over {
    border: 2px solid var(--roy-color-warning);
    background: #cccccc;
  }

  .can-edit {
    height: 100%;
    cursor: text;
  }
}
</style>
