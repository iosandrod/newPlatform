import { defineComponent, onMounted, onUnmounted } from 'vue'
import wangEditor from './wangClass'
import { system } from '@/system'
import tableCom from '@/table/tableCom'
import tabCom from '@/buttonGroup/tabCom'
import { createEditor } from '@wangeditor/editor'
export default defineComponent({
  name: 'CodeEditorCom',
  //
  components: {
    tabCom, //
  },
  props: {
    defaultContent: {
      // 如果传入的是数组，就直接使用；否则默认 []。
      type: [Array, String],
      default: () => [],
    },
    defaultConfig: {
      type: Object,
      default: () => ({}),
    },
    mode: {
      type: String,
      default: 'default',
    },
    defaultHtml: {
      type: String,
      default: '',
    },
    // 这里接收外部 v-model 传进来的 value
    value: {
      type: String,
      default: '',
    },
  },
  setup(props, { attrs, slots, emit, expose }) {
    let editor = new wangEditor(props) //
    const register = (el) => {
      editor.registerRef('root', el)
    }
    const registerTool = (el) => {
      editor.registerRef('tool', el)
    }
    const registerOuter = (el) => {
      editor.registerRef('out', el)
    }
    onMounted(() => {
      //
      editor.render()
    })
    onUnmounted(() => {
      editor.unmounted()
    })
    expose({ _instance: editor })
    let sys = system
    return () => {
      let com = (
        <div
          class="w-full flex-1"
          style={{ position: 'relative', border: '' }}
          ref={register}
        ></div>
      )
      let toolCom = <div ref={registerTool} class="h-40"></div>
      let outCom = (
        <div
          class="w-full h-full flex flex-col"
          style={{ position: 'relative', minHeight: '100px' }}
          ref={registerOuter}
        >
          {toolCom}
          {com}
        </div> //
      ) //
      return outCom //
    }
  },
})
