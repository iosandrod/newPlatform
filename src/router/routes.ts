import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/pages/index'), //
    meta: {
      title: '首页',
      renderMenu: false,
      icon: 'CreditCardOutlined',
    },
    children: [
      {
        path: 'home',
        name: 'home', //
        component: () => import('@/pages/home/Home'),
      },
      {
        path: ':tableName',
        name: 'entity', //
        component: () => import('@/pages/design/index'), //
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      view: 'blank',
    },
    component: () => import('@/pages/login/Login'),
  },
  {
    path: '/companyLogin',
    name: 'companyLogin',
    component: () => import('@/pages/login/companyLogin'),
  },
  {
    path: '/companyRegister',
    name: 'companyRegister',
    component: () => import('@/pages/login/companyRegister'),
  },
]

export default routes
