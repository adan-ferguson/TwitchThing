import { toDisplayName, uuid } from './utilFunctions.js'

// Stupid
import Stats from './stats/stats.js'
import AbilitiesData from './abilitiesData.js'
new Stats()

export default class EffectInstance{

  _state = {}

  constructor(owner, state = {}){
    this.owner = owner
    this._state = state
  }

  /**
   * Something to identify this effect so that when we parse an action, we can find
   * the source of the action.
   * @return {string}
   */
  get id(){
    throw 'id getter not defined'
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

  /**
   * @return {Stats}
   */
  get stats(){
    return new Stats(this.effectData.stats)
  }

  get state(){
    this.fixState()
    return JSON.parse(JSON.stringify(this._state))
  }

  /**
   * @return {array}
   */
  get mods(){
    return this.effectData.mods || []
  }

  set state(newState){
    this._state = {
      ...newState
    }
    this.fixState()
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
      uniqueID: uuid(),
      ...this._state
    }
  }
}