import { defineAsyncComponent } from 'vue'

export const globalStaticCom = [
  {
    title: '实体建模',
    name: 'erDesign',
    component: () =>
      defineAsyncComponent(() => import('./pages/platform/globalTableFlow')),
  },
  {
    title: '个人信息',
    name: 'userinfo',
    component: () =>      defineAsyncComponent(() => import('./pages/platform/globalUserinfo')),
  },
]
