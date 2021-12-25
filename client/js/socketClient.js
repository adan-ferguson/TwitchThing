import { io } from 'socket.io-client'

let socket

export function connect(){
  socket = io.connect()
  socket.on('connect', () => {
    console.log('Socket connected')
  })
  socket.on('room joined', id => {
    console.log('Room joined', id)
  })
  socket.on('room left', id => {
    console.log('Room left', id)
  })
}

export function getSocket(){
  return socket
}