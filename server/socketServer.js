import { Server as SocketServer } from 'socket.io'
import Users from './collections/users.js'

let io

export function setup(server, sessionMiddleware){

  io = new SocketServer(server)

  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next)
  })

  io.on('connection', async socket => {

    try {
      const user = await Users.deserializeFromSession(socket.request.session?.passport?.user)
      if(user){
        const id = user._id.toString()
        socket.join(id)
        socket.emit('user connect', id)
      }else{
        socket.emit('anonymous connect')
      }
    }catch(ex){
      socket.emit('error', ex)
    }

    socket.on('joinroom', roomID => {
      socket.join(roomID)
      socket.emit('room joined', roomID)
    })

    socket.on('leaveroom', roomID => {
      socket.leave(roomID)
      socket.emit('room left', roomID)
    })
  })
}

export function broadcast(eventName, data = {}){
  io.emit(eventName, data)
}

export function emit(roomname, eventName, data = {}){
  io.to(roomname.toString()).emit(eventName, data)
}