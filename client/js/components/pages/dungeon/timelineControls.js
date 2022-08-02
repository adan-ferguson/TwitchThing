import Timeline from '../../../../../game/timeline.js'
import Ticker from '../../../ticker.js'
import dateformat from 'dateformat'
import Modal from '../../modal.js'
import EventLog from './eventLog.js'

const HTML = `
<di-bar class="event-time-bar"></di-bar>
<div class="flex-rows">
  <di-timer></di-timer>
  <div class="flex-columns buttons">
    <button class="log" title="View event log"><i class="fa-solid fa-list"></i></button>
    <div class="flex-columns">
      <button class="restart" title="Restart"><i class="fa-solid fa-backward-fast"></i></button>
      <button class="back" title="Back"><i class="fa-solid fa-backward-step"></i></button>
      <button class="pause" title="Pause"><i class="fa-solid fa-pause"></i></button>
      <button class="play" title="Play"><i class="fa-solid fa-play"></i></button>
      <button class="forward" title="Forward"><i class="fa-solid fa-forward-step"></i></button>  
      <button class="finish" title="Skip to Results"><i class="fa-solid fa-forward-fast"></i></button> 
    </div>
    <button class="view-combat toggle-on" title="View combat on/off"><i class="fa-solid fa-gun"></i></button>
  </div>
</div>
`

export default class TimelineControls extends HTMLElement{

  _eventTimeBarEl
  _viewCombatBtn

  _playEl
  _pauseEl
  viewCombat

  constructor(){
    super()
    this.innerHTML = HTML
    this._eventTimeBarEl = this.querySelector('.event-time-bar')
      .setOptions({
        showValue: false
      })
    this._playEl = this.querySelector('button.play')
    this._pauseEl = this.querySelector('button.pause')
    this._playEl.addEventListener('click', () => {
      this.play()
    })
    this._pauseEl.addEventListener('click', () => {
      this.pause()
    })

    this.querySelector('button.restart').addEventListener('click', () => {
      this.jumpTo(0, {
        animate: false
      })
    })
    this.querySelector('button.back').addEventListener('click', () => {
      this.jumpToIndex(this._timeline.currentEntryIndex - 1, {
        animate: false
      })
    })
    this.querySelector('button.forward').addEventListener('click', () => {
      this.jumpToIndex(this._timeline.currentEntryIndex + 1)
    })
    this.querySelector('button.finish').addEventListener('click', () => {
      this.jumpTo(this._timeline.duration)
    })

    this._viewCombatBtn = this.querySelector('button.view-combat')
    this._viewCombatBtn
      .addEventListener('click', ()=> {
        this._updateViewCombat()
      })

    this.querySelector('button.log').addEventListener('click', () => {
      this._showEventLogModal()
    })

    this._ticker = new Ticker()
      .on('tick', () => {
        this._tick()
      })
      .on('ended', () => {
        this._nextEvent()
      })

    this._updateViewCombat()
  }

  get elapsedEvents(){
    return this._timeline.entries.slice(0, this._timeline.currentEntryIndex + 1)
  }

  get finished(){
    return this._timeline.time === this._timeline.duration
  }

  setup(timeline){
    this._timeline = timeline
    setTimeout(() => {
      this._updateEvent()
      this.play()
    }, 0)
  }

  addEvent(event){
    this._timeline.addEntry(event)
    this._updateEvent()
  }

  jumpTo(time, options = {}){
    this._timeline.time = time
    this._triggerEvent(options)
    this._updateEvent()
  }

  jumpToAfterCombat(combatID, options = {}){
    let i
    const entry = this._timeline.entries.find((event, _i) => {
      i = _i
      return event.combatID === combatID
    })
    if(entry){
      this.jumpToIndex(i + 1, options)
    }
  }

  jumpToIndex(index, options = {}){
    index = Math.max(0, index)
    if(index >= this._timeline.entries.length){
      this.jumpTo(this._timeline.duration, options)
    }else{
      this.jumpTo(this._timeline.entries[index].time, options)
    }
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
    if(this._timeline.nextEntry){
      this.jumpTo(this._timeline.nextEntry.time)
    }else{
      this.pause()
    }
  }

  _tick(){
    this._timeline.time = this._timeline.currentEntry.time + this._ticker.currentTime
    this._eventTimeBarEl.setValue(this._ticker.currentTime)
    this._eventTimeBarEl.setOptions({
      max: this._ticker.endTime,
      label: dateformat(this._timeline.time, 'M:ss')
    })
  }

  _nextEvent(){
    this._triggerEvent()
    this._updateEvent()
  }

  _triggerEvent(options = {}){
    this.dispatchEvent(new CustomEvent('event_changed', {
      detail: options
    }))
  }

  _updateEvent(){
    this._ticker.endTime = this._timeline.currentEntry.duration
    this._ticker.currentTime = this._timeline.timeSinceLastEntry
    this._tick()
  }

  _updateViewCombat(val = 'toggle'){

    const STORAGE_KEY = 'ViewCombatWhileWatchingDungeonRunReplay'

    if(this.viewCombat === undefined){
      val = localStorage.getItem(STORAGE_KEY) === 'true'
    }else if(val === 'toggle'){
      val = !this.viewCombat
    }

    localStorage.setItem(STORAGE_KEY, val)

    if(val){
      this._viewCombatBtn.classList.remove('toggle-off')
      this._viewCombatBtn.classList.add('toggle-on')
      this.viewCombat = true
    }else{
      this._viewCombatBtn.classList.remove('toggle-on')
      this._viewCombatBtn.classList.add('toggle-off')
      this.viewCombat = false
    }
  }

  _showEventLogModal(){
    const wasRunning = this._ticker.running
    const modal = new Modal()
    const log = new EventLog(this._timeline)
    log.addEventListener('event_selected', e => {
      this.jumpToIndex(e.detail.eventIndex, {
        animate: false
      })
      modal.hide()
    })

    modal.innerPane.appendChild(log)
    modal.show()
    modal.addEventListener('hide', () => {
      if(wasRunning){
        this._ticker.start()
      }
    })
    this._ticker.stop()
  }
}

customElements.define('di-dungeon-timeline-controls', TimelineControls)