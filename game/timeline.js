export default class Timeline{

  constructor(timelineEntries){
    this._entries = timelineEntries
  }

  get duration(){
    return this._entries.at(-1).time
  }

  get time(){
    return this._time
  }

  set time(val){
    this._time = Math.max(0, Math.min(this.duration, val))
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
}