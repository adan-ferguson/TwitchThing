import Bar from './bar.js'
import { suffixedNumber } from '../../../../game/utilFunctions.js'

const BASE_ANIM_TIME = 1000
const LVL_ANIM_TIME = 500

export default class XpBar extends Bar{

  constructor(){
    super()
    this._options.labelOverride = (val, max) => {
      return suffixedNumber(val) + '/' + suffixedNumber(max) + ' xp'
    }
    this._options.showLabel = true
    this._options.rounding = true
  }

  get level(){
    return this._level
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
      relative: false,
      ...options
    }

    if(options.relative){
      val = this._val + val
    }

    if(!options.animate){
      const level = this._xpToLevel(val)
      this._setLevel(level)
      super.setBadge(level)
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
    const xpToAdd = targetXp - this._val
    let xpLeft = xpToAdd
    const animTime = this._calcAnimTime(xpToAdd)
    this._flyingText(`+${suffixedNumber(xpLeft)} xp`)
    if(skipToEnd){
      this.skipToEndOfAnimation()
    }
    while(xpLeft > 0){
      let toNextLevel = this._options.max - this._val
      if(xpAnimation.skipped){
        return
      }
      if (xpLeft >= toNextLevel){
        // const diff = this._options.max - this._val
        await super.setValue(this._options.max, { animate: true, animTime: 1000 })
        if(xpAnimation.skipped){
          return
        }
        this._flyingText('Level Up!')
        xpAnimation.currentLevel++
        if(onLevelup){
          await onLevelup(xpAnimation.currentLevel)
        }
        this._setLevel(xpAnimation.currentLevel)
        xpLeft -= toNextLevel
      }else{
        // const diff = targetXp - this._val
        await super.setValue(targetXp, { animate: true, animTime: 1000 })
        return
      }
    }
  }

  _setLevel(level){
    this._level = level
    super.setOptions({
      min: this._levelToXp(level),
      max: this._levelToXp(level + 1)
    })
  }

  _calcAnimTime(xpToAdd){
    const before = this._xpToLevel(this._val)
    const after = this._xpToLevel(this._val + xpToAdd)
    return BASE_ANIM_TIME + LVL_ANIM_TIME * (after - before)
  }
}

customElements.define('di-xp-bar', XpBar)