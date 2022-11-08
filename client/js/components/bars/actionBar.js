import Bar from './bar.js'
import { ACTION_COLOR } from '../../colors.js'

export default class ActionBar extends Bar{
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
    this.setValue(elapsed)
    this.setOptions({
      max: elapsed + remaining
    })
  }

  advanceTime(ms){
    this.setValue(ms, { relative: true })
  }
}

customElements.define('di-action-bar', ActionBar)