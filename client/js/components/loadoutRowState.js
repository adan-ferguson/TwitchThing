import DIElement from './diElement.js'
import { effectInstanceState } from '../effectInstanceState.js'
import { FLASH_COLORS, ITEM_ROW_COLORS } from '../colors.js'
import { flash } from '../animations/simple.js'

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
    return '<di-bar class="cooldown"></di-bar>'
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
    this.classList.toggle('disabled', this._stateInfo.disabled)
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