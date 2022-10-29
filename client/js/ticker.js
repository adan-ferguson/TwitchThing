import { EventEmitter } from 'events'
import { mergeOptionsObjects } from '../../game/utilFunctions.js'

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
    if(this.running){
      this._tick()
    }
  }

  get endTime(){
    return this._endTime
  }

  set endTime(val){
    if(val === this.endTime){
      return
    }
    this._endTime = val
    if(this.running){
      this._tick()
    }
  }

  get waitFn(){
    return this._options.live ? setTimeout : requestAnimationFrame.bind(window)
  }

  setOptions(options = {}){
    this._options = mergeOptionsObjects(this._options, options)
    this._tick()
  }

  start(){
    if(this.reachedEnd || this.running){
      return
    }
    this.running = true
    this._tick()
  }

  stop(){
    this.running = false
  }

  _tick(){

    if(this._ticking){
      return
    }

    const doTick = () => {
      if(!this.running){
        this._ticking = false
        return
      }
      const prevTime = this._currentTime
      let elapsedTime = Math.round(
        this._options.live ?
          (Date.now() - this._startingTimestamp) * this._options.speed :
          (Date.now() - this._previousTimestamp) * this._options.speed + prevTime
      )

      if(!this._options.live){
        // Don't support ticks which are longer than a 30fps tick
        elapsedTime = Math.min(prevTime + this._options.speed * 1000/30, elapsedTime)
      }

      this._currentTime = Math.max(0, Math.min(this.endTime, this._startingTime + elapsedTime))
      this.emit('tick', this._currentTime - prevTime)
      if(this.currentTime === this.endTime){
        this._ticking = false
        this.emit('ended', elapsedTime - this.currentTime)
      }else{
        this._previousTimestamp = Date.now()
        this.waitFn(() => doTick())
      }
    }

    this._previousTimestamp = Date.now()
    this._startingTimestamp = Date.now()
    this._startingTime = this.currentTime

    this._ticking = true
    this.waitFn(() => {
      doTick()
    })
  }
}