import { EventEmitter } from 'events'
import { mergeOptionsObjects, minMax } from '../../game/utilFunctions.js'

export default class Ticker extends EventEmitter{

  running = false
  _currentTime = 0
  _endTime = 1

  _options

  constructor(options = {}){
    super()
    this._options = {
      speed: 1,
      live: true, // If true, then keep synced up if tab is unfocused or JS is paused.
      ...options
    }
  }

  get reachedEnd(){
    return this.currentTime === this.endTime
  }

  get currentTime(){
    return this._currentTime
  }

  set currentTime(val){
    if(val === this.currentTime){
      return
    }
    this._currentTime = val
    this._calibrateTicks()
  }

  get endTime(){
    return this._endTime
  }

  set endTime(val){
    if(val === this.endTime){
      return
    }
    this._endTime = val
    this._calibrateTicks()
  }

  get waitFn(){
    return this._options.live ? setTimeout.bind(window) : requestAnimationFrame.bind(window)
  }

  setOptions(options = {}){
    this._options = mergeOptionsObjects(this._options, options)
    this._calibrateTicks()
  }

  start(){
    if(this.reachedEnd || this.running){
      return
    }
    this._startTicks()
  }

  stop(){
    this.running = false
  }

  _startTicks(){
    this.running = true
    this._calibrateTicks()
  }

  _calibrateTicks(){

    // Timestamp when the ticker would have been at 0
    this._startingTimestamp = Date.now() - this.currentTime

    // Timestamp of the last tick or last calibration
    this._previousTickTimestamp = Date.now()

    if(this.running){
      this._doTick()
    }
  }

  _doTick(){

    if(this._ticking){
      return
    }

    this._ticking = true

    const tick = () => {

      if(!this.running){
        this._ticking = false
        return
      }

      const prevTime = this._currentTime
      let newCurrentTime
      if(this._options.live){
        newCurrentTime = Date.now() - this._startingTimestamp
      }else{
        newCurrentTime = (Date.now() - this._previousTickTimestamp) * this._options.speed + prevTime

        // Prevent skipping if JS was halted or tab was changed or whatever
        newCurrentTime = Math.min(prevTime + this._options.speed * 1000/30, newCurrentTime)
      }

      newCurrentTime = Math.round(newCurrentTime)
      this._currentTime = minMax(0, newCurrentTime, this.endTime)
      this.emit('tick', this._currentTime - prevTime)

      if(this.currentTime === this.endTime){
        this._ticking = false
        this.emit('ended', newCurrentTime - this.currentTime)
      }else{
        this._previousTickTimestamp = Date.now()
        this.waitFn(tick)
      }
    }

    this.waitFn(tick)
  }
}