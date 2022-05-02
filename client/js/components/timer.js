import dateformat from 'dateformat'

const DISCONNECT_TIMEOUT = 5000

/**
 * Timer that ticks up in seconds.
 * TODO: more options at we required more timer functionality
 */
export default class Timer extends HTMLElement{

  _lastTick

  constructor(){
    super()
    this._time = 0 // Time in milliseconds
    this.format = 'M:ss'
  }

  set time(ms){
    this._time = Math.max(0, ms || 0)
    this.textContent = dateformat(this._time, this.format)
  }

  get time(){
    return this._time
  }

  setTimeSince(since){
    this.time = new Date() - new Date(since)
  }

  start(){
    if(this.isRunning){
      return
    }
    this._lastTickDatetime = new Date()
    requestAnimationFrame(this._tick)
    this.isRunning = true
  }

  stop(){
    this.isRunning = false
  }

  _tick = () => {
    if(!this.isRunning){
      return this.stop()
    }
    if(!this.isConnected){
      if(new Date() - this._lastTickDatetime > DISCONNECT_TIMEOUT){
        // Stop ticking if we're not attached to DOM
        return this.stop()
      }
    }else{
      const diff = new Date() - this._lastTickDatetime
      this.time += diff
      this._lastTickDatetime = new Date()
    }
    requestAnimationFrame(this._tick)
  }
}

customElements.define('di-timer', Timer)