import Stats from './stats/stats.js'

export default class AbilityInstance{

  constructor(abilityDef, state, parentEffect, index){
    this._abilityDef = abilityDef
    this._parentEffect = parentEffect
    this._state = state ?? {}
    this._index = index
  }

  get vars(){
    return this.abilityDef.vars ?? {}
  }

  get index(){
    return this._index
  }

  get phantomEffect(){
    return this.abilityDef.phantomEffect
  }

  get replacements(){
    return this.abilityDef.replacements || {}
  }

  get repetitions(){
    return this.abilityDef.repetitions ?? 1
  }

  get abilityId(){
    return this.abilityDef.abilityId
  }

  get actions(){
    return this.abilityDef.actions
  }

  get abilityDef(){
    return this._abilityDef
  }

  get type(){
    return this.abilityDef.actions ? 'action' : 'replacement'
  }

  get trigger(){
    return this.abilityDef.trigger
  }

  get fighterInstance(){
    return this.parentEffect.fighterInstance
  }

  get parentEffect(){
    return this._parentEffect
  }

  get state(){
    return { ...this._state }
  }

  get resetCooldownAfterCombat(){
    return this.abilityDef.resetCooldownAfterCombat ?? false
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
      return 1 - (this.initialCooldown) / this.cooldown
    }
    return this._state.cooldownElapsedPct
  }

  set cooldownElapsedPct(val){
    if(!this.cooldown){
      return
    }
    this._state.cooldownElapsedPct = Math.max(0, Math.min(val, 1))
  }

  get cooldownMultiplier(){
    if(this.parentEffect.useCooldownMultiplier){
      return this.totalStats.get('cooldownMultiplier').value
    }
    return 1
  }

  get cooldown(){
    return this.cooldownMultiplier * this._abilityDef.cooldown || this.initialCooldown
  }

  get initialCooldown(){
    return (this._abilityDef.initialCooldown ?? 0) * this.cooldownMultiplier
  }

  get uses(){
    return (this._abilityDef.uses ?? 0) * (this.parentEffect.stacks ?? 1)
  }

  get timesUsed(){
    return this._state.timesUsed ?? 0
  }

  get usesRemaining(){
    return this.uses ? this.uses - this.timesUsed : null
  }

  get ready(){
    return !this.cooldownRemaining && this.enabled
  }

  get enabled(){
    if(this.uses && !this.usesRemaining){
      return false
    }
    if(this.parentEffect.disabled){
      return false
    }
    return this.fighterInstance.meetsConditions(this.conditions.owner)
  }

  get cooldownRefreshing(){
    return this.cooldownRemaining && (!this.uses || this.timesUsed < this.uses)
  }

  get totalStats(){
    return new Stats([this.parentEffect.totalStats, this.abilityDef.exclusiveStats ?? {}])
  }

  get conditions(){
    return this.abilityDef.conditions ?? {}
  }

  get stacks(){
    return this.parentEffect?.stacks || 1
  }

  get turnRefund(){
    return this.abilityDef.turnRefund ?? 0
  }

  get tags(){
    return this.abilityDef.tags ?? []
  }

  tryUse(){
    if(!this.ready){
      return false
    }
    if(this.cooldown){
      this.cooldownElapsedPct = 0
    }
    this._state.timesUsed = (this._state.timesUsed ?? 0) + 1
    return true
  }

  advanceTime(ms){
    if(this.cooldownRefreshing){
      this.cooldownRemaining = Math.max(0, this.cooldownRemaining - ms)
    }
  }

  endCombat(){
    if(this.resetCooldownAfterCombat){
      delete this._state.cooldownElapsedPct
    }
  }
  // get nextTurnOffset(){
  //   return this._abilityDef.nextTurnOffset
  // }
}