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
    // const wasNormal = this.currentContents instanceof EventContentsNormal
    // if(wasNormal && sameRoom(this.currentContents.dungeonEvent, dungeonEvent)){
    //   console.log('update')
    //   this.currentContents.update(dungeonEvent)
    // }else{
    // }
    this.setContents(new EventContentsNormal(dungeonEvent), animate)
  }

  async setContents(contents, animate = true){

    // console.log('content change', animate)
    //
    // animate = animate && this.currentContents
    // if(animate){
    //   console.log('fadeout')
    //   await fadeOut(this, 100)
    //   console.log('fadein')
    //   fadeIn(this, 100)
    // }else{
    //   console.log('nofade')
    // }

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

customElements.define('di-dungeon-event', Event)