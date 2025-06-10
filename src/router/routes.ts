import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'pageIndex',
    // component: () => import('@/pages/companyPage'), //
    component: () => import('@/pages/pageIndex.vue'), //
    meta: {
      icon: 'CreditCardOutlined',
    },
    children: [
      {
        path: 'testPage',
        name: 'testPage', //
        component: () => import('@/pages/platform/login/Login1'), //
        meta: {
          icon: 'CreditCardOutlined',
        },
      },
    ],
  },
]
export default routes

/* 

 // children: [
    //   //
    //   {
    //     path: 'home',
    //     name: 'home', //
    //     component: () => import('@/pages/platform/home/Home'),
    //   },
    //   // {
    //   //   path: 'companyHome',
    //   //   name: 'companyHome', //
    //   //   component: () => import('@/pages/companyPage'), //
    //   // },
    //   {
    //     path: 'companyHome',
    //     name: 'companyHome', //
    //     component: () => import('@/pages/home/cHome.vue'), //
    //   },
    // ],
*/

/* 
// {
  //   path: '/companyHome',
  //   name: 'companyHome', //
  //   component: () => import('@/pages/companyPage'), //
  // },
  // {
  //   path: '/testPage',
  //   name: 'testPage', //
  //   component: () => import('@/pages/platform/login/Login'), //
  // },
  // {
  //   path: '/login',
  //   name: 'login',
  //   meta: {
  //     view: 'blank',
  //   },
  //   component: () => import('@/pages/platform/login/Login'),
  // },
  // {
  //   path: '/companyLogin',
  //   name: 'companyLogin',
  //   component: () => import('@/pages/platform/login/companyLogin'),
  // },
  // {
  //   path: '/companyRegister',
  //   name: 'companyRegister',
  //   component: () => import('@/pages/platform/login/companyRegister'),
  // },
  // {
  //   path: '/companyUserInfo',
  //   name: 'companyUserInfo',
  //   component: () => import('@/pages/platform/user/userInfo'), //
  // },
  // {
  //   path: '/',
  //   name: 'entity', //
  //   component: () => import('@/pages/erp/index'), //
  //   children: [
  //     {
  //       path: ':tableName',
  //       name: 'entityTable',
  //       component: () => import('@/pages/erp/design/index'), //
  //     },
  //   ],
  // },
*/
