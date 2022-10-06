export default class AbilityInstance{

  constructor(abilityDef, parentEffect){
    this._abilityDef = abilityDef
    this._parentEffect = parentEffect
    this.state = {}
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

  get conditions(){
    return this._abilityDef.conditions ?? null
  }

  get ready(){
    if(this.cooldownRemaining){
      return false
    }
    if(this.uses && this._state.timesUsed >= this.uses){
      return false
    }
    if(this._abilityDef.combatOnly !== false && !this.fighterInstance.inCombat){
      return false
    }
    if(!this.fighterInstance.meetsConditions(this.conditions)){
      return false
    }
    return true
  }

  shouldTrigger(){
    if(!this.ready){
      return false
    }
    if(this._abilityDef.chance && Math.random() > this._abilityDef.chance){
      return false
    }
  }

  advanceTime(ms){
    if(this._state.cooldownRemaining){
      this._state.cooldownRemaining = Math.max(0, this._state.cooldownRemaining - ms)
    }
  }

  use(){
    this._state.cooldownRemaining = this.cooldown
    this._state.timesUsed = (this._state.timesUsed ?? 0) + 1
  }
}