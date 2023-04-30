import DIElement from './diElement.js'
import { effectInstanceState } from '../effectInstanceState.js'
import { FLASH_COLORS } from '../colors.js'
import { flash } from '../animations/simple.js'

export default class LoadoutRowState extends DIElement{

  _stateInfo = null

  constructor(){
    super()
    this.cooldownBar.setOptions({
      showValue: false,
      color: '#AAAAAA'
    })
    this._update()
  }

  get initialHTML(){
    return '<di-bar class="cooldown"></di-bar>'
  }

  get idle(){
    return this._options.loadoutEffectInstance ? false : true
  }

  get defaultOptions(){
    return {
      loadoutEffectInstance: null,
      displayStyle: null
    }
  }

  get cooldownBar(){
    return this.querySelector('di-bar.cooldown')
  }

  _update(){

    const prevStateInfo = this._stateInfo
    this._stateInfo = effectInstanceState(this._options.loadoutEffectInstance)

    if(!this._stateInfo){
      this.classList.add('displaynone')
      return
    }

    this.classList.remove('displaynone')
    this.classList.toggle('disabled', this._stateInfo.disabled)
    this.setAttribute('ability-type', this._stateInfo.abilityType)
    this.setAttribute('ability-state', this._stateInfo.abilityState)
    this.setAttribute('display-style', this._options.displayStyle)
    this.cooldownBar
      .setOptions({
        max: this._stateInfo.abilityBarMax
      })
      .setValue(this._stateInfo.abilityBarValue === this._stateInfo.abilityBarMax ? 0 : this._stateInfo.abilityBarValue)

    // Flash if we just used the ability
    // TODO: probably false positives here?
    if(prevStateInfo?.abilityState === 'ready' && this._stateInfo.abilityState === 'recharging'){
      flash(this, FLASH_COLORS[this._stateInfo.abilityType])
    }
  }

  advanceTime(ms){
    if(this.idle || !this._stateInfo || this.getAttribute('ability-state') === 'ready'){
      return
    }
    if(this._stateInfo.cooldownRefreshing){
      this.cooldownBar.setValue(ms, { relative: true })
      if(this.cooldownBar.pct === 1){
        this.setAttribute('ability-state', 'ready')
      }
    }
  }
}

customElements.define('di-loadout-row-state', LoadoutRowState)