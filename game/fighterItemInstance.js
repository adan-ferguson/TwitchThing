import Stats from './stats/stats.js'

// Stupid
new Stats()

export default class FighterItemInstance{

  constructor(itemData, state = null){
    this._itemData = { ...itemData }
    this._state = state ? { ...state } : {}
  }

  get itemData(){
    return { ...this._itemData }
  }

  get state(){
    return { ...this._state }
  }

  /**
   * @return {Stats}
   */
  get stats(){
    return new Stats(this.itemData.stats)
  }

  /**
   * @return {array}
   */
  get mods(){
    return this.itemData.mods || []
  }

  /**
   * @return {object}
   */
  get activeAbility(){
    return this.itemData.active
  }

  get activeAbilityReady(){
    return this.activeAbility && !this._state.cooldownRemaining
  }

  get cooldownRemaining(){
    return this._state.cooldownRemaining || 0
  }

  get cooldown(){
    return this.activeAbility?.cooldown || 0
  }

  setState(newState = {}){
    this._state = { ...newState }
  }

  advanceTime(ms){
    if(this._state.cooldownRemaining){
      this._state.cooldownRemaining = Math.max(0, this._state.cooldownRemaining - ms)
    }
  }

  enterCooldown(){
    this._state.cooldownRemaining = this.cooldown
  }

}
