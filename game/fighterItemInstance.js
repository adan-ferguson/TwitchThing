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
    return this.activeAbility && !this._state.cooldown
  }

  get cooldownRemaining(){
    return this._state.cooldown || 0
  }

  get cooldown(){
    return this.activeAbility?.cooldown || 0
  }

  advanceTime(ms){
    if(this._state.cooldown){
      this._state.cooldown = Math.max(0, this._state.cooldown - ms)
    }
  }

  enterCooldown(){
    this._state.cooldown = this.cooldown
  }

}
