import io, { Socket } from 'socket.io-client'
import socketio from '@feathersjs/socketio-client'
import { Application, feathers, Params } from '@feathersjs/feathers'
import auth, {
  AuthenticationClient,
  AuthenticationClientOptions,
  getDefaultStorage,
} from '@feathersjs/authentication-client'
import { system } from '@/system'
import * as hooks from '@feathersjs/authentication-client/src/hooks/index'
import {
  AuthenticationRequest,
  AuthenticationResult,
} from '@feathersjs/authentication'
import { nextTick } from 'vue'
import axios from 'axios'
export const defaultStorage: any = getDefaultStorage()
const defaults: AuthenticationClientOptions = {
  header: 'Authorization',
  scheme: 'Bearer',
  storageKey: 'feathers-jwt',
  locationKey: 'access_token',
  locationErrorKey: 'error',
  jwtStrategy: 'jwt',
  path: '/authentication',
  Authentication: AuthenticationClient,
  storage: defaultStorage,
} //
let queryString = window.location.search.slice(1)
let params = new URLSearchParams(queryString)
let obj = Object.fromEntries(params.entries()) || {}
// console.log(obj, 'testObj123123') //
let userid = obj?.userid
if (userid != null) {
  nextTick(() => {
    system.setLocalItem('userid', userid)
  })
}
export const createAxios = (config) => {
  let _appName = localStorage.getItem('appName')
  let _userid = localStorage.getItem('userid') //
  let fullHost = window.location.host // erp.dxf.life
  let hostname = window.location.hostname // erp.dxf.life
  let subdomain = hostname.split('.')[0] // erp
  let port = location.port
  let userid = config.userid
  if (userid == null) {
    userid = _userid
  } //
  let appName = config.appName
  if (appName == null) {
    appName = _appName //
  }
  let _key = '' //
  if (appName != null && userid != 'undefined') {
    _key = `/${appName}_${userid}`
  }
  let baseUrl = `http://${'localhost:3031'}` //
  let _base = import.meta.env.VITE_BASEURL
  let isProd = import.meta.env.VITE_ENVIRONMENT
  if (isProd == 'production') {
    baseUrl = _base //
  }
  let _host = `${baseUrl}${_key}`
  if (config?.isMain === true) {
    _host = baseUrl //
  }
  if (appName == 'platform') {
    _host = baseUrl //
  }
  let axiosInstance = axios.create({
    baseURL: _host,
    timeout: 60000,
  })
  return axiosInstance //
}
class myAuth extends AuthenticationClient {
  constructor(app: any, op: any) {
    super(app, op)
  }
  authenticate(
    authentication?: AuthenticationRequest,
    params?: Params,
  ): Promise<AuthenticationResult> {
    if (!authentication) {
      return this.reAuthenticate()
    }
    const promise = this.service
      .create(authentication, params)
      .then((_authResult: AuthenticationResult) => {
        let authResult = _authResult.data //
        const { accessToken } = authResult
        this.authenticated = true
        this.app.emit('login', authResult)
        this.app.emit('authenticated', authResult)

        return this.setAccessToken(accessToken).then(() => authResult)
      })
      .catch((error: any) => this.handleError(error, 'authenticate'))
    this.app.set('authentication', promise)
    return promise
  }
}
const init = (_options: Partial<AuthenticationClientOptions> = {}) => {
  const options: AuthenticationClientOptions = Object.assign(
    {},
    defaults,
    _options,
  )
  return (app: any) => {
    const authentication = new myAuth(app, options)

    app.authentication = authentication
    app.authenticate = authentication.authenticate.bind(authentication)
    app.reAuthenticate = authentication.reAuthenticate.bind(authentication)
    app.logout = authentication.logout.bind(authentication)

    app.hooks([hooks.authentication(), hooks.populateHeader()])
  }
}
export class Client {}
//
export type createConfig = {}
export const createClient = async (config) => {
  //
  let _appName = localStorage.getItem('appName')
  let _userid = localStorage.getItem('userid') //
  let fullHost = window.location.host // erp.dxf.life
  let hostname = window.location.hostname // erp.dxf.life
  let subdomain = hostname.split('.')[0] // erp
  let port = location.port
  let userid = config.userid
  if (userid == null) {
    userid = _userid
  } //
  let appName = config.appName
  if (appName == null) {
    appName = _appName //
  }
  let _key = ''
  appName = appName || (await system.getCurrentApp())
  if (appName != 'platform') {
    userid = userid || 1
  }
  if (appName != null && userid != 'undefined') {
    _key = `/${appName}_${userid}`
  }
  let baseUrl = `http://${'localhost:3031'}` //
  let _base = import.meta.env.VITE_BASEURL
  let isProd = import.meta.env.VITE_ENVIRONMENT
  if (isProd == 'production') {
    baseUrl = _base //
  }
  let _host = `${baseUrl}${_key}`
  if (config?.isMain === true) {
    _host = baseUrl //
  }
  if (appName == 'platform') {
    _host = baseUrl //
  }
  const socket = io(_host, {
    transports: ['websocket'],
    extraHeaders: {
      authorization: localStorage.getItem('feathers-jwt'),
    },
    auth: {
      authorization: localStorage.getItem('feathers-jwt'),
    },
  })
  socket.on('login', () => {
    console.log('登陆了') //
  })
  socket.on('connected login', async (data) => {
    let appName = await system.getCurrentApp()
    if (appName == 'platform') {
      //
      system.loginInfo = {
        user: data,
      }
    }
  })
  let client = socketio(socket)
  let app = feathers()
  app.configure(client)
  app.set('connection', socket)
  app.configure(init())
  app.set('baseUrl', _host)
  return app
}

