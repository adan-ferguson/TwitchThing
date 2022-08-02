import { fadeIn, fadeOut } from '../../../animationHelper.js'
import { wrap } from '../../../../../game/utilFunctions.js'

const innerHTML = `
<div class="room-image">
    <img>
</div>
<div class="room-contents">
  <div class="message"></div>
  <div class="rewards"></div>
</div>
`

export default class Event extends HTMLElement{

  _rewards
  _message
  _hasUpdated

  _adventurer

  _imageEl

  constructor(){
    super()
    this.innerHTML = innerHTML
    this._imageEl = this.querySelector('.room-image img')
    this._contents = this.querySelector('.room-contents')
    this._rewards = this.querySelector('.rewards')
    this._message = this.querySelector('.message')
  }

  setAdventurer(adventurer){
    this._adventurer = adventurer
  }

  async update(dungeonEvent, animate = true){

    if(this._hasUpdated && animate){
      await fadeOut(this._contents)
      fadeIn(this._contents)
    }

    this._hasUpdated = true
    this._setImage(dungeonEvent)
    this._message.textContent = dungeonEvent.message
    this._addRewards(dungeonEvent.rewards)

    if(dungeonEvent.combatID){
      const btn = wrap('Watch', {
        elementType: 'button'
      })
      btn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('view_combat'))
      })
      this._rewards.appendChild(btn)
    }
  }

  _addRewards(rewards){
    if(!rewards){
      this._rewards.innerHTML = ''
      return
    }
    let html = ''
    for(let key in rewards){
      let val = rewards[key]
      if(key === 'chests'){
        html += `<div>${this._adventurer.name} found a treasure chest</div>`
      }else{
        html += `<div>+${val} ${key}</div>`
      }
    }
    this._rewards.innerHTML = html
  }

  _setImage(dungeonEvent){
    let roomType = dungeonEvent.roomType ?? 'wandering'
    roomType = dungeonEvent.combatID ? 'fighting' : roomType
    this._imageEl.setAttribute('src', `/assets/rooms/${roomType}.png`)
  }
}

customElements.define('di-dungeon-event', Event)