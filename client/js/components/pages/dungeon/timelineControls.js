import Ticker from '../../../ticker.js'
import Modal from '../../modal.js'
import EventLog from './eventLog.js'
import { mergeOptionsObjects, toTimerFormat } from '../../../../../game/utilFunctions.js'
import fizzetch from '../../../fizzetch.js'

const HTML = `
<di-bar class="event-time-bar"></di-bar>
<div class="flex-rows">
  <div class="flex-columns buttons">
    <button class="log displaynone" title="View event log"><i class="fa-solid fa-list"></i></button>
    <button class="end-run replay-no" title="Tell your adventurer to leave via some sort of magic pager">Leave</button>
    <select class="speed replay-yes">
      <option value="25">25%</option>
      <option value="50">50%</option>
      <option value="100">100%</option>
      <option value="200">200%</option>
      <option value="400">400%</option>
    </select>
    <div class="flex-columns replay-yes">
      <button class="restart" title="Restart"><i class="fa-solid fa-backward-fast"></i></button>
      <button class="back" title="Back"><i class="fa-solid fa-backward-step"></i></button>
      <button class="pause" title="Pause"><i class="fa-solid fa-pause"></i></button>
      <button class="play" title="Play"><i class="fa-solid fa-play"></i></button>
      <button class="forward" title="Forward"><i class="fa-solid fa-forward-step"></i></button>  
      <button class="finish" title="Skip to Results"><i class="fa-solid fa-forward-fast"></i></button> 
    </div>
  </div>
</div>
`

const JUMP_MINIMUM_DIFF = 30 // If a jump is small, ignore it

export default class TimelineControls extends HTMLElement{

  _options = {
    isReplay: false
  }
  _eventTimeBarEl
  _eventLog
  _currentEvent

  _playEl
  _pauseEl

  constructor(){
    super()
    this.innerHTML = HTML
    this._setupLeaveButton()
    this._eventTimeBarEl = this.querySelector('.event-time-bar')
      .setOptions({
        showValue: false
      })

    this._eventTimeBarEl.addEventListener('click', e => {
      if(!this._options.isReplay){
        return false
      }
      const pct = e.offsetX / this._eventTimeBarEl.clientWidth
      this.jumpTo(this._timeline.duration * pct)
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
      const backThreshold = 2000 * this.speed
      const backOne = !this._timeline.timeSinceLastEntry ||
        this._timeline.timeSinceLastEntry < backThreshold && this._ticker.running
      const index = this._timeline.currentEntryIndex + (backOne ? -1 : 0)
      const targetTime = Math.max(0, this._timeline.entries[index].time)
      this.jumpTo(targetTime, {
        animate: false
      })
    })
    this.querySelector('button.forward').addEventListener('click', () => {
      this.jumpToIndex(this._timeline.currentEntryIndex + 1, {
        animate: false
      })
    })
    this.querySelector('button.finish').addEventListener('click', () => {
      this.jumpTo(this._timeline.duration, {
        animate: false
      })
    })

    this.querySelector('button.log').addEventListener('click', () => {
      this._showEventLogModal()
    })

    this._setupSpeed()
    this._ticker = new Ticker()
      .on('tick', () => {
        this._tick()
      })
      .on('ended', overflow => {
        this._updateEvent()
        if(this._timeline.finished){
          this.dispatchEvent(new CustomEvent('finished'))
        }
      })

    this.pause()
  }

  get speed(){
    if(!this._options.isReplay){
      return 1
    }
    return this._speedEl.value / 100
  }

  get elapsedEvents(){
    return this._timeline.entries.slice(0, this._timeline.currentEntryIndex + 1)
  }

  get finished(){
    return this._timeline.time === this._timeline.duration
  }

  get ticker(){
    return this._ticker
  }

