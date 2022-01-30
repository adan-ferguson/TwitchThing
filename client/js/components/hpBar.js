import Bar from './bar.js'

export default class HpBar extends Bar {
  constructor(){
    super()
    this._label = 'hp'
  }
}

customElements.define('di-hp-bar', HpBar)