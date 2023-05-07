import Stats from './stats/stats.js'
import Mods from './mods/combined.js'
import ModsCollection from './modsCollection.js'
import { deepClone, minMax } from './utilFunctions.js'
import StatusEffectInstance from './statusEffectInstance.js'

// Stupid
new Stats()

const STATE_DEFAULTS = {}

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

  _statusEffectInstances
  _state

  /**
   * @return {string}
   */
  get displayName(){
    throw 'Not implemented'
  }

  /**
   * @return {string}
   */
  get uniqueID(){
    throw 'Not implemented'
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

  get loadoutEffectInstances(){
    throw 'Not implemented'
  }

  get loadoutState(){
    throw 'Not implemented'
  }

  set loadoutState(val){
    throw 'Not implemented'
  }

  get statusEffectInstances(){
    return this._statusEffectInstances
  }

  /**
   * @returns {Stats}
   */
  get stats(){
    if(this._cachedStats){
      return this._cachedStats
    }
    const derivedStats = {
      physPower: this.basePower,
      magicPower: this.basePower,
      hpMax: this.baseHp
    }
    const baseStatAffectors = this.baseStats
    const loadoutStatAffectors = this.loadoutEffectInstances.map(ii => ii.stats)
    const statusEffectAffectors = this.statusEffectInstances.map(sei => sei.stats)
    this._cachedStats = new Stats(
      [derivedStats, ...baseStatAffectors, ...loadoutStatAffectors],
      statusEffectAffectors
    )
    return this._cachedStats
  }

  get effectInstances(){
    return [...this.loadoutEffectInstances, ...this.statusEffectInstances]
  }

  /**
   * @returns {ModsCollection}
   */
  get mods(){
    return new ModsCollection(this.effectInstances.map(ei => ei.mods).filter(m => m))
  }

  get state(){
    const baseState = { ...this._state }
    baseState.loadout = this.loadoutState
    if(this._statusEffectInstances){
      baseState.statusEffects = this._statusEffectInstances.map(sei => {
        return { state: sei.state, data: sei.data }
      })
    }
    return deepClone(baseState)
  }

  /**
   * Generally want to avoid using this. Do a full update of this fighter
   * instance's state.
   * @param state
   */
  set state(state){
    this._state = {
      ...STATE_DEFAULTS,
      ...state
    }
    this.loadoutState = this._state.loadout ?? {}
    this._statusEffectInstances = this._state.statusEffects?.forEach(({ data, state }) => {
      this.addStatusEffect(data, state)
    }) ?? []
  }

  get turnTime(){
    const speed = this.stats.get('speed').value
    let turnTime
    if(speed >= 0){
      turnTime = COMBAT_BASE_TURN_TIME * (100 / (speed + 100))
    }else{
      turnTime = COMBAT_BASE_TURN_TIME * (1 + speed / -100)
    }
    return turnTime
  }

  get nextActionTime(){
    return this.turnTime
  }

  get timeUntilNextUpdate(){
    const vals = [this.timeUntilNextAction]
    this.effectInstances.forEach(ei => {
      // ei.getAbilities('action', 'tick').forEach(tickAbility => {
      //   if(tickAbility.enabled){
      //     vals.push(tickAbility.cooldownRemaining)
      //   }
      // })
      if(this.inCombat){
        ei.getAbilities('action', 'combatTime').forEach(combatTimeAbility => {
          const targetTime = combatTimeAbility.trigger.combatTime
          if(combatTimeAbility.enabled && targetTime > this._state.combatTime){
            vals.push(targetTime - this._state.combatTime)
          }
        })
      }
      if(ei.durationRemaining){
        vals.push(ei.durationRemaining)
      }
    })
    return Math.min(...vals)
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
    return Math.ceil(this.hpPct * this.hpMax)
  }

  set hp(val){
    this.hpPct = val / this.hpMax
  }

  get hpMax(){
    return Math.ceil(this.stats.get('hpMax').value)
  }

  get hpPct(){
    return this._state.hpPct ?? 1
  }

  set hpPct(val){
    this._state.hpPct = minMax(0, val, 1)
  }

  get basicAttackType(){
    return this.mods.contains(Mods.magicAttack) ? 'magic' : 'phys'
  }

  get magicPower(){
    return Math.ceil(this.stats.get('magicPower').value)
  }

  get physPower(){
    return Math.ceil(this.stats.get('physPower').value)
  }

  get inCombat(){
    return 'combatTime' in this._state
  }

  get nextTurnOffset(){
    return this._state.nextTurnOffset ?? 0
  }

  set nextTurnOffset(val){
    this._state.nextTurnOffset = val
  }

  getNextActiveAbility(){
    if(this.mods.contains(Mods.silenced)){
      return null
    }
    for(let ai of this.getAbilities('action', 'active')){
      if(ai.ready){
        return ai
      }
    }
    return null
  }

  getAbilities(type, eventName){
    const abilities = []
    this.effectInstances.forEach(effectInstance => {
      abilities.push(...effectInstance.getAbilities(type, eventName))
    })
    return abilities
  }

  meetsConditions(conditions){
    if(!conditions){
      return true
    }
    return Object.keys(conditions).every(conditionName => {
      if(conditionName === 'hpPctBelow'){
        return this.hpPct <= conditions[conditionName]
      }else if(conditionName === 'debuffed'){
        // return this.statusEffectsData.instances.some(sei => {
        //   return !sei.isBuff && !sei.expired && !sei.phantom
        // })
      }else if(conditionName === 'combatTimeAbove'){
        return this._state.combatTime >= conditions[conditionName]
      }
      throw `Undefined condition: ${conditionName}`
    })
  }

  isEffectDisabled(effect){
    if(effect.effectData.conditions){
      if(!this.meetsConditions(effect.effectData.conditions)){
        return true
      }
    }
    // Check for status effects which might be disabling this item
    // if(effect instanceof FighterSlotInstance){
    //   if(this.statusEffectsData.instances.find(sei => sei.effectData.disarmedItemSlot === effect.slot)){
    //     return true
    //   }
    // }
    return false
  }

  startCombat(){
    this._state.combatTime = 0
    this._state.timeSinceLastAction = this.mods.contains(Mods.sneakAttack) ? this.nextActionTime - 1 : 0
  }

  endCombat(){
    delete this._state.combatTime
    delete this._state.timeSinceLastAction
  }

  advanceTime(ms){
    if(!this.mods.contains(Mods.freezeActionBar) && this.inCombat){
      this._state.timeSinceLastAction += ms
    }
    if(!this.mods.contains(Mods.freezeCooldowns)){
      this.loadoutEffectInstances.forEach(itemInstance => {
        if(itemInstance){
          itemInstance.advanceTime(ms)
        }
      })
    }
    this.statusEffectInstances.forEach(sei => sei.advanceTime(ms))
    this._cleanupExpiredStatusEffects()
    if(this.inCombat){
      this._state.combatTime += ms
    }
    this._cachedStats = null
  }

  // getSlotEffectsFor(slotIndex){
  //
  //   const item = this.itemInstances[slotIndex]
  //
  //   if(!item){
  //     // TODO: not necessarily correct
  //     return []
  //   }
  //
  //   const slotEffects = []
  //   this.effectInstances.forEach(ei => {
  //     if(ei.slotEffect){
  //       if(ei.slotEffect.slotIndex === slotIndex || item.slotTags.indexOf(ei.slotEffect.slotTag) >= 0){
  //         slotEffects.push(ei.slotEffect)
  //       }
  //     }
  //   })
  //
  //   return slotEffects
  // }

  statsForEffect(effect){
    // TODO: metaEffects for this effect
    return this.stats
    // // TODO: stupid
    // if(!effect || !effect.applicableSlotEffects){
    //   return this.stats
    // }
    // return new Stats([this.stats, ...effect.applicableSlotEffects.map(se => se.stats ?? {})])
  }

  addStatusEffect = (data, state = {}) => {
    this.statusEffectInstances.push(new StatusEffectInstance(data, this, state))
  }

  nextTurn(){
    this._state.timeSinceLastAction = this._state.nextTurnOffset ?? 0
    delete this._state.nextTurnOffset
    this._cachedStats = null
  }

  _cleanupExpiredStatusEffects(){
    this._statusEffectInstances = this._statusEffectInstances.filter(sei => !sei.expired)
  }
}