import Bar from './bar.js'

export default class XpBar extends Bar{

  constructor(){
    super()
    this._label = 'xp'
  }

  setBadge(){
    throw 'Do not call setBadge on levelBar, call setValue'
  }

  setRange(){
    throw 'Do not call setRange on levelBar, call setValue and setLevelFunctions'
  }

  setLevelFunctions(xpToLevel, levelToXp){
    this._xpToLevel = xpToLevel
    this._levelToXp = levelToXp
  }

  async setValue(val, options = {}){

    if(isNaN(parseFloat(val)) || !this._xpToLevel || !this._levelToXp){
      return
    }

    if(!options.animate){
      const level = this._xpToLevel(val)
      super.setBadge(level)
      super.setRange(this._levelToXp(level), this._levelToXp(level + 1))
      super.setValue(val)
    }else{
      let xpToAdd = val - this._val
      this._flyingText(`+${xpToAdd} xp`)
      while(xpToAdd > 0){
        let toNextLevel = this._max - this._val
        if (xpToAdd >= toNextLevel){
          await super.setValue(this._max, { animate: true })
          this._flyingText('Level Up!')
          xpToAdd -= toNextLevel
        }else{
          await super.setValue(val, { animate: true })
          return
        }
      }
    }
  }
}

customElements.define('di-xp-bar', XpBar)