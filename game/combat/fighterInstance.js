import { getAdventurerStats, adventurerLevelToHp, adventurerLevelToPower, getAdventurerMods } from '../adventurer.js'
import { getMonsterMods, getMonsterStats, monsterLevelToHp, monsterLevelToPower } from '../monster.js'
import { randomRound } from '../rando.js'

const STATE_DEFAULTS = {
  timeSinceLastAction: 0
}

export const COMBAT_BASE_TURN_TIME = 3000

export default class FighterInstance{

  constructor(fighter, fighterStartState, fighterId){

    checkValidity(fighter)

    this.fighterId = fighterId
    this.baseFighter = fighter
    this._currentState = {
      ...STATE_DEFAULTS,
      ...fighterStartState
    }
    if(!('hp' in this._currentState)){
      this._currentState.hp = this.hpMax
    }
    this.startState = this._currentState
  }

  get baseHp(){
    return this.fighterType === 'adventurer' ?
      adventurerLevelToHp(this.baseFighter.level) :
      monsterLevelToHp(this.baseFighter.level)
  }

  get basePower(){
    return this.fighterType === 'adventurer' ?
      adventurerLevelToPower(this.baseFighter.level) :
      monsterLevelToPower(this.baseFighter.level)
  }

  get fighterType(){
    return this.baseFighter.type === 'adventurer' ? 'adventurer' : 'monster'
  }

  get stats(){
    if(this.fighterType === 'adventurer'){
      return getAdventurerStats(this.baseFighter, this.currentState)
    }else{
      return getMonsterStats(this.baseFighter, this.currentState)
    }
  }

  get mods(){
    if(this.fighterType === 'adventurer'){
      return getAdventurerMods(this.baseFighter, this.currentState)
    }else{
      return getMonsterMods(this.baseFighter, this.currentState)
    }
  }

  get currentState(){
    return { ...this._currentState }
  }

  get actionTime(){
    return COMBAT_BASE_TURN_TIME / this.stats.get('speed').value
  }

  get timeUntilNextAction(){
    return Math.ceil(Math.max(0, (this.actionTime - this.currentState.timeSinceLastAction)))
  }

  get actionReady(){
    return this.hp > 0 && !this.timeUntilNextAction
  }

  get hp(){
    return this._currentState.hp
  }

  set hp(val){
    this._currentState.hp = Math.min(this.hpMax, Math.max(0, val))
  }

  get hpMax(){
    return Math.ceil(this.baseHp * this.stats.get('hpMax').value)
  }

  advanceTime(ms){
    this._currentState.timeSinceLastAction += ms
  }

  performAction(combat){
    this._currentState.timeSinceLastAction = 0
    return {
      ability: 'basicAttack',
      results: this._basicAttack(combat).filter(r => r)
    }
  }

  performTick(combat){
    const tickUpdates = []
    if(combat.time > 0 && combat.time % 5000 === 0){
      tickUpdates.push(this._regen())
    }
    return tickUpdates.filter(t => t)
  }

  attemptDodge(){
    return Math.random() + this.stats.get('dodgeChance').value > 1
  }

  takeDamage(damageInfo){
    const blocked = Math.floor(damageInfo.baseDamage * this.stats.get(damageInfo.damageType + 'Def').value)
    const finalDamage = Math.min(this.hp, damageInfo.baseDamage - blocked)
    this.hp -= finalDamage
    return { ...damageInfo, blocked, finalDamage }
  }

  /**
   * TODO: gotta figure a better way to organize this
   * @param combat
   * @returns {[{subject: *, resultType: string}]|*[]}
   * @private
   */
  _basicAttack(combat){

    const enemy = combat.getEnemyOf(this)
    const dodged = enemy.attemptDodge()

    if(dodged){
      return [{
        subject: enemy.fighterId,
        resultType: 'dodge'
      }]
    }

    if(this.baseFighter.name === 'sorcerer'){
      debugger
    }
    const magicAttack = this.mods.contains({ name: 'magicAttack' })
    const damageInfo = {
      resultType: 'damage',
      subject: enemy.fighterId,
      damageType: magicAttack ? 'magic' : 'phys',
      baseDamage: Math.ceil(this.basePower * this.stats.get(magicAttack ? 'magicPower' : 'physPower').value)
    }

    if(this._attemptCrit()){
      damageInfo.baseDamage *= (1 + this.stats.get('critDamage').value)
      damageInfo.crit = true
    }

    const damageResult = enemy.takeDamage(damageInfo)
    return [damageResult, this._lifesteal(damageResult)]
  }

  _regen(){
    const regen = this.stats.get('regen').value
    if(regen){
      return this._gainHealth(randomRound(this.baseHp * regen))
    }
  }

  /**
   * @param amount {number} Amount we're attempting to gain
   * @returns {{resultType, amount}} ActionResult
   * @private
   */
  _gainHealth(amount){
    const hpBefore = this.hp
    this.hp += amount
    const finalAmount = this.hp - hpBefore
    if(finalAmount > 0){
      return {
        subject: this.fighterId,
        resultType: 'gainHealth',
        amount: this.hp - hpBefore
      }
    }
  }

  _attemptCrit(){
    return Math.random() + this.stats.get('critChance').value > 1
  }

  _lifesteal(damageResult){
    const lifesteal = Math.min(
      this.hpMax - this.hp,
      Math.ceil(this.stats.get('lifesteal').value * damageResult.finalDamage)
    )
    if(lifesteal){
      return this._gainHealth(lifesteal)
    }
  }
}

function checkValidity(fighter){
  if(!fighter.name){
    throw 'Fighter name is required'
  }
}