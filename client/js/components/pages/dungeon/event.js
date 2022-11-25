import { fadeIn, fadeOut } from '../../../animations/simple.js'
import EventContentsNormal from './eventContentsNormal.js'

export default class Event extends HTMLElement{

  _adventurer
  _timeline
  currentContents = null

  constructor(){
    super()
    this.classList.add('fill-contents', 'absolute-full-size')
  }

  setup(adventurer, timeline){
    this._adventurer = adventurer
    this._timeline = timeline

    timeline.on('timechange', () => this._updateTimeBar())
  }

  update(dungeonEvent, animate = false){
    console.log('upd')
    const wasNormal = this.currentContents instanceof EventContentsNormal
    if(wasNormal && sameRoom(this.currentContents.dungeonEvent, dungeonEvent)){
      this.currentContents.update(dungeonEvent)
    }else{
      this.setContents(new EventContentsNormal(dungeonEvent), animate)
    }
  }

  async setContents(contents, animate = true){

    animate = animate && this.currentContents
    if(animate){
      await fadeOut(this)
      fadeIn(this)
    }

    this.innerHTML = ''
    this.currentContents = contents
    this.appendChild(this.currentContents)
  }

  _updateTimeBar(){
    if(!this._timeline.currentEntry){
      return
    }
    this.currentContents?.setTimeBar?.(this._timeline.timeSinceLastEntry,  this._timeline.currentEntry.duration)
  }
}

function sameRoom(e1, e2){
  return e1.floor === e2.floor && e1.room === e2.room
}

customElements.define('di-dungeon-event', Event)