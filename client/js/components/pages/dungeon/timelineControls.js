import Timeline from '../../../../../game/timeline.js'
import CustomAnimation from '../../../customAnimation.js'

const HTML = `
<di-bar class="event-time-bar"></di-bar>
<div class="flex-columns">
    <di-timer></di-timer>
    <button class="log">Log</button>
    <button class="permalink">Link</button>
</div>
`

export default class TimelineControls extends HTMLElement{

  _eventTimeBarEl
  _eventTimeBarAnimation

  constructor(){
    super()
    this.innerHTML = HTML
    this._eventTimeBarEl = this.querySelector('.event-time-bar')
    this._eventTimeBarEl.setOptions({
      showLabel: false
    })
  }

  get elapsedEvents(){
    return this.timeline.entries.slice(0, this.timeline.currentEntryIndex + 1)
  }

  setup(dungeonRun){
    this.timeline = new Timeline(dungeonRun.events)

    if(dungeonRun.finalizedData){
      // This is a replay
    }else{
      // This is live
      this.timeline.time = dungeonRun.virtualTime
    }

    this._updateEventTimeBar()
  }

  addEvent(event){
    this.timeline.addEntry(event)
    this._updateEventTimeBar()
  }

  jumpToAfterCombat(combatID){

  }

  _next(){
    if(this.timeline.nextEntry){
      this.timeline.time = this.timeline.nextEntry.time
      this.dispatchEvent(new Event('nextevent'))
      this._updateEventTimeBar()
    }else{
      this.timeline.time = this.timeline.duration
    }
  }

  _updateEventTimeBar(){
    if(this._eventTimeBarAnimation){
      this._eventTimeBarAnimation.cancel()
    }
    const startTime = this.timeline.timeSinceLastEntry
    const duration = this.timeline.currentEntry.duration
    this._eventTimeBarEl.setOptions({ max: duration })
    this._eventTimeBarEl.setValue(startTime)
    this._eventTimeBarAnimation = new CustomAnimation({
      duration,
      tick: pct => {
        this._eventTimeBarEl.setValue(startTime + (duration - startTime) * pct)
      },
      finish: () => {
        this._next()
      }
    })
  }
}

customElements.define('di-timeline-controls', TimelineControls)