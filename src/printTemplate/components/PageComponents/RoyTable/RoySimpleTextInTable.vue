<template>
  <div
    class="RoySimpleText"
    style="width: 100%; height: 100%;"
    @click="activeCell"
    @contextmenu.prevent="setEdit"
    @dblclick.prevent="setEdit"
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent.stop="handleDrop"
  >
    <StyledSimpleText
      ref="editAreaRef"
      :class="{
        'can-edit': canEdit,
        'is-drag-over': dragOver, 
      }"
      class="edit-area"
      :contenteditable="canEdit"
      tabindex="0"
      v-bind="styleProp"
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

// Props
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
  curId: {
    type: String,
    default: '',
  },
})

// Emits
const emit = defineEmits([
  'activeCell',
  'update:bindValue',
  'input',
  'componentUpdated',
])

// Vuex store
const store = useStore()

// Local refs and state
const editAreaRef = ref(null)
const canEdit = ref(false)
const dragOver = ref(false)

// Computed: map state
const curComponent = computed(
  () => store.state.printTemplateModule.curComponent,
)
const dataSource = computed(() => store.state.printTemplateModule.dataSource)

// Computed: style object from element
const styleProp = computed(() => props.element.style || {})

// Computed: whether this cell may be edited
const mayEdit = computed(() => props.curId === props.element?.id)

// Methods

function activeCell() {
  emit('activeCell', { id: props.element.id })
}

function setEdit() {
  if (canEdit.value) return
  if (props.bindValue) return
  if (props.element.isLock) return

  canEdit.value = true
  // Select all content and focus
  if (editAreaRef.value) {
    const el = editAreaRef.value.$el || editAreaRef.value
    selectText(el)
    el.focus()
  }
}

function selectText(el) {
  const selection = window.getSelection()
  const range = document.createRange()
  range.selectNodeContents(el)
  selection.removeAllRanges()
  selection.addRange(range)
}

function handleBlur() {
  canEdit.value = false
}

function handleMouseDown(e) {
  if (canEdit.value) {
    e.stopPropagation()
  }
}

function handleKeyDown(e) {
  if (canEdit.value && e.keyCode === 13) {
    e.preventDefault()
    document.execCommand('insertLineBreak')
    return false
  }
}

function clearStyle(e) {
  emit('input', props.element, e.target.innerHTML)
}

function handleDrop(e) {
  // e.preventDefault() and e.stopPropagation() are handled by .prevent.stop in template
  dragOver.value = false

  const index = e.dataTransfer.getData('datasource-index')
  if (index) {
    const bindingDataSource = dataSource.value[index]
    if (bindingDataSource) {
      emit('update:bindValue', bindingDataSource)
      store.commit('printTemplateModule/updateDataValue', {
        data: props.element,
        value: `<span class="roy-binding-value">[绑定:${bindingDataSource.title}]</span>`,
        key: 'propValue',
      })
      emit(
        'componentUpdated',
        `<span class="roy-binding-value">[绑定:${bindingDataSource.title}]</span>`,
      )
      canEdit.value = false
      return
    }
  }
  toast('拖拽元素非数据源元素，此次拖拽无效', 'info')
}

function handleDragEnter() {
  dragOver.value = true
}

function handleDragLeave() {
  dragOver.value = false
}

// Watchers
watch(mayEdit, (newVal) => {
  if (!newVal) {
    canEdit.value = false
  }
})

watch(canEdit, (newVal) => {
  if (!newVal && editAreaRef.value) {
    const el = editAreaRef.value.$el || editAreaRef.value
    store.commit('printTemplateModule/updateDataValue', {
      data: props.element,
      value: el.innerHTML,
      key: 'propValue',
    })
    emit('componentUpdated', el.innerHTML)
  }
})
</script>

<style lang="scss" scoped>
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
