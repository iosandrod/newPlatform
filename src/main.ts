// import './css.js'
import { createApp, nextTick } from 'vue' //
import App from './App' //
import router from '@/router'
import elementPlus from 'element-plus'
import * as VueVTable from '@visactor/vue-vtable'
const app = createApp(App)
import Vant, { Locale } from 'vant'
import enUS from 'vant/es/locale/lang/en-US'
import 'element-plus/dist/index.css'
import 'vant/lib/index.css'

import './homeStyle.css'
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
// import 'ant-design-vue/dist/antd.css' //
import '@/printTemplate/assets/main.scss'
import 'remixicon/fonts/remixicon.css'
import '@arco-design/web-vue/es/message/style/css'
import '@arco-design/web-vue/es/modal/style/css'
import '@arco-design/web-vue/es/notification/style/css'
import Vue3Dragscroll from 'vue3-dragscroll'
import AddNode from '@/audit/components/flow/AddNode.vue'
import NodeWrap from '@/audit/components/flow/NodeWrap.vue'
import SvgIcon from '@/audit/components/SvgIcon/index.vue'
import vFocus from '@/audit/directive/focus'
import '@/audit/styles/index.scss' //
//@ts-ignore

import pinia from '@/audit/stores'
// import "@arco-design/web-vue/dist/arco.css";

app.directive('focus', vFocus)
// import "virtual:svg-icons-register";
import Vuex from 'vuex'
import printTemplateModule from '@/printTemplate/stores/modules/index.js'
import './style.js'
import PrintDesign from '@/printTemplate/components/index.js'
import store from '@/printTemplate/stores/index.js'
import wangCom from './wangEditor/wangCom'
// import { registerAntdComp } from './audit/antd'
// import { registerIconsComp } from './audit/icons'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import NaiveChatP from './chat' //
import './style.scss' //
import './assets/tailwind.css' //
import './mainStyle.css'
import './changeCalStyle.scss'
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

app.use(NaiveChatP)
app.use(ArcoVueIcon)
app.use(ArcoVue)
app.use(PrintDesign, {
  store,
}) //
app.use(store) //
app.use(pinia) //
registerEdit()
Locale.use('en-US', enUS)
// registerAntdComp(app)
// registerIconsComp(app)
app.use(Vant)
app.component('wangEditor', wangCom)
app.use(Vue3Dragscroll)
app.component('erButton', buttonCom)
app.component('erButtonGroup', buttonGroupCom)
// app.component('erForm', formEditor) //
app.component('erForm', formCom)
// app.component('erForm', formEditor)
app.component('erFormEditor', formEditor)
app.component('erPage', pageCom) //
app.component('SvgIcon', SvgIcon)
app.component('erTable', tableCom)
app.component('erDropdown', dropdownCom)
app.component('erSelect', selectCom) //
app.component('AddNode', AddNode)
app.component('NodeWrap', NodeWrap)
app.use(context) //
app.use(VxeTable) //
app.use(VxeUIAll)
app.use(router)

app.use(elementPlus) //
app.mount('#app')
//
