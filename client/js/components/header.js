import SettingsPage from './pages/settings.js'
import { create as createDropdown }  from './dropdown.js'

const HTML = `
<button class="back hidden"><- Back</button>
<button class="user-dropdown">
  <span class="username">???</span>
  <i class='fas fa-caret-down'></i>
</button>
`

export default class Header extends HTMLElement {

  constructor(){
    super()
    this.innerHTML = HTML

    this.querySelector('.username').textContent = this.user.displayname

    this.backButton = this.querySelector('.back')
    this.backButton.addEventListener('click', () => this.app.back())

    createDropdown(this.querySelector('.user-dropdown'), {
      Settings: () => this.app.setPage(new SettingsPage()),
      Logout: () => confirmLogout()
    })

    this.app.addEventListener('pagechange', () => this.backButton.classList.toggle('show', this.app.showBackButton))
  }

  get app(){
    return this.closest('di-app')
  }

  get user(){
    return this.app?.user
  }
}

function confirmLogout(){

}

customElements.define('di-header', Header)