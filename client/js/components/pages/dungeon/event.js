import { toArray } from '../../../../../game/utilFunctions.js'

const innerHTML = `
<div class="message"></div>
<div class="rewards"></div>
`

export default class Event extends HTMLElement{

  _rewards
  _message

  _adventurer

  constructor(){
    super()
    this.innerHTML = innerHTML
    this._rewards = this.querySelector('.rewards')
    this._message = this.querySelector('.message')
  }

  setAdventurer(adventurer){
    this._adventurer = adventurer
  }

  update(dungeonEvent){
    this.classList.add('fade-out')
    setTimeout(() => {
      this.classList.remove('fade-out')
      if(!dungeonEvent){
        this._message.textContent = `${this._adventurer.name} enters the dungeon.`
        return
      }
      this._message.textContent = dungeonEvent.message
      this._addRewards(dungeonEvent.rewards)
    }, 400)
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
        html += '<div>${this._adventurer.name} found a treasure chest</div>'
      }else{
        html += `<div>+${val} ${key}</div>`
      }
    }
    this._rewards.innerHTML = html
  }
}

customElements.define('di-dungeon-event', Event)