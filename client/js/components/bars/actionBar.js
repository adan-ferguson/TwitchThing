import Bar from './bar.js'

export default class ActionBar extends Bar{
  constructor(){
    super()
    this.setLabel('hp')
    this.color = GREEN
    this.increaserColor = BRIGHT_GREEN
    this.decreaserColor = RED
  }
}

customElements.define('di-action-bar', HpBar)