  setup(timeline, dungeonRun, options = {}){
    this.setOptions(options)
    this._dungeonRun = dungeonRun
    this._timeline = timeline
    this._timeline.on('timechange', ({ before, after, jumped }) => {
      this._update()
    })
    this._setupEventLog(dungeonRun.adventurer)
    this._ticker.currentTime = this._timeline.timeSinceLastEntry
    this._update()
  }

  setOptions(options = {}){
    this._options = mergeOptionsObjects(this._options, options)
    this.querySelectorAll(`.replay-${this._options.isReplay ? 'no' : 'yes'}`).forEach(el => {
      el.classList.add('displaynone')
    })
    this.querySelectorAll(`.replay-${this._options.isReplay ? 'yes' : 'no'}`).forEach(el => {
      el.classList.remove('displaynone')
    })
    this.classList.toggle('replay', this._options.isReplay)
    this._ticker.setOptions({
      speed: this.speed,
      live: !this._options.isReplay
    })
  }

  updateEvent(currentEvent){
    this._timeline.addEntry(currentEvent)
  }

  addEvents(events){
    const update = this._timeline.finished
    events.forEach(event => this._timeline.addEntry(event))
    if(update){
      this._updateEvent()
    }
  }

  jumpTo(time, options = {}){
    const diff = time - this._timeline.time
    if(!options.force && Math.abs(diff) < JUMP_MINIMUM_DIFF){
      return
    }
    this._timeline.setTime(time, true)
    this._updateEvent({
      jumped: true,
      ...options
    })
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
    if(this._ticker.reachedEnd){
      return
    }
    this._pauseEl.classList.remove('displaynone')
    this._playEl.classList.add('displaynone')
    this._updateEvent()
    this._ticker.start()
  }

  pause(){
    this._pauseEl.classList.add('displaynone')
    this._playEl.classList.remove('displaynone')
    this._ticker.stop()
  }

  _setupEventLog(adventurer){
    this._eventLog = new EventLog(this._timeline, {
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
    this._timeline.setTime(this._timeline.currentEntry.time + this._ticker.currentTime)
    this._update()
  }

  _update(){
    if(this._options.isReplay){
      this._eventTimeBarEl.setOptions({
        max: this._timeline.duration
      })
    }

    this._eventTimeBarEl
      .setOptions({ label: toTimerFormat(Math.max(0, this._timeline.time)) })
      .setValue(this._options.isReplay ? this._timeline.time : 0)
  }

  _nextEvent(){
    this._updateEvent()
  }

  _updateEvent(options = {}){

    options = {
      jumped: false,
      ...options
    }

    const eventChanged = this._currentEvent !== this._timeline.currentEntry

    this._currentEvent = this._timeline.currentEntry
    this._ticker.currentTime = this._timeline.timeSinceLastEntry
    this._ticker.endTime = this._timeline.currentEntry.duration
    this._update()

    if(!eventChanged && !options.jumped){
      return
    }

    this.dispatchEvent(new CustomEvent('event_changed', {
      detail: options
    }))
  }

  _showEventLogModal(){
    const wasRunning = this._ticker.running
    const modal = new Modal()
    modal.innerContent.appendChild(this._eventLog)
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

  _setupSpeed(){
    const STORAGE_NAME = 'CombatReplaySpeed'
    this._speedEl = this.querySelector('select.speed')
    this._speedEl.addEventListener('change', () => {
      localStorage.setItem(STORAGE_NAME, this._speedEl.value)
      this._ticker.setOptions({
        speed: this.speed
      })
    })
    this._speedEl.value = localStorage.getItem(STORAGE_NAME) ?? '100'
  }
  
  _setupLeaveButton(){
    const btn = this.querySelector('.end-run')
    let leaving = false
    btn.addEventListener('click', () => {
      leaving = !leaving
      btn.classList.toggle('toggle-on', leaving)
      fizzetch(`/game/dungeonrun/${this._dungeonRun._id}/instruct`, { leave: leaving })
    })
  }
}

customElements.define('di-dungeon-timeline-controls', TimelineControls)