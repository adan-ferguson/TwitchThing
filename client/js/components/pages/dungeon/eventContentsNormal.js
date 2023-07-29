import RELICS from '../../../relicDisplayInfo.js'
import { arrayize, suffixedNumber } from '../../../../../game/utilFunctions.js'
import { ROOM_IMAGES } from '../../../assetLoader.js'
import MonsterInstance from '../../../../../game/monsterInstance.js'

const HTML = `
<div class="room-image"></div>
<div class="middle-part">
  <div class="description subtitle"></div>
  <div class="room-contents">
    <div class="message"></div>
    <div class="rewards"></div>
    <div class="penalty"></div>
  </div>
  <span class="loader spin-effect displaynone">DI</span>
</div>
<di-bar class="time-bar"></di-bar>
`

export default class EventContentsNormal extends HTMLElement{

  _imageEl
  _contentsEl
  _descriptionEl
  _rewardsEl
  _messageEl

  constructor(dungeonEvent){
    super()
    this.innerHTML = HTML
    this.dungeonEvent = dungeonEvent
    this._imageEl = this.querySelector('.room-image')
    this._contents = this.querySelector('.room-contents')
    this._description = this.querySelector('.description')
    this._rewards = this.querySelector('.rewards')
    this._penalty = this.querySelector('.penalty')
    this._message = this.querySelector('.message')
    this._timeBarEl = this.querySelector('.time-bar')
      .setOptions({
        showLabel: false,
        showValue: false
      })
    this.update(dungeonEvent)
  }

  update(dungeonEvent, animate = false){
    this._timeBarEl.classList.toggle('displaynone', dungeonEvent.time < 0)
    this._setImage(dungeonEvent)
    this._description.textContent = getDescription(dungeonEvent)
    this._message.textContent = dungeonEvent.message
    this._addRewards(dungeonEvent.rewards)
    this._addPenalty(dungeonEvent.penalty)
    this.querySelector('.loader').classList.toggle('displaynone', dungeonEvent.roomType !== 'entrance')
  }

  setTimeBar(val, max){
    this._timeBarEl.setOptions({ max }).setValue(val)
  }

  _addRewards(rewards){
    rewards = arrayize(rewards)
    if(!rewards.length){
      this._rewards.innerHTML = ''
      return
    }
    let html = ''
    rewards.forEach(r => {
      for(let key in r){
        if(key === 'pityPoints'){
          continue
        }
        let val = r[key]
        if(key === 'chests'){
          html += '<div>Found a treasure chest</div>'
        }else{
          html += `<div>+${suffixedNumber(val)} ${key}</div>`
        }
      }
    })
    this._rewards.innerHTML = html
  }

  _addPenalty(penalty){
    if(!penalty){
      this._penalty.innerHTML = ''
      return
    }
    let html = ''
    for(let key in penalty){
      let val = penalty[key]
      html += `<div>${val} ${key}</div>`
    }
    this._penalty.innerHTML = html
  }

  _setImage(dungeonEvent){
    const roomType = dungeonEvent.roomType ?? 'wandering'
    this._imageEl.style.backgroundImage = `url(${ROOM_IMAGES[roomType]})`
  }
}

function getDescription(dungeonEvent){
  if(dungeonEvent.relic){
    return `${RELICS[dungeonEvent.relic.tier].displayName} ${dungeonEvent.relic.type} relic`
  }
  if(dungeonEvent.roomType === 'combatResult' && dungeonEvent.result === 1){
    const name = new MonsterInstance(dungeonEvent.monster).displayName
    return `${name} defeated`
  }
}

customElements.define('di-dungeon-event-contents-normal', EventContentsNormal)