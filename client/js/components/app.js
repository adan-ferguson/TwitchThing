import * as Loader from '../loader.js'
import MainPage from './pages/main.js'

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
      await this.currentPage.navigateFrom()
      this.currentPage.remove()
    }
    await page.navigateTo()
    this.querySelector(':scope > .content').appendChild(page)
    this.currentPage = page
    this.dispatchEvent(new Event('pagechange'))
    Loader.hide()
  }
}

customElements.define('di-app', App)