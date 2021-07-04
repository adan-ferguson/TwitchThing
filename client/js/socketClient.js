import { io } from 'socket.io-client'

const socket = io.connect()
socket.on('connect', () => {
  console.log('Socket connected')
})