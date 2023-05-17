import Bar from './bar.js'
import { ACTION_COLOR, FLASH_COLORS } from '../../colors.js'
import { flash } from '../../animations/simple.js'

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

  setTime(elapsed, remaining, dontFlash = false){
    if(!dontFlash){
      if(this.options.max !== elapsed + remaining){
        flash(this._barBorder, FLASH_COLORS[elapsed + remaining > this.options.max ? 'bad' : 'good'], 120)
      }
    }
    this.setOptions({
      max: elapsed + remaining
    })
    this._setTime(elapsed)
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