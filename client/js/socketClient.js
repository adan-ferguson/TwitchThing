import { io } from 'socket.io-client'
import SimpleModal from './components/simpleModal.js'

let socket
const rooms = {}

export function connect(){
  socket = io.connect()
  socket.on('connect', () => {
    console.log('Socket connected')
    for(let id in rooms){
      joinSocketRoom(id)
    }
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

export function joinSocketRoom(id){
  socket.emit('joinroom', id)
  rooms[id] = 1
}

export function leaveSocketRoom(id){
  socket.emit('leaveroom', id)
  delete rooms[id]
}