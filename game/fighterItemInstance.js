import Stats from './stats/stats.js'
import { toDisplayName } from './utilFunctions.js'

// Stupid
new Stats()

export default class FighterItemInstance{

  constructor(itemData, state = null, owner = null){
    this._itemData = { ...itemData }
    this._state = state ? { ...state } : {}
    this.owner = owner
  }

  get displayName(){
    return this.itemData.displayName ?? toDisplayName(this.itemData.name)
  }

  get description(){
    return this.itemData.description ?? ''
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
  get ability(){
    return this.itemData.ability
  }

  get abilityReady(){
    if(!this.ability){
      return false
    }
    if(this._state.cooldownRemaining){
      return false
    }
    if(this.ability.uses && this._state.timesUsed >= this.ability.uses){
      return false
    }
    if(this.ability.conditions && this.owner){
      if(!this.owner.meetsConditions(this.ability.conditions)){
        return false
      }
    }
    return true
  }

  get cooldownRemaining(){
    return this._state.cooldownRemaining || 0
  }

  get cooldown(){
    return this.ability?.cooldown || 0
  }

  setState(newState = {}){
    this._state = { ...newState }
    if(this._state.cooldownRemaining === undefined && this.ability){
      this._state.cooldownRemaining = this.ability.initialCooldown ?? 0
    }
  }

  advanceTime(ms){
    if(this._state.cooldownRemaining){
      this._state.cooldownRemaining = Math.max(0, this._state.cooldownRemaining - ms)
    }
  }

  used(){
    this._state.cooldownRemaining = this.cooldown
    this._state.timesUsed = (this._state.timesUsed ?? 0) + 1
  }

  shouldTrigger(triggerName){
    if(!this.ability || this.ability.type !== 'triggered'){
      return false
    }
    if(!this.ability.trigger === triggerName){
      return false
    }
    if(!this.abilityReady){
      return false
    }
    if(this.ability.chance && Math.random() > this.ability.chance){
      return false
    }
    return true
  }

}
