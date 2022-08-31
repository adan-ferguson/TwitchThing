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
    <div class="flex-columns replay-yes">
      <button class="restart" title="Restart"><i class="fa-solid fa-backward-fast"></i></button>
      <button class="back" title="Back"><i class="fa-solid fa-backward-step"></i></button>
      <button class="pause" title="Pause"><i class="fa-solid fa-pause"></i></button>
      <button class="play" title="Play"><i class="fa-solid fa-play"></i></button>
      <button class="forward" title="Forward"><i class="fa-solid fa-forward-step"></i></button>  
      <button class="finish" title="Skip to Results"><i class="fa-solid fa-forward-fast"></i></button> 
    </div>
    <button class="view-combat toggle-on replay-yes" title="View combat on/off"><i class="fa-solid fa-gun"></i></button>
    <button class="permalink replay-no" title="Share"><i class="fa-solid fa-clipboard"></i></button>
  </div>
</div>
`

export default class TimelineControls extends HTMLElement{

  _options = {
    isReplay: false
  }
  _eventTimeBarEl
  _viewCombatBtn
  _eventLog

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

    this._viewCombatBtn = this.querySelector('button.view-actionsAndTicks')
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
      .on('ended', overflow => {
        this._nextEvent(overflow)
      })

    this._updateViewCombat()
  }

  get elapsedEvents(){
    return this._timeline.entries.slice(0, this._timeline.currentEntryIndex + 1)
  }

  get finished(){
    return this._timeline.time === this._timeline.duration
  }

  setup(timeline, adventurer, options = {}){

    this._options = {
      isReplay: false,
      ...options
    }
    this.querySelectorAll(`.replay-${options.isReplay ? 'no' : 'yes'}`).forEach(el => {
      el.classList.add('displaynone')
    })

    this._timeline = timeline
    this._setupEventLog(adventurer)

    setTimeout(() => {
      this._updateEvent()
      this.play()
    }, 0)
  }

  addEvent(event){
    const update = this._timeline.finished
    this._timeline.addEntry(event)
    if(update){
      this._updateEvent()
    }
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

  _setupEventLog(adventurer){
    this._eventLog = new EventLog(this._timeline, adventurer, {
      rowsClickable: this._options.isReplay
    })
    this._eventLog.addEventListener('event_selected', e => {
      this.jumpToIndex(e.detail.eventIndex, {
        animate: false
      })
    })
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
    if(!this._timeline.finished){
      this._triggerEvent()
      this._updateEvent()
    }else{
      this.dispatchEvent(new CustomEvent('finished'))
    }
  }

  _triggerEvent(options = {}){
    this.dispatchEvent(new CustomEvent('event_changed', {
      detail: options
    }))
  }

  _updateEvent(){
    this._prevEvent = this._timeline.currentEntry
    this._ticker.currentTime = this._timeline.timeSinceLastEntry
    this._ticker.endTime = this._timeline.currentEntry.duration
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
    modal.innerPane.appendChild(this._eventLog)
    modal.show()
    modal.addEventListener('hide', () => {
      if(wasRunning){
        this._ticker.start()
      }
    })

    const listener = () => {
      modal.hide()
      this._eventLog.removeEventListener('click', listener)
    }
    this._eventLog.addEventListener('event_selected', listener)
    this._eventLog.updateCurrent(true)

    if(this._options.isReplay){
      this._ticker.stop()
    }
  }
}

customElements.define('di-dungeon-timeline-controls', TimelineControls)