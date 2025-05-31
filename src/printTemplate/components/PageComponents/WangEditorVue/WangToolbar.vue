<template>
  <div ref="box"></div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { createToolbar, DomEditor } from '@wangeditor/editor'

// 定义接收的 props
const props = defineProps({
  editor: {
    type: Object,
    default: null
  }, 
  defaultConfig: {
    type: Object,
    default: () => ({})
  },
  mode: {
    type: String,
    default: 'default'
  }
})

// 用于获取 <div ref="box"> 的引用
const box = ref(null)

/**
 * 创建 toolbar
 */
function create(editor) {
  // 如果挂载点还不存在，直接返回
  if (box.value == null) return
  // 如果 editor 不存在，也返回
  if (editor == null) return
  // 如果该 editor 已经有 toolbar，就不要重复创建
  if (DomEditor.getToolbar(editor)) return

  createToolbar({
    editor,
    selector: box.value,
    config: props.defaultConfig || {},
    mode: props.mode || 'default'
  })
}

// 监听 props.editor 的变化，editor 只要不为 null 就调用 create
watch(
  () => props.editor,
  (newEditor) => {
    if (newEditor == null) return
    create(newEditor)
  },
  { immediate: true }
)
</script>
