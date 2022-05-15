import Stats from '../stats/stats.js'
import Item from '../item.js'
import { getAdventurerStats } from '../adventurer.js'
import { getMonsterStats } from '../monster.js'

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
      this._currentState.hp = fighter.baseHp * this.stats.get('hpMax').value
    }
  }

  get power(){
    return this.baseFighter.basePower
  }

  get fighterType(){
    return this.baseFighter.adventurerID ? 'adventurer' : 'monster'
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
    return this.baseFighter.baseHp * this.stats.get('hpMax').value
  }

  advanceTime(ms){
    this._currentState.timeSinceLastAction += ms
  }

  performAction(enemy){
    let baseDamage = Math.ceil(this.power * this.stats.get('physPower').value)
    const damageResult = this._dealDamage(baseDamage, enemy)
    this._currentState.timeSinceLastAction = 0

    return {
      actionType: 'attack',
      result: damageResult
    }
  }

  tick(){
    return []
  }

  _dealDamage(amount, enemy){
    const damageResult = enemy._takeDamage(amount)

    const lifesteal = this._lifesteal(damageResult.damage)
    if(lifesteal){
      damageResult.lifesteal = lifesteal
    }

    return damageResult
  }

  _lifesteal(damage){
    const lifesteal = Math.min(
      this.hpMax - this.hp,
      Math.ceil(this.stats.get('lifesteal').value * damage / 100)
    )
    this.hp += lifesteal
    return lifesteal
  }

  _takeDamage(dmgBeforeDefense){
    const dmgAfterDefense = dmgBeforeDefense * this.stats.get('physDef').value
    const blocked = Math.max(0, dmgBeforeDefense - dmgAfterDefense)
    const finalDamage = Math.min(this.hp, dmgAfterDefense)
    this.hp -= finalDamage
    return {
      damage: finalDamage,
      blocked
    }
  }
}

function checkValidity(fighter){
  if(!fighter.name){
    throw 'Fighter name is required'
  }
  if(!fighter.baseHp){
    throw 'Fighter baseHp is required'
  }
  if(!fighter.basePower){
    throw 'Fighter basePower is required'
  }
}