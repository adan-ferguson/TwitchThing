import { uniqueID } from './utilFunctions.js'
import Stats  from './stats/stats.js'
import AbilityInstance from './abilityInstance.js'

// Stupid
new Stats()

export default class EffectInstance{

  _fighterInstance
  _state = {}

  constructor(owner, state = {}){
    this._fighterInstance = owner
    if(!state.uniqueID){
      state.uniqueID = uniqueID()
    }
    this.state = state
  }

  get uniqueID(){
    return this._state.uniqueID
  }

  get fighterInstance(){
    return this._fighterInstance
  }

  get effectData(){
    throw 'effectData getter not defined'
  }

  get conditions(){
    return this.effectData.conditions ?? null
  }

  get disabled(){
    // if(!this.owner){
    //   return false
    // }
    // if(this.owner.isEffectDisabled(this)){
    //   return true
    // }
    if(!this.meetsConditions){
      return true
    }
    return false
  }

  get meetsConditions(){
    if(!this.conditions){
      return true
    }
    if(this.conditions.deepestFloor && !this.fighterInstance.onDeepestFloor){
      return false
    }
    return true
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
    // TODO: this
    return this.fighterInstance.stats
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

  get statics(){
    if(this.disabled){
      return []
    }
    return this.effectData.statics ?? []
  }

  getAbilities(type, trigger){
    return this.abilities.filter(ai => {
      if(ai.type !== type){
        return false
      }else{
        return ai.trigger[trigger]
      }
    })
  }

  advanceTime(ms){
    this.abilities.forEach(ai => {
      ai.advanceTime(ms)
    })
  }
}

function makeAbilities(abilitiesDef, abilitiesStateVal, parent){
  if(!abilitiesDef){
    return []
  }
  const abilities = []
  abilitiesDef.forEach((abilityDef, i) => {
    abilities.push(new AbilityInstance(abilityDef, abilitiesStateVal[i], parent, i))
  })
  return abilities
}

function abilitiesStateValue(abilities){
  return abilities.map(a => a.state)
}