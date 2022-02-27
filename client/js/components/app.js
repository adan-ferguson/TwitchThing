import * as Loader from '../loader.js'
import MainPage from './pages/main/mainPage.js'
import fizzetch from '../fizzetch.js'

import './header.js'
import './pages/adventurer/adventurerPane.js'
import './pages/combat/fighterPane.js'
import './pages/combat/feed.js'
import './pages/dungeon/adventurerPane.js'
import './pages/dungeon/event.js'
import './pages/dungeon/state.js'
import './xpBar.js'
import './hpBar.js'
import './loadout.js'

const HTML = `
<di-header></di-header>
<div class="content"></div>
`
export default class App extends HTMLElement{

  constructor(user){
    super()
    this.user = user
    this.innerHTML = HTML
    this.currentPage = null
    this.header = this.querySelector('di-header')
    this.setPage(new MainPage())
  }

  get showBackButton(){
    return this.currentPage?.backPage ? true : false
  }

  async setPage(page){

    Loader.show()

    // Update the user whenever we change pages
    this._fetchUser()

    if(this.currentPage){
      const preventUnload = await this.currentPage.unload()
      if(preventUnload){
        return
      }
      this.currentPage.classList.add('fade-out')
      this.currentPage.remove()
    }

    this.currentPage = page
    const { error } = (await page.load() || {})

    if(this.currentPage !== page){
      // The page.load() caused a redirect, so this setPage is no longer relevant.
      return
    }

    if(error){
      return this.setPage(new MainPage({ error }))
    }

    this.querySelector(':scope > .content').appendChild(page)
    page.classList.add('fade-in')
    this.dispatchEvent(new Event('pagechange'))

    Loader.hide()
  }

  back(){
    if(this.currentPage.backPage){
      this.setPage(this.currentPage.backPage())
    }
  }

  async _fetchUser(){
    // TODO: error handle
    this.user = await fizzetch('/user')
    this.header.updateUserBar()
  }
}

customElements.define('di-app', App)