import Bar from './bar.js'

export default class XpBar extends Bar {

  constructor(){
    super()
    this._label = 'xp'
  }

  setBadge() {
    throw 'Do not call setBadge on levelBar, call setValue'
  }

  setRange(){
    throw 'Do not call setRange on levelBar, call setValue and setLevelFunctions'
  }

  setLevelFunctions(xpToLevel, levelToXp){
    this._xpToLevel = xpToLevel
    this._levelToXp = levelToXp
  }

  setValue(val){

    if(isNaN(val) || val === this._val){
      return
    }

    const level = this._xpToLevel(val)
    super.setBadge(level)
    super.setRange(this._levelToXp(level), this._levelToXp(level + 1))
    super.setValue(val)
  }

  async animateValue(val){

    if(isNaN(val) || val === this._val){
      return
    }

    if(this.animation){
      this.animation.cancel()
    }

    let xpToAdd = val - this._val
    while(xpToAdd > 0){
      let toNextLevel = this._max - this._val
      if (xpToAdd >= toNextLevel) {
        await super.animateValue(this._max)
        // TODO: flying text "Level Up!"
        xpToAdd -= toNextLevel
      }else{
        await super.animateValue(this._val + xpToAdd)
        xpToAdd = 0
      }
    }
  }
}

customElements.define('di-xp-bar', XpBar)