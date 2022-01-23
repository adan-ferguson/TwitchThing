import App from '../components/app.js'
import '../loadIcons.js'
import * as SocketClient from '../socketClient.js'

SocketClient.connect()
SocketClient.getSocket().on('user connect', id => {
  console.log('socket user connected', id)
  const app = new App()
  document.querySelector('#root').appendChild(app)
}).on('adventurer update', ({ dungeonRun, event }) => {
  console.log('adventurer updated', dungeonRun, event)
})