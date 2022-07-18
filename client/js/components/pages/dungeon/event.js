import CustomAnimation from '../../../customAnimation.js'
import { fadeIn, fadeOut } from '../../../animationHelper.js'

const innerHTML = `
<div class="room-image">
    <img>
</div>
<di-bar class="time-bar"></di-bar>
<div class="room-contents">
  <div class="room-description"></div>
  <div class="message"></div>
  <div class="rewards"></div>
</div>
`

export default class Event extends HTMLElement{

  _rewards
  _message
  _timeBar
  _timeBarAnimation

  _adventurer

  _imageEl

  constructor(){
    super()
    this.innerHTML = innerHTML
    this._imageEl = this.querySelector('.room-image img')
    this._contents = this.querySelector('.room-contents')
    this._rewards = this.querySelector('.rewards')
    this._message = this.querySelector('.message')
    this._timeBar = this.querySelector('.time-bar')
    this._timeBar.setOptions({
      showLabel: false
    })
  }

  setAdventurer(adventurer){
    this._adventurer = adventurer
  }

  update(dungeonEvent, currentTime){
    fadeOut(this._contents).then(() => {
      fadeIn(this._contents)
      this._contents.classList.remove('fade-out')
      this._setImage(dungeonEvent)
      this._message.textContent = dungeonEvent.message
      this._addRewards(dungeonEvent.rewards)
    })
    // TODO: relics show something if they're attempting to interpret a relic
    this._updateTimeBar(currentTime - dungeonEvent.startTime, dungeonEvent.duration)
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

  _updateTimeBar(currentTime, maxTime){
    if(this._timeBarAnimation){
      this._timeBarAnimation.cancel()
    }
    maxTime = maxTime - currentTime
    this._timeBar.setOptions({ max: maxTime })
    this._timeBar.setValue(0)
    this._timeBarAnimation = new CustomAnimation({
      duration: maxTime,
      tick: pct => {
        this._timeBar.setValue(maxTime * pct)
      }
    })
  }

  _setImage(dungeonEvent){
    let roomType = dungeonEvent.roomType ?? 'wandering'
    this._imageEl.setAttribute('src', `/assets/rooms/${roomType}.png`)
  }
}

customElements.define('di-dungeon-event', Event)