import { Server as SocketServer } from 'socket.io'
import log from 'fancy-log'
import { loadFromMagicID } from './collections/users.js'

let io

export function setup(server, sessionMiddleware){

  io = new SocketServer(server)

  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next)
  })

  io.on('connection', socket => {

    const magicID = socket.request.session.passport.user
    if(magicID){
      socket.request.user = loadFromMagicID(magicID).then(user => {
        if(user){
          socket.join(user._id)
          io.to(user._id).emit('user connect', user._id)
          log('User joined room', user._id)
        }
      })
    }

    socket.on('view dungeon run', ({ adventurerID }) => {
      socket.join(adventurerID)
      io.to(adventurerID).emit('room joined', adventurerID)
      log('User joined room', adventurerID)
    })

    socket.on('leave dungeon run', ({ adventurerID }) => {
      socket.leave(adventurerID)
      io.to(adventurerID).emit('room left', adventurerID)
      log('User left room', adventurerID)
    })
  })
}

export function emit(roomname, eventName, data = {}){
  io.to(roomname.toString()).emit(eventName, data)
}