import * as Dropdown  from './dropdown.js'
import SimpleModal from './simpleModal.js'
import AdminPage from './pages/admin/adminPage.js'

const HTML = `
<button class="back-button hidden"><- Back</button>
<div class="user-info clickable">
    <span class="displayname"></span> <i class="fa-solid fa-caret-down"></i>
</div>
`

export default class Header extends HTMLElement{

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

    this._userInfo = this.querySelector('.user-info')

    Dropdown.create(this._userInfo, () => {
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

  updateUserBar(){
    if(this.user.anonymous){
      return this._setAnonymousMode()
    }
    this.querySelector('.displayname').textContent = this.user.displayname
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