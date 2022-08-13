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
    if(this.running && !this._ticking){
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
    if(this.running && !this._ticking){
      this._tick()
    }
  }

  setOptions(options = {}){
    this._options = mergeOptionsObjects(this._options, options)
  }

  start(){
    if(this.reachedEnd){
      return
    }
    this.running = true
    this._tick()
  }

  stop(){
    this.running = false
  }

  _tick(){
    const before = Date.now()
    this._ticking = true
    setTimeout(() => {
      if(!this.running){
        this._ticking = false
        return
      }
      const timeBefore = this.currentTime
      const diff = (Date.now() - before) * this._options.speed
      this.currentTime = Math.max(0, Math.min(this.endTime, this.currentTime + diff))
      this.emit('tick', this.currentTime - timeBefore)
      if(this.currentTime === this.endTime){
        this._ticking = false
        this.emit('ended', timeBefore + diff - this.currentTime)
      }else{
        this._tick()
      }
    })
  }
}