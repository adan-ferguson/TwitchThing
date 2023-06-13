import EventContentsNormal from './eventContentsNormal.js'

export default class Event extends HTMLElement{

  _adventurer
  _timeline
  _topThing
  currentContents = null

  constructor(){
    super()
    this.classList.add('fill-contents', 'absolute-full-size')
  }

  setup(adventurer, timeline, topThing){
    this._adventurer = adventurer
    this._timeline = timeline
    this._topThing = topThing

    timeline.on('timechange', () => this._updateTimeBar())
  }

  update(dungeonEvent, animate = false){
    this.setContents(new EventContentsNormal(dungeonEvent), animate)
  }

  async setContents(contents, animate = true){
    this.currentContents?.stop?.()
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