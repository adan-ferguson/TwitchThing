const SocketServer = require('socket.io').Server
const log = require('fancy-log')

let io

function setup(server, sessionMiddleware){

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

function emit(roomname, eventName, data = {}){
  io.to(roomname).emit(eventName, data)
}

module.exports = {
  setup,
  emit
}