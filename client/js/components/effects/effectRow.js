import { flash } from '../../animations/simple.js'
import tippy from 'tippy.js'
import { effectDisplayInfo } from '../../effectDisplayInfo.js'

const HTML = `
<di-bar></di-bar>
<span class="display-text"></span>
`

export default class EffectRow extends HTMLElement{

  _cachedTxt
  _barEl

  constructor(key, effect, animate = false){
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
    this.update(effect, animate)
  }

  update(effect, animate = false){

    this.effect = effect
    const info = effectDisplayInfo(effect)

    this._barEl.setValue(info.barValue)
    if(this._cachedTxt === info.text){
      return
    }

    this.querySelector('.display-text').textContent = info.text
    this._cachedTxt = info.text
    this._barEl.setOptions({ max: info.barMax, color: info.color })
    this._tippy.setContent(info.tooltip)
    if(animate){
      flash(this, info.color)
    }
  }
}
customElements.define('di-effect-row', EffectRow)