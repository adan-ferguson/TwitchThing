import SettingsPage from './pages/settings.js'

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

    this.userDropdownButton = this.querySelector('.user-dropdown')
    this.userDropdownButton.addEventListener('click', () => this._showMenu())

    this.app.addEventListener('click', () => this._hideMenu())
    this.app.addEventListener('pagechange', () => this.backButton.classList.toggle('show', this.app.showBackButton))
  }

  get app(){
    return this.closest('di-app')
  }

  get user(){
    return this.app?.user
  }

  _showMenu(){
    const menu = {
      Settings: () => this.app.setPage(new SettingsPage()),
      Logout: () => confirmLogout()
    }

    const menuEl = document.createElement('div')
    for(let option of menu){

    }
    // menuItems.push(<button key='settings' onClick={() => this.props.changePage(Settings)}>Settings</button>)
    // menuItems.push(<button key='logout' onClick={this._logout}>Logout</button>)
  }

  _hideMenu(){

  }
}

function confirmLogout(){

}

customElements.define('di-header', Header)