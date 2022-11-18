import { EventEmitter } from 'events'

export default class Timeline extends EventEmitter{

  constructor(timelineEntries){
    super()
    this._entries = timelineEntries
    this._time = 0
  }

  get entries(){
    return this._entries
  }

  get duration(){
    if(!this._entries.length){
      return 0
    }
    return this._entries.at(-1).time + (this._entries.at(-1).duration ?? 0)
  }

  get time(){
    return this._time
  }

  get finished(){
    return this._time >= this.duration
  }

  get timeSinceLastEntry(){
    return Math.max(0, this.time - this.currentEntry.time)
  }

  get firstEntry(){
    return this._entries[0]
  }

  get currentEntry(){
    return this._entries[this.currentEntryIndex]
  }

  get nextEntry(){
    return this._entries[this.currentEntryIndex + 1]
  }

  get currentEntryIndex(){
    let entryIndex = 0
    for(let i = 0; i < this._entries.length; i++){
      if(this._entries[i].time <= this.time){
        entryIndex = i
      }else{
        break
      }
    }
    return entryIndex
  }

  setTime(val, jumped = false){
    const before = this._time
    if(before === undefined){
      jumped = true
    }
    this._time = Math.max(this.firstEntry.time, Math.min(this.duration, val))
    if(this._time !== before || jumped){
      this.emit('timechange', {
        before,
        after: this._time,
        jumped
      })
    }
  }

  addEntry(entry){
    this._entries.push(entry)
    this.emit('entry_added', entry)
  }
}