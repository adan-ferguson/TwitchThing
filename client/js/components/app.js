import * as Loader from '../loader.js'
import MainPage from './pages/main/mainPage.js'
import fizzetch from '../fizzetch.js'
import { hideAll as hideAllTippys } from 'tippy.js'
import SimpleModal from './simpleModal.js'
import AdventurerPage from './pages/adventurer/adventurerPage.js'
import DungeonPage from './pages/dungeon/dungeonPage.js'
import { getSocket } from '../socketClient.js'
import { showPopup } from './popup.js'
import ErrorPage from './pages/errorPage.js'
import { fadeIn } from '../animationHelper.js'
import getStartPage from './pathRouter.js'
import { addPageToHistory } from '../history.js'

const HTML = `
<di-header></di-header>
<div class="content"></div>
`

export default class App extends HTMLElement{

  currentPage

  constructor(startupParams = {}){
    super()
    this.innerHTML = HTML
    this.currentPage = null
    this.header = this.querySelector('di-header')
    this.startupParams = startupParams || {}
    getSocket().on('show popup', showPopup)
    this.setPage(getStartPage())
  }

  get showBackButton(){
    return this.currentPage?.backPage ? true : false
  }

  get publicView(){
    return document.location.pathname.search(/^\/game/) > -1 ? false : true
  }

  updateTitle(){
    this.header.titleText = this.currentPage.titleText
  }

  async reloadPage(){
    this.setPage(this.currentPage)
  }

  async setPage(page){

    if(!page){
      throw 'Attempted to set null page'
    }

    Loader.showLoader()
    hideAllTippys()
    closeAllModals()

    // Update the user whenever we change pages
    this._fetchUser()

    const previousPage = this.currentPage
    if(previousPage){
      const preventUnload = await previousPage.unload()
      if(preventUnload){
        return
      }
      // await fadeOut(previousPage, 100)
      previousPage.unloaded = true
      previousPage.remove()
    }

    this.currentPage = page
    page.app = this
    page.unloaded = false

    this._resetBackground()

    try {
      await page.load(previousPage)
    }catch(ex){
      console.error(ex)
      this.setPage(new ErrorPage(ex))
    }

    if(this.currentPage !== page){
      // The page.load() caused a redirect, so this setPage is no longer relevant.
      return
    }

    addPageToHistory(page)
    this.querySelector(':scope > .content').appendChild(page)
    fadeIn(page)
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
    this.setPage(this.currentPage.backPage() || new MainPage())
  }

  setBackground(color, texture){
    this.style.backgroundColor = color
    this.style.backgroundImage = texture ? `url("/assets/textures/${texture}")` : null
  }

  _resetBackground(){
    this.setBackground(null, null)
  }

  async _fetchUser(){
    this.user = await fizzetch('/user')
    this.header.update()
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

function closeAllModals(){
  document.querySelectorAll('di-modal').forEach(modal => {
    modal.hide()
  })
}