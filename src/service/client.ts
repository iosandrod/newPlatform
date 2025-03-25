import io from 'socket.io-client'
import socketio from '@feathersjs/socketio-client'
import { feathers } from '@feathersjs/feathers'
import auth from '@feathersjs/authentication-client'
export class Client {

}
//
export type createConfig = {

}
export const createClient = (config) => {
    const socket = io('http://localhost:3031', {
        transports: ['websocket'],
    })
    const client = socketio(socket)
    let app = feathers()
    app.configure(client)
    app.set('connection', socket)
    app.configure(auth())
    app.use('users', app.service('users'), {
        methods: ['find', 'get', 'create', 'patch', 'remove', 'update']//
    })
    return client
}

export const client = createClient({})