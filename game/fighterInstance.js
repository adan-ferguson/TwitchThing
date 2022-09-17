import Stats from './stats/stats.js'
import { all as Mods } from './mods/combined.js'

// Stupid
new Stats()

const STATE_DEFAULTS = {
  timeSinceLastAction: 0,
  nextActionTimeMultiplier: 1,
  effects: []
}

export const COMBAT_BASE_TURN_TIME = 3000

/**
 * Format:
 * {
 *   timeSinceLastAction: 0,
 *   hp: 0,
 *   itemStates: []
 * }
 */
export default class FighterInstance{

  _fighterData
  _state
  _itemInstances

  startState

  constructor(fighterData, initialState = {}){
    this._fighterData = fighterData

    this._itemInstances = []
    for(let i = 0; i < 8; i++){
      if(fighterData.items[i]){
        this._itemInstances[i] = new this.ItemClass(fighterData.items[i], null, this)
      }else{
        this._itemInstances[i] = null
      }
    }

    this.setState(initialState)
    this.startState = { ...this._state }
  }

  /**
   * @return {object}
   */
  get fighterData(){
    return this._fighterData
  }

  get displayName(){
    throw 'Not implemented'
  }

  get ItemClass(){
    throw 'Not implemented'
  }

  /**
   * @return {string}
   */
  get uniqueID(){
    throw 'Not implemented'
  }

  get itemInstances(){
    return this._itemInstances
  }

  /**
   * @return {number}
   */
  get baseHp(){
    throw 'Not implemented'
  }

  /**
   * @returns {number}
   */
  get basePower(){
    throw 'Not implemented'
  }

  /**
   * @returns {Stats}
   */
  get stats(){
    throw 'Not implemented'
  }

  /**
   * @returns {ModsCollection}
   */
  get mods(){
    throw 'Not implemented'
  }

  /**
   * @return {OrbsData}
   */
  get orbs(){
    throw 'Not implemented'
  }

  get state(){
    const baseState = { ...this._state }
    baseState.itemStates = this._itemInstances.map(ii => {
      if(!ii){
        return null
      }else{
        return ii.state
      }
    })
    return { ...baseState }
  }

  get nextActionTime(){
    return this._state.nextActionTimeMultiplier * COMBAT_BASE_TURN_TIME / this.stats.get('speed').value
  }

  get timeUntilNextAction(){
    return Math.ceil(Math.max(0, (this.nextActionTime - this._state.timeSinceLastAction)))
  }

  get actionReady(){
    return this.hp > 0 && !this.timeUntilNextAction
  }

  get hp(){
    return Math.floor(this._state.hp ?? this.hpMax)
  }

  set hp(val){
    if(isNaN(val)){
      debugger
    }
    this._state.hp = Math.max(0, Math.min(this.hpMax, val))
    if(this.hp === this.hpMax){
      this._state.hpRemainder = 0
    }
  }

  get hpMax(){
    const hpMax = Math.round(this.baseHp * this.stats.get('hpMax').value)
    if(hpMax === 0){
      debugger
    }
    return hpMax
  }

  get hpPct(){
    return this.hp / this.hpMax
  }

  get basicAttackType(){
    return this.mods.contains(Mods.magicAttack) ? 'magic' : 'phys'
  }

  get magicPower(){
    return this.stats.get('magicPower').value * this.basePower
  }

  get physPower(){
    return this.stats.get('physPower').value * this.basePower
  }

  /**
   * Generally want to avoid using this. Do a full update of this fighter
   * instance's state.
   * @param newState
   */
  setState(newState){
    const itemStates = newState.itemStates ?? []
    this.itemInstances.forEach((itemInstance, i) => {
      itemInstance?.setState(itemStates[i])
    })
    this._state = {
      ...STATE_DEFAULTS,
      ...newState
    }
    delete this._state.itemStates
  }

  advanceTime(ms){
    this._state.timeSinceLastAction += ms
    this.itemInstances.forEach(itemInstance => {
      if(itemInstance){
        itemInstance.advanceTime(ms)
      }
    })
    this._state.effects = this._state.effects.filter(effect => {
      if(effect.duration > 0){
        effect.duration -= ms
      }
      return effect.duration > 0
    })
  }

  nextActiveItemIndex(){
    return this.itemInstances.findIndex(itemInstance => {
      if(itemInstance?.abilityReady && itemInstance?.ability.type === 'active'){
        return true
      }
    })
  }

  triggeredAbilities(trigger){
    const indexes = []
    this.itemInstances.forEach((itemInstance, i) => {
      if(itemInstance?.shouldTrigger(trigger)){
        indexes.push(i)
      }
    })
    return indexes
  }

  resetTimeSinceLastAction(){
    this._state.timeSinceLastAction = 0
    this._state.nextActionTimeMultiplier = 1
  }

  /**
   * Use this for things like regen/dots so that 0.3 per second doesn't result in nothing happening.
   * @param amount
   */
  changeHpWithDecimals(amount){
    amount = amount + (this._state.hpRemainder ?? 0)
    this._state.hpRemainder = amount % 1
    this.hp += Math.floor(amount)
  }

  gainEffect(effect){
    this._state.effects.push(effect)
  }

  hasEffect(effectType){
    return this._state.effects.find(effect => effect.type === effectType)
  }

  multiplyNextTurnTime(amount){
    this._state.nextActionTimeMultiplier *= amount
  }
}