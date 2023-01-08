import { toDisplayName } from './utilFunctions.js'
import Stats  from './stats/stats.js'
import AbilitiesData from './abilitiesData.js'
import ModsCollection from './modsCollection.js'
import { scaleStats } from './stats/statScaling.js'

// Stupid
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

  get disabled(){
    if(!this.owner){
      return false
    }
    if(this.owner.isEffectDisabled(this)){
      return true
    }
    return false
  }

  /**
   * @return {Stats}
   */
  get stats(){
    if(this.disabled){
      return new Stats()
    }
    const scaledStats = this.effectData.scaledStats
    if(scaledStats){
      return new Stats(scaleStats(scaledStats.stats, scaledStats.scaling, this.owner))
    }
    return new Stats(this.effectData.stats)
  }

  get exclusiveStats(){
    return this.owner?.statsForEffect(this) ?? new Stats()
  }

  get state(){
    this.fixState()
    return JSON.parse(JSON.stringify(this._state))
  }

  /**
   * @return {ModsCollection}
   */
  get mods(){
    if(this.disabled){
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
    if(this.disabled){
      return {}
    }
    return this.generateAbilitiesData().instances
  }

  get slotEffect(){
    return this.effectData.slotEffect ?? null
  }

  generateAbilitiesData(){
    return new AbilitiesData(this.effectData.abilities, this._state?.abilities ?? {}, this)
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
    if(this.disabled){
      return false
    }
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

  refreshCooldown(def = null){
    const ad = this.generateAbilitiesData()
    ad.refreshCooldowns(def)
    this._state.abilities = ad.stateVal
  }

  fixState(){
    this._state = {
      abilities: this.generateAbilitiesData().stateVal,
      ...this._state
    }
  }
}