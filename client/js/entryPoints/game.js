import App from '../components/app.js'
import * as SocketClient from '../socketClient.js'
import '../componentImporter.js'

let app

SocketClient.connect()
SocketClient.getSocket().on('user connect', id => {
  console.log('socket connected', id)
  startApp()
}).on('anonymous connect', () => {
  console.log('socket connected')
  startApp()
}).on('connect', () => {
  if(app){
    app.reloadPage()
  }
})

function startApp(){
  if(!app){
    app = new App(window.STARTUP_PARAMS)
    document.querySelector('#root').appendChild(app)
  }
}