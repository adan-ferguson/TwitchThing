import SettingsPage from './pages/settings.js'
import * as Dropdown  from './dropdown.js'
import SimpleModal from './simpleModal.js'
import { levelToXp } from '/game/user.js'

const HTML = `
<button class="back-button hidden"><- Back</button>
<di-bar class="user-bar"></di-bar>
`

export default class Header extends HTMLElement {

  constructor(){
    super()
    this.innerHTML = HTML

    this.querySelector('.username').textContent = this.user.displayname

    this.backButton = this.querySelector('.back-button')
    this.backButton.addEventListener('click', () => this.app.back())

    this.userBar = this.querySelector('.user-bar')
    this.userBar.setLabel(this.user.name)
    this._updateUserBar()

    Dropdown.create(this.userBar, {
      Settings: () => this.app.setPage(new SettingsPage()),
      Logout: () => confirmLogout()
    })

    this.app.addEventListener('pagechange', () => this.backButton.classList.toggle('hidden', !this.app.showBackButton))
  }

  get app(){
    return this.closest('di-app')
  }

  get user(){
    return this.app?.user
  }

  async addUserXp(xpToAdd){
    while(xpToAdd > 0){
      let toNextLevel = this.userBar.max - this.userBar.min
      if (xpToAdd >= toNextLevel) {
        await this.userBar.animateValueChange(toNextLevel)
        // TODO: flying text "Level Up!"
        // TODO: probably need a temp user
        this.user.xp += toNextLevel
        this.user.level++
        this._updateUserBar()
        xpToAdd -= toNextLevel
      }else{
        await this.userBar.animateValueChange(xpToAdd)
        xpToAdd = 0
      }
    }
  }

  _updateUserBar(){
    this.userBar.setBadge(this.user.level)
    this.userBar.setRange(levelToXp(this.user.level), levelToXp(this.user.level + 1))
    this.userBar.setValue(this.user.xp)
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