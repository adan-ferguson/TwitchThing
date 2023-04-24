import DIElement from './diElement.js'
import { effectInstanceState } from '../effectInstanceState.js'

export default class LoadoutRowState extends DIElement{

  _stateInfo = null

  constructor(){
    super()
    this.cooldownBar.setOptions({
      showValue: false
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
      loadoutEffectInstance: null
    }
  }

  get cooldownBar(){
    return this.querySelector('di-bar.cooldown')
  }

  _update(){

    this._stateInfo = effectInstanceState(this._options.loadoutEffectInstance)

    if(!this._stateInfo){
      this.classList.add('displaynone')
      return
    }

    debugger
    this.classList.remove('displaynone')
    this.classList.toggle('disabled', this._stateInfo.disabled)
    this.setAttribute('ability-type', this._stateInfo.abilityType)
    this.setAttribute('ability-state', this._stateInfo.abilityState)
    this.cooldownBar
      .setOptions({
        max: this._stateInfo.abilityBarMax
      })
      .setValue(this._stateInfo.abilityBarValue === this._stateInfo.abilityBarMax ? 0 : this._stateInfo.abilityBarValue)
  }

  advanceTime(ms){
    if(this.idle || !this._stateInfo){
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