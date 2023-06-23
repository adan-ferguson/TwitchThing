import Bar from './bar.js'
import { ACTION_COLOR, FLASH_COLORS } from '../../colors.js'
import { flash } from '../../animations/simple.js'
import { COMBAT_BASE_TURN_TIME, speedToTurnTime } from '../../../../game/fighterInstance.js'

export default class ActionBar extends Bar{

  _actualValue = 0

  constructor(){
    super()
    this.setOptions({
      showMax: false,
      showValue: false,
      color: ACTION_COLOR,
      labelOverride: (val, max) => {
        const timeInSeconds = (val / 1000).toFixed(1)
        const totalInSeconds = (max / 1000).toFixed(1)
        return timeInSeconds + 's / ' + totalInSeconds + 's'
      }
    })
  }

  setBaseTime(fighterInstance){
    const speedStatObj = fighterInstance.stats.get('speed')
    this._baseTime = speedToTurnTime(speedStatObj.baseValue)
  }

  setTime(fighterInstance, dontFlash = false){
    const elapsed = fighterInstance.timeSinceLastAction
    const speedStatObj = fighterInstance.stats.get('speed')
    const turnTime = speedToTurnTime(speedStatObj.value)
    this.setOptions({
      max: turnTime
    })
    this._setTime(elapsed)

    if(Math.abs(turnTime - this._baseTime) > 0){
      this.setAttribute('polarity', turnTime > this._baseTime ? 'debuff' : 'buff')
    }else{
      this.removeAttribute('polarity')
    }
  }

  advanceTime(ms){
    this._setTime(this._actualValue + ms)
  }

  _setTime(actualValue){
    this._actualValue = actualValue
    this.setValue(actualValue)
  }
}

customElements.define('di-action-bar', ActionBar)