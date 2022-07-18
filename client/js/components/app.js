import * as Loader from '../loader.js'
import MainPage from './pages/main/mainPage.js'
import fizzetch from '../fizzetch.js'
import { hideAll as hideAllTippys } from 'tippy.js'
import SimpleModal from './simpleModal.js'
import AdventurerPage from './pages/adventurer/adventurerPage.js'
import DungeonPage from './pages/dungeon/dungeonPage.js'
import { getSocket } from '../socketClient.js'
import { showPopup } from './popup.js'

const HTML = `
<di-header></di-header>
<div class="page-title"></div>
<div class="content"></div>
`

const PAGES = {
  adventurer: AdventurerPage,
  dungeon: DungeonPage
}

export default class App extends HTMLElement{

  currentPage
  _pageTitle

  constructor(startupParams = {}){
    super()
    this.innerHTML = HTML
    this._pageTitle = this.querySelector('.page-title')
    this.currentPage = null
    this.header = this.querySelector('di-header')
    this.startupParams = startupParams || {}
    getSocket().on('show popup', showPopup)
    this._setInitialPage()
  }

  get showBackButton(){
    return this.currentPage?.backPage ? true : false
  }

  updateTitle(){
    this._pageTitle.textContent = this.currentPage.titleText
  }

  async setPage(page){

    if(this.currentPage && this.startupParams.watch){
      throw 'Can not change pages in watch mode'
    }

    if(!page){
      throw 'Attempted to set null page'
    }

    Loader.showLoader()
    hideAllTippys()

    // Update the user whenever we change pages
    this._fetchUser()

    const previousPage = this.currentPage
    if(previousPage){
      const preventUnload = await previousPage.unload()
      if(preventUnload){
        return
      }
      previousPage.unloaded = true
      previousPage.classList.add('fade-out')
      previousPage.remove()
    }

    this.currentPage = page
    page.app = this
    page.unloaded = false

    this._resetBackground()

    try {
      await page.load(previousPage)
    }catch(ex){
      const { error, targetPage } = ex
      console.error(ex)
      if(targetPage){
        this.setPage(pageFromString(targetPage.name, targetPage.args))
      }else{
        this.setPage(new MainPage({ error }))
      }
    }

    if(this.currentPage !== page){
      // The page.load() caused a redirect, so this setPage is no longer relevant.
      return
    }

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

  setBackground(color, texture){
    this.style.backgroundColor = color
    this.style.backgroundImage = `url("/assets/textures/${texture}")`
  }

  async _setInitialPage(){
    const [pageStr, arg] = window.location.hash.substring(1).split('=')
    if(pageStr === 'adventurer' && arg){
      if(await this._setAdventurerPage(arg)){
        return
      }
    }
    if(this.startupParams.watch?.page === 'dungeonrun'){
      return this.setPage(new DungeonPage(this.startupParams.watch.id, true))
    }
    this.setPage(new MainPage())
  }

  _resetBackground(){
    this.setBackground(null, null)
  }

  async _fetchUser(){
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