

// Stupid
import Stats from './stats/stats.js'
new Stats()

export default class EffectInstance{

  constructor(state = {}, owner = null){
    this.setState = state
    this.owner = owner
  }

  /**
   * Something to identify this effect so that when we parse an action, we can find
   * the source of the action.
   *
   * @returns {string}
   */
  get id(){
    throw 'id gettter not defined'
  }

  /**
   * @return {object}
   */
  get ability(){
    throw 'ability getter not defined'
  }

  /**
   * @return {array}
   */
  get mods(){
    throw 'mods getter not defined'
  }

  /**
   * @return {Stats}
   */
  get stats(){
    throw 'stats getter not defined'
  }

  get state(){
    return { ...this._state }
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
    if(this.ability.combatOnly !== false && !this.owner.inCombat){
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

  /**
   *
   */
  used(){
    this._state.cooldownRemaining = this.cooldown
    this._state.timesUsed = (this._state.timesUsed ?? 0) + 1
  }

  shouldTrigger(triggerName){
    if(!this.ability || this.ability.type !== 'triggered'){
      return false
    }
    if(this.ability.trigger !== triggerName){
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

  setState(newState = {}){
    this._state = { ...newState }
    if(this._state.cooldownRemaining === undefined && this.ability?.cooldown){
      this._state.cooldownRemaining = this.ability.initialCooldown ?? 0
    }
  }

  advanceTime(ms){
    if(this._state.cooldownRemaining){
      this._state.cooldownRemaining = Math.max(0, this._state.cooldownRemaining - ms)
    }
  }
}