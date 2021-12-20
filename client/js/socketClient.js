import { io } from 'socket.io-client'

let socket

export function connect(){
  socket = io.connect()
  socket.on('connect', () => {
    console.log('Socket connected')
  })
}

export function getSocket(){
  return socket
}