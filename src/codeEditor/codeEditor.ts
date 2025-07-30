import { Base } from '@/base/base' //
import * as monaco from 'monaco-editor'
import { shallowRef } from 'vue'
export default class CodeEditor extends Base {
  templateValue = ''
  instance: monaco.editor.IStandaloneCodeEditor
  config: any
  constructor(config: any) {
    super() //
    this.config = config
    this.init()
  } //
  init() {
    super.init() //
    this.templateValue = this.getModelValue()
  }
  getModelValue() {
    let config = this.config
    let modelValue = config.modelValue || ''
    modelValue = modelValue || this.templateValue //
    return modelValue
  }
  //
  onChange(value) {
    let config = this.config
    this.templateValue = value
    let onChange = config.onChange
    if (onChange) {
      onChange(value)
    } //
    this.templateValue = value //
  }
  unmounted() {}
  getInstance() {
    return this.instance
  }
  getBindValue() {
    return this.templateValue
  }
  getLanguage() {
    let config = this.config
    let language = config.language
    if (language == null) {
      language = 'javascript' //
    }
    return language
  }
  render() {
    //
    let root: HTMLDivElement = this.getRef('root')
    let modelValue = this.getModelValue()
    let editor = monaco.editor.create(root!, {
      value: modelValue,
      overviewRulerBorder: false,
      language: this.getLanguage(),
      lineNumbers: 'off',
      minimap: { enabled: false },
    })
    let _this = this
    //@ts-ignore
    this.instance = shallowRef(editor)
    let codeEdit = editor
    codeEdit.onMouseLeave(() => {
      let lastCursorPosition = codeEdit.getPosition()
    })
    codeEdit!.onDidChangeModelContent((value) => {
      const context = codeEdit?.getValue()
      this.onChange(context)
    })
  }
}
