import App from './components/app.js'
import './loadIcons.js'
import * as SocketClient from './socketClient.js'
import User from './user.js'

SocketClient.connect()
const app = new App()
document.querySelector('#root').appendChild(app)

User.load().then(user => {
  if(user){
    app.setUser(user)
  }else{
    app.showLoginPage()
  }
})