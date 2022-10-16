import tippy from 'tippy.js'
import { effectDisplayInfo } from '../../effectDisplayInfo.js'

const HTML = `
<di-bar></di-bar>
<span class="display-text"></span>
`

export default class EffectRow extends HTMLElement{

  _barEl

  constructor(key, effect){
    super()
    this.innerHTML = HTML
    this.setAttribute('effect-key', key)
    this._barEl = this.querySelector('di-bar')
      .setOptions({
        showLabel: false
      })
    this._tippy = tippy(this, {
      theme: 'light'
    })
    this.update(effect, false)
  }

  update(effect, animate = true){

    this.effect = effect
    const info = effectDisplayInfo(effect)
    animate = info.animateChanges && animate

    this.querySelector('.display-text').textContent = info.text
    this._barEl.setOptions({ max: info.barMax, color: info.color })
    this._barEl.setValue(info.barValue, { animate: animate })
    this._tippy.setContent(info.tooltip)
    // if(info.animateChanges){
    //   flash(this, info.color)
    // }
  }
}
customElements.define('di-effect-row', EffectRow)