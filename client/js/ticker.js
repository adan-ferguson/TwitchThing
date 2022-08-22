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

    const doTick = () => {
      if(!this.running){
        this._ticking = false
        return
      }
      const elapsedTime = (new Date() - this._startingTimestamp) * this._options.speed
      this._currentTime = Math.max(0, Math.min(this.endTime, this._startingTime + elapsedTime))
      this.emit('tick')
      if(this.currentTime === this.endTime){
        this._ticking = false
        this.emit('ended', elapsedTime - this.currentTime)
      }else{
        setTimeout(() => {
          doTick()
        })
      }
    }

    this._startingTimestamp = Date.now()
    this._startingTime = this.currentTime

    if(this._ticking){
      return
    }
    this._ticking = true
    setTimeout(() => {
      doTick()
    })
  }
}