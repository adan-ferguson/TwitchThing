import * as Dropdown  from './dropdown.js'
import SimpleModal from './simpleModal.js'
import { levelToXp, xpToLevel } from '/game/user.js'
import AdminPage from './pages/admin/adminPage.js'

const HTML = `
<button class="back-button hidden"><- Back</button>
<div class="page-title"></div>
<div class="user-info">
    <div class="displayname"></div>
    <di-xp-bar class="clickable"></di-xp-bar>
</div>
`

export default class Header extends HTMLElement{

  _pageTitle
  _userInfo

  _anonymousMode = false

  constructor(){
    super()
    this.innerHTML = HTML

    this.backButton = this.querySelector('.back-button')
    this.backButton.addEventListener('click', () => {
      if(this._anonymousMode){
        window.location = '/'
      }else{
        this.app.back()
      }
    })

    this._pageTitle = this.querySelector('.page-title')
    this._userInfo = this.querySelector('.user-info')

    this.xpBar = this.querySelector('di-xp-bar')
    this.xpBar.setLevelFunctions(xpToLevel, levelToXp)

    Dropdown.create(this.xpBar, () => {

      const options = {
        Logout: () => confirmLogout()
      }

      if(this.user.isAdmin){
        options.Admin =  () => this.app.setPage(new AdminPage())
      }

      return options
    })

    this.app.addEventListener('pagechange', () => this.backButton.classList.toggle('hidden', !this.app.showBackButton))
  }

  get app(){
    return this.closest('di-app')
  }

  get user(){
    return this.app?.user
  }

  set titleText(val){
    this._pageTitle.textContent = val
  }

  async addUserXp(xpToAdd, onLevelUp){
    if(this.user.anonymous){
      return
    }
    await this.xpBar.setValue(this.user.xp + xpToAdd, {
      animate: true,
      onLevelUp
    })
  }

  updateUserBar(){
    if(this.user.anonymous){
      return this._setAnonymousMode()
    }
    this.querySelector('.displayname').textContent = this.user.displayname
    this.xpBar.setValue(this.user.xp)
  }

  _setAnonymousMode(){
    if(this._anonymousMode){
      return
    }
    this._anonymousMode = true
    this._userInfo.classList.add('hidden')
    this.backButton.textContent = 'DI'
  }
}

function confirmLogout(){
  new SimpleModal('Are you sure you want to log out?', [{
    text: 'Yes',
    style: 'scary',
    fn: () => {
      window.location = '/user/logout'
      return false
    }
  },{
    text: 'No'
  }]).show()
}

customElements.define('di-header', Header)