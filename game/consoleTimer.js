export default class ConsoleTimer{
  constructor(){
    this._lastTime = Date.now()
  }

  reset(){
    this._lastTime = Date.now()
  }
  log(msg){
    console.log(Date.now() - this._lastTime, msg)
    this._lastTime = Date.now()
  }
}