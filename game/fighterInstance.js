import Stats from './stats/stats.js'

const STATE_DEFAULTS = {
  timeSinceLastAction: 0
}

// Just getting rid of error
new Stats()

export const COMBAT_BASE_TURN_TIME = 3000

export default class FighterInstance{

  _baseFighterDef
  _currentState
  startState

  constructor(baseFighterDef, initialState = {}){
    this._baseFighterDef = baseFighterDef
    this.currentState = initialState
    this.startState = { ...this._currentState }
  }

  /**
   * @return {object}
   */
  get baseFighterDef(){
    return this._baseFighterDef
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
   * @return {string}
   */
  get displayName(){
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

  get orbs(){
    return null
  }

  get currentState(){
    return { ...this._currentState }
  }

  set currentState(val){
    this._currentState = {
      ...STATE_DEFAULTS,
      ...val
    }
  }

  get actionTime(){
    return COMBAT_BASE_TURN_TIME / this.stats.get('speed').value
  }

  get timeUntilNextAction(){
    return Math.ceil(Math.max(0, (this.actionTime - this._currentState.timeSinceLastAction)))
  }

  get actionReady(){
    return this.hp > 0 && !this.timeUntilNextAction
  }

  get hp(){
    return Math.floor(this._currentState.hp ?? this.hpMax)
  }

  set hp(val){
    this._currentState.hp = Math.max(0, Math.min(this.hpMax, val))
    if(this.hp === this.hpMax){
      this._currentState.hpRemainder = 0
    }
  }

  get hpMax(){
    return Math.round(this.baseHp * this.stats.get('hpMax').value)
  }

  get hpPct(){
    return this.hp / this.hpMax
  }

  advanceTime(ms){
    this._currentState.timeSinceLastAction += ms
    // TODO advance buff/debuff times
    // TODO advance active timers
  }

  resetTimeSinceLastAction(){
    this._currentState.timeSinceLastAction = 0
  }

  /**
   * Use this for things like regen/dots so that 0.3 per second doesn't result in nothing happening.
   * @param amount
   */
  changeHpWithDecimals(amount){
    amount = amount + (this._currentState.hpRemainder ?? 0)
    this._currentState.hpRemainder = amount % 1
    this.hp += Math.floor(amount)
  }
}