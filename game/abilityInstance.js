export default class AbilityInstance{

  constructor(abilityDef, state, parentEffect){
    this._abilityDef = abilityDef
    this._parentEffect = parentEffect
    this._state = state ?? {}
  }

  get name(){
    return this._abilityDef.name
  }

  get actions(){
    return this._abilityDef.actions
  }

  get fighterInstance(){
    return this._parentEffect.owner
  }

  get state(){
    return { ...this._state }
  }

  set state(newVal){
    if(this._state.cooldownRemaining === undefined && this.cooldown){
      this._state.cooldownRemaining = this._abilityDef.initialCooldown ?? 0
    }
    this._state = { ...newVal }
  }

  get cooldownRemaining(){
    return this._state.cooldownRemaining ?? 0
  }

  get cooldown(){
    return this._abilityDef.cooldown ?? 0
  }

  get uses(){
    return this._abilityDef.uses ?? 0
  }

  get timesUsed(){
    return this._state.timesUsed ?? 0
  }

  get conditions(){
    return this._abilityDef.conditions ?? null
  }

  get ready(){
    if(!this.fighterInstance || this.cooldownRemaining){
      return false
    }
    if(this.uses && this._state.timesUsed >= this.uses){
      return false
    }
    if(this._abilityDef.combatOnly !== false && !this.fighterInstance.inCombat){
      return false
    }
    return true
  }

  get meetsConditions(){
    return this.fighterInstance.meetsConditions(this.conditions)
  }

  shouldTrigger(){
    if (!this.ready){
      return false
    }
    if(!this.meetsConditions){
      return false
    }
    if (this._abilityDef.chance && Math.random() > this._abilityDef.chance){
      return false
    }
    return true
  }

  advanceTime(ms){
    if(this._state.cooldownRemaining){
      this._state.cooldownRemaining = Math.max(0, this._state.cooldownRemaining - ms)
    }
  }

  use(){
    if(this.cooldown){
      this._state.cooldownRemaining = this.cooldown
    }
    this._state.timesUsed = (this._state.timesUsed ?? 0) + 1
    return this
  }
}