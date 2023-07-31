import App from '../components/app.js'
import * as SocketClient from '../socketClient.js'
import '../componentImporter.js'
import SimpleModal from '../components/simpleModal.js'

let app
let reloadForced = false

SocketClient.connect()
SocketClient.getSocket().on('user connect', id => {
  console.log('socket connected', id)
  startApp()
}).on('anonymous connect', () => {
  console.log('socket connected')
  startApp()
}).on('connect', () => {
  if(app && !reloadForced){
    app.reloadPage()
  }
}).on('force reload', () => {
  reloadForced = true
  new SimpleModal('Game updated, click to reload',{
    text: 'Okay',
    fn: () => window.location.reload(),
  }).setOptions({
    closeOnUnderlayClick: false
  }).show()
})

function startApp(){
  if(!app){
    app = new App(window.STARTUP_PARAMS)
    document.querySelector('#root').appendChild(app)
  }
}