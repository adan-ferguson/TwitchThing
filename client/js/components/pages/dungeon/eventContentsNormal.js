import RELICS from '../../../relicDisplayInfo.js'

const HTML = `
<div class="room-image">
    <img src="">
</div>
<div class="description subtitle"></div>
<div class="room-contents">
  <div class="message"></div>
  <div class="rewards"></div>
</div>
<span class="loader spin-effect displaynone">DI</span>
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
    this._imageEl = this.querySelector('.room-image img')
    this._contents = this.querySelector('.room-contents')
    this._description = this.querySelector('.description')
    this._rewards = this.querySelector('.rewards')
    this._message = this.querySelector('.message')
    this._timeBarEl = this.querySelector('.time-bar')
      .setOptions({
        showLabel: false,
        showValue: false
      })
    this.update(dungeonEvent)
  }

  update(dungeonEvent, animate = false){
    this._setImage(dungeonEvent)
    this._description.textContent = getDescription(dungeonEvent)
    this._message.textContent = dungeonEvent.message
    this._addRewards(dungeonEvent.rewards)
    this.querySelector('.loader').classList.toggle('displaynone', dungeonEvent.roomType !== 'entrance')
  }

  setTimeBar(val, max){
    this._timeBarEl.setOptions({ max }).setValue(val)
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
        html += '<div>Found a treasure chest</div>'
      }else{
        html += `<div>+${val} ${key}</div>`
      }
    }
    this._rewards.innerHTML = html
  }

  _setImage(dungeonEvent){
    let roomType = dungeonEvent.roomType ?? 'wandering'
    this._imageEl.setAttribute('src', `/assets/rooms/${roomType}.png`)
  }
}

function getDescription(dungeonEvent){
  if(dungeonEvent.relic){
    return `${RELICS[dungeonEvent.relic.tier].displayName} ${dungeonEvent.relic.type} relic`
  }
}

customElements.define('di-dungeon-event-contents-normal', EventContentsNormal)