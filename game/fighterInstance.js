import { randomRound } from './rando.js'
import { all as Mods } from './mods/combined.js'
import Stats from './stats/stats.js'

const STATE_DEFAULTS = {
  timeSinceLastAction: 0
}

// Just getting rid of error
new Stats()

export const COMBAT_BASE_TURN_TIME = 3000

export default class FighterInstance{

  _currentState
  startState

  constructor(initialState = {}){
    this._currentState = {
      ...STATE_DEFAULTS,
      ...initialState
    }
    this.startState = this._currentState
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

  get currentState(){
    return { ...this._currentState }
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
    return this._currentState.hp ?? this.hpMax
  }

  set hp(val){
    this._currentState.hp = Math.min(this.hpMax, Math.max(0, val))
  }

  get hpMax(){
    return Math.round(this.baseHp * this.stats.get('hpMax').value)
  }

  get hpPct(){
    return this.hp / this.hpMax
  }

  // advanceTime(ms){
  //   this._currentState.timeSinceLastAction += ms
  // }
  //
  // performAction(combat){
  //   this._currentState.timeSinceLastAction = 0
  //   return {
  //     ability: 'basicAttack',
  //     results: this._basicAttack(combat).filter(r => r)
  //   }
  // }
  //
  // performTick(combat){
  //   const tickUpdates = []
  //   if(combat.time % 5000 === 0){
  //     tickUpdates.push(this._regen())
  //   }
  //   return tickUpdates.filter(t => t)
  // }
  //
  // attemptDodge(){
  //   return Math.random() + this.stats.get('dodgeChance').value > 1
  // }
  //
  // takeDamage(damageInfo){
  //   const blocked = Math.floor(damageInfo.baseDamage * this.stats.get(damageInfo.damageType + 'Def').value)
  //   const finalDamage = Math.min(this.hp, damageInfo.baseDamage - blocked)
  //   this.hp -= finalDamage
  //   return { ...damageInfo, blocked, finalDamage }
  // }
  //
  // /**
  //  * TODO: gotta figure a better way to organize this
  //  * @param combat
  //  * @returns {[{subject: *, resultType: string}]|*[]}
  //  * @private
  //  */
  // _basicAttack(combat){
  //
  //   const enemy = combat.getEnemyOf(this)
  //   const dodged = enemy.attemptDodge()
  //
  //   if(dodged){
  //     return [{
  //       subject: enemy.fighterId,
  //       resultType: 'dodge'
  //     }]
  //   }
  //
  //   const magicAttack = this.mods.contains(Mods.magicAttack)
  //   const damageInfo = {
  //     resultType: 'damage',
  //     subject: enemy.fighterId,
  //     damageType: magicAttack ? 'magic' : 'phys',
  //     baseDamage: Math.ceil(this.basePower * this.stats.get(magicAttack ? 'magicPower' : 'physPower').value)
  //   }
  //
  //   if(this._attemptCrit()){
  //     damageInfo.baseDamage *= (1 + this.stats.get('critDamage').value)
  //     damageInfo.crit = true
  //   }
  //
  //   const damageResult = enemy.takeDamage(damageInfo)
  //   return [damageResult, this._lifesteal(damageResult)]
  // }
  //
  // _regen(){
  //   const regen = this.stats.get('regen').value
  //   if(regen){
  //     return this._gainHealth(randomRound(this.hpMax * regen))
  //   }
  // }
  //
  // /**
  //  * @param amount {number} Amount we're attempting to gain
  //  * @returns {{resultType, amount}} ActionResult
  //  * @private
  //  */
  // _gainHealth(amount){
  //   const hpBefore = this.hp
  //   this.hp += amount
  //   const finalAmount = this.hp - hpBefore
  //   if(finalAmount > 0){
  //     return {
  //       subject: this.fighterId,
  //       resultType: 'gainHealth',
  //       amount: this.hp - hpBefore
  //     }
  //   }
  // }
  //
  // _attemptCrit(){
  //   return Math.random() + this.stats.get('critChance').value > 1
  // }
  //
  // _lifesteal(damageResult){
  //   const lifesteal = Math.min(
  //     this.hpMax - this.hp,
  //     Math.ceil(this.stats.get('lifesteal').value * damageResult.finalDamage)
  //   )
  //   if(lifesteal){
  //     return this._gainHealth(lifesteal)
  //   }
  // }
}