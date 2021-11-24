import MainPage from './pages/main.js'
import LoginPage from './pages/login.js'
import * as Loader from '../loader.js'

const HTML = `
<div class="effects"></div>
<div class="content"></div>
`

export default class App extends HTMLElement {

  constructor(){
    super()
    this.innerHTML = HTML
  }

  setUser(user){
    Loader.hide()
    this.user = user
    this.setPage(new MainPage(this))
  }

  showLoginPage(){
    Loader.hide()
    this.setPage(new LoginPage())
  }

  async setPage(page){
    if(this.currentPage){
      await this.currentPage.navigateFrom()
      this.currentPage.remove()
    }
    await page.navigateTo()
    this.querySelector(':scope > .content').appendChild(page)
    this.currentPage = page
  }
}

customElements.define('di-app', App)