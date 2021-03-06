import CustomAnimation from '../../../../customAnimation.js'
import { fadeIn, fadeOut } from '../../../../animationHelper.js'

const innerHTML = `
<di-bar class="time-bar"></di-bar>
<div class="event-contents">
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

  constructor(){
    super()
    this.innerHTML = innerHTML
    this._contents = this.querySelector('.event-contents')
    this._rewards = this.querySelector('.rewards')
    this._message = this.querySelector('.message')
    this._timeBar = this.querySelector('.time-bar')
    this._timeBar.showLabel = false
  }

  setAdventurer(adventurer){
    this._adventurer = adventurer
  }

  update(dungeonEvent, currentTime){
    fadeOut(this._contents).then(() => {
      fadeIn(this._contents)
      this._contents.classList.remove('fade-out')
      if (!dungeonEvent){
        this._message.textContent = `${this._adventurer.name} enters the dungeon.`
        return
      }
      this._message.textContent = dungeonEvent.message
      this._addRewards(dungeonEvent.rewards)
    })
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
    this._timeBar.setMax(maxTime)
    this._timeBar.setValue(currentTime)
    this._timeBarAnimation = new CustomAnimation({
      duration: maxTime - currentTime,
      tick: pct => {
        this._timeBar.setValue(currentTime * (1 - pct) + maxTime * pct)
      }
    })
  }
}

customElements.define('di-dungeon-event', Event)