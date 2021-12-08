import SettingsPage from './pages/settings.js'
import * as Dropdown  from './dropdown.js'
import SimpleModal from './simpleModal.js'

const HTML = `
<button class="back-button hidden"><- Back</button>
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

    this.backButton = this.querySelector('.back-button')
    this.backButton.addEventListener('click', () => this.app.back())

    Dropdown.create(this.querySelector('.user-dropdown'), {
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
  SimpleModal('Are you sure you want to log out?', [{
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