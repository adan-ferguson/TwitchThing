export default class AbilityInstance{

  constructor(abilityDef, state, parentEffect){
    this._abilityDef = abilityDef
    this._parentEffect = parentEffect
    this._state = state ?? {}
  }

  get parentEffect(){
    return this._parentEffect
  }

  get name(){
    return this._abilityDef.name
  }

  get description(){
    return this._abilityDef.description ?? null
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

  get isPositive(){
    return this._abilityDef.isPositive ?? this._parentEffect.isBuff ?? true
  }

  get cooldownRemaining(){
    if(!this.cooldown){
      return 0
    }
    return this.cooldown * (1 - this.cooldownElapsedPct)
  }

  set cooldownRemaining(val){
    this.cooldownElapsedPct = 1 - (val / this.cooldown)
  }

  get cooldownElapsedPct(){
    if(!this.cooldown){
      return 1
    }
    if(this._state.cooldownElapsedPct === undefined){
      this._state.cooldownElapsedPct =  1 - (this.initialCooldown) / this.cooldown
    }
    return this._state.cooldownElapsedPct
  }

  set cooldownElapsedPct(val){
    if(!this.cooldown){
      return
    }
    this._state.cooldownElapsedPct = Math.min(val, 1)
  }

  get cooldown(){
    return (1 - this._parentEffect.exclusiveStats.get('cooldownReduction').value) * this._abilityDef.cooldown || this.initialCooldown
  }

  get initialCooldown(){
    return (this._abilityDef.initialCooldown ?? 0) * (1 - this._parentEffect.exclusiveStats.get('cooldownReduction').value)
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
    return !this.cooldownRemaining && this.enabled
  }

  get enabled(){
    if(this.uses && this._state.timesUsed >= this.uses){
      return false
    }
    return this.fighterInstance.meetsConditions(this.conditions)
  }

  get nextTurnOffset(){
    return this._abilityDef.nextTurnOffset
  }

  get cooldownRefreshing(){
    return this.cooldown && (!this.uses || this.timesUsed < this.uses)
  }

  get phantom(){
    return this._abilityDef.phantom ?? false
  }

  shouldTrigger(){
    if (this.cooldownRemaining || !this.enabled){
      return false
    }
    if (this._abilityDef.chance && Math.random() > this._abilityDef.chance){
      return false
    }
    return true
  }

  advanceTime(ms){
    if(this.cooldownRefreshing){
      this.cooldownRemaining = Math.max(0, this.cooldownRemaining - ms)
    }
  }

  use(){
    if(this.cooldown){
      this.cooldownElapsedPct = 0
    }
    this._state.timesUsed = (this._state.timesUsed ?? 0) + 1
    return this
  }
}