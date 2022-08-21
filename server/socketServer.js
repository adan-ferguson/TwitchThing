import { Server as SocketServer } from 'socket.io'
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
        }
      })
    }else{
      socket.emit('anonymous connect')
      console.log('Anonymous user connected')
    }

    socket.on('joinroom', roomID => {
      socket.join(roomID)
      socket.emit('room joined', roomID)
      console.log('User joined room', roomID)
    })

    socket.on('leaveroom', roomID => {
      socket.join(roomID)
      socket.emit('room left', roomID)
      console.log('User left room', roomID)
    })
  })
}

export function broadcast(eventName, data = {}){
  io.emit(eventName, data)
}

export function emit(roomname, eventName, data = {}){
  io.to(roomname.toString()).emit(eventName, data)
}