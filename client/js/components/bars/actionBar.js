import Bar from './bar.js'
import { ACTION_COLOR } from '../../colors.js'

export default class ActionBar extends Bar{

  _actualValue = 0

  constructor(){
    super()
    this.setOptions({
      showMax: false,
      showValue: false,
      color: ACTION_COLOR,
      label: val => {
        const timeInSeconds = (val / 1000).toFixed(1)
        const totalInSeconds = (this._options.max / 1000).toFixed(1)
        return timeInSeconds + 's / ' + totalInSeconds + 's'
      }
    })
  }

  setTime(elapsed, remaining){
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