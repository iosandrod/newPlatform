import { defineAsyncComponent, defineComponent } from 'vue'
import erpHome from './erpHome'

export const staticCom = {
  home: {
    title: '首页',
    name: 'home', //
    closeable: false,
    component: () => defineAsyncComponent(() => import('./erpHome')), //
  },
  userinfo: {
    title: '个人信息',
    name: 'userinfo', //
    closeable: false,
    component: () => defineAsyncComponent(() => import('./userinfo')), //
  },
}
//