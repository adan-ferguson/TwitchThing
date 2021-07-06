import { io } from 'socket.io-client'

let socket

export function connect(){
  socket = io.connect()
  socket.on('connect', () => {
    console.log('Socket connected')
  })
}

export function setupUser(user){
  socket
    .emit('join room', { room: user.data.username })
    .on('updated', args => {
      user.update(args)
    })
    .on('room joined', name => {
      console.log('joined room', name)
    })
}

export function getSocket(){
  return socket
}