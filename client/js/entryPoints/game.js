import App from '../components/app.js'
import '../loadIcons.js'
import * as SocketClient from '../socketClient.js'
import User from '../user.js'

if(!window.INITIAL_USER_DATA){
  window.location = '/login'
}

SocketClient.connect()

const app = new App(new User(window.INITIAL_USER_DATA))
document.querySelector('#root').appendChild(app)