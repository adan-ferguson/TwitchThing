import { flash } from '../../animationHelper.js'

const HTML = `
<di-bar></di-bar>
<span class="display-text"></span>
`

const BUFF_COLOR = '#ddffba'
const DEBUFF_COLOR = '#ffc0c0'

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
    this.update(effect, animate)
  }

  update(effect, animate = false){

    this._cachedEffect = effect
    let txt = `${effect.displayName}`
    if(effect.stacks >= 2){
      txt += ` x${effect.stacks}`
    }

    const intDuration = parseInt(effect.duration) || null

    if(txt !== this._cachedTxt){
      this.querySelector('.display-text').textContent = txt
      this._cachedTxt = txt
      const color = effect.buff ? BUFF_COLOR : DEBUFF_COLOR
      const max = intDuration ?? 1
      this._barEl.setOptions({ max, color })
      if(!intDuration){
        this._barEl.setValue(1)
      }
      if(animate){
        flash(this, color)
      }
    }

    if(intDuration){
      this._barEl.setValue(intDuration - effect.state.time)
    }
  }
}
customElements.define('di-effect-row', EffectRow)