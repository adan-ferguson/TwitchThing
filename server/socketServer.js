import { Server as SocketServer } from 'socket.io'
import log from 'fancy-log'

let io

export function setup(server, sessionMiddleware){

  io = new SocketServer(server)

  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next)
  })

  io.on('connection', socket => {
    socket.on('join room', ({ room }) => {
      socket.join(room)
      io.to(room).emit('room joined', room)
      log('User joined room', room)
    })
  })
}

export function emit(roomname, eventName, data = {}){
  io.to(roomname).emit(eventName, data)
  log(roomname, eventName, data)
}