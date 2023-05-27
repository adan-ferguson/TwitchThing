import { statusEffectDisplayInfo } from '../../displayInfo/statusEffectDisplayInfo.js'
import { flash } from '../../animations/simple.js'
import { ACTION_COLOR } from '../../colors.js'
import DIElement from '../diElement.js'
import EffectDetails from '../effectDetails.js'
import { wrapContent } from '../../../../game/utilFunctions.js'

const HTML = `
<di-bar></di-bar>
<di-mini-bar></di-mini-bar>
`

export default class EffectRow extends DIElement{

  barEl

  constructor(key, effect){
    super()
    this.classList.add('effect-instance')
    this.innerHTML = HTML
    this.barEl = this.querySelector('di-bar')
    this._miniBarEl = this.querySelector('di-mini-bar')
      .setOptions({
        color: ACTION_COLOR
      })
  }

  get tooltip(){

    if(!this._effect){
      return null
    }

    const tooltip = document.createElement('div')
    tooltip.classList.add('loadout-row-tooltip')
    tooltip.appendChild(new EffectDetails().setObject(this._effect))

    return tooltip
  }

  setEffect(effect, key){
    this.setAttribute('effect-id', key)
    return this.update(effect, true)
  }

  update(effect, key, cancelAnimations = false){

    this._effect = effect

    const info = statusEffectDisplayInfo(effect)
    if(!info){
      debugger // Shouldn't reach here...
    }

    this.classList.toggle('persisting', effect.persisting)

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
      this._timedMiniBar = info.abilityInfo.abilityState === 'cooldown-refreshing' ? true : false
      this._miniBarEl
        .setOptions({ max: info.abilityInfo.abilityBarMax })
        .setValue(info.abilityInfo.abilityBarValue)
    }

    this.setTooltip(this.tooltip)
    return this
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
    flash(this.barEl.foregroundEl, statusEffectDisplayInfo(this._effect).colors.flash, 500)
  }
}
customElements.define('di-effect-row', EffectRow)