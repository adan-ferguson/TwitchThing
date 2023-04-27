import Bar from './bar.js'
import { suffixedNumber } from '../../../../game/utilFunctions.js'

export default class XpBar extends Bar{

  constructor(){
    super()
    this._options.labelOverride = (val, max) => {
      return suffixedNumber(val) + '/' + suffixedNumber(max) + ' xp'
    }
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

  skipToEndOfAnimation(){
    if(!this._xpAnimation){
      return
    }
    this._xpAnimation.skipped = true
    for(let i = this._xpAnimation.currentLevel + 1; i <= this._xpToLevel(this._xpAnimation.targetXp); i++){
      this._xpAnimation.onLevelup(i, false)
    }
    this.setValue(this._xpAnimation.targetXp)
    this._xpAnimation = null
  }

  async setValue(val, options = {}){

    if(isNaN(parseFloat(val)) || !this._xpToLevel || !this._levelToXp){
      return
    }

    this.animation?.cancel()

    options = {
      animate: false,
      skipToEndOfAnimation: false,
      onLevelup: null,
      ...options
    }

    if(!options.animate){
      const level = this._xpToLevel(val)
      this._setLevel(level)
      // super.setBadge(level)
      super.setValue(val)
    }else{
      await this._startAnimation({
        onLevelup: options.onLevelup,
        targetXp: val,
        skipToEnd: options.skipToEndOfAnimation
      })
    }
  }

  async _startAnimation({ onLevelup, targetXp, skipToEnd = false }){
    const xpAnimation = {
      skipped: false,
      currentLevel: this._xpToLevel(this._val),
      targetXp,
      onLevelup
    }
    this._xpAnimation = xpAnimation
    let xpToAdd = targetXp - this._val
    this._flyingText(`+${suffixedNumber(xpToAdd)} xp`)
    if(skipToEnd){
      this.skipToEndOfAnimation()
    }
    while(xpToAdd > 0){
      let toNextLevel = this._options.max - this._val
      if(xpAnimation.skipped){
        return
      }
      if (xpToAdd >= toNextLevel){
        await super.setValue(this._options.max, { animate: true })
        if(xpAnimation.skipped){
          return
        }
        this._flyingText('Level Up!')
        xpAnimation.currentLevel++
        if(onLevelup){
          await onLevelup(xpAnimation.currentLevel)
        }
        this._setLevel(xpAnimation.currentLevel)
        xpToAdd -= toNextLevel
      }else{
        await super.setValue(targetXp, { animate: true })
        return
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