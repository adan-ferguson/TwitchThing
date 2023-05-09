import _ from 'lodash'

export default class AbilityInstance{

  constructor(abilityDef, state, parentEffect, index){
    this._abilityDef = abilityDef
    this._parentEffect = parentEffect
    this._state = state ?? {}
    this._index = index
  }

  get index(){
    return this._index
  }

  get replacements(){
    return this.abilityDef.replacements
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
    if(_.isString(this.abilityDef.trigger)){
      return { [this.abilityDef.trigger]: true }
    }
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

  get usesRemaining(){
    return this.uses ? this.uses - this.timesUsed : 99999999
  }

  get ready(){
    return !this.cooldownRemaining && this.enabled
  }

  get enabled(){
    if(!this.usesRemaining){
      return false
    }
    return this.fighterInstance.meetsConditions(this.conditions)
  }

  get cooldownRefreshing(){
    return this.cooldownRemaining && (!this.uses || this.timesUsed < this.uses)
  }

  get exclusiveStats(){
    return this.parentEffect.exclusiveStats
  }

  get conditions(){
    return this.abilityDef.conditions ?? null
  }

  tryUse(data = {}){
    if(!this.ready){
      return false
    }
    if(this.cooldown){
      this.cooldownElapsedPct = 0
    }
    if(data.combatTime && this.trigger.combatTime){
      if(data.combatTime.before >= this.trigger.combatTime || this.trigger.combatTime < data.combatTime.after){
        return false
      }
    }
    //   if (this._abilityDef.chance && Math.random() > this._abilityDef.chance){
    //     return false
    //   }
    this._state.timesUsed = (this._state.timesUsed ?? 0) + 1
    return true
  }

  advanceTime(ms){
    if(this.cooldownRefreshing){
      this.cooldownRemaining = Math.max(0, this.cooldownRemaining - ms)
    }
  }
  //
  // get nextTurnOffset(){
  //   return this._abilityDef.nextTurnOffset
  // }
  //
  // get phantom(){
  //   return this._abilityDef.phantom ?? false
  // }
}