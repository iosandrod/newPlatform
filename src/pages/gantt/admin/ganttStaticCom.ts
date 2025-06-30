import { defineAsyncComponent, defineComponent } from 'vue'

export const ganttStaticCom = {
  home: {
    title: '首页',
    name: 'home', //
    closeable: false,
    component: () => defineAsyncComponent(() => import('./ganttHome')), //
  },
  userinfo: {
    title: '个人信息',
    name: 'userinfo', //
    closeable: false,
    component: () => defineAsyncComponent(() => import('./ganttUserinfo')), //
  },
}
