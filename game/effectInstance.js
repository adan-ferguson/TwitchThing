import { uniqueID } from './utilFunctions.js'
import Stats  from './stats/stats.js'
import AbilityInstance from './abilityInstance.js'

// Stupid
new Stats()

export default class EffectInstance{

  owner
  _state = {}

  constructor(owner, state = {}){
    this.owner = owner
    if(!state.effectId){
      state.effectId = uniqueID()
    }
    this.state = state
  }

  get effectId(){
    return this._state.effectId
  }

  get effectData(){
    throw 'effectData getter not defined'
  }

  get disabled(){
    // if(!this.owner){
    //   return false
    // }
    // if(this.owner.isEffectDisabled(this)){
    //   return true
    // }
    return false
  }

  /**
   * @return {Stats}
   */
  get stats(){
    if(this.disabled){
      return new Stats()
    }
    return new Stats(this.effectData.stats)
  }

  get exclusiveStats(){
    return this.owner.statsForEffect(this)
  }

  get state(){
    if(this._abilities){
      this._state.abilities = abilitiesStateValue(this._abilities)
      this._abilities = null
    }
    return JSON.parse(JSON.stringify(this._state))
  }

  set state(newState){
    this._state = {
      abilities: {},
      ...newState
    }
    this._abilities = null
  }

  get abilities(){
    if(!this._abilities){
      this._abilities = makeAbilities(this.effectData.abilities, this._state.abilities, this)
    }
    return this._abilities
  }

  advanceTime(ms){
    this.abilities.forEach(ai => {
      ai.advanceTime(ms)
    })
  }

  // /**
  //  * @return {ModsCollection}
  //  */
  // get mods(){
  //   if(this.disabled){
  //     return new ModsCollection()
  //   }
  //   return new ModsCollection(this.effectData.mods || [])
  // }

  // get hasAbilities(){
  //   return Object.keys(this.effectData.abilities ?? {}).length > 0
  // }

  // get abilities(){
  //   return this.generateAbilitiesData().instances
  // }

  // get enabledAbilities(){
  //   if(this.disabled){
  //     return {}
  //   }
  //   return this.abilities
  // }

  // get isValid(){
  //   return this.effectData ? true : false
  // }

  // generateAbilitiesData(){
  //   return new AbilitiesData(this.effectData.abilities, this._state?.abilities ?? {}, this)
  // }
  //
  // /**
  //  * @param eventName {string}
  //  */
  // getAbility(eventName){
  //   return this.generateAbilitiesData().instances[eventName]
  // }

  // useAbility(eventName){
  //   const ad = this.generateAbilitiesData()
  //   const inst = ad.instances[eventName]
  //   inst.use()
  //   this._state.abilities = ad.stateVal
  //
  //   if(inst.nextTurnOffset){
  //     let offset = 0
  //     if(inst.nextTurnOffset.pct){
  //       offset += this.owner.turnTime * inst.nextTurnOffset.pct
  //     }
  //     this.owner.nextTurnOffset += offset
  //   }
  // }
  //
  // shouldTrigger(triggerName){
  //   if(this.disabled){
  //     return false
  //   }
  //   const abilityInstance = this.getAbility(triggerName)
  //   if(!abilityInstance?.shouldTrigger()){
  //     return false
  //   }
  //   return true
  // }
  //
  // refreshCooldown(def = null){
  //   const ad = this.generateAbilitiesData()
  //   ad.refreshCooldowns(def)
  //   this._state.abilities = ad.stateVal
  // }
}

function makeAbilities(abilitiesDef, abilitiesStateVal, parent){
  if(!abilitiesDef){
    return []
  }
  const abilities = []
  abilitiesDef.forEach((abilityDef, i) => {
    abilities.push(new AbilityInstance(abilityDef, abilitiesStateVal[i], parent))
  })
  return abilities
}

function abilitiesStateValue(abilities){
  return abilities.map(a => a.state)
}