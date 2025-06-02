// import './css.js'
import { createApp } from 'vue' //
import App from './App' //
import router from '@/router'
import elementPlus from 'element-plus'
import * as VueVTable from '@visactor/vue-vtable'
const app = createApp(App)
import Vant, { Locale } from 'vant'
import enUS from 'vant/es/locale/lang/en-US'
import 'element-plus/dist/index.css'
import 'element-plus/dist/index.css'
import 'vant/lib/index.css'
import './mainStyle.css'
import './homeStyle.css'
import './style.scss' //
import 'vxe-table/lib/style.css'
import 'vxe-pc-ui/styles/all.scss'
// import 'default-passive-events' //
import VxeTable from 'vxe-table'
import VxeUIAll from 'vxe-pc-ui' //
import context from '@/contextM'
import '@/contextM/themes/default/index.scss'
import { erFormEditor } from '@ER/formEditor'
import { registerEdit } from '@/table/registerEdit'
import tableCom from './table/tableCom'
import dropdownCom from './menu/dropdownCom'
import buttonCom from './buttonGroup/buttonCom'
import { Base } from '@/base/base' //w
import './run' //
import { system } from './system'
import buttonGroupCom from './buttonGroup/buttonGroupCom'
import { http } from './service/client'
import selectCom from './select/selectCom'
import { Table } from './table/table'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import formCom from '@ER/formCom'
import formEditor from '@ER/formEditor/formEditor'
import pageCom from '@ER/pageCom'
import '@/printTemplate/assets/main.scss'
import 'remixicon/fonts/remixicon.css'
import Vuex from 'vuex'
import printTemplateModule from '@/printTemplate/stores/modules/index.js'
import './style.js'

//@ts-ignore
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  },
}
app.config.globalProperties.$VXETable = VxeTable
app.config.globalProperties.$XModal = VxeTable.modal
let componentObj = {
  tableCom,
  dropdownCom, //
  buttonCom,
  buttonGroupCom,
  formCom,
  pageCom,
}
//@ts-ignore
Base.prototype.system = system //
//@ts-ignore
Base.prototype.http = http ////
//@ts-ignore
Base.prototype._router = router
//@ts-ignore
Base.prototype.getAllComponent = () => componentObj
//@ts-ignore
// Table.component = tableCom
import PrintDesign from '@/printTemplate/components/index.js'
import store from '@/printTemplate/stores/index.js'
import wangCom from './wangEditor/wangCom'
app.use(PrintDesign, {
  store,
}) //
app.use(store) //
registerEdit()
Locale.use('en-US', enUS)
app.use(Vant)
app.component('wangEditor', wangCom)
app.component('erButton', buttonCom)
app.component('erButtonGroup', buttonGroupCom)
app.component('erForm', formEditor) //
app.component('erTable', tableCom)
app.component('erDropdown', dropdownCom)
app.component('erSelect', selectCom) //
app.use(context) //
app.use(VxeTable) //
app.use(VxeUIAll)
app.use(router)
app.use(elementPlus) //
app.mount('#app')
//
