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
    this._state = { ...newVal }
  }

  get cooldownRemaining(){
    if(this._state.cooldownRemaining === undefined && this.cooldown){
      return this._abilityDef.initialCooldown ?? 0
    }
    return this._state.cooldownRemaining
  }

  set cooldownRemaining(val){
    this._state.cooldownRemaining = val
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
    if(this.cooldownRemaining){
      this.cooldownRemaining = Math.max(0, this.cooldownRemaining - ms)
    }
  }

  use(){
    if(this.cooldown){
      this.cooldownRemaining = this.cooldown
    }
    this._state.timesUsed = (this._state.timesUsed ?? 0) + 1
    return this
  }
}