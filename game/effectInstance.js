import { fillArray, uniqueID } from './utilFunctions.js'
import Stats  from './stats/stats.js'
import AbilityInstance from './abilityInstance.js'

// Stupid
new Stats()

export default class EffectInstance{

  _baseEffectData
  _fighterInstance
  _state = {}

  constructor(owner, state = {}){
    this._fighterInstance = owner
    if(!state.uniqueID){
      state.uniqueID = uniqueID()
    }
    this.state = state
  }

  get calculateBaseEffectData(){
    throw 'calculateBaseEffectData not implemented'
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

  get metaEffects(){
    return this.effect.metaEffects
  }

  get baseEffectData(){
    if(!this._baseEffectData){
      this._baseEffectData = this.calculateBaseEffectData
    }
    return this._baseEffectData
  }

  /**
   * @return {Stats}
   */
  get stats(){
    return new Stats(fillArray(() => this.effectData.stats, this.statMultiplier))
  }

  get exclusiveStats(){
    return new Stats(this.effectData.exclusiveStats)
  }

  get totalStats(){
    return new Stats([this.fighterInstance.stats, this.exclusiveStats])
  }

  get transStats(){
    return this.effectData.transStats ?? []
  }

  get statMultiplier(){
    return this.effect.statMultiplier ?? 1
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
    return this.effectData.mods ?? []
  }

  get disabled(){
    return this.totalMods.some(m => m.disabled)
  }

  get exclusiveMods(){
    return this.effectData.exclusiveMods ?? []
  }

  get totalMods(){
    return [...this.fighterInstance.mods, ...this.exclusiveMods]
  }

  getAbilities(trigger = null, type = 'either'){
    return this.abilities.filter(ai => {
      if(ai.type !== type && type !== 'either'){
        return false
      }else{
        return !trigger || ai.trigger === trigger
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

  endCombat(){
    this.abilities.forEach(ai => {
      ai.endCombat()
    })
  }

  invalidate(){
    this._baseEffectData = null
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