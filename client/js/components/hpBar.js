import Bar from './bar.js'

const RED = '#ffadad'
const BRIGHT_GREEN = '#67ff67'
const GREEN = '#c3ffc3'

export default class HpBar extends Bar{
  constructor(){
    super()
    this.setLabel('hp')
    this.color = GREEN
    this.increaserColor = BRIGHT_GREEN
    this.decreaserColor = RED
  }
}

customElements.define('di-hp-bar', HpBar)