export const axiosClient = createAxios({
  isMain: true, //
}) //
const defaultMethod = ['find', 'get', 'create', 'patch', 'remove', 'update']
export class myHttp {
  client: Application
  mainClient: Application
  constructor() {
    this.initClient() //
    this.init()
  } //
  async initClient() {
    // debugger//
    this.client = await createClient({})
    this.mainClient = await createClient({ isMain: true }) //
  }
  async changeClient(config) {
    let appName = config.appName
    if (appName == null || appName == 'platform') {
      this.client = this.mainClient
      return
    }
    let userid = config.userid //
    if (userid == null || userid == 0) {
      this.client = this.mainClient
      return //
    }
    let _client = await createClient(config)
    this.client = _client //
  }
  async init() {
    nextTick(async () => {
      let token = localStorage.getItem('feathers-jwt')
      if (token) {
        try {
          let app = system.getCurrentApp()
          let res = await this.client.authenticate({
            accessToken: token,
            _unUseCaptcha: true,
            strategy: 'jwt',
          })
          // system.confirmMessage('默认登录成功') //
          console.log('系统默认登录成功')
          system.loginInfo = res //
        } catch (error) {
          // console.log('默认登录失败') //
          console.error(error, '默认登录失败') //
          // console.error(error, '登录失败') //
        }
      } else {
        system.loginInfo = null
      }
    })

    // system.hasDefaultLogin = true
  }
  setSystemLoading(status) {}
  async registerUser(data) {
    try {
      let _res = await this.create('users', data)
      console.log(_res, 'test_res') //
      system.confirmMessage('注册成功')
      let r = system.getRouter()

      r.push('login') //
    } catch (error) {
      system.confirmMessage(`注册失败,${error?.message}`, 'error') //
    }
  } //
  async loginUser(data) {
    try {
      //
      let http = this
      data.strategy = 'local' ////
      console.log('用户登录', data)
      let _res = await http.client.authenticate(data) //
      system.loginInfo = _res //
      // console.log(_res, 'testRes') //
      system.confirmMessage('登录成功') //
      let router = system.getRouter()
      router.push('/home')
      return _res
    } catch (error) {
      system.confirmMessage(`登录失败,${error?.message}`, 'error') //
    }
  }
  async logoutUser() {
    try {
      let client = this.client //
      await client.logout() //
      let router = system.getRouter()
      router.push('/login') //
      system.loginInfo = null //
    } catch (error) {
      console.error('登出信息报错') //
    }
  }
  redirectToLogin() {
    let router = system.getRouter()
    router.push('/login') //
  }
  async post(tableName, method, params = {}, query = {}): Promise<any> {
    let connection = this?.client?.get('connection')
    return new Promise((resolve, reject) => {
      connection.emit(
        method, //
        tableName,
        params,
        query,
        (data, err) => {
          console.log(method, 'testMethod', data, err, 'sdjfklsf') //
          let isError = false
          let error = null //
          let _data = null
          if (defaultMethod.includes(method)) {
            if (err) {
              isError = false
              // error = err
              _data = err?.data || {}
              if (err?.code == '401') {
                isError = true
                error = err //
              }
            } else {
              isError = true
              if (data?.code == '401') {
                isError = true
                error = data
                system.confirmMessage('登录信息无效', 'error') //
                this.redirectToLogin() //
              } else {
                error = data //
              }
            }
          } else {
            if (data) {
              isError = true
              error = data
            } else {
              isError = false
              if (err?.code == '401') {
                isError = true
                error = err
              }
              _data = err?.data || {}
            }
          }
          if (isError == true) {
            reject(error)
          }
          let _data1 = _data
          resolve(_data1) //
        },
      )
    })
  }
  async runCustomMethod(tableName, me, data) {
    let _res = await this.post(tableName, me, data)
    return _res //
  }
  async find(tableName, query = {}, config?: any): Promise<any> {
    // let _data = await this.get(tableName, 'find', query) //
    // return _data
    let _data = await this.runCustomMethod(tableName, 'getTableData', {
      query,
      ...config,
    })
    return _data //
  }
  async get(tableName, method, query?: any): Promise<any> {
    let connection = this?.client?.get('connection')
    return new Promise((resolve, reject) => {
      connection.emit(
        method, //
        tableName, //
        query,
        (err, data) => {
          if (err) {
            reject(err)
          } //
          console.log('数据获取成功', data) //
          resolve(data?.data || {}) //
        },
      )
    })
  }
  async patch(tableName, params = {}, query = {}): Promise<any> {
    console.log('patch', params, query) //
    let connection = this?.client?.get('connection')
    return new Promise((resolve, reject) => {
      connection.emit(
        'patch', //
        tableName,
        params, //
        query, //
        (data, err) => {
          let isError = false
          let error = null //
          let _data = null
          let method = 'patch' //
          if (defaultMethod.includes(method)) {
            if (err) {
              isError = false
              // error = err
              _data = err?.data || {}
              if (err?.code == '401') {
                isError = true
                error = err //
              }
            } else {
              isError = true
              if (data?.code == '401') {
                isError = true
                error = data
                system.confirmMessage('登录信息无效', 'error') //
                this.redirectToLogin() //
              } else {
                // _data = data?.data || {}
                error = data //
              }
            }
          } else {
            if (data) {
              isError = true
              error = data
            } else {
              isError = false
              if (err?.code == '401') {
                isError = true
                error = err
              }
              _data = err?.data || {}
            }
          }
          if (isError == true) {
            reject(error)
          }
          let _data1 = _data
          resolve(_data1) //
        }, //
      )
    })
  } //
  async delete(tableName, params = {}, query = {}) {
    await this.batchDelete(tableName, params) //
  }
  async getPageLayout(navName) {
    let data = await this.get('entity', 'find', {
      tableName: navName,
    })
    return data //
  }
  async create(tableName, data = {}) {
    console.log('新增数据', tableName, data) //
    let _res = await this.post(tableName, 'create', data)
    return _res //
  } //
  async uploadFile(file: File) {
    let fileName = file.name
    console.time('uploadFile')
    let uri = await this.fileToDataURL(file)
    console.timeEnd('uploadFile')
    let obj = {
      uri: uri,
      fileName: fileName,
    } //
    let _res = await this.create('uploads', obj) //
    return _res
  }
  fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        // reader.result 就是完整的 data URI
        resolve(reader.result)
      }
      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
    })
  }
  async hTable(tableName: string) {
    let _d = await this.runCustomMethod('entity', 'hasEntity', tableName)
    return _d //
  }
  registerEvent(event, fn) {
    let connection: Socket = this.client.get('connection')
    if (typeof fn !== 'function') {
      return
    }
    connection.on(event, fn) //
  }
  unRegisterEvent(event, fn) {
    let connection: Socket = this.client.get('connection')
    connection.removeListener(event, fn) //
  }
  async batchUpdate(tableName, data) {
    console.log('批量更新数据', tableName, data) //
    let _res = await this.runCustomMethod(tableName, 'batchUpdate', data)
    return _res //
  }
  async batchDelete(tableName, data) {
    console.log('批量删除数据', tableName, data) //
    let _res = await this.runCustomMethod(tableName, 'batchDelete', data)
    return _res //
  }
  async getClientBaseUrl() {
    let client = this.client
    let baseUrl = client.get('baseUrl')
    return baseUrl
  } //
}

// export const http = new myHttp()
