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

export const client = createClient({})
const defaultMethod = ['find', 'get', 'create', 'patch', 'remove', 'update']
export class myHttp {
  client = client
  async post(tableName, method, params = {}, query = {}) {
    //
    let connection = this.client.get('connection')
    return new Promise((resolve, reject) => {
      connection.emit(
        method, //
        tableName,
        params,
        query,
        (data, err) => {
          if (defaultMethod.includes(method)) {
            if (err) {
              reject(err)
            }
            resolve(data)
          } else {
            if (data) {
              reject(data)
            }
            resolve(err) //
          }
        },
      )
    })
  }
  async get(tableName, method, query) {
    let connection = this.client.get('connection')
    return new Promise((resolve, reject) => {
      connection.emit(
        method, //
        tableName, //
        {},
        query,
        (data, err) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        },
      )
    })
  }
}

export const http = new myHttp()
