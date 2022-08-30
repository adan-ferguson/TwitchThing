import * as Dropdown  from './dropdown.js'
import SimpleModal from './simpleModal.js'

const HTML = `
<div class="autocrawl clickable">AUTOCRAWL</div>
<div class="user-info clickable">
    <span class="displayname"></span> <i class="fa-solid fa-caret-down"></i>
</div>
<div class="title-text absolute-center-both"></div>
`

export default class Header extends HTMLElement{

  _userInfo

  constructor(){
    super()
    this.innerHTML = HTML

    this.querySelector('.autocrawl').addEventListener('click', () => {
      this.app.setPage('')
    })

    this._userInfo = this.querySelector('.user-info')

    Dropdown.create(this._userInfo, () => {
      const options = {
        Logout: () => confirmLogout()
      }
      if(this.user.isAdmin){
        options.Admin =  () => this.app.setPage('/admin')
        options['Sim Combat'] = () => this.app.setPage('/admin/sim')
      }
      return options
    })
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