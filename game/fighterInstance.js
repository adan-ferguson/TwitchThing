import Stats from './stats/stats.js'
import { arrayize, deepClone, minMax } from './utilFunctions.js'
import StatusEffectInstance from './baseEffects/statusEffectInstance.js'
import PhantomEffectInstance from './baseEffects/phantomEffectInstance.js'
import MetaEffectCollection from './metaEffectCollection.js'

// Stupid
new Stats()

const STATE_DEFAULTS = {}

export const COMBAT_BASE_TURN_TIME = 3000

export function speedToTurnTime(speed){
  let turnTime
  const dimSpeed = diminish(Math.abs(speed), 40)
  if(speed >= 0){
    turnTime = COMBAT_BASE_TURN_TIME * (100 / (dimSpeed + 100))
  }else{
    turnTime = COMBAT_BASE_TURN_TIME * (1 + dimSpeed / 100)
  }
  return turnTime

  function diminish(speed, basis){
    return basis * Math.pow(speed / basis, 0.7)
  }
}

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
  _phantomEffectInstances = []
  _state
  _metaEffectCollection

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
    return []
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
    const loadoutStatAffectors = this.loadoutEffectInstances.filter(ei => !ei.disabled).map(ei => ei.stats)
    const statusEffectAffectors = this.statusEffectInstances.filter(ei => !ei.disabled).map(ei => ei.stats)
    this._cachedStats = new Stats(
      [derivedStats, ...baseStatAffectors, ...loadoutStatAffectors],
      statusEffectAffectors,
      this.effectInstances.filter(ei => !ei.disabled).map(ei => ei.transStats),
      this.effectInstances.filter(ei => !ei.disabled).map(ei => ei.statsModifiers)
    )
    return this._cachedStats
  }

  get totalStats(){
    return this.stats
  }

  get effectInstances(){
    return [...this.loadoutEffectInstances, ...this.statusEffectInstances, ...this._phantomEffectInstances]
  }

  get mods(){
    return this.effectInstances.map(ei => ei.mods).flat()
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
    this._state = deepClone({
      ...STATE_DEFAULTS,
      ...state
    })
    this.loadoutState = this._state.loadout ?? {}
    this._statusEffectInstances = []
    this._state.statusEffects?.forEach(({ data, state }) => {
      this._addStatusEffect(data, state)
    })
    this.uncache()
  }

  get turnTime(){
    const speed = this.stats.get('speed').value
    return speedToTurnTime(speed)
  }

  get nextActionTime(){
    return this.turnTime
  }

  get timeUntilNextUpdate(){
    const vals = [this.timeUntilNextAction]
    this.effectInstances.forEach(ei => {
      if(this.inCombat){
        ei.getAbilities('instant', 'action').forEach(tickAbility => {
          if(tickAbility.enabled){
            vals.push(tickAbility.cooldownRemaining)
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
    return this.timeBarPct * this.turnTime
  }

  set timeSinceLastAction(val){
    this.timeBarPct = val / this.turnTime
  }

  get timeUntilNextAction(){
    if(this.hasMod('freezeActionBar')){
      return Number.MAX_SAFE_INTEGER
    }
    return this.turnTime - this.timeSinceLastAction
  }

  set timeUntilNextAction(val){
    this.timeSinceLastAction = this.turnTime - val
  }

  get timeBarPct(){
    return this._state.timeBarPct ?? 0
  }

  set timeBarPct(val){
    this._state.timeBarPct = minMax(0, val, 1)
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
    return this.hasMod('magicAttack') ? 'magic' : 'phys'
  }

  get magicPower(){
    return Math.ceil(this.stats.get('magicPower').value)
  }

  get physPower(){
    return Math.ceil(this.stats.get('physPower').value)
  }

  get inCombat(){
    return this._state.combat ? true : false
  }

  get nextTurnOffset(){
    return this._state.nextTurnOffset ?? 0
  }

  set nextTurnOffset(val){
    this._state.nextTurnOffset = val
  }

  get metaEffectCollection(){
    if(!this._metaEffectCollection){
      this._metaEffectCollection = new MetaEffectCollection(this)
    }
    return this._metaEffectCollection
  }

  get canDie(){
    return !this._dead && !this._state.deathPreventedViaAbility && !this.hasMod('cantDie')
  }

  get dead(){
    return this._dead
  }

  set dead(val){
    this._dead = val
  }

  set deathPreventedViaAbility(val){
    this._state.deathPreventedViaAbility = val
  }

  getNextActiveAbility(){
    if(this.hasMod('silenced')){
      return null
    }
    for(let ai of this.getAbilities('active', 'action')){
      if(ai.ready){
        return ai
      }
    }
    return null
  }

  getAbilities(eventName, type = 'either'){
    const abilities = []
    this.effectInstances.forEach(effectInstance => {
      abilities.push(...effectInstance.getAbilities(eventName, type))
    })
    return abilities
  }

  meetsConditions(conditions){
    if(!conditions){
      return true
    }
    if(this._state.idle){
      return false
    }
    if(conditions.hpPctBelow && this.hpPct >= conditions.hpPctBelow){
      return false
    }
    if(conditions.hpFull && this.hpPct < 1){
      return false
    }
    if(conditions.deepestFloor && !this.onDeepestFloor){
      return false
    }
    if(conditions.bossFight && !this._state.combat?.bossFight){
      return false
    }
    if(conditions.hasStatusEffect && !this.hasStatusEffect(conditions.hasStatusEffect)){
      return false
    }
    if(conditions.doesntHaveStatusEffect && this.hasStatusEffect(conditions.doesntHaveStatusEffect)){
      return false
    }
    if(conditions.hasDebuff){
      if(!this.statusEffectInstances.find(sei => sei.polarity === 'debuff')){
        return false
      }
    }
    if(conditions.overtime){
      if(!this._state.combat?.overtime){
        return false
      }
    }
    return true
  }

  hasStatusEffect(conditions){
    return this.statusEffectInstances.some(sei => {
      if(conditions.name && sei.name !== conditions.name){
        return false
      }
      if(conditions.tag && !sei.tags.includes(conditions.tag)){
        return false
      }
      return true
    })
  }

  startCombat(combatParams){
    this._state.combat = {
      time: 0,
      overtime: false,
      bossFight: false,
      ...combatParams
    }
    this._state.timeBarPct = this.hasMod('sneakAttack') ? 0.99 : 0
  }

  updateCombat(combatParams){
    this._state.combat = {
      ...this._state.combat,
      ...combatParams
    }
  }

  endCombat(){
    delete this._state.combat
    delete this._state.timeBarPct
    this.effectInstances.forEach(ei => ei.endCombat())
  }

  advanceTime(ms){
    if(!this.hasMod('freezeActionBar') && this.inCombat){
      this.timeSinceLastAction += ms
    }
    if(!this.hasMod('freezeCooldowns')){
      this.loadoutEffectInstances.forEach(itemInstance => {
        if(itemInstance){
          itemInstance.advanceTime(ms)
        }
      })
    }
    this.statusEffectInstances.forEach(sei => sei.advanceTime(ms))
    this.deathPreventedViaAbility = false
    this.uncache()
  }

  hasMod(modType){
    return this.modsOfType(modType).length > 0
  }

  modsOfType(modType){
    return this.mods.map(m => m[modType]).filter(m => m)
  }

  addStatusEffect = (data, state = {}) => {
    this._addStatusEffect(data, state)
    this.uncache()
  }

  nextTurn(turnRefund = 0){
    this.timeBarPct = turnRefund
    this.statusEffectInstances.forEach(sei => sei.nextTurn())
    this.uncache()
  }

  uncache(){
    this._cleanupExpiredStatusEffects()
    this._cachedStats = null
    this._metaEffectCollection = null
  }

  addPhantomEffect(phantomEffectData, parentEffect){
    const pe = new PhantomEffectInstance(phantomEffectData, this, parentEffect)
    this._phantomEffectInstances.push(pe)
    this.uncache()
    return pe
  }

  clearPhantomEffects(){
    this._phantomEffectInstances = []
    this.uncache()
  }

  _cleanupExpiredStatusEffects(){
    this._statusEffectInstances = this._statusEffectInstances.filter(sei => !sei.expired)
  }

  _addStatusEffect(data, state = {}){
    const sei = new StatusEffectInstance(data, this, state)
    if(!this.inCombat && !sei.persisting){
      return
    }
    if(sei.expired){
      return
    }
    this.statusEffectInstances.push(sei)
  }
}