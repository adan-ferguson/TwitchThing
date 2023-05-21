import { uniqueID } from './utilFunctions.js'
import Stats  from './stats/stats.js'
import AbilityInstance from './abilityInstance.js'

// Stupid
new Stats()

export default class EffectInstance{

  _fighterInstance
  _state = {}

  constructor(baseEffectData, owner, state = {}){
    this._fighterInstance = owner
    if(!state.uniqueID){
      state.uniqueID = uniqueID()
    }
    this._baseEffectData = baseEffectData
    this.state = state
  }

  get uniqueID(){
    return this._state.uniqueID
  }

  get fighterInstance(){
    return this._fighterInstance
  }

  get effectData(){
    return this.fighterInstance.metaEffectCollection.apply(this)
  }

  get effect(){
    return this.effectData
  }

  get baseEffectData(){
    return this._baseEffectData
  }

  get conditions(){
    return this.effectData.conditions ?? null
  }

  get disabled(){
    if(this.fighterInstance.idle){
      return false
    }
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
    return this.effectData.stats
  }

  get exclusiveStats(){
    if(this.disabled){
      return new Stats()
    }
    return this.effectData.exclusiveStats
  }

  get totalStats(){
    return new Stats([this.fighterInstance.stats, this.exclusiveStats])
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

  get mods(){
    if(this.disabled){
      return []
    }
    return this.effectData.mods ?? []
  }

  get exclusiveMods(){
    return this.effectData.exclusiveMods ?? []
  }

  get totalMods(){
    return [...this.fighterInstance.mods, ...this.exclusiveMods]
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

  modsOfType(type){
    return this.totalMods.map(m => m[type]).filter(m => m)
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