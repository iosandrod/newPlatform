import { defineAsyncComponent } from 'vue'

export const globalStaticCom = [
  {
    title: '实体建模',
    name: 'erDesign',
    component: () =>
      defineAsyncComponent(() => import('./pages/platform/globalTableFlow')),
  },
]
