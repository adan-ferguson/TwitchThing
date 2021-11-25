import Game from './game.js'
import * as Loader from '../loader.js'

export default class App extends HTMLElement {

  constructor(){
    super()
  }

  setUser(user){
    Loader.hide()
    this.innerHTML = ''
    this.appendChild(new Game(user))
  }
}

customElements.define('di-app', App)