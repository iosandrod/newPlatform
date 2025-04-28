import io from 'socket.io-client'
import socketio from '@feathersjs/socketio-client'
import { feathers } from '@feathersjs/feathers'
import auth from '@feathersjs/authentication-client'
export class Client { }
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

export const client = createClient({})
const defaultMethod = ['find', 'get', 'create', 'patch', 'remove', 'update']
export class myHttp {
  client = client
  async post(tableName, method, params = {}, query = {}): Promise<any> {
    //
    let connection = this.client.get('connection')
    return new Promise((resolve, reject) => {
      connection.emit(
        method, //
        tableName,
        params,
        query,
        (data, err) => {
          let isError = false
          let error = null
          let _data = null
          if (defaultMethod.includes(method)) {
            if (err) {
              isError = true
              error = err
            } else {
              isError = false
              _data = data?.data || {}
            }
          } else {
            if (data) {
              isError = true
              error = data
            } else {
              isError = false
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
  async get(tableName, method, query?: any): Promise<any> {//
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
          console.log('数据获取成功', data)//
          resolve(data?.data || {}) //
        },
      )
    })
  }
  async patch(tableName, params = {}, query = {}): Promise<any> {
    let connection = this.client.get('connection')
    return new Promise((resolve, reject) => {
      connection.emit(
        'update', //
        tableName,
        params, //
        query,
        (data, err) => {
          if (err) {
            reject(err)
          } //
          resolve(data?.data || {}) //
        },
      )
    })
  }
  async delete(tableName, params = {}, query = {}) { }
  async getPageLayout(navName) {
    let data = await this.get('entity', 'find', {
      tableName: navName
    })
    return data//
  }
}

export const http = new myHttp()
