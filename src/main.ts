import { createApp } from 'vue'
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
import 'vxe-table/lib/style.css'
import 'vxe-pc-ui/styles/all.scss'
import 'default-passive-events' //
import VxeTable from 'vxe-table'
import VxeUIAll from 'vxe-pc-ui'
Locale.use('en-US', enUS)
app.use(Vant)
app.use(VxeTable)
app.use(VxeUIAll)
app.use(router)
app.use(elementPlus)
app.component('vue-list-table', VueVTable.ListTable)
app.mount('#app')
