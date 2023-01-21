import Bar from './bar.js'

export default class MiniBar extends Bar{
  constructor(){
    super()
    this.setOptions({
      max: 1,
      showLabel: false,
      showValue: false,
      showMax: false
    })
  }
}
customElements.define('di-mini-bar', MiniBar)