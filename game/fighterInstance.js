import Stats from './stats/stats.js'
import { all as Mods } from './mods/combined.js'
import { EffectsData } from './effectsData.js'
import ModsCollection from './modsCollection.js'

// Stupid
new Stats()

const STATE_DEFAULTS = {
  timeSinceLastAction: 0,
  inCombat: false
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

    this.effectsData = new EffectsData(this)
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
   * @returns {array}
   */
  get baseStats(){
    throw 'Not implemented'
  }

  /**
   * @returns {Stats}
   */
  get stats(){
    const baseStatAffectors = this.baseStats
    const loadoutStatAffectors = this.itemInstances.filter(s => s).map(ii => ii.stats)

    // lol
    const effectAffectors = []
    this.effectsData.stateVal.forEach(effect => {
      if(effect.stats){
        for(let i = 0; i < (effect.stacks ?? 1); i++){
          effectAffectors.push(effect.stats)
        }
      }
    })

    return new Stats([...baseStatAffectors, ...loadoutStatAffectors], effectAffectors)
  }

  get baseMods(){
    return []
  }

  /**
   * @returns {ModsCollection}
   */
  get mods(){
    const loadoutMods = this.itemInstances
      .filter(m => m)
      .map(ii => ii.mods)
    const stateMods = this.effectsData.stateVal.map(effect => effect.mods ?? [])
    return new ModsCollection(this.baseMods, loadoutMods, stateMods)
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
    baseState.effects = this.effectsData.stateVal
    return { ...baseState }
  }

  get nextActionTime(){
    const slow = this.stats.get('slow').value
    const speed = this.stats.get('speed').value
    return slow + COMBAT_BASE_TURN_TIME / speed
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

  get inCombat(){
    return this._state.inCombat
  }

  set inCombat(val){
    this._state.inCombat = val
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
    this.effectsData.stateVal = newState.effects
    this._state = {
      ...STATE_DEFAULTS,
      ...newState
    }
    delete this._state.itemStates
    delete this._state.effects
  }

  advanceTime(ms){
    if(!this.mods.contains(Mods.freezeActionBar)){
      this._state.timeSinceLastAction += ms
    }
    this.itemInstances.forEach(itemInstance => {
      if(itemInstance){
        itemInstance.advanceTime(ms)
      }
    })
    this.effectsData.advanceTime(ms)
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

  adjustNextActionTime(ms){
    this._state.timeSinceLastAction += ms
  }

  gainEffect(effect){
    this.effectsData.add(effect)
  }
}