import * as Loader from '../loader.js'
import MainPage from './pages/main/mainPage.js'
import fizzetch from '../fizzetch.js'
import { hideAll as hideAllTippys } from 'tippy.js'
import SimpleModal from './simpleModal.js'
import AdventurerPage from './pages/adventurer/adventurerPage.js'
import DungeonPage from './pages/dungeon/dungeonPage.js'

import './header.js'
import './pages/dungeon/combat/fighterPane.js'
import './pages/dungeon/combat/feed.js'
import './pages/dungeon/exploring/adventurerPane.js'
import './pages/dungeon/exploring/event.js'
import './pages/dungeon/exploring/state.js'
import './loadout/inventory.js'
import './stats/statsList.js'
import './xpBar.js'
import './hpBar.js'
import './loadout/loadout.js'

const HTML = `
<di-header></di-header>
<div class="content"></div>
`

const PAGES = {
  adventurer: AdventurerPage,
  dungeon: DungeonPage
}

export default class App extends HTMLElement{

  currentPage

  constructor(user){
    super()
    this.user = user
    this.innerHTML = HTML
    this.currentPage = null
    this.header = this.querySelector('di-header')
    this._setInitialPage()
  }

  get showBackButton(){
    return this.currentPage?.backPage ? true : false
  }

  updateTitle(){
    this.header.titleText = this.currentPage.titleText
  }

  /**
   * @param page {Page}
   * @returns {Promise<undefined|*>}
   */
  async setPage(page){

    if(!page){
      throw 'Attempted to set null page'
    }

    Loader.showLoader()
    hideAllTippys()

    // Update the user whenever we change pages
    this._fetchUser()

    if(this.currentPage){
      const preventUnload = await this.currentPage.unload()
      if(preventUnload){
        return
      }
      this.currentPage.unloaded = true
      this.currentPage.classList.add('fade-out')
      this.currentPage.remove()
    }

    this.currentPage = page
    page.app = this
    const error = await page.load()

    if(this.currentPage !== page){
      // The page.load() caused a redirect, so this setPage is no longer relevant.
      return
    }

    if(error){
      return this.setPage(new MainPage({ error }))
    }

    page.unloaded = false
    this.querySelector(':scope > .content').appendChild(page)
    page.classList.add('fade-in')
    this.dispatchEvent(new Event('pagechange'))
    this.updateTitle()

    Loader.hideLoader()
  }

  async back(){
    if(this.currentPage.confirmLeavePageMessage){
      const confirmed = await this._confirmLeavePage(this.currentPage.confirmLeavePageMessage)
      if(!confirmed){
        return
      }
    }
    this.setPage(this.currentPage.backPage())
  }

  async _setInitialPage(){
    const [pageStr, arg] = window.location.hash.substring(1).split('=')
    if(pageStr === 'adventurer' && arg){
      if(await this._setAdventurerPage(arg)){
        return
      }
    }
    this.setPage(new MainPage())
  }

  async _fetchUser(){
    // TODO: error handle
    this.user = await fizzetch('/user')
    this.header.updateUserBar()
  }

  _confirmLeavePage(message){
    return new Promise(res => {
      new SimpleModal(message, [{
        text: 'Leave Page',
        style: 'scary',
        fn: () => {
          res(true)
        }
      },{
        text: 'Never Mind',
        fn: () => {
          res(false)
        }
      }]).show()
    })
  }

  async _setAdventurerPage(adventurerID){
    const { error, status } = await fizzetch(`/game/adventurer/${adventurerID}/status`)
    if(error){
      return false
    }
    if(status === 'idle'){
      this.setPage(new AdventurerPage(adventurerID))
    }else{
      this.setPage(new DungeonPage(adventurerID))
    }
    return true
  }
}

customElements.define('di-app', App)

export function pageFromString(name, args){
  const page = PAGES[name?.toLowerCase()]
  if(page){
    return new page(...args)
  }
  return null
}