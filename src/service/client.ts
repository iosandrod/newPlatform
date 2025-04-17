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
    methods: ['find', 'get', 'create', 'patch', 'remove', 'update'],
  }) //
  app.use('company', app.service('company'), {
    methods: ['find', 'get', 'create', 'patch', 'remove', 'update'], //
  })
//   const allEntity = app.service('entity').find()
//   const allCompany = app.service('company').find() //
  return client //
}

export const client = createClient({})
