import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import { shallowReactive } from 'vue'
import routes from './routes'
import { system } from '@/system'
import { http } from '@/service/client'
import { generateRoutes } from './register'
// let _routes = generateRoutes()
// console.log(_routes, 'test_routes') //
const router = createRouter(
  shallowReactive({
    history: createWebHistory(),
    routes,
  }),
) // 

let unAuthPath = /companyLogin|companyRegister|companyHome/g
router.beforeEach(async (to, from, next) => {
  next() //
  // let p = to.path
  // let fp = to.fullPath
  // if (/\/$/.test(p)) {
  //   p = p.slice(0, -1)
  //   to.path = p //
  // }
  // if (/\/$/.test(fp)) {
  //   fp = fp.slice(0, -1)
  //   to.fullPath = fp //
  // }
  // if (unAuthPath.test(p)) {
  //   next() //
  // } //
  // const isLogin = system.loginInfo
  // if (isLogin == null) {
  //   // let res = await http.init()
  //   let res = null
  //   if (res != null) {
  //     next()
  //   } else {
  //     next()
  //     // next({
  //     //   // name: 'companyLogin', //
  //     // })
  //   }
  // } else {
  //   next() //
  // }
})
// 注册导航守卫
export default router
