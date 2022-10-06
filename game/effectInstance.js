import { toDisplayName, uuid } from './utilFunctions.js'

// Stupid
import Stats from './stats/stats.js'
import AbilitiesData from './abilitiesData.js'
new Stats()

export default class EffectInstance{

  _state = {}

  constructor(state = {}, owner = null){
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

  get abilitiesData(){
    return new AbilitiesData(this.effectData.abilities, this.owner)
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
    return {
      ...this._state
    }
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

  shouldTrigger(triggerName){
    const abilityInstance = this.abilitiesData.instances[triggerName]
    if(!abilityInstance?.shouldTrigger()){
      return false
    }
    return true
  }

  advanceTime(ms){
    this._state.abilities = this.abilitiesData.advanceTime(ms).stateVal
  }

  fixState(){
    this._state = {
      abilities: this.abilitiesData.stateVal,
      uniqueID: uuid(),
      ...this._state
    }
  }
}