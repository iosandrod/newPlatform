import io from 'socket.io-client'
import socketio from '@feathersjs/socketio-client'
import { feathers } from '@feathersjs/feathers'
import auth from '@feathersjs/authentication-client'
export class Client {}
//
export type createConfig = {}
export const createClient = (config) => {
  const socket = io('http://localhost:3031', {
    transports: ['websocket'],
    
  })
  const client = socketio(socket)
  let app = feathers()
  app.configure(client)
  app.set('connection', socket)
  app.configure(auth())
  app.hooks({
    // all: [
    //   async (context, next) => {
    //     console.log('这个是钩子') //
    //     await next()
    //   },
    // ],
    around: [
      async (context, next) => {
        console.log('这个是环绕钩子') //
        await next()
      }, //
    ],
  })
  app.use('users', app.service('users'), {
    methods: ['find', 'get', 'create', 'patch', 'remove', 'update'], //
  })
  app.use('navs', app.service('navs'), {
    methods: ['find', 'get', 'create', 'patch', 'remove', 'update'], //
  })
  app.use('entity', app.service('entity'), {
    methods: [
      'find',
      'get',
      'create',
      'patch',
      'remove',
      'update',
      'getDefaultPageLayout',
    ],
  }) //
  app.use('company', app.service('company'), {
    methods: ['find', 'get', 'create', 'patch', 'remove', 'update'], //
  })
  //   const allEntity = app.service('entity').find()
  //   const allCompany = app.service('company').find() //
  return app //
}
let token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJpYXQiOjE3NDU5MjUzMzEsImV4cCI6MTc0NjAxMTczMSwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsInN1YiI6IjEiLCJqdGkiOiJhOTYyM2ZlOS04NTQ5LTQxNWMtOTc5NS1iYTFiMmYyZjdjOGEifQ.SgpYPmb7Cuh_EKXn8IGOiFEUVN3atSguCnoxgIRi3rQ'
export const client = createClient({})
const defaultMethod = ['find', 'get', 'create', 'patch', 'remove', 'update']
export class myHttp {
  client = client
  async post(tableName, method, params = {}, query = {}): Promise<any> {
    let connection = this.client.get('connection')
    return new Promise((resolve, reject) => {
      connection.emit(
        method, //
        tableName,
        params,
        {},
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
        },
      )
    })
  }
  async find(tableName, query = {}): Promise<any> {
    let _data=await this.get(tableName, 'find', query) //
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
    let connection = this.client.get('connection')
    return new Promise((resolve, reject) => {
      connection.emit(
        'patch', //
        tableName,
        params, //
        query,//
        (data, err) => {
          let isError = false
          let error = null //
          let _data = null
          let method = 'patch'//
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
        },//
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
  async create(tableName, data) {
    let _res = await this.post('entity', 'create', data)
    return _res //
  }
}

export const http = new myHttp()
