import Bar from './bar.js'
import actionIcon from '../../../assets/icons/magicPower.svg'

export default class ActionBar extends Bar{
  constructor(){
    super()
    this.showValueBeforeLabel = false
    this.setBadge(`<img src="${actionIcon}">`)
  }

  setTime(elapsed, remaining){
    const timeInSeconds = (Math.ceil(remaining / 100) / 10).toFixed(1) + 's'
    this.setValue(elapsed)
    this.setLabel(timeInSeconds)
    this.setOptions({ max: elapsed + remaining })
  }
}

customElements.define('di-action-bar', ActionBar)