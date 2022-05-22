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
    const baseHp = this.fighterType === 'adventurer' ?
      adventurerLevelToHp(this.baseFighter.level) :
      monsterLevelToHp(this.baseFighter.level)
    return baseHp * this.stats.get('hpMax').value
  }

  advanceTime(ms){
    this._currentState.timeSinceLastAction += ms
  }

  performAction(enemy){
    const basePower = this.fighterType === 'adventurer' ?
      adventurerLevelToPower(this.baseFighter.level) :
      monsterLevelToPower(this.baseFighter.level)

    let baseDamage = Math.ceil(basePower * this.stats.get('physPower').value)
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
    const blocked = Math.floor(dmgBeforeDefense * this.stats.get('physDef').value)
    const finalDamage = Math.min(this.hp, dmgBeforeDefense - blocked)
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
}