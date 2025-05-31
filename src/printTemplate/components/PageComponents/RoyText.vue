<template>
  <div style="width: 100%; height: 100%;" @dblclick="onDblClick">
    <!-- <RoyModal
      v-if="showEditor"
      v-model:show="showEditor"
      height="70%"
      title="长文本编辑"
      width="60%"
      @close="handleTextClosed"
    >
      <div class="roy-wang-editor" @mousedown="handleMouseDown">
        <WangToolbar
          :defaultConfig="toolbarConfig"
          :editor="wangEditor"
          style="border-bottom: 1px solid #ccc;"
        />
        <WangEditor
          v-model="html"
          :defaultConfig="editorConfig"
          :mode="mode"
          style="height: 300px;"
          @onCreated="onCreated"
        />
      </div>
    </RoyModal> -->
    <StyledText v-bind="style">
      <div class="roy-text-inner" v-html="propValue"></div>
    </StyledText>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, computed, inject } from 'vue'
import { useStore, mapState } from 'vuex'
import { StyledText } from '@/printTemplate/components/PageComponents/style'
import RoyModal from '@/printTemplate/components/RoyModal/RoyModal.vue'
import WangToolbar from '@/printTemplate/components/PageComponents/WangEditorVue/WangToolbar.vue'
import WangEditor from '@/printTemplate/components/PageComponents/WangEditorVue/WangEditor.vue'
import {
  toolBarConfig,
  editorConfig as _editorConfig,
  mode,
} from '@/printTemplate/components/config/editorConfig'
import commonMixin from '@/printTemplate/mixin/commonMixin'
import { System } from '@/system'
let sys: System = inject('systemIns')
// console.log(sys, 'sfsfsdfs') //
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
})

// Mixin (Vue 3 still supports options-based mixins; to use commonMixin, unwrap its methods/context)
const { deepCopy, getUuid } = commonMixin.methods

// Vuex store
const store = useStore()

// Local reactive state
const wangEditor = ref(null)
const showEditor = ref(false)
const html = ref(deepCopy(props.propValue))

const toolbarConfig = toolBarConfig
let editorConfig = JSON.parse(JSON.stringify(_editorConfig))
const editorMode = mode

// Computed style from element
const style = computed(() => {
  return props.element.style || {}
})

// When the modal closes, save current HTML back to Vuex
function onBlur() {
  store.commit('printTemplateModule/setPropValue', {
    id: props.element.id,
    propValue: html.value,
  })
}

function onDblClick() {
  // showEditor.value = true //
  sys.openWangEditorDialog({
    modelValue: html.value,
    confirmFn: (dialog: Dialog) => {
      let com: CodeEditor = dialog.getRef('innerCom')
      let bindValue = com.getBindValue()
      html.value = bindValue //
      store.commit('printTemplateModule/setPropValue', {
        id: props.element.id,
        propValue: html.value,
      })
    },
  }) //
}

function handleMouseDown(e) {
  e.stopPropagation()
}

function handleTextClosed() {
  onBlur()
}

// Called when WangEditor has been created
function onCreated(editorInstance) {
  wangEditor.value = Object.seal(editorInstance)
}

// Clean up editor before unmount
onBeforeUnmount(() => {
  const editorInstance = wangEditor.value
  if (editorInstance) {
    editorInstance.destroy()
  }
})

// Keep html in sync if propValue changes externally
watch(
  () => props.propValue,
  (newVal) => {
    if (newVal !== html.value) {
      html.value = deepCopy(newVal)
    }
  },
)
</script>
