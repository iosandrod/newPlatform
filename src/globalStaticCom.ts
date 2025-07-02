import { defineAsyncComponent } from 'vue'

export const globalStaticCom = [
  {
    title: '实体管理', //
    name: 'realTable', //
    closeable: false,
    component: () =>
      defineAsyncComponent(() => import('@/staticAdminCom/realTable')), //
  },
]
