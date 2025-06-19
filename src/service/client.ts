import io, { Socket } from 'socket.io-client'
import socketio from '@feathersjs/socketio-client'
import { feathers, Params } from '@feathersjs/feathers'
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
export const createClient = (config) => {
  // debugger//
  let fullHost = window.location.host // erp.dxf.life
  let hostname = window.location.hostname // erp.dxf.life
  let subdomain = hostname.split('.')[0] // erp
  let port = location.port
  let userid = config.userid
  let appName = config.appName
  let _key = '' //
  if (appName != null && userid != 'undefined') {
    _key = `/${appName}_${userid}`
  }
  // let baseUrl = `http://47.92.84.152:3031`
  let baseUrl = `http://${'localhost:3031'}` //
  let _host = `${baseUrl}${_key}`
  // if (subdomain == 'erp') {
  //   if (userid == null) {
  //     return
  //   }
  // }
  const socket = io(_host, {
    transports: ['websocket'],
    extraHeaders: {
      authorization: localStorage.getItem('feathers-jwt'), //
    },
    auth: {
      authorization: localStorage.getItem('feathers-jwt'), //
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
  }) //
  const client = socketio(socket)
  let app = feathers()
  app.configure(client)
  app.set('connection', socket)
  app.configure(init()) //
  return app
}
export const client = createClient({})
// export const client: any = {
//   get: () => {
//     return {
//       emit: () => {},
//     }
//   },
//   authenticate: () => {},
// } //
const defaultMethod = ['find', 'get', 'create', 'patch', 'remove', 'update']
export class myHttp {
  client = client
  mainClient = client
  constructor() {
    this.init()
  }
  changeClient(config) {
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
    let _client = createClient(config)
    this.client = _client //
  }
  async init() {
    let token = localStorage.getItem('feathers-jwt')
    if (token) {
      // try {
      //   let res = await this?.client?.authenticate({
      //     strategy: 'jwt',
      //     accessToken: token, //
      //     _unUseCaptcha: true,
      //   }) //
      //   system.confirmMessage('登录成功') //
      //   system.loginInfo = res //
      //   return res
      // } catch (error) {
      //   console.error(error, '登录失败')
      //   localStorage.removeItem('feathers-jwt') //
      // }
    }
  }
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
}

export const http = new myHttp()

/* 
feathers: {
    provider: 'socketio',
    headers: {
      host: 'localhost:3031',
      connection: 'Upgrade',
      pragma: 'no-cache',
      'cache-control': 'no-cache',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',    
      upgrade: 'websocket',
      origin: 'http://localhost:3003',
      'sec-websocket-version': '13',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,fr;q=0.5',
      cookie: 'session=U2FsdGVkX1/8m7tAhv2rq4Pbjsd8DSbsri1CXZ3/DrkZ6xv/YGE1bbXA5gosoyewwOyoHKvqmvgKOrhcWetEn8hw7P8nOxCE1QuIIdo6bY07MOCnERli9o5lpoOGozUB/x4XbJmg3UApx5guO+cX/g==; Hm_lvt_52eb07460b7dc3e27bb80c78c0988671=1743073927',
      'sec-websocket-key': 'Afbxp7rAlhCjcDFzQXLMDA==',
      'sec-websocket-extensions': 'permessage-deflate; client_max_window_bits',
      authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJpYXQiOjE3NTAwNDc3MjQsImV4cCI6MTc1MDEzNDEyNCwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsInN1YiI6IjEiLCJqdGkiOiJiM2Q3ODZhOC0wNTQ4LTRkZGMtYTIyYS00NTc4Y2RjZGUxN2YifQ.f0nLDh680HhW0MyK-Nrz_aEgmTG1QovFqx_1GvUgh0Q'
    },
    authentication: {
      strategy: 'jwt',
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJpYXQiOjE3NTAwNDc3MjQsImV4cCI6MTc1MDEzNDEyNCwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsInN1YiI6IjEiLCJqdGkiOiJiM2Q3ODZhOC0wNTQ4LTRkZGMtYTIyYS00NTc4Y2RjZGUxN2YifQ.f0nLDh680HhW0MyK-Nrz_aEgmTG1QovFqx_1GvUgh0Q'
    },
    user: {
      id: 1,
      createdAt: '2025-05-24 09:13:24',
      updatedAt: '2025-05-24 09:13:24',
      username: 'dxf',
      email: '1151685410@qq.com',
      password: '$2b$10$mtmxQd1lFzh6ORBsVOsfvOzH2XN107xINOtc3AmggeDO9.CfXztXm',
      appName: null,
      companyName: 'newC',
      companyCnName: '新公司',
      companyType: null,
      companyId: null,
      phone: null,
      avatar: '/images/7332066ce14ee350ac57f9d74393a604d7c7ba4fdd3e15f3a47daa59bbc647f9.jpg',
      companyLogo: '/images/7332066ce14ee350ac57f9d74393a604d7c7ba4fdd3e15f3a47daa59bbc647f9.jpg'
    }
  },


*/
