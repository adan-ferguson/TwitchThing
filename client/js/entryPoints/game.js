import App from '../components/app.js'
import * as SocketClient from '../socketClient.js'

let app

SocketClient.connect()
SocketClient.getSocket().on('user connect', id => {
  console.log('socket user connected', id)
  if(!app){
    app = new App()
    document.querySelector('#root').appendChild(app)
  }
}).on('adventurer update', ({ dungeonRun, event }) => {
  console.log('adventurer updated', dungeonRun, event)
})