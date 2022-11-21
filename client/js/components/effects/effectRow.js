import tippy from 'tippy.js'
import { effectDisplayInfo } from '../../effectDisplayInfo.js'
import { flash } from '../../animations/simple.js'
import { ACTION_COLOR } from '../../colors.js'
import { parseDescriptionString } from '../../descriptionString.js'

const HTML = `
<di-bar></di-bar>
<di-mini-bar></di-mini-bar>
`

export default class EffectRow extends HTMLElement{

  barEl

  constructor(key, effect){
    super()
    this.innerHTML = HTML
    this.setAttribute('effect-key', key)
    this.barEl = this.querySelector('di-bar')
    this._miniBarEl = this.querySelector('di-mini-bar')
      .setOptions({
        color: ACTION_COLOR
      })
    if(effect.description){
      const parsed = parseDescriptionString(effect.description)
      this._tippy = tippy(this, {
        theme: 'light',
        content: parsed
      })
    }
    this.update(effect, false)
  }

  update(effect, cancelAnimations = false){

    this.effect = effect
    const info = effectDisplayInfo(effect)

    this.classList.toggle('lingering', effect.lingering)

    if(!this.barEl.animating || cancelAnimations){
      this.barEl.setOptions({
        max: info.barMax,
        color: info.colors.bar,
        label: info.text,
        lineBreakLabel: true,
        showValue: info.showValue,
        showMax: false,
        rounding: true
      })
      this.barEl.setValue(info.barValue)
      this._timedBar = info.timed
    }

    if(info.abilityInfo){
      this._timedMiniBar = info.abilityInfo.ability.cooldown ? true : false
      this._miniBarEl
        .setOptions({ max: info.abilityInfo.barMax })
        .setValue(info.abilityInfo.barValue)
    }
  }

  advanceTime(ms){
    if(this._timedBar){
      this.barEl.setValue(-ms, { relative: true })
    }
    if(this._timedMiniBar){
      this._miniBarEl.setValue(ms, { relative : true } )
    }
  }

  flash(){
    flash(this.barEl.foregroundEl, effectDisplayInfo(this.effect).colors.flash, 500)
  }
}
customElements.define('di-effect-row', EffectRow)