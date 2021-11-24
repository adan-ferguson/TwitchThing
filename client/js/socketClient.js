import { io } from 'socket.io-client'

let socket

export default {
  a: 1,
  b: 2
}

export function connect(){
  socket = io.connect()
  socket.on('connect', () => {
    console.log('Socket connected')
  })
}

export function setupUser(user){
  socket
    .emit('join room', { room: user.username })
    .on('resources_updated', args => {
      user.update(args)
    })
    .on('room joined', name => {
      console.log('joined room', name)
    })
}

export function getSocket(){
  return socket
}