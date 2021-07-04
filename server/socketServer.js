const SocketServer = require('socket.io').Server
const log = require('fancy-log')

function setup(server, sessionMiddleware){

  const io = new SocketServer(server)
  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next)
  })

  io.on('connection', socket => {
    const session = socket.request.session
    log('A user connected.', session.username || 'unknown user')
  })
}

module.exports = {
  setup
}