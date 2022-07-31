import Timeline from '../../../../../game/timeline.js'
import Ticker from '../../../ticker.js'
import dateformat from 'dateformat'

const HTML = `
<di-bar class="event-time-bar"></di-bar>
<div class="flex-rows">
  <di-timer></di-timer>
  <div class="flex-columns buttons">
    <div class="flex-columns">
      <button class="back" title="Back"><i class="fa-solid fa-backward-step"></i></button>
      <button class="pause" title="Pause"><i class="fa-solid fa-pause"></i></button>
      <button class="play" title="Play"><i class="fa-solid fa-play"></i></button>
      <button class="forward" title="Forward"><i class="fa-solid fa-forward-step"></i></button>   
    </div>
    <button class="log" title="View Log"><i class="fa-solid fa-list"></i></button>
    <button class="share" title="Share">Share <i class="fa-solid fa-share-from-square"></i></button>
  </div>
</div>
`

export default class TimelineControls extends HTMLElement{

  _eventTimeBarEl

  _playEl
  _pauseEl

  constructor(){
    super()
    this.innerHTML = HTML
    this._eventTimeBarEl = this.querySelector('.event-time-bar')
      .setOptions({
        showValue: false
      })
    this._playEl = this.querySelector('button.play')
    this._pauseEl = this.querySelector('button.pause')
    this._ticker = new Ticker(() => this._tick())

    this._playEl.addEventListener('click', () => {
      this.play()
    })
    this._pauseEl.addEventListener('click', () => {
      this.pause()
    })
  }

  get elapsedEvents(){
    return this.timeline.entries.slice(0, this.timeline.currentEntryIndex + 1)
  }

  setup(dungeonRun){
    this.timeline = new Timeline(dungeonRun.events)
    setTimeout(() => {
      this._update()
      this.play()
    }, 0)
  }

  addEvent(event){
    this.timeline.addEntry(event)
    this._update()
  }

  jumpTo(time, triggerEvent = true){
    this.timeline.time = time
    if(triggerEvent){
      this.dispatchEvent(new Event('nextevent'))
    }
    this._update()
  }

  jumpToAfterCombat(combatID){
    let i
    const entry = this.timeline.entries.find((event, _i) => {
      i = _i
      return event.combatID === combatID
    })
    if(entry){
      this.jumpToIndex(i + 1)
    }
  }

  jumpToIndex(index){
    index = Math.max(0, Math.min(this.timeline.entries.length - 1, index))
    this.jumpTo(this.timeline.entries[index].time)
  }

  destroy(){
    this._destroyed = true
    this._ticker.stop()
  }

  play(){
    this._pauseEl.classList.remove('displaynone')
    this._playEl.classList.add('displaynone')
    this._ticker.start()
  }

  pause(){
    this._pauseEl.classList.add('displaynone')
    this._playEl.classList.remove('displaynone')
    this._ticker.stop()
  }

  _next(){
    if(this._destroyed){
      return
    }
    if(this.timeline.nextEntry){
      this.jumpTo(this.timeline.nextEntry.time)
    }else{
      this.pause()
    }
  }

  _tick(){
    this.timeline.time = this.timeline.currentEntry.time + this._ticker.currentTime
    this._eventTimeBarEl.setOptions({
      max: this._ticker.endTime,
      label: dateformat(this.timeline.time, 'M:ss')
    })
    this._eventTimeBarEl.setValue(this._ticker.currentTime)
    if(this._ticker.finished){
      this.dispatchEvent(new CustomEvent('nextevent'))
      this._update()
    }
  }

  _update(){
    this._ticker.setTimes(this.timeline.timeSinceLastEntry, this.timeline.currentEntry.duration)
  }
}

customElements.define('di-timeline-controls', TimelineControls)