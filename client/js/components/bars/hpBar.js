import Bar from './bar.js'
import healthIcon from '../../../assets/icons/health.svg'

const DECREASER = '#ec0000'
const INCREASER = '#3fef3f'
const HP = '#93e078'

export default class HpBar extends Bar{
  constructor(){
    super()
    this.setBadge(`<img src="${healthIcon}">`)
    this.setOptions({
      color: HP,
      increaserColor: INCREASER,
      decreaserColor: DECREASER
    })
  }
}

customElements.define('di-hp-bar', HpBar)