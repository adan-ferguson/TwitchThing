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
      const preventUnload = await this.currentPage.unload()
      if(preventUnload){
        return
      }
      this.currentPage.classList.add('fade-out')
      this.currentPage.remove()
    }

    this.currentPage = page
    const error = await page.load()
    if(error){
      this.setPage(new MainPage({ error }))
      return
    }

    this.querySelector(':scope > .content').appendChild(page)
    page.classList.add('fade-in')
    this.dispatchEvent(new Event('pagechange'))
    Loader.hide()
  }

  back(){
    if(this.currentPage.backPage){
      this.setPage(new this.currentPage.backPage())
    }
  }
}

customElements.define('di-app', App)