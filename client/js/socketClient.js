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

export function getSocket(){
  return socket
}