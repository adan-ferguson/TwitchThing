import SettingsPage from './pages/settings.js'
import * as Dropdown  from './dropdown.js'
import SimpleModal from './simpleModal.js'
import { levelToXp, xpToLevel } from '/game/user.js'

const HTML = `
<button class="back-button hidden"><- Back</button>
<div>
    <div class="displayname"></div>
    <di-xp-bar class="clickable"></di-xp-bar>
</div>
`

export default class Header extends HTMLElement{

  constructor(){
    super()
    this.innerHTML = HTML

    this.backButton = this.querySelector('.back-button')
    this.backButton.addEventListener('click', () => this.app.back())

    this.xpBar = this.querySelector('di-xp-bar')
    this.xpBar.setLevelFunctions(xpToLevel, levelToXp)

    Dropdown.create(this.xpBar, {
      // Settings: () => this.app.setPage(new SettingsPage()),
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
    this.user.xp += xpToAdd
    this.user.level = xpToLevel(this.user.xp)
    await this.xpBar.setValue(this.user.xp, { animate: true })
  }

  updateUserBar(){
    this.querySelector('.displayname').textContent = this.user.displayname
    this.xpBar.setValue(this.user.xp)
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