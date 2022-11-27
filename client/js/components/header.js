import * as Dropdown  from './dropdown.js'
import SimpleModal from './simpleModal.js'
import tippy from 'tippy.js'
import { suffixedNumber } from '../../../game/utilFunctions.js'

const HTML = `
<div class="autocrawl clickable">AUTOCRAWL</div>
<div class="right-side">
  <div class="gold-button">
    <img src="/assets/icons/gold.svg">
    <span class="val"></span>
  </div>
  <div class="user-info clickable">
    <span class="displayname"></span> <i class="fa-solid fa-caret-down"></i>
  </div>
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

    this.querySelector('.gold-button').addEventListener('click', () => {
      if(!this.user?.features?.shop){
        return
      }
      this.app.setPage('/shop')
    })

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
      this.querySelector('.right-side').classList.add('hidden')
    }else{
      this.querySelector('.displayname').textContent = this.user.displayname
      const goldButtonEl = this.querySelector('.gold-button')
      goldButtonEl.querySelector('.val').textContent = suffixedNumber(this.user.inventory.gold ?? 0, 5)
      if(!this.user.features?.shop){
        goldButtonEl.classList.add('locked')
        tippy(goldButtonEl, {
          theme: 'light',
          content: 'Clear floor 10 to unlock the shop'
        })
      }
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