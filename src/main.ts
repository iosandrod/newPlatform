import { createApp } from 'vue' //
import App from './App.vue'
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
import './style.scss'//
import 'vxe-table/lib/style.css'
import 'vxe-pc-ui/styles/all.scss'
import 'default-passive-events' //
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
import { system } from './system'
import buttonGroupCom from './buttonGroup/buttonGroupCom'
import { http } from './service/client'
import selectCom from './select/selectCom'
//@ts-ignore
Base.prototype.system = system //
//@ts-ignore
Base.prototype.http = http ////
//@ts-ignore
Base.prototype._router = router
registerEdit()
Locale.use('en-US', enUS)
app.use(Vant)
app.component('erButton', buttonCom)
app.component('erButtonGroup', buttonGroupCom)
app.component('erForm', erFormEditor) //
app.component('erTable', tableCom) //
app.component('erDropdown', dropdownCom)
app.component('erSelect', selectCom) //
app.use(context) //
app.use(VxeTable)
app.use(VxeUIAll)
app.use(router)
app.use(elementPlus) //
app.component('vue-list-table', VueVTable.ListTable)
app.mount('#app')
