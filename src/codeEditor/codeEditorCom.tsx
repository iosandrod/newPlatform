import { defineComponent, onMounted, onUnmounted } from 'vue'
import CodeEditor from './codeEditor'

export default defineComponent({
  name: 'CodeEditorCom',
  //
  props: {},
  setup(props) {
    let editor = new CodeEditor(props) //
    const register = (el) => {
      editor.registerRef('root', el)
    }
    const registerOuter = (el) => {
      editor.registerRef('out', el)
    }
    onMounted(() => {
      editor.render()
    })
    onUnmounted(() => {
      editor.unmounted()
    })
    return () => {
      let com = (
        <div
          class="w-full h-full"
          style={{ position: 'relative', border: '1px solid black' }}
          ref={register}
        ></div>
      )
      let outCom = (
        <div
          class="w-full h-full"
          style={{ position: 'relative', minHeight: '100px' }}
          ref={registerOuter}
        >
          {com}
        </div> //
      )
      return outCom //
    }
  },
})
