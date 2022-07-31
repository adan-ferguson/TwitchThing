export default class Ticker{

  running = false
  currentTime = 0
  endTime = 1

  _onTick

  constructor(onTick){
    this._onTick = onTick
  }

  get finished(){
    return this.currentTime === this.endTime
  }

  setTimes(currentTime, endTime){
    this.endTime = endTime
    this.currentTime = Math.min(endTime, currentTime)
    if(!this._ticking && this.running){
      this._tick()
    }
  }

  start(){
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
      this.currentTime = Math.min(this.endTime, this.currentTime + Date.now() - before)
      this._onTick()
      if(this.currentTime < this.endTime){
        this._tick()
      }else{
        this._ticking = false
      }
    })
  }
}