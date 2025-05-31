/*
 * @Author: ROYIANS
 * @Date: 2022/9/30 9:42
 * @Description: 组件注册
 * @sign:
 * ╦═╗╔═╗╦ ╦╦╔═╗╔╗╔╔═╗
 * ╠╦╝║ ║╚╦╝║╠═╣║║║╚═╗
 * ╩╚═╚═╝ ╩ ╩╩ ╩╝╚╝╚═╝
 */
import PtdDesigner from './Main/Home.vue'
import PtdViewer from './Viewer/PtdViewer.vue'
import { Boot } from '@wangeditor/editor'
import { menuConfig } from '@/printTemplate/components/config/editorConfig'

import 'normalize.css/normalize.css'
import '@/printTemplate/assets/animate.css'
import '@/printTemplate/assets/main.scss'
import '@/printTemplate/assets/iconfont/iconfont.css'
import '@wangeditor/editor/dist/css/style.css'

import NightModeStore from '../stores/modules/index.js'

// RoyUI
import '@/printTemplate/components/RoyUI/styles/index.scss'
import { UI } from '@/printTemplate/components/RoyUI'
// RoyUI End

const componentsLib = {
  PtdDesigner,
  PtdViewer,
  ...UI
}
const install = function (Vue, opts = {}) {
  if (install.installed) {
    return
  }
  if (!opts.store) {
    console.warn('[print-template-designer] 请提供store！')
    return
  }
  if (!opts.store.state.printTemplateModule) {
    // 注册module
    opts.store.registerModule(['printTemplateModule'], NightModeStore)
  }
  // 富文本编辑器添加菜单
  Boot.registerMenu(menuConfig)
  Object.keys(componentsLib).forEach((key) => {
    // 注册组件
    Vue.component(key, componentsLib[key])
  })
}
const Api = {
  version: 'ROY-PRINT-DESIGNER@0.1.15',
  PtdDesigner,
  PtdViewer,
  NightModeStore,
  install
}
// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
export default Api
