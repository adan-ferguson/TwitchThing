import Stats from './stats/stats.js'
import { dualWieldMod, freezeActionBarMod, magicAttackMod, silencedMod, sneakAttackMod } from './mods/combined.js'
import { StatusEffectsData } from './statusEffectsData.js'
import ModsCollection from './modsCollection.js'
import FighterItemInstance from './fighterItemInstance.js'
import { toArray } from './utilFunctions.js'

// Stupid
new Stats()

const STATE_DEFAULTS = {
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

  constructor(fighterData, initialState = {}){
    this._fighterData = fighterData

    this._itemInstances = []
    for(let i = 0; i < 8; i++){
      if(fighterData.items[i]){
        this._itemInstances[i] = new this.ItemClass(fighterData.items[i], null, this)
        this._itemInstances[i].effectId = 'item-' + i
      }else{
        this._itemInstances[i] = null
      }
    }

    this.statusEffectsData = new StatusEffectsData(this)
    this.setState(initialState)
  }

  /**
   * @return {number}
   */
  get level(){
    throw 'Not implemented'
  }

  /**
   * @return {object}
   */
  get fighterData(){
    return this._fighterData
  }

  /**
   * @return {string}
   */
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

    const derivedStats = {
      physPower: this.basePower,
      magicPower: this.basePower,
      hpMax: this.baseHp
    }
    const baseStatAffectors = this.baseStats
    const loadoutStatAffectors = this.itemInstances.filter(s => s).map(ii => ii.stats)

    // lol
    const effectAffectors = this.statusEffectsData.instances.map(effect => {
      if(!effect){
        debugger
      }
      return effect.stats
    })
    return new Stats([derivedStats, ...baseStatAffectors, ...loadoutStatAffectors], effectAffectors)
  }

  get baseMods(){
    return []
  }

  get effectInstances(){
    return [...this.itemInstances.filter(ii => ii), ...this.statusEffectsData.instances]
  }

  /**
   * @returns {ModsCollection}
   */
  get mods(){
    return new ModsCollection(this.effectInstances.map(ei => ei.mods).filter(m => m))
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
    baseState.effects = this.statusEffectsData.stateVal
    return { ...baseState }
  }

  get nextActionTime(){
    const slow = this.stats.get('slow').value
    const speed = this.stats.get('speed').value

    let turnTime
    if(speed >= 0){
      turnTime = COMBAT_BASE_TURN_TIME * (100 / (speed + 100))
    }else{
      turnTime = COMBAT_BASE_TURN_TIME * (1 + speed / -100)
    }

    return slow + turnTime
  }

  get timeUntilNextUpdate(){
    let nextTick = Infinity
    this.effectInstances.forEach(ei => {
      const tickAbility = ei.getAbility('tick')
      if(tickAbility){
        nextTick = Math.min(nextTick, tickAbility.cooldownRemaining)
      }
    })
    return Math.min(this.timeUntilNextAction, nextTick)
  }

  get timeSinceLastAction(){
    return this._state.timeSinceLastAction ?? 0
  }

  set timeSinceLastAction(val){
    this._state.timeSinceLastAction = val
  }

  get timeUntilNextAction(){
    return Math.ceil(Math.max(0, (this.nextActionTime - this.timeSinceLastAction)))
  }

  set timeUntilNextAction(val){
    this._state.timeSinceLastAction = this.nextActionTime - Math.max(0, val)
  }

  get actionReady(){
    return this.hp > 0 && !this.timeUntilNextAction
  }

  get hp(){
    return Math.ceil((this._state.hpPct ?? 1) * this.hpMax)
  }

  set hp(val){
    if(isNaN(val)){
      debugger
    }
    this._state.hpPct = Math.max(0, Math.min(1, val / this.hpMax))
  }

  get hpMax(){
    const hpMax = Math.ceil(this.stats.get('hpMax').value)
    if(hpMax === 0){
      debugger
    }
    return hpMax
  }

  get hpPct(){
    return this._state.hpPct ?? 1
  }

  get basicAttackType(){
    return this.mods.contains(magicAttackMod) ? 'magic' : 'phys'
  }

  get magicPower(){
    return Math.ceil(this.stats.get('magicPower').value)
  }

  get physPower(){
    return Math.ceil(this.stats.get('physPower').value)
  }

  get inCombat(){
    return this._state.inCombat
  }

  set inCombat(val){
    this._state.inCombat = val
  }

  set nextTurnOffset(val){
    this._state.nextTurnOffset = val
  }

  /**
   * Generally want to avoid using this. Do a full update of this fighter
   * instance's state.
   * @param newState
   */
  setState(newState){
    const itemStates = newState.itemStates ?? []
    this.itemInstances.forEach((itemInstance, i) => {
      if(itemInstance){
        itemInstance.state = itemStates[i]
      }
    })
    this.statusEffectsData.stateVal = newState.effects
    this._state = {
      ...STATE_DEFAULTS,
      ...newState
    }
    delete this._state.itemStates
    delete this._state.effects
  }

  advanceTime(ms){
    if(!this.mods.contains(freezeActionBarMod) && this.inCombat){
      this._state.timeSinceLastAction += ms
    }
    this.itemInstances.forEach(itemInstance => {
      if(itemInstance){
        itemInstance.advanceTime(ms)
      }
    })
    if(this.inCombat){
      this._state.combatTime += ms
    }
    this.statusEffectsData.advanceTime(ms)
  }

  nextActiveItemIndex(){
    if(this.mods.contains(silencedMod)){
      return -1
    }
    return this.itemInstances.findIndex(itemInstance => {
      const ability = itemInstance?.getAbility('active')
      if(ability?.ready){
        return true
      }
    })
  }

  triggeredEffects(triggerType){
    const effects = []
    this.effectInstances.forEach(effectInstance => {
      if(effectInstance?.shouldTrigger(triggerType)){
        effects.push(effectInstance)
      }
    })
    return effects
  }

  nextTurn(){
    this._state.timeSinceLastAction = this._state.nextTurnOffset ?? 0
    delete this._state.nextTurnOffset
    this.statusEffectsData.nextTurn()
  }

  meetsConditions(conditions){
    if(!conditions){
      return true
    }
    return Object.keys(conditions).every(conditionName => {
      if(conditionName === 'hpPctBelow'){
        return this.hpPct <= conditions[conditionName]
      }else if(conditionName === 'debuffed'){
        return this.statusEffectsData.instances.some(sei => {
          return !sei.isBuff && !sei.expired && !sei.phantom
        })
      }else if(conditionName === 'combatTimeAbove'){
        return this._state.combatTime >= conditions[conditionName]
      }
      throw `Undefined condition: ${conditionName}`
    })
  }

  cleanup(){
    this.statusEffectsData.cleanupExpired()
  }

  startCombat(){
    this.inCombat = true
    this._state.combatTime = 0
    this._state.timeSinceLastAction = this.mods.contains(sneakAttackMod) ? this.nextActionTime - 1 : 0
  }

  endCombat(){
    this.inCombat = false
    delete this._state.combatTime
    delete this._state.timeSinceLastAction
  }

  isEffectDisabled(effect){
    if(effect.effectData.conditions){
      if(!this.meetsConditions(effect.effectData.conditions)){
        return true
      }
    }
    // Check for status effects which might be disabling this item
    if(effect instanceof FighterItemInstance){
      if(this.statusEffectsData.instances.find(sei => sei.effectData.disarmedItemSlot === effect.slot)){
        return true
      }
    }
    return false
  }

  getSlotEffectsFor(slotIndex){

    const item = this.itemInstances[slotIndex]

    if(!item){
      // TODO: not necessarily correct
      return []
    }

    const slotEffects = []
    this.effectInstances.forEach(ei => {
      if(ei.slotEffect){
        if(ei.slotEffect.slotIndex === slotIndex || item.slotTags.indexOf(ei.slotEffect.slotTag) >= 0){
          slotEffects.push(ei.slotEffect)
        }
      }
    })

    return slotEffects
  }
}