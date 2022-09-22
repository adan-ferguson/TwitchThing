import Bar from './bar.js'

const ACTION_BAR_COLOR = 'rgb(168, 199, 255)'

export default class ActionBar extends Bar{
  constructor(){
    super()
    this.setOptions({
      showMax: false,
      showValue: false,
      color: ACTION_BAR_COLOR
    })
  }

  setTime(elapsed, remaining){
    const timeInSeconds = (remaining / 1000).toFixed(1)
    const totalInSeconds = ((elapsed + remaining) / 1000).toFixed(1)
    this.setValue(elapsed)
    this.setOptions({
      max: elapsed + remaining,
      label: timeInSeconds + 's / ' + totalInSeconds + 's'
    })
  }
}

customElements.define('di-action-bar', ActionBar)