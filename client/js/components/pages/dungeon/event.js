import { fadeIn, fadeOut } from '../../../animations/simple.js'
import EventContentsNormal from './eventContentsNormal.js'

export default class Event extends HTMLElement{

  _rewards
  _message
  _adventurer
  _currentContents = null

  constructor(){
    super()
    this.classList.add('fill-contents')
  }

  setup(adventurer, timeline){
    this._adventurer = adventurer
    this._timeline = timeline
    timeline.on('timechange', () => this._updateTimeBar())
  }

  update(dungeonEvent, animate = true){
    const wasNormal = this._currentContents instanceof EventContentsNormal
    if(wasNormal && sameRoom(this._currentContents.dungeonEvent, dungeonEvent)){
      this._currentContents.update(dungeonEvent, animate)
    }else{
      this.setContents(new EventContentsNormal(dungeonEvent), animate)
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

  _updateTimeBar(){
    if(!this._timeline.currentEntry){
      return
    }
    this._currentContents.setTimeBar?.(this._timeline.timeSinceLastEntry, this._timeline.currentEntry.duration)
  }
}

function sameRoom(e1, e2){
  return e1.floor === e2.floor && e1.room === e2.room
}

customElements.define('di-dungeon-event', Event)