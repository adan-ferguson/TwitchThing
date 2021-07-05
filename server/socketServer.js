const SocketServer = require('socket.io').Server
const log = require('fancy-log')

let io

function setup(server, sessionMiddleware){

  io = new SocketServer(server)

  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next)
  })

  io.use((socket, next) => {
    const username = socket.request.session.username
    if(username && !socket.rooms.has(username)){
      socket.join(username)
      log('A user connected.', username)
    }
    next()
  })

  io.on('connection', socket => {
    // Listen for stuff
  })
}

function emit(roomname, eventName, data = {}){
  io.to(roomname).emit(eventName, data)
}

module.exports = {
  setup,
  emit
}