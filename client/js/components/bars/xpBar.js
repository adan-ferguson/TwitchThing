import Bar from './bar.js'

export default class XpBar extends Bar{

  constructor(){
    super()
    this._options.label = 'xp'
    this._options.showLabel = true
    this._options.rounding = true
  }

  get animSpeed(){
    return 1000
  }

  setBadge(){
    throw 'Do not call setBadge on levelBar, call setValue'
  }

  setLevelFunctions(xpToLevel, levelToXp){
    this._xpToLevel = xpToLevel
    this._levelToXp = levelToXp
    return this
  }

  async setValue(val, options = {}){

    if(isNaN(parseFloat(val)) || !this._xpToLevel || !this._levelToXp){
      return
    }

    options = {
      animate: false,
      triggerEventsEvenIfNoAnimate: false,
      ...options
    }

    if(!options.animate){
      const level = this._xpToLevel(val)
      const currentLevel = this._xpToLevel(this._val)
      if(options.triggerEventsEvenIfNoAnimate){
        for(let i = currentLevel + 1; i <= level; i++){
          await options.onLevelup?.(i)
        }
      }
      this._setLevel(level)
      super.setBadge(level)
      super.setValue(val)
    }else{
      let xpToAdd = val - this._val
      this._flyingText(`+${xpToAdd} xp`)
      while(xpToAdd > 0){
        let currentLevel = this._xpToLevel(this._val)
        let toNextLevel = this._options.max - this._val
        if (xpToAdd >= toNextLevel){
          await super.setValue(this._options.max, { animate: true })
          this._flyingText('Level Up!')
          currentLevel++
          if(options.onLevelup){
            await options.onLevelup(currentLevel)
          }
          this._setLevel(currentLevel)
          xpToAdd -= toNextLevel
        }else{
          await super.setValue(val, { animate: true })
          return
        }
      }
    }
  }

  _setLevel(level){
    super.setOptions({
      min: this._levelToXp(level),
      max: this._levelToXp(level + 1)
    })
  }
}

customElements.define('di-xp-bar', XpBar)