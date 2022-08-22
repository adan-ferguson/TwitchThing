import Bar from './bar.js'

const DECREASER = '#ffa4a4'
const INCREASER = '#3fef3f'
const HP = '#bbf8a3'

export default class HpBar extends Bar{
  constructor(){
    super()
    this.setOptions({
      color: HP,
      increaserColor: INCREASER,
      decreaserColor: DECREASER
    })
  }
}

customElements.define('di-hp-bar', HpBar)