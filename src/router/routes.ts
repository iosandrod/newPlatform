import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/pages/companyPage'), //
    meta: {
      title: '首页',
      renderMenu: false,
      icon: 'CreditCardOutlined',
    },
    children: [
      //
      {
        path: 'home',
        name: 'home', //
        component: () => import('@/pages/home/Home'),
      },
      {
        path: 'companyHome',
        name: 'companyHome', //
        component: () => import('@/pages/companyPage'), //
      },
    ],
  },
  {
    path: '/testPage',
    name: 'testPage', //
    component: () => import('@/pages/login/Login'), //
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
  {
    path: '/companyUserInfo',
    name: 'companyUserInfo',
    component: () => import('@/pages/user/userInfo'), //
  },
  {
    path: '/',
    name: 'entity', //
    component: () => import('@/pages/index'), //
    children: [
      {
        path: ':tableName',
        name: 'entityTable',
        component: () => import('@/pages/design/index'), //
      },
    ],
  },
]

export default routes
