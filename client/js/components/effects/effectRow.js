import tippy from 'tippy.js'
import { effectDisplayInfo } from '../../effectDisplayInfo.js'
import { flash } from '../../animations/simple.js'
import { effectTooltip } from './effectTooltip.js'

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
    this._tippy.setContent(effectTooltip(effect))
    this.update(effect, false)
  }

  update(effect, animate = true){
    this.effect = effect
    const info = effectDisplayInfo(effect)
    animate = info.animateChanges && animate

    // TODO: poison tooltip
    // if(info.tooltipOutdated){
    //   this._updateTooltip()
    // }

    this.querySelector('.display-text').textContent = info.text
    this._barEl.setOptions({ max: info.barMax, color: info.colors.bar })
    this._barEl.setValue(info.barValue, { animate: animate })
  }

  flash(){
    flash(this._barEl.foregroundEl, effectDisplayInfo(this.effect).colors.flash, 500)
  }
}
customElements.define('di-effect-row', EffectRow)