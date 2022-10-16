import { toDisplayName } from './utilFunctions.js'

// Stupid
import Stats from './stats/stats.js'
import AbilitiesData from './abilitiesData.js'
import ModsCollection from './modsCollection.js'
new Stats()

export default class EffectInstance{

  owner
  _state = {}
  effectId = ''

  constructor(owner, state = {}){
    this.owner = owner
    this._state = state
  }

  get effectData(){
    throw 'effectData getter not defined'
  }

  get displayName(){
    return this.effectData.displayName ?? toDisplayName(this.effectData.name)
  }

  get description(){
    return this.effectData.description ?? ''
  }

  get meetsConditions(){
    if(this.effectData.conditions && this.owner){
      if(!this.owner.meetsConditions(this.effectData.conditions)){
        return false
      }
    }
    return true
  }

  /**
   * @return {Stats}
   */
  get stats(){
    if(!this.meetsConditions){
      return new Stats()
    }
    return new Stats(this.effectData.stats)
  }

  get state(){
    this.fixState()
    return JSON.parse(JSON.stringify(this._state))
  }

  /**
   * @return {ModsCollection}
   */
  get mods(){
    if(!this.meetsConditions){
      return new ModsCollection()
    }
    return new ModsCollection(this.effectData.mods || [])
  }

  set state(newState){
    this._state = {
      ...newState
    }
    this.fixState()
  }

  get hasAbilities(){
    return Object.keys(this.effectData.abilities ?? {}).length > 0
  }

  get abilities(){
    if(!this.meetsConditions){
      return {}
    }
    return this.generateAbilitiesData().instances
  }

  generateAbilitiesData(){
    return new AbilitiesData(this.effectData.abilities, this._state.abilities ?? {}, this)
  }

  /**
   * @param eventName {string}
   */
  getAbility(eventName){
    return this.generateAbilitiesData().instances[eventName]
  }

  useAbility(eventName){
    const ad = this.generateAbilitiesData()
    ad.instances[eventName].use()
    this._state.abilities = ad.stateVal
  }

  shouldTrigger(triggerName){
    const abilityInstance = this.getAbility(triggerName)
    if(!abilityInstance?.shouldTrigger()){
      return false
    }
    return true
  }

  advanceTime(ms){
    const ad = this.generateAbilitiesData()
    ad.advanceTime(ms)
    this._state.abilities = ad.stateVal
  }

  fixState(){
    this._state = {
      abilities: this.generateAbilitiesData().stateVal,
      ...this._state
    }
  }
}