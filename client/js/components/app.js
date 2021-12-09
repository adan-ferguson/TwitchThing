import * as Loader from '../loader.js'
import MainPage from './pages/main/mainPage.js'

import './header.js'

const HTML = `
<di-header></di-header>
<div class="content"></div>
`
export default class App extends HTMLElement {

  constructor(user){
    super()
    this.user = user
    this.innerHTML = HTML
    this.currentPage = null

    this.setPage(new MainPage())
  }

  get showBackButton(){
    return this.currentPage?.backPage ? true : false
  }

  async setPage(page){
    Loader.show()
    if(this.currentPage){
      this.currentPage.classList.add('fade-out')
      await this.currentPage.unload()
      this.currentPage.remove()
    }
    await page.load()
    this.currentPage = page
    this.querySelector(':scope > .content').appendChild(page)
    page.classList.add('fade-in')
    this.dispatchEvent(new Event('pagechange'))
    Loader.hide()
  }
}

customElements.define('di-app', App)