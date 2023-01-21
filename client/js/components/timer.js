const DISCONNECT_TIMEOUT = 5000

/**
 * Timer that ticks up in seconds.
 */
export default class Timer extends HTMLElement{

  _lastTick

  constructor(){
    super()
    this._time = 0 // Time in milliseconds
    this.format = 'M:ss'
  }

  set time(ms){
    this._time = ms || 0
    this.textContent = textContent
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

export function betterDateFormat(ms, options = {}){

  options = {
    milliseconds: false,
    ...options
  }

  const negative = ms > 0 ? false : true
  ms = Math.abs(ms)

  const minutes = clean((ms / 60000))
  const seconds = clean((ms / 1000) % 60)
  const milliseconds = clean(ms % 1000)

  let textContent = negative ? '-' : ''
  textContent += minutes ? minutes : '0'
  textContent += ':' + seconds.toString().padStart(2, '0')

  if(options.milliseconds){
    textContent += ':' + milliseconds.toString().padStart(2, '0')
  }

  return textContent

  function clean(num){
    return Math.floor(Math.round(num))
  }
}