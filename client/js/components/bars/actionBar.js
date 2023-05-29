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

  setBaseTime(baseTime){
    this._baseTime = baseTime
  }

  setTime(elapsed, remaining, dontFlash = false){
    // if(!dontFlash){
    //   if(this.options.max !== elapsed + remaining){
    //     flash(this._barBorder, FLASH_COLORS[elapsed + remaining > this.options.max ? 'bad' : 'good'], 120)
    //   }
    // }
    const max = elapsed + remaining
    this.setOptions({
      max
    })
    this._setTime(elapsed)

    if(Math.abs(max - this._baseTime) > 1){
      this.setAttribute('polarity', max > this._baseTime ? 'debuff' : 'buff')
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