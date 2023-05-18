import DIElement from './diElement.js'
import { effectInstanceState } from '../effectInstanceState.js'
import { FLASH_COLORS, ITEM_ROW_COLORS } from '../colors.js'
import { flash } from '../animations/simple.js'
import { makeEl } from '../../../game/utilFunctions.js'

export default class LoadoutRowState extends DIElement{

  _stateInfo = null

  constructor(){
    super()
    this.cooldownBar.setOptions({
      showValue: false,
      color: '#AAAAAA'
    })
    this.update()
  }

  get initialHTML(){
    return `
<di-bar class="cooldown"></di-bar>
<div class="dots"></div>
`
  }

  get idle(){
    return this._options.loadoutEffectInstance ? false : true
  }

  get defaultOptions(){
    return {
      loadoutEffectInstance: null,
      displayStyle: 'standard'
    }
  }

  get cooldownBar(){
    return this.querySelector('di-bar.cooldown')
  }

  flash(){
    if(this._stateInfo){
      flash(this, FLASH_COLORS[this._stateInfo.abilityType])
    }
  }

  update(){

    // const prevStateInfo = this._stateInfo
    this._stateInfo = effectInstanceState(this._options.loadoutEffectInstance)

    if(!this._stateInfo){
      this.classList.add('displaynone')
      return
    }

    this.classList.remove('displaynone')
    this.parentElement.classList.toggle('disabled', this._stateInfo.disabled)
    // TODO: better next effect
    // this.classList.toggle('next', this._stateInfo.next)
    this.setAttribute('ability-type', this._stateInfo.abilityType)
    this.setAttribute('ability-state', this._stateInfo.abilityState)
    this.setAttribute('display-style', this._options.displayStyle)

    const barColor = this._stateInfo.abilityState === 'ready' ?
      ITEM_ROW_COLORS[this._stateInfo.abilityType] :
      ITEM_ROW_COLORS.disabled
    this.cooldownBar
      .setOptions({
        max: this._stateInfo.abilityBarMax,
        color: barColor
      })
      .setValue(this._stateInfo.abilityBarValue)
    this._updateDots(this._stateInfo.abilityUses)
  }

  advanceTime(ms){
    if(this.idle || !this._stateInfo || this.getAttribute('ability-state') === 'ready'){
      return
    }
    if(this._stateInfo.abilityState === 'cooldown-refreshing'){
      this.cooldownBar.setValue(ms, { relative: true })
      if(this.cooldownBar.pct === 1){
        this._stateInfo.abilityInstance.cooldownRemaining = 0
        this.update()
      }
    }
  }

  _updateDots(num = 0){
    const dotsEl = this.querySelector('.dots')
    dotsEl.innerHTML = ''
    if(!num){
      return
    }
    for(let i = 0; i < num; i++){
      const dot = makeEl({ class: 'dot' })
      dotsEl.append(dot)
    }
  }
}

customElements.define('di-loadout-row-state', LoadoutRowState)