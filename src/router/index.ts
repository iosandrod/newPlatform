import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import { shallowReactive } from 'vue'
import routes from './routes'
import { system } from '@/system'
import { http } from '@/service/client'

const router = createRouter(
  shallowReactive({
    history: createWebHistory(), //
    routes,
  }),
) //
router.beforeEach(async (to, from, next) => {
  //
  let p = to.fullPath
  if (/companyLogin|companyRegister/.test(p)) {
    console.log('去登录页面') //
    next() //
  } //
  const isLogin = system.loginInfo
  if (isLogin == null) {
    let res = await http.init()
    if (res != null) {
      next()
    } else {
      //
      next({
        name: 'companyLogin', //
      })
    }
  } else {
    next() //
  }
})
// 注册导航守卫
export default router
