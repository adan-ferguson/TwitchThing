import { fadeIn, fadeOut } from '../../../animationHelper.js'
import EventContentsNormal from './eventContentsNormal.js'
import EventContentsResults from './eventContentsResults.js'

export default class Event extends HTMLElement{

  _rewards
  _message
  _adventurer
  _currentContents = null

  constructor(){
    super()
    this.classList.add('fill-contents')
  }

  setAdventurer(adventurer){
    this._adventurer = adventurer
  }

  update(dungeonEvent, animate = true){

    if(dungeonEvent.runFinished){
      this.setContents(new EventContentsResults(dungeonEvent))
    }else{
      const wasNormal = this._currentContents instanceof EventContentsNormal
      if(wasNormal && sameRoom(this._currentContents.dungeonEvent, dungeonEvent)){
        this._currentContents.update(dungeonEvent, animate)
      }else{
        this.setContents(new EventContentsNormal(dungeonEvent), animate)
      }
    }
  }

  async setContents(contents, animate = true){

    animate = animate && this._currentContents
    if(animate){
      await fadeOut(this)
      fadeIn(this)
    }

    this.innerHTML = ''
    this._currentContents = contents
    this.appendChild(this._currentContents)
  }
}

function sameRoom(e1, e2){
  return e1.floor === e2.floor && e1.room === e2.room
}

customElements.define('di-dungeon-event', Event)