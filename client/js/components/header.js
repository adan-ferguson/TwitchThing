import * as Dropdown  from './dropdown.js'
import SimpleModal from './simpleModal.js'
import tippy from 'tippy.js'
import { suffixedNumber } from '../../../game/utilFunctions.js'
import goldIcon from '../../assets/icons/gold.svg'
import { faIcon, simpleTippy } from './common.js'
import Modal from './modal.js'
import RegisterForm from './registerForm.js'

const HTML = `
<div class="left-side">
  <button class="back-button"><i class="fa-solid fa-arrow-left"></i></button>
  <div class="flex-rows">
    <a class="autocrawl clickable" href="/game">AUTOCRAWL</a>
    <a class="version" href="/notes/0-8">v0.8.1.0</a>
  </div>
</div>
<div class="right-side">
  <div class="scrap-button displaynone">
    <i class="fa-solid fa-recycle"></i>
    <span class="val"></span>
  </div>
  <div class="gold-button displaynone">
    ${goldIcon}
    <span class="val"></span>
  </div>
  <div class="register-button displaynone">
    ${faIcon('circle-exclamation')}
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

    this.querySelector('.back-button').addEventListener('click', () => {
      window.history.back()
    })

    this.querySelector('.autocrawl').addEventListener('click', e => {
      e.preventDefault()
      this.app.setPage('')
    })

    this._userInfo = this.querySelector('.user-info')

    const goldButton = this.querySelector('.gold-button')
    tippy(goldButton, {
      theme: 'light'
    })
    goldButton.addEventListener('click', () => {
      if(!this.user?.features?.shop){
        return
      }
      this.app.setPage('/shop')
    })

    const scrapButton = this.querySelector('.scrap-button')
    tippy(scrapButton, {
      theme: 'light'
    })
    scrapButton.addEventListener('click', () => {
      if(!this.user?.features?.workshop){
        return
      }
      this.app.setPage('/workshop')
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

    this._setupRegisterButton()
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
    if(!this.user || this.user.anonymous){
      this.querySelector('.right-side').classList.add('hidden')
    }else{
      this.querySelector('.displayname').textContent = this.user.displayname
      this._updateGold()
      this._updateScrap()
      this._updateRegisterButton()
    }
  }

  _updateGold(){
    let tip = 'Shop'
    const goldButtonEl = this.querySelector('.gold-button')
    goldButtonEl.querySelector('.val').textContent = suffixedNumber(this.user.inventory.gold ?? 0, 5)
    if(!this.user.features?.shop){
      if(!this.user.inventory.gold){
        return
      }
      goldButtonEl.classList.add('locked')
      tip = 'Clear floor 10 to unlock the shop'
    }else{
      goldButtonEl.classList.remove('locked')
    }
    goldButtonEl.classList.remove('displaynone')
    goldButtonEl._tippy.setContent(tip)
  }

  _updateScrap(){
    let tip = 'Scrap'
    const scrapEl = this.querySelector('.scrap-button')
    scrapEl.querySelector('.val').textContent = suffixedNumber(this.user.inventory.scrap ?? 0, 5)
    if(!this.user.features.workshop){
      if(!this.user.features.shop){
        return
      }
      scrapEl.classList.add('locked')
      tip = 'Clear floor 20 to unlock the workshop'
    }else{
      scrapEl.classList.remove('locked')
    }
    scrapEl.classList.remove('displaynone')
    scrapEl._tippy.setContent(tip)
  }

  _setupRegisterButton(){
    const btn = this.querySelector('.register-button')
    simpleTippy(btn, 'Register account and get rid of annoying exclamation point')
    btn.addEventListener('click', () => {
      const modal = new Modal()
      modal.innerContent.append(new RegisterForm({
        linkExisting: true
      }))
      modal.show()
    })
  }

  _updateRegisterButton(){
    this.querySelector('.register-button').classList.toggle('displaynone', this.user.isRegistered ? true : false)
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