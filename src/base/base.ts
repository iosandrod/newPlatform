import { nanoid } from 'nanoid'
import { Reactive, reactive, shallowRef, toRaw } from 'vue'
import hooks from '@ER/hooks'
import {
  // system,
  System,
} from '@/system'
import pool from 'workerpool'
import { myHttp } from '@/service/client'
import { Router } from 'vue-router'
import { PageDesign } from '@ER/pageDesign'
export const workerPool = pool.pool()
export class Base {
  cacheMethod: {
    [key: string]: { before?: Array<any>; after?: Array<any> }
  } = {}
  staticCacheMethod: {
    [key: string]: { before?: Array<any>; after?: Array<any> }
  } = {}
  hooks: typeof hooks = shallowRef(hooks) as any
  id: string
  refPool: any = shallowRef({}) as any
  _refPool: any = shallowRef({}) as any
  // system: System
  // http: myHttp
  cacheTemplateProps: any = {} ////
  uuid() {
    return nanoid() //
  }
  _getPageDesign?: () => PageDesign
  getPageDesignIns() {
    let _getPageDesign = this._getPageDesign
    if (_getPageDesign) {
      return _getPageDesign()
    }
    return null //
  }
  async clearCacheValue(key) {
    let cacheTemplateProps = this.cacheTemplateProps
    if (key == null) {
      Object.keys(cacheTemplateProps).forEach((key) => {
        delete cacheTemplateProps[key] //
      })
    }
  }
  async runPoolFn(fn, ...args) {
    if (typeof fn !== 'function') {
      return
    }
    return await workerPool.exec(fn, args)
  }
  getWorkerPool() {
    return workerPool
  }
  constructor() {
    this.id = this.uuid() //
    return reactive(this) //
  }
  init() {}
  getHttp(): myHttp {
    //@ts-ignore
    return this.http
  }
  getSystem(): System {
    //@ts-ignore
    return this.system
  }
  setIsDesign(status?: boolean) {
    //@ts-ignore
    this.isDesign = status
  }
  registerRef(key: string, ref: any) {
    let _instance = ref?._instance
    if (_instance) {
      ref = _instance //
    }
    if (ref == null) {
      this.unregisterRef(key)
      return
    }
    let refPool = this.refPool
    refPool[key] = ref
  }
  unregisterRef(key: string, all = false, fn?: any) {
    let refPool = this.refPool
    let ref = refPool[key]
    if (ref != null) {
      //@ts-ignore
      delete refPool[key]
      return
    }
  }
  onMounted() {}
  onUnmounted() {
    let keys = Object.keys(this.refPool)
    for (const key of keys) {
      this.unregisterRef(key) //
    }
  }
  getRef(key: any) {
    // return this.refPool[this._refPool[key]]//
    let refPool = this.refPool
    let arr = refPool[key]
    return arr //
  }
  getRunBefore(config?: { method: string; params?: any }) {}
  getRunAfter(config?: { method: string; params?: any }) {}
  getRouter(): Reactive<Router> {
    //@ts-ignore
    return this._router //
  }
  getAfterMethod(name: string, _static = false) {
    if (_static) {
      let staticCacheMethod = this.staticCacheMethod
      let method = staticCacheMethod[name] || {}
      let after = method.after || []
      return after
    }
    let cacheMethod = this.cacheMethod
    let method = cacheMethod[name] || {}
    let after = method.after || []
    return after
  }
  runAfter(config?: any) {
    if (config == null) {
      return
    }
    let methodName = config.methodName //
    let after = this.getAfterMethod(methodName)
    for (const fn of after) {
      fn(config) //
    }
    this.clearAfter(methodName) //
    let staticAfter = this.getAfterMethod(methodName, true)
    for (const fn of staticAfter) {
      fn(config)
    } //
  }
  clearAfter(name: string) {
    let cacheMethod = this.cacheMethod
    let method = cacheMethod[name] || {}
    method.after = []
  }
}
