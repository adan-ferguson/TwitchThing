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
          io.to(id).emit('user connect', id)
          log('User joined room', id)
        }
      })
    }

    socket.on('view dungeon run', ({ adventurerID }) => {
      socket.join(adventurerID.toString())
      io.to(adventurerID).emit('room joined', adventurerID)
      log('User joined room', adventurerID)
    })

    socket.on('leave dungeon run', ({ adventurerID }) => {
      socket.leave(adventurerID.toString())
      io.to(adventurerID).emit('room left', adventurerID)
      log('User left room', adventurerID)
    })
  })
}

export function emit(roomname, eventName, data = {}){
  io.to(roomname.toString()).emit(eventName, data)
}