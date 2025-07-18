import { nanoid } from 'nanoid'
import { Reactive, reactive, shallowRef, toRaw } from 'vue'
import hooks from '@ER/hooks'
import {
  // system,
  System,
} from '@/system'
import { myHttp } from '@/service/client'
import { Router } from 'vue-router'
import { PageDesign } from '@ER/pageDesign'
export class Base {
  timeout = {} //
  entityEventManager: { [key: string]: Array<any> } = {}
  entityEventManagerArr = []
  pageLoading = false
  _once: { [key: string]: boolean } = {}
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
    } else {
      let allKeys = Object.keys(cacheTemplateProps)
      let reg = new RegExp(`^${key}`)
      allKeys.forEach((key) => {
        if (reg.test(key)) {
          delete cacheTemplateProps[key] //
        }
      })
    }
  }
  async runPoolFn(fn, ...args) {
    if (typeof fn !== 'function') {
      //
      return
    }
  }
  getWorkerPool() {}
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
  //
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
  addMethod(config) {
    // debugger //
    if (config == null) {
      return //
    }
    let cacheMethod = this.cacheMethod
    let methodName = config.methodName
    let type = config.type
    let obj = cacheMethod[methodName]
    let fn = config.fn
    let key = config.key
    if (['before', 'after'].indexOf(type) == -1) {
      return
    }
    let _arr = null
    if (obj == null) {
      obj = {
        before: [],
        after: [],
      }
      let arr = obj[type] //
      cacheMethod[methodName] = obj
      _arr = arr
      // arr.push(config) //
      return
    } else {
      let arr = obj[type]
      // arr.push(config) //
      _arr = arr
    }
    if (key != null && typeof key === 'string') {
      let _config = _arr.find((item) => item.key === key)
      if (_config) {
        let nextFn = _config.nextFn
        if (!Array.isArray(nextFn)) {
          nextFn = []
          _config.nextFn = nextFn
        }
        nextFn.push(fn) //
      } else {
        _arr.push(config) //
      }
    } else {
      _arr.push(config) //
    }
  }
  async runAfter(config?: any) {
    if (config == null) {
      return
    }

    let methodName = config.methodName
    if (methodName == 'updateCanvas') {
    }
    let after = this.getAfterMethod(methodName)
    let _arr1 = []
    for (const fn of after) {
      if (typeof fn == 'function') {
        await fn(config) //
      }
      if (typeof fn == 'object' && !Array.isArray(fn)) {
        let _fn = fn.fn
        if (typeof _fn == 'function') {
          await _fn(config) //
        }
        let nextFn = fn.nextFn
        if (Array.isArray(nextFn)) {
          _arr1.push(...nextFn) //
        }
      }
      if (Array.isArray(fn)) {
        _arr1.push(...fn) //
      }
    }
    this.clearAfter(methodName) //
    _arr1.forEach((fn) => {
      this.addMethod(fn) //
    })
    let staticAfter = this.getAfterMethod(methodName, true)
    for (const fn of staticAfter) {
      await fn(config)
    } //
  }
  clearAfter(name: string) {
    let cacheMethod = this.cacheMethod
    let method = cacheMethod[name] || {}
    method.after = []
  }
  getMainPageDesign() {
    let _this: any = this
    let tableName = _this.tableName //
    let system = this.getSystem() ////
    let targetDesign =
      system.tableMap[tableName] || system.tableEditMap[tableName]
    return targetDesign //
  }
  getSysComponents(): any {
    //@ts-ignore
    return this.getAllComponent()
  }
  changeRowState(re, state = 'change') {
    if (state == 'delete') {
      re['_rowState'] = 'delete'
      return //
    }
    let rowState = re['_rowState']
    if (rowState == 'add' || rowState == 'delete') {
      return
    }
    re['_rowState'] = state
  } //
  setCurrentLoading(loading: boolean) {
    this.pageLoading = loading ////
  }
  registerEntityEvent(config?: any) {
    let tableName = config?.tableName //
    let event = config.event
    if (tableName == null || event == null) {
      return
    }
    let http = this.getHttp() //
    let client = http.client
    let connection = client.get('connection')
    // console.log(connection, 'connection') //
    let eventName = `${tableName} ${event}`
    connection.on(eventName, (data) => {
      let fn = config.fn
      if (typeof fn == 'function') {
        fn(data)
      }
      // console.log('event', eventName, data)//
    })
  }
  setLocalItem(key: string, value: any) {
    if (typeof value == 'object') {
      if (value != null) {
        value = JSON.stringify(value)
      }
    }
    localStorage.setItem(key, value) //
  } //
  getLocalItem(key: string) {
    let _item = localStorage.getItem(key) //
    try {
      let v = JSON.parse(_item)
      _item = v
    } catch (error) {}
    return _item //
  }
  getEnvValue(key) {
    let _v = import.meta.env[key]
    return _v
  }
} //
