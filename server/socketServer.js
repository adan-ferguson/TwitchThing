import { Server as SocketServer } from 'socket.io'
import log from 'fancy-log'
import Users from './collections/users.js'

let io

export function setup(server, sessionMiddleware){

  io = new SocketServer(server)

  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next)
  })

  io.on('connection', socket => {

    const magicID = socket.request.session?.passport?.user
    if(magicID){
      socket.request.user = Users.loadFromMagicID(magicID).then(user => {
        if(user){
          const id = user._id.toString()
          socket.join(id)
          socket.emit('user connect', id)
          log('User joined room', id)
        }
      })
    }else{
      socket.emit('anonymous connect')
      log('Anonymous user connected')
    }

    socket.on('join dungeon run room', dungeonRunID => {
      socket.join(dungeonRunID)
      socket.emit('room joined', dungeonRunID)
    })
  })
}

export function emit(roomname, eventName, data = {}){
  io.to(roomname.toString()).emit(eventName, data)
}