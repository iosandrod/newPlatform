<!--/*-->
<!-- * @Author: ROYIANS-->
<!-- * @Date: 2022/10/18 9:12-->
<!-- * @Description: 文本-->
<!-- * @sign: 迷路，并无小路大路短路长路之区别。不能说在大路长路上迷路就不是迷路了。走在达不到目的的路上，就是迷路。-->
<!-- * ╦═╗╔═╗╦ ╦╦╔═╗╔╗╔╔═╗-->
<!-- * ╠╦╝║ ║╚╦╝║╠═╣║║║╚═╗-->
<!-- * ╩╚═╚═╝ ╩ ╩╩ ╩╝╚╝╚═╝-->
<!-- */-->
<template>
  <div style="width: 100%; height: 100%" @click="activeCell" @dblclick="onDblClick">
    <RoyModal
      v-if="showEditor"
      :show.sync="showEditor"
      height="70%"
      title="长文本编辑"
      width="60%"
      @close="handleTextClosed"
    >
      <div class="roy-wang-editor" @mousedown="handleMouseDown">
        <WangToolbar
          :defaultConfig="toolbarConfig"
          :editor="wangEditor"
          style="border-bottom: 1px solid #ccc"
        />
        <WangEditor
          v-model="html"
          :defaultConfig="editorConfig"
          :mode="mode"
          style="height: 300px"
          @onCreated="onCreated"
        />
      </div>
    </RoyModal>
    <StyledText v-bind="style">
      <div class="roy-text-inner" v-html="propValue"></div>
    </StyledText>
  </div>
</template>

<script>
import { StyledText } from '@/printTemplate/components/PageComponents/style'
import RoyModal from '@/printTemplate/components/RoyModal/RoyModal.vue'
import WangToolbar from '@/printTemplate/components/PageComponents/WangEditorVue/WangToolbar.vue'
import WangEditor from '@/printTemplate/components/PageComponents/WangEditorVue/WangEditor.vue'
import { toolBarConfig, editorConfig, mode } from '@/printTemplate/components/config/editorConfig'
import commonMixin from '@/printTemplate/mixin/commonMixin'
import { mapState } from 'vuex'

export default {
  name: 'RoyTextInTable',
  mixins: [commonMixin],
  props: {
    element: {
      type: Object,
      default: () => {}
    },
    propValue: {
      type: String,
      default: ''
    }
  },
  components: {
    WangEditor,
    WangToolbar,
    StyledText,
    RoyModal
  },
  computed: {
    ...mapState({
      curComponent: (state) => state.printTemplateModule.curComponent
    }),
    style() {
      return this.element.style || {}
    }
  },
  data() {
    return {
      wangEditor: null,
      showEditor: false,
      html: this.deepCopy(this.propValue),
      toolbarConfig: toolBarConfig,
      editorConfig: editorConfig,
      mode: mode
    }
  },
  methods: {
    activeCell() {
      this.$emit('activeCell', {
        id: this.element.id
      })
    },
    onCreated(editor) {
      this.wangEditor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    onDblClick() {
      this.showEditor = true
    },
    handleMouseDown(e) {
      e.stopPropagation()
    },
    handleTextClosed() {
      this.$store.commit('printTemplateModule/updateDataValue', {
        data: this.element,
        value: this.html,
        key: 'propValue'
      })
      // this.$emit('update:propValue', this.html)
      this.$emit('componentUpdated', this.html)
    }
  },
  created() {},
  watch: {},
  beforeDestroy() {
    const editor = this.wangEditor
    if (editor == null) {
      return
    }
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
}
</script>
