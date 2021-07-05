import { io } from 'socket.io-client'

let socket

export function connect(){
  socket = io.connect()
  socket.on('connect', () => {
    console.log('Socket connected')
  })
}

export function setupUser(user){
  socket.emit('setup user', () => {
    console.log('Joined user socket room')
  })
  socket.on('updated', diff => {
    user.update(diff)
  })
}