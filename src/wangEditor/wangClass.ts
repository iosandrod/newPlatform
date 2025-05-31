import { Base } from '@/base/base' //
import { shallowRef } from 'vue'
import {
  createEditor,
  createToolbar,
  DomEditor,
  IDomEditor,
  Toolbar,
} from '@wangeditor/editor'
export default class wangEditor extends Base {
  templateValue = ''
  instance: IDomEditor
  toolInstance: Toolbar
  config: any
  constructor(config: any) {
    super() //
    this.config = config
    this.init()
  } //
  init() {
    //
    super.init() //
    this.templateValue = this.getModelValue()
  }
  getModelValue() {
    let config = this.config
    let modelValue = config.modelValue || '' //
    return modelValue
  }
  //
  onChange(value) {
    let config = this.config
    this.templateValue = value
    let onChange = config.onChange //
    this.templateValue = value
    if (onChange) {
      onChange(value)
    }
  }
  unmounted() {
    //取消挂载//
    let ins = this.instance
    ins.destroy()
    let toolIns = this.toolInstance
    toolIns.destroy() //
  }
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
    let config = this.config
    let _ref = this.getRef('root')
    let _editor = createEditor({
      selector: _ref,
      html: this.templateValue,
      config: {
        onChange: (editor) => {
          const html = editor.getHtml()
          this.onChange(html)
        },
        onCreated: (editor) => {},
      },
      content: [],
      mode: config.mode,
    })
    //@ts-ignore
    this.instance = shallowRef(_editor)
    let tRef = this.getRef('tool')
    let _tool = createToolbar({
      editor: _editor,
      selector: tRef,
      config: config.defaultConfig || {}, //
      mode: config.mode || 'default',
    })
    //@ts-ignore
    this.toolInstance = shallowRef(_tool)
  }
}
