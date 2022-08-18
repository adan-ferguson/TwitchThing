import Ticker from '../../../ticker.js'
import dateformat from 'dateformat'

const HTML = `
<di-bar class="event-time-bar"></di-bar>
<div class="flex-rows">
  <di-timer></di-timer>
  <div class="flex-columns buttons replay-yes">
    <select class="speed">
      <option value="25">25%</option>
      <option value="50">50%</option>
      <option value="100">100%</option>
      <option value="200">200%</option>
      <option value="400">400%</option>
    </select>
    <div class="flex-columns">
      <button class="restart" title="Restart"><i class="fa-solid fa-backward-fast"></i></button>
      <button class="pause displaynone" title="Pause"><i class="fa-solid fa-pause"></i></button>
      <button class="play" title="Play"><i class="fa-solid fa-play"></i></button>
      <button class="finish" title="Finish"><i class="fa-solid fa-forward-fast"></i></button> 
    </div>
    <button class="permalink" title="Share"><i class="fa-solid fa-clipboard"></i></button>
  </div>
</div>
`

export default class TimeControls extends HTMLElement{

  _eventTimeBarEl
  _playEl
  _pauseEl
  _speedEl

  _ticker
  _options = {
    isReplay: false
  }

  constructor(){
    super()
    this.innerHTML = HTML

    this._eventTimeBarEl = this.querySelector('.event-time-bar')
      .setOptions({
        showValue: false
      })

    this._setupPlayPause()
    this._setupSpeed()

    this.querySelector('button.restart').addEventListener('click', () => {
      this.jumpTo(0)
    })

    this.querySelector('button.finish').addEventListener('click', () => {
      this.jumpTo(this._ticker.endTime)
    })

    this._ticker = new Ticker().on('tick', () => {
      this._update()
      this.dispatchEvent(new CustomEvent('tick'))
    })
  }

  get speed(){
    return this._options.isReplay ? this._speedEl.value / 100 : 1
  }

  get time(){
    return this._ticker.currentTime
  }

  setup(startTime, endTime, options = {}){

    this._options = {
      isReplay: false,
      ...options
    }

    this.querySelectorAll(`.replay-${options.isReplay ? 'no' : 'yes'}`).forEach(el => {
      el.classList.add('displaynone')
    })

    this._ticker.setOptions({
      speed: this.speed
    })
    this._ticker.endTime = endTime
    this._ticker.currentTime = startTime
    this._update()
  }

  jumpTo(time, options = {}){
    this._ticker.currentTime = time
    this._update()
    this.dispatchEvent(new CustomEvent('jumped'))
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

  _update(){
    this._eventTimeBarEl.setOptions({
      max: this._ticker.endTime,
      label: dateformat(this._ticker.currentTime, 'M:ss.L')
    })
    if(this._options.isReplay){
      this._eventTimeBarEl.setValue(this._ticker.currentTime)
    }
  }

  _setupPlayPause(){
    this._playEl = this.querySelector('button.play')
    this._playEl.addEventListener('click', () => {
      this.play()
    })
    this._pauseEl = this.querySelector('button.pause')
    this._pauseEl.addEventListener('click', () => {
      this.pause()
    })
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
}

customElements.define('di-combat-time-controls', TimeControls)