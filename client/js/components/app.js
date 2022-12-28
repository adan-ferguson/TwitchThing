import * as Loader from '../loader.js'
import fizzetch from '../fizzetch.js'
import { hideAll as hideAllTippys } from 'tippy.js'
import SimpleModal from './simpleModal.js'
import { getSocket } from '../socketClient.js'
import { showPopup } from './popup.js'
import { fadeIn } from '../animations/simple.js'
import { addPageToHistory } from '../history.js'
import { pathToPage } from './pathRouter.js'

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

    this._fetchUser().then(() => {
      getSocket()
        .on('show popup', showPopup)
        .on('user updated', user => {
          this._setUser(user)
        })
      this.setPage(window.location.pathname, window.location.search, true)
      window.addEventListener('popstate', e => {
        this.setPage(window.location.pathname, window.location.search, true)
      })
    })
  }

  get publicView(){
    return document.location.pathname.search(/^\/game/) > -1 ? false : true
  }

  updateTitle(){
    this.header.titleText = this.currentPage.titleText
  }

  async reloadPage(){
    this.setPage(this.currentPage.path, {}, true)
  }

  async setPage(path, queryArgs = {}, replaceHistoryState = false){

    if(typeof(queryArgs) === 'string'){
      queryArgs = Object.fromEntries(new URLSearchParams(queryArgs))
    }

    const page = pathToPage(path, queryArgs)

    // Update the user whenever we change pages
    this._fetchUser()

    const previousPage = this.currentPage
    if(previousPage){
      if(previousPage.loadstate === 'loaded'){
        const preventUnload = await previousPage.unload()
        if(preventUnload){
          return
        }
      }
      previousPage.loadstate = 'unloaded'
      previousPage.remove()
    }

    Loader.showLoader()
    hideAllTippys()
    closeAllModals()

    this.currentPage = page
    page.app = this

    this._resetBackground()

    try {
      page.loadstate = 'loading'
      await page.load()
      page.loadstate = 'loaded'
    }catch(ex){
      if(ex.error?.targetPage){
        this.setPage(ex.error.targetPage)
        return
      }
      console.error(ex)
      if(page.useHistory){
        addPageToHistory(page, replaceHistoryState)
      }
      this.setPage('error', { error: ex.error ?? ex })
      return
    }

    if(this.currentPage !== page){
      // The page.load() caused a redirect, so this setPage is no longer relevant.
      return
    }

    document.title = 'AutoCrawl - ' + page.constructor.name

    if(page.useHistory){
      addPageToHistory(page, replaceHistoryState)
    }
    
    this.querySelector(':scope > .content').appendChild(page)
    fadeIn(page)
    this.dispatchEvent(new Event('pagechange'))
    this.updateTitle()
    Loader.hideLoader()
  }

  setBackground(color, texture){
    this.style.backgroundColor = color
    this.style.backgroundImage = texture ? `url("/assets/textures/${texture}")` : null
  }

  _resetBackground(){
    this.setBackground(null, null)
  }

  _setUser(user){
    this.user = user
    this.header.update()
  }

  async _fetchUser(){
    this._setUser(await fizzetch('/user'))
  }
}

customElements.define('di-app', App)

function closeAllModals(){
  document.querySelectorAll('di-modal').forEach(modal => {
    modal.hide()
  })
}