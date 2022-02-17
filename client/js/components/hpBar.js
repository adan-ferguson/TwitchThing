import Bar from './bar.js'
import * as tinycolor from 'tinycolor2'

const RED = '#ffadad'
const YELLOW = '#ffffc7'
const GREEN = '#c3ffc3'

export default class HpBar extends Bar{
  constructor(){
    super()
    this.setLabel('hp')
    this.setColor(pct => {
      if(pct < 0.5){
        return tinycolor.mix(RED, YELLOW, pct * 200).toHexString()
      }else{
        return tinycolor.mix(YELLOW, GREEN, (pct - 0.5) * 200).toHexString()
      }
    })
  }
}

customElements.define('di-hp-bar', HpBar)