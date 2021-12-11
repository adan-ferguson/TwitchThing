import App from '../components/app.js'
import '../loadIcons.js'
import * as SocketClient from '../socketClient.js'

if(!window.INITIAL_USER_DATA){
  window.location = '/login'
}

SocketClient.connect()

const app = new App(window.INITIAL_USER_DATA)
document.querySelector('#root').appendChild(app)