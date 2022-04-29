import App from '../components/app.js'
import * as SocketClient from '../socketClient.js'

let app

SocketClient.connect()
SocketClient.getSocket().on('user connect', id => {
  console.log('socket connected', id)
  startApp()
}).on('anonymous connect', () => {
  console.log('socket connected')
  startApp()
})

function startApp(){
  if(!app){
    app = new App(window.STARTUP_PARAMS)
    document.querySelector('#root').appendChild(app)
  }
}