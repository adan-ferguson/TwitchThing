export default class ConsoleTimer{
  constructor(){
    this._lastTime = Date.now()
    this._logCount = 0
  }
  log(){
    console.log(++this._logCount, Date.now() - this._lastTime)
    this._lastTime = Date.now()
  }
}