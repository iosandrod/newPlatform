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
  let port = location.port
  // console.log(port, 'testPort') //
  let _host = `http://localhost:3031`
  if (port == '3004') {
    _host = `${_host}/erp_1` //
  }
  const socket = io(_host, {
    transports: ['websocket'],
  })
  const client = socketio(socket)
  let app = feathers()
  app.configure(client)
  app.set('connection', socket)
  app.configure(init()) //

  return app //
}
export const client = createClient({})
const defaultMethod = ['find', 'get', 'create', 'patch', 'remove', 'update']
export class myHttp {
  client = client
  constructor() {
    this.init() //
  }
  async init() {
    let token = localStorage.getItem('feathers-jwt')
    if (token) {
      try {
        let res = await this.client.authenticate({
          strategy: 'jwt',
          accessToken: token, //
          _unUseCaptcha: true,
        }) //
        system.loginInfo = res //
        return res
      } catch (error) {
        console.error(error, '登录失败') //
        localStorage.removeItem('feathers-jwt') //
      }
    }
  }
  async registerUser(data) {
    try {
      let _res = await this.create('users', data)
      console.log(_res, 'test_res') //
      system.confirmMessage('注册成功')
      let r = system.getRouter()
      r.push('companyLogin') //
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
      router.push('/companyHome') // //
      return _res ////
    } catch (error) {
      system.confirmMessage(`登录失败,${error?.message}`, 'error') //
    }
  }
  async logoutUser() {
    try {
      let client = this.client //
      await client.logout() //
      let router = system.getRouter()
      router.push('/companyLogin') //
      system.loginInfo = null //
    } catch (error) {
      console.error('登出信息报错') //
    }
  }
  redirectToLogin() {
    let router = system.getRouter()
    router.push('/companyLogin') //
  }
  async post(tableName, method, params = {}, query = {}): Promise<any> {
    let connection = this.client.get('connection')
    return new Promise((resolve, reject) => {
      connection.emit(
        method, //
        tableName,
        params,
        query,
        (data, err) => {
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
  async find(tableName, query = {}): Promise<any> {
    let _data = await this.get(tableName, 'find', query) //
    return _data
  }
  async get(tableName, method, query?: any): Promise<any> {
    let connection = this.client.get('connection')
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
    let connection = this.client.get('connection')
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
  }
  async delete(tableName, params = {}, query = {}) {}
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
    console.log('转化时间分析') //
    let obj = {
      uri: uri,
      fileName: fileName,
    } //
    console.log(obj, 'testObj') //
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
}

export const http = new myHttp()
