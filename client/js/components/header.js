import * as Dropdown  from './dropdown.js'
import SimpleModal from './simpleModal.js'
import AdminPage from './pages/admin/adminPage.js'

const HTML = `
<button class="back-button hidden"><- Back</button>
<div class="user-info clickable">
    <span class="displayname"></span> <i class="fa-solid fa-caret-down"></i>
</div>
<div class="autocrawl absolute-center-both">AUTOCRAWL</div>
<div class="title-text absolute-center-both"></div>
`

export default class Header extends HTMLElement{

  _userInfo

  constructor(){
    super()
    this.innerHTML = HTML

    this.backButton = this.querySelector('.back-button')
    this.backButton.addEventListener('click', () => {
      if(this.app.watchView){
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

  set titleText(val){
    this.querySelector('.title-text').textContent = val
  }

  get app(){
    return this.closest('di-app')
  }

  get user(){
    return this.app?.user
  }

  update(){
    if(this.user.anonymous){
      this._userInfo.classList.add('hidden')
    }else{
      this.querySelector('.displayname').textContent = this.user.displayname
    }
    if(this.app.watchView){
      this.backButton.textContent = 'AutoCrawl'
    }
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