import * as Loader from '../loader.js'
import fizzetch from '../fizzetch.js'
import { hideAll as hideAllTippys } from 'tippy.js'
import { getSocket } from '../socketClient.js'
import { showPopup } from './popup.js'
import { fadeIn } from '../animations/simple.js'
import { addPageToHistory } from '../history.js'
import { pathToPage } from './pathRouter.js'
import { cancelAllFlyingText } from './visualEffects/flyingTextEffect.js'
import _ from 'lodash'
import { alertModal } from './simpleModal.js'

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
    cancelAllFlyingText()
    closeAllModals()

    this.currentPage = page
    page.app = this

    this._resetBackground()

    try {
      page.loadstate = 'loading'
      await page.load()
      page.loadstate = 'loaded'
    }catch(ex){
      if(ex.error?.redirect){
        window.location = ex.error.redirect
        return
      }
      const targetPage = ex.error?.targetPage ?? null
      if(targetPage !== null){
        this.setPage(ex.error.targetPage)
        return
      }
      console.error(ex)
      if(page.useHistory){
        addPageToHistory(page, replaceHistoryState)
      }
      this.showError(ex.error ?? ex, path ? true : false)
      return
    }

    if(this.currentPage !== page){
      // The page.load() caused a redirect, so this setPage is no longer relevant.
      return
    }

    document.title = 'AutoCrawl'

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

  showError(error, redirectToMain = true){
    if(redirectToMain){
      this.setPage('')
    }
    let str
    if(!error){
      str = 'Some error'
    }else if(error.message){
      str = error.message
    }else if(_.isString(error)){
      str = error
    }else{
      str = JSON.stringify(error)
    }
    alertModal(str)
  }

  _resetBackground(){
    this.setBackground(null, null)
  }

  _setUser(user){
    this.user = user
    this.header.update()
  }

  async _fetchUser(){
    const { user, popups } = await fizzetch('/user/appfetch')
    this._setUser(user)
    showPopup(popups)
  }
}

customElements.define('di-app', App)

function closeAllModals(){
  document.querySelectorAll('di-modal').forEach(modal => {
    modal.hide()
  })
}