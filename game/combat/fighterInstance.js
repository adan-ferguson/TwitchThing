import { getAdventurerStats, adventurerLevelToHp, adventurerLevelToPower } from '../adventurer.js'
import { getMonsterStats, monsterLevelToHp, monsterLevelToPower } from '../monster.js'

const STATE_DEFAULTS = {
  timeSinceLastAction: 0
}

export const COMBAT_BASE_TURN_TIME = 3000

export default class FighterInstance{

  constructor(fighter, fighterStartState){

    checkValidity(fighter)

    this.baseFighter = fighter
    this._currentState = {
      ...STATE_DEFAULTS,
      ...fighterStartState
    }
    if(!('hp' in this._currentState)){
      this._currentState.hp = this.hpMax
    }
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

  performAction(enemy){

    let baseDamage = Math.ceil(this.basePower * this.stats.get('physPower').value)
    const damageResult = this._dealDamage(baseDamage, enemy, {
      basicAttack: true
    })
    this._currentState.timeSinceLastAction = 0

    return {
      actionType: 'basicAttack',
      result: damageResult
    }
  }

  tick(){
    return []
  }

  _dealDamage(val, enemy, props = {}){

    const damageResult = {
      baseDamage: val,
      basicAttack: false,
      type: 'phys',
      ...props
    }

    this._critBonus(damageResult)
    enemy._takeDamage(damageResult)
    this._lifesteal(damageResult)

    return damageResult
  }

  _critBonus(damageResult){
    const crit = Math.random() + this.stats.get('critChance') > 1
    if(crit){
      damageResult.baseDamage *= this.stats.get('critDamage').value
      damageResult.crit = true
    }
  }

  _lifesteal(damageResult){
    const lifesteal = Math.min(
      this.hpMax - this.hp,
      Math.ceil(this.stats.get('lifesteal').value * damageResult.finalDamage / 100)
    )
    if(lifesteal){
      damageResult.lifesteal = lifesteal
      this.hp += lifesteal
    }
  }

  _takeDamage(damageResult){

    this._dodge(damageResult)
    if(damageResult.dodged){
      return
    }

    const blocked = Math.floor(damageResult.baseDamage * this.stats.get(damageResult.type + 'Def').value)
    const finalDamage = Math.min(this.hp, damageResult.baseDamage - blocked)
    this.hp -= finalDamage
    damageResult.finalDamage = finalDamage
    damageResult.blocked = blocked
  }

  _dodge(damageResult){
    damageResult.dodged = Math.random() + this.stats.get('dodgeChance') > 1
  }
}

function checkValidity(fighter){
  if(!fighter.name){
    throw 'Fighter name is required'
  }